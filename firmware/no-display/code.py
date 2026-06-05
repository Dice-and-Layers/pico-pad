"""
PICO BOY - Display-less Macro Firmware
--------------------------------------
A lightweight version of the firmware for users without an OLED display.
Focuses exclusively on macro keyboard functionality.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
"""

import board
import time
from digitalio import DigitalInOut, Direction, Pull
import macros
import utils

# Load board model configuration
model = utils.get_board_model()

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


# Start Macro Mode directly
if __name__ == "__main__":
    print("Starting Display-less Macro Mode...")
    # Passing None for display to indicate we are display-less
    macros.run_macros(None, get_keys)
