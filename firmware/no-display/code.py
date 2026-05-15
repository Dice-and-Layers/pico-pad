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
