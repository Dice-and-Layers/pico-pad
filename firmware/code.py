import board
import busio
import time
import adafruit_ssd1306
from digitalio import DigitalInOut, Direction, Pull

import utils
import asteroids
import pong
import tetris
import macros
import snake
import breakout
import flappy
import invaders
import dino

# --- Hardware Setup ---
try:
    i2c = busio.I2C(board.GP17, board.GP16)
    display = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
except Exception as e:
    display = None

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
    pressed = []
    for c_idx, col in enumerate(cols):
        col.value = True
        for r_idx, row in enumerate(rows):
            if row.value:
                pressed.append((r_idx, c_idx))
        col.value = False
    return pressed

# --- Menu Logic ---
menu_items = [
    ("MACROS", macros.run_macros),
    ("ASTEROIDS", asteroids.run_game),
    ("PONG", pong.run_game),
    ("TETRIS", tetris.run_game),
    ("SNAKE", snake.run_game),
    ("BREAKOUT", breakout.run_game),
    ("FLAPPY", flappy.run_game),
    ("INVADERS", invaders.run_game),
    ("DINO RUN", dino.run_game),
]
selected = 0

def draw_menu(selected_idx):
    display.fill(0)
    utils.draw_text(display, "GAME BOX", 20, 2, scale=2)
    display.hline(0, 18, 128, 1)
    
    visible_count = 4
    start_idx = max(0, min(selected_idx, len(menu_items) - visible_count))
    
    for i in range(visible_count):
        idx = start_idx + i
        if idx >= len(menu_items): break
        
        y = 22 + i * 10
        prefix = ">" if idx == selected_idx else " "
        utils.draw_text(display, prefix + menu_items[idx][0], 10, y)

    # Scroll Bar
    if len(menu_items) > visible_count:
        bar_h = 40
        scroll_pos = (selected_idx / (len(menu_items) - 1)) * (bar_h - 8)
        display.rect(120, 22, 4, bar_h, 1)
        display.fill_rect(121, 23 + int(scroll_pos), 2, 8, 1)
    
    display.show()

if display is None:
    macros.run_macros(None, get_keys)
else:
    while True:
        draw_menu(selected)
        
        start_poll = time.monotonic()
        while time.monotonic() - start_poll < 0.1:
            keys = get_keys()
            if (0, 1) in keys: # Up
                selected = (selected - 1) % len(menu_items)
                time.sleep(0.15)
                break
            elif (2, 1) in keys: # Down
                selected = (selected + 1) % len(menu_items)
                time.sleep(0.15)
                break
            elif (1, 1) in keys: # Launch
                display.fill(0)
                utils.draw_text(display, "LAUNCHING...", 20, 25, scale=2)
                display.show()
                time.sleep(0.5)
                menu_items[selected][1](display, get_keys)
                time.sleep(0.2)
                break
        
        time.sleep(0.01)