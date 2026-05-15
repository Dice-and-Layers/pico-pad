import board
import busio
import time
import adafruit_ssd1306
from digitalio import DigitalInOut, Direction, Pull

# --- Hardware Setup ---

# I2C for SSD1306 OLED
# SDA on GP16, SCL on GP17
i2c = None
display = None

try:
    i2c = busio.I2C(board.GP17, board.GP16)
    
    # I2C Scanner
    while not i2c.try_lock():
        pass
    print("I2C scanner scanning...")
    devices = i2c.scan()
    if devices:
        print("I2C devices found:", [hex(device) for device in devices])
    else:
        print("No I2C devices found.")
    i2c.unlock()

    # Initialize Display
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
    print("OLED Display found and initialized.")
except Exception as e:
    print("I2C or OLED Error:", e)

# 3x3 Key Matrix Pins
COL_PINS = [board.GP5, board.GP6, board.GP7]
ROW_PINS = [board.GP2, board.GP3, board.GP4]

cols = []
for pin in COL_PINS:
    c = DigitalInOut(pin)
    c.direction = Direction.OUTPUT
    c.value = False
    cols.append(c)

rows = []
for pin in ROW_PINS:
    r = DigitalInOut(pin)
    r.direction = Direction.INPUT
    r.pull = Pull.DOWN
    rows.append(r)

# --- Display Helpers ---

def draw_grid(active_key=None):
    if not display:
        return
    
    display.fill(0)
    # display.text("Macro Key Test", 30, 0, 1) # Removed to avoid font file error
    
    # Draw 3x3 Grid
    # Each box roughly 20x15
    start_x = 34
    start_y = 15
    box_w = 20
    box_h = 15
    gap = 4
    
    for r in range(3):
        for c in range(3):
            x = start_x + c * (box_w + gap)
            y = start_y + r * (box_h + gap)
            
            # Check if this key is being pressed
            if active_key == (r, c):
                display.fill_rect(x, y, box_w, box_h, 1)
            else:
                display.rect(x, y, box_w, box_h, 1)
    
    display.show()

# --- Main Loop ---

print("Key Matrix Test Starting...")
print("Press any key to see it on the OLED and Serial console.")

last_pressed = None

while True:
    current_pressed = None
    
    # Scan Matrix
    for c_idx, col in enumerate(cols):
        col.value = True
        for r_idx, row in enumerate(rows):
            if row.value:
                current_pressed = (r_idx, c_idx)
                break
        col.value = False
        if current_pressed:
            break
            
    # Update if state changed
    if current_pressed != last_pressed:
        if current_pressed:
            print(f"Key Pressed: Row {current_pressed[0]}, Col {current_pressed[1]}")
        draw_grid(current_pressed)
        last_pressed = current_pressed
        
    time.sleep(0.02) # Small delay for stability
