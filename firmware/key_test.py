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
    if board_model == "3x3_pro":
        i2c = busio.I2C(board.GP15, board.GP14)
    else:
        i2c = busio.I2C(board.GP17, board.GP16)
    import adafruit_ssd1306
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
    print("OLED Display found and initialized.")
except Exception as e:
    print("OLED Display not initialized:", e)

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

elif board_model == "3x3_pro":
    # 3x3 Pro Matrix Keyboard (3 rows, 4 columns. Col 4 / C4 is the profile switch dedicated button S4)
    COL_PINS = [board.GP3, board.GP4, board.GP5, board.GP6]
    ROW_PINS = [board.GP0, board.GP1, board.GP2]
    
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
        
    # LED Matrix Setup
    # LED Columns (Cathodes, active low): GP7, GP8, GP9
    # LED Rows (Anodes, active high): GP10, GP11, GP12
    LED_COLS = [board.GP7, board.GP8, board.GP9]
    LED_ROWS = [board.GP10, board.GP11, board.GP12]
    
    led_cols_io = []
    for pin in LED_COLS:
        c = DigitalInOut(pin)
        c.direction = Direction.OUTPUT
        c.value = True # Inactive High
        led_cols_io.append(c)
        
    led_rows_io = []
    for pin in LED_ROWS:
        r = DigitalInOut(pin)
        r.direction = Direction.OUTPUT
        r.value = False # Inactive Low
        led_rows_io.append(r)

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

    def draw_grid(active_key=None):
        if not display: return
        display.fill(0)
        start_x, start_y = 20, 15
        box_w, box_h, gap = 20, 15, 4
        # Draw 3x3 grid
        for r in range(3):
            for c in range(3):
                x = start_x + c * (box_w + gap)
                y = start_y + r * (box_h + gap)
                if active_key == (r, c):
                    display.fill_rect(x, y, box_w, box_h, 1)
                else:
                    display.rect(x, y, box_w, box_h, 1)
        # Draw Profile Switch button (0, 3) to the right of row 0
        x_prof = start_x + 3 * (box_w + gap)
        y_prof = start_y
        if active_key == (0, 3):
            display.fill_rect(x_prof, y_prof, box_w, box_h, 1)
            import utils
            utils.draw_text(display, "P", x_prof + 8, y_prof + 4, scale=1, color=0)
        else:
            display.rect(x_prof, y_prof, box_w, box_h, 1)
            import utils
            utils.draw_text(display, "P", x_prof + 8, y_prof + 4, scale=1, color=1)
        display.show()

    # Run a premium swipe startup animation on the LED matrix
    for r in led_rows_io:
        r.value = True
        for c in led_cols_io:
            c.value = False
        time.sleep(0.06)
        r.value = False
        for c in led_cols_io:
            c.value = True

    print("3x3 Pro Matrix Key Test active. Press keys (including S4 switcher) to test.")
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

        # Drive LED matrix based on pressed key
        for r in led_rows_io:
            r.value = False
        for c in led_cols_io:
            c.value = True

        if current_pressed:
            r_idx, c_idx = current_pressed
            if r_idx < 3 and c_idx < 3:
                # Normal Key: Light up corresponding LED
                led_rows_io[r_idx].value = True
                led_cols_io[c_idx].value = False
            elif current_pressed == (0, 3):
                # Switch Key: Flash all LEDs as feedback
                for r in led_rows_io:
                    r.value = True
                for c in led_cols_io:
                    c.value = False

            if current_pressed != last_pressed:
                if current_pressed == (0, 3):
                    print("Key Pressed: Profile Switch Button (0, 3)")
                else:
                    print(f"Key Pressed: Row {r_idx}, Col {c_idx}")

                # Cycle NeoPixel color on new press
                if neopixel_led:
                    c = colors[color_idx]
                    color_idx = (color_idx + 1) % len(colors)
                    if hasattr(neopixel_led, 'set_color'):
                        neopixel_led.set_color(*c)
                    else:
                        neopixel_led[0] = c

            was_pressed = True
        else:
            if was_pressed:
                if neopixel_led:
                    if hasattr(neopixel_led, 'set_color'):
                        neopixel_led.set_color(0, 0, 0)
                    else:
                        neopixel_led[0] = (0, 0, 0)
            was_pressed = False

        if current_pressed != last_pressed:
            draw_grid(current_pressed)
            last_pressed = current_pressed

        time.sleep(0.02)

elif board_model == "6x2_encoder":
    # 6x2 Matrix Keyboard + Rotary Encoder (3 rows, 6 columns)
    COL_PINS = [board.GP6, board.GP7, board.GP8, board.GP9, board.GP10, board.GP11]
    ROW_PINS = [board.GP12, board.GP13, board.GP14]
    
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
        
    import rotaryio
    encoder = rotaryio.IncrementalEncoder(board.GP2, board.GP3)
    encoder_last_pos = encoder.position
    
    # NeoPixel setup (RP2040 Zero onboard NeoPixel)
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

    print("6x2 Matrix + Encoder Key Test active.")
    print("Press matrix keys, encoder switch (Row 0, Col 5), or rotate the encoder.")
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
                
        # Check encoder rotation
        current_pos = encoder.position
        if current_pos != encoder_last_pos:
            diff = current_pos - encoder_last_pos
            direction = "CW (Clockwise)" if diff > 0 else "CCW (Counter-Clockwise)"
            print(f"Encoder Rotated: {direction} | Position: {current_pos}")
            encoder_last_pos = current_pos
            
            # Flash NeoPixel on rotation
            if neopixel_led:
                c = colors[color_idx]
                color_idx = (color_idx + 1) % len(colors)
                if hasattr(neopixel_led, 'set_color'):
                    neopixel_led.set_color(*c)
                else:
                    neopixel_led[0] = c
                time.sleep(0.02)
                if hasattr(neopixel_led, 'set_color'):
                    neopixel_led.set_color(0, 0, 0)
                else:
                    neopixel_led[0] = (0, 0, 0)
            
        if current_pressed != last_pressed:
            if current_pressed:
                if current_pressed == (0, 5):
                    print(f"Encoder Switch Pressed! (Row 0, Col 5)")
                else:
                    print(f"Key Pressed: Row {current_pressed[0]}, Col {current_pressed[1]}")
                
                # Cycle NeoPixel color
                if neopixel_led:
                    c = colors[color_idx]
                    color_idx = (color_idx + 1) % len(colors)
                    if hasattr(neopixel_led, 'set_color'):
                        neopixel_led.set_color(*c)
                    else:
                        neopixel_led[0] = c
                was_pressed = True
            else:
                if was_pressed:
                    if neopixel_led:
                        if hasattr(neopixel_led, 'set_color'):
                            neopixel_led.set_color(0, 0, 0)
                        else:
                            neopixel_led[0] = (0, 0, 0)
                was_pressed = False
            last_pressed = current_pressed
            
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
