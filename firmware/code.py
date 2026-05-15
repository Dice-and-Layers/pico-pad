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
# Import rebranded games
import starroids
import retro_paddle
import geo_stack
import neon_snake
import wall_buster
import winged_jump
import alien_siege
import primal_dash

# --- Hardware Configuration ---
try:
    # I2C setup for SSD1306 OLED (128x64)
    i2c = busio.I2C(board.GP17, board.GP16)
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
except Exception:
    display = None

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