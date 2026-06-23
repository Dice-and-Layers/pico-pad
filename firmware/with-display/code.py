"""
PICO BOY - Main Launcher & Firmware
-----------------------------------
A modular firmware for the Raspberry Pi Pico based handheld.
Features a scrollable game launcher, macro keyboard support, 
and automatic hardware detection.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import board
import busio
import time
import adafruit_ssd1306
from digitalio import DigitalInOut, Direction, Pull

import utils
import macros
# Import rebranded games from the games folder
from games import starroids, retro_paddle, geo_stack, neon_snake, wall_buster, winged_jump, alien_siege, primal_dash, chess_clock

# Load board model configuration
model = utils.get_board_model()

# --- Hardware Configuration ---
display = None
try:
    # I2C setup for SSD1306 OLED (128x64)
    if model == "3x3_pro":
        i2c = busio.I2C(board.GP15, board.GP14)
    else:
        i2c = busio.I2C(board.GP17, board.GP16)
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
except Exception as e:
    print("Display init failed:", e)

if model == "1x3":
    # 1x3 Direct Pin Setup - Swapped GP1 and GP2 to match physical PCB layout (GP2 in middle, GP1 on right)
    KEY_PINS = [board.GP0, board.GP2, board.GP1]
    LED_PINS = [board.GP5, board.GP3, board.GP4] # Left -> GP5, Middle -> GP3, Right -> GP4
    
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
        
    # Run a premium startup animation on the 3 LEDs
    for l in leds_io:
        l.value = True
        time.sleep(0.06)
        l.value = False
    for l in reversed(leds_io):
        l.value = True
        time.sleep(0.06)
        l.value = False
        
    def get_keys():
        """Scans the 1x3 direct keys (active low) and returns list of pressed (row, col) tuples."""
        pressed = []
        for idx, key in enumerate(keys_io):
            if not key.value:  # Pressed is Low
                pressed.append((0, idx)) # Row 0, Col idx
                leds_io[idx].value = True
            else:
                leds_io[idx].value = False
        # Update onboard NeoPixel status
        utils.update_neopixel(len(pressed) > 0)
        return pressed

elif model == "3x3_pro":
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
        
    # Run a premium swipe startup animation on the LED matrix
    for r in led_rows_io:
        r.value = True
        for c in led_cols_io:
            c.value = False
        time.sleep(0.06)
        r.value = False
        for c in led_cols_io:
            c.value = True
            
    def get_keys():
        """Scans the 3x4 matrix and returns list of pressed (row, col) tuples."""
        pressed = []
        for c_idx, col in enumerate(cols):
            col.value = True
            for r_idx, row in enumerate(rows):
                if row.value:
                    pressed.append((r_idx, c_idx))
            col.value = False
            
        # Drive LED matrix based on pressed keys and active profile
        for r in led_rows_io:
            r.value = False
        for c in led_cols_io:
            c.value = True
            
        # If macro keys (excluding profile switcher at 0,3) are pressed, light them up
        macro_pressed = [k for k in pressed if k[0] < 3 and k[1] < 3]
        if macro_pressed:
            for r_idx, c_idx in macro_pressed:
                led_rows_io[r_idx].value = True
                led_cols_io[c_idx].value = False
        else:
            # Indicate active profile when idle on top row
            import macros
            active_idx = getattr(macros, "active_profile_idx", 0)
            led_rows_io[0].value = True
            col_to_light = active_idx % 3
            led_cols_io[col_to_light].value = False
            
        # Update onboard NeoPixel
        utils.update_neopixel(len(pressed) > 0)
        return pressed

else:
    # Matrix Keyboard Setup (3x3)
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
    
    def get_keys():
        """Scans the 3x3 matrix and returns list of pressed (row, col) tuples."""
        pressed = []
        for c_idx, col in enumerate(cols):
            col.value = True
            for r_idx, row in enumerate(rows):
                if row.value: pressed.append((r_idx, c_idx))
            col.value = False
        return pressed


# --- Menu Configuration ---
menu_items = [
    ("MACROS", macros.run_macros),
    ("STARROIDS", starroids.run_game),
    ("RETRO PADDLE", retro_paddle.run_game),
    ("GEO STACK", geo_stack.run_game),
    ("NEON SNAKE", neon_snake.run_game),
    ("WALL BUSTER", wall_buster.run_game),
    ("WINGED JUMP", winged_jump.run_game),
    ("ALIEN SIEGE", alien_siege.run_game),
    ("PRIMAL DASH", primal_dash.run_game),
    ("CHESS CLOCK", chess_clock.run_game),
]
selected = 0
scroll_offset = 0
visible_count = 4

def draw_menu():
    """Renders the scrollable launcher menu with inverted selection."""
    global scroll_offset
    display.fill(0)
    
    # Title Header
    utils.draw_text(display, "PICO BOY", 32, 2, scale=2)
    display.hline(0, 18, 128, 1)
    
    # Selection boundary logic for smooth scrolling
    if selected < scroll_offset:
        scroll_offset = selected
    elif selected >= scroll_offset + visible_count:
        scroll_offset = selected - visible_count + 1
        
    for i in range(visible_count):
        idx = scroll_offset + i
        if idx >= len(menu_items): break
        
        y = 22 + i * 10
        if idx == selected:
            # Highlight selected item
            display.fill_rect(2, y - 1, 116, 9, 1)
            utils.draw_text(display, menu_items[idx][0], 8, y, color=0)
        else:
            utils.draw_text(display, menu_items[idx][0], 8, y, color=1)

    # Scroll Bar Indicator
    if len(menu_items) > visible_count:
        bar_h, bar_y = 40, 22
        scroll_bar_pos = (selected / (len(menu_items) - 1)) * (bar_h - 8)
        display.rect(120, bar_y, 4, bar_h, 1)
        display.fill_rect(121, bar_y + 1 + int(scroll_bar_pos), 2, 6, 1)
    
    display.show()

# --- Execution Entry Point ---
if display is None:
    # Default to Macro Mode if no screen is detected
    macros.run_macros(None, get_keys)
else:
    while True:
        draw_menu()
        
        # Poll keys for navigation
        keys = get_keys()
        if (0, 1) in keys: # Up
            selected = (selected - 1) % len(menu_items)
            time.sleep(0.15)
        elif (2, 1) in keys: # Down
            selected = (selected + 1) % len(menu_items)
            time.sleep(0.15)
        elif (1, 1) in keys: # Select/Launch
            display.fill(0)
            utils.draw_text(display, "LAUNCHING...", 20, 25, scale=2)
            display.show()
            time.sleep(0.5)
            # Hand over control to the selected game module
            menu_items[selected][1](display, get_keys)
            time.sleep(0.2)
            
        time.sleep(0.01)