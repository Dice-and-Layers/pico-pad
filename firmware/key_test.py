import board
import busio
import time
import os
import json
from digitalio import DigitalInOut, Direction, Pull

# --- Load Config for Board Model ---
board_model = "3x3"
# Try loading from settings.toml first
val = os.getenv("BOARD_MODEL", None)
if val is not None:
    board_model = val.lower().strip()
else:
    # Try loading from macros.json
    try:
        with open("macros.json", "r") as f:
            data = json.load(f)
            board_model = data.get("settings", {}).get("board_model", "3x3").lower().strip()
    except Exception:
        pass

print("==========================================")
print(f"Key Test Starting... Configured Model: {board_model.upper()}")
print("==========================================")

# --- Initialize Display if present ---
i2c = None
display = None
try:
    i2c = busio.I2C(board.GP17, board.GP16)
    import adafruit_ssd1306
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
    print("OLED Display found and initialized.")
except Exception as e:
    print("OLED Display not initialized (normal for 1x3 or display-less models).")

# --- Hardware Setup based on Model ---
if board_model == "1x3":
    # Swapped GP1 and GP2 to match physical PCB layout (GP2 in middle, GP1 on right)
    KEY_PINS = [board.GP0, board.GP2, board.GP1]
    LED_PINS = [board.GP5, board.GP3, board.GP4] # Left -> GP5 (L1), Middle -> GP3 (L3), Right -> GP4 (L2)
    
    keys_io = []
    for pin in KEY_PINS:
        k = DigitalInOut(pin)
        k.direction = Direction.INPUT
        k.pull = Pull.UP
        keys_io.append(k)
        
    leds_io = []
    for pin in LED_PINS:
        l = DigitalInOut(pin)
        l.direction = Direction.OUTPUT
        l.value = False
        leds_io.append(l)

    # NeoPixel setup
    neopixel_led = None
    try:
        import neopixel
        neopixel_led = neopixel.NeoPixel(board.GP16, 1, brightness=0.3, auto_write=True)
        print("NeoPixel library found and initialized on GP16.")
    except ImportError:
        try:
            import neopixel_write
            class FallbackNeoPixel:
                def __init__(self, pin):
                    self.pin = DigitalInOut(pin)
                    self.pin.direction = Direction.OUTPUT
                def set_color(self, r, g, b):
                    r_val = int(r * 0.3)
                    g_val = int(g * 0.3)
                    b_val = int(b * 0.3)
                    neopixel_write.neopixel_write(self.pin, bytearray([g_val, r_val, b_val]))
            neopixel_led = FallbackNeoPixel(board.GP16)
            print("NeoPixel fallback initialized using neopixel_write on GP16.")
        except Exception as ne_err:
            print("NeoPixel not initialized:", ne_err)

    colors = [
        (255, 0, 0),     # Red
        (0, 255, 0),     # Green
        (0, 0, 255),     # Blue
        (255, 255, 0),   # Yellow
        (0, 255, 255),   # Cyan
        (255, 0, 255)    # Magenta
    ]
    color_idx = 0
    was_pressed = False

    print("1x3 Key Test active. Press K1 (GP0), K2 (GP1), or K3 (GP2) to test.")
    
    last_state = [False, False, False]
    
    while True:
        any_pressed = False
        for i, key in enumerate(keys_io):
            is_pressed = not key.value
            if is_pressed:
                any_pressed = True
                leds_io[i].value = True
                if not last_state[i]:
                    labels = [
                        ("K1", "GP0", "L1", "GP5", "Left"),
                        ("K3", "GP2", "L3", "GP3", "Middle"),
                        ("K2", "GP1", "L2", "GP4", "Right")
                    ]
                    key_name, key_pin, led_name, led_pin, pos = labels[i]
                    print(f"Key Pressed: {key_name} ({key_pin}, {pos}) -> LED {led_name} ({led_pin}) turns ON")
                    
                    # Cycle NeoPixel color
                    if neopixel_led:
                        c = colors[color_idx]
                        color_idx = (color_idx + 1) % len(colors)
                        if hasattr(neopixel_led, 'set_color'):
                            neopixel_led.set_color(*c)
                        else:
                            neopixel_led[0] = c
            else:
                leds_io[i].value = False
            
            last_state[i] = is_pressed
            
        if not any_pressed:
            if was_pressed:
                if neopixel_led:
                    if hasattr(neopixel_led, 'set_color'):
                        neopixel_led.set_color(0, 0, 0)
                    else:
                        neopixel_led[0] = (0, 0, 0)
            was_pressed = False
        else:
            was_pressed = True
            
        time.sleep(0.02)

else:
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
        
    def draw_grid(active_key=None):
        if not display: return
        display.fill(0)
        start_x, start_y = 34, 15
        box_w, box_h, gap = 20, 15, 4
        for r in range(3):
            for c in range(3):
                x = start_x + c * (box_w + gap)
                y = start_y + r * (box_h + gap)
                if active_key == (r, c):
                    display.fill_rect(x, y, box_w, box_h, 1)
                else:
                    display.rect(x, y, box_w, box_h, 1)
        display.show()

    print("3x3 Matrix Key Test active. Press keys in the grid to test.")
    last_pressed = None
    
    while True:
        current_pressed = None
        for c_idx, col in enumerate(cols):
            col.value = True
            for r_idx, row in enumerate(rows):
                if row.value:
                    current_pressed = (r_idx, c_idx)
                    break
            col.value = False
            if current_pressed:
                break
                
        if current_pressed != last_pressed:
            if current_pressed:
                print(f"Key Pressed: Row {current_pressed[0]}, Col {current_pressed[1]}")
            draw_grid(current_pressed)
            last_pressed = current_pressed
            
        time.sleep(0.02)
