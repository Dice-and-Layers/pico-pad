"""
PICO BOY - Utility Module
-------------------------
Shared functions for font rendering, icon drawing, and high score management.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import json

def get_high_score(game_name):
    try:
        with open("scores.json", "r") as f:
            scores = json.load(f)
            return scores.get(game_name, 0)
    except:
        return 0

def save_high_score(game_name, score):
    scores = {}
    try:
        with open("scores.json", "r") as f:
            scores = json.load(f)
    except:
        pass
    if score > scores.get(game_name, 0):
        scores[game_name] = score
        try:
            with open("scores.json", "w") as f:
                json.dump(scores, f)
        except:
            pass

# --- UI Helpers ---
FONT = {
    '0': [0x1F, 0x11, 0x1F], '1': [0x00, 0x1F, 0x00], '2': [0x1D, 0x15, 0x17],
    '3': [0x15, 0x15, 0x1F], '4': [0x07, 0x04, 0x1F], '5': [0x17, 0x15, 0x1D],
    '6': [0x1F, 0x15, 0x1D], '7': [0x01, 0x01, 0x1F], '8': [0x1F, 0x15, 0x1F],
    '9': [0x17, 0x15, 0x1F], 'A': [0x1E, 0x05, 0x1E], 'B': [0x1F, 0x15, 0x0A],
    'C': [0x0E, 0x11, 0x11], 'D': [0x1F, 0x11, 0x0E], 'E': [0x1F, 0x15, 0x15],
    'F': [0x1F, 0x05, 0x01], 'G': [0x0E, 0x11, 0x1D], 'H': [0x1F, 0x04, 0x1F],
    'I': [0x11, 0x1F, 0x11], 'J': [0x10, 0x10, 0x1F], 'K': [0x1F, 0x04, 0x1B],
    'L': [0x1F, 0x10, 0x10], 'M': [0x1F, 0x02, 0x1F], 'N': [0x1F, 0x04, 0x1F],
    'O': [0x0E, 0x11, 0x0E], 'P': [0x1F, 0x05, 0x02], 'Q': [0x0E, 0x11, 0x1E],
    'R': [0x1F, 0x09, 0x16], 'S': [0x12, 0x15, 0x09], 'T': [0x01, 0x1F, 0x01],
    'U': [0x1F, 0x10, 0x1F], 'V': [0x07, 0x18, 0x07], 'W': [0x1F, 0x08, 0x1F],
    'X': [0x1B, 0x04, 0x1B], 'Y': [0x07, 0x18, 0x07], 'Z': [0x19, 0x15, 0x13],
    ' ': [0x00, 0x00, 0x00], '.': [0x10, 0x00, 0x00], '>': [0x04, 0x0A, 0x11]
}

# --- Game Sprites (8x8) ---
ICONS = {
    'SHIP': [0x18, 0x3C, 0x7E, 0xDB, 0xFF, 0x24, 0x5A, 0xA5],
    'ASTEROID': [0x3C, 0x7E, 0xFF, 0xE7, 0xC3, 0xFF, 0x7E, 0x3C],
    'SNAKE_HEAD': [0x3C, 0x42, 0x99, 0xA5, 0xA5, 0x99, 0x42, 0x3C],
    'FOOD': [0x00, 0x18, 0x3C, 0x3C, 0x18, 0x00, 0x00, 0x00],
    'BIRD': [0x00, 0x70, 0xD8, 0xF8, 0x78, 0x00, 0x00, 0x00],
    'ALIEN': [0x18, 0x3C, 0x7E, 0xDB, 0xFF, 0x24, 0x5A, 0xA5],
    'DINO': [0x07, 0x05, 0x07, 0x16, 0x1F, 0x0E, 0x0A, 0x0A],
    'CACTUS': [0x04, 0x05, 0x15, 0x15, 0x1F, 0x04, 0x04, 0x04]
}

def draw_text(d, text, x, y, scale=1, color=1):
    curr_x = x
    for char in text:
        if char.upper() in FONT:
            cols_data = FONT[char.upper()]
            for c_idx, col in enumerate(cols_data):
                for r_idx in range(5):
                    if (col >> r_idx) & 1:
                        if scale == 1:
                            d.pixel(curr_x + c_idx, y + r_idx, color)
                        else:
                            d.fill_rect(curr_x + c_idx*scale, y + r_idx*scale, scale, scale, color)
        curr_x += 4 * scale

def draw_icon(d, name, x, y, color=1, scale=1):
    if name in ICONS:
        data = ICONS[name]
        for r_idx, row in enumerate(data):
            for c_idx in range(8):
                if (row >> (7 - c_idx)) & 1:
                    if scale == 1:
                        d.pixel(int(x) + c_idx, int(y) + r_idx, color)
                    else:
                        d.fill_rect(int(x) + c_idx*scale, int(y) + r_idx*scale, scale, scale, color)

# --- Dynamic Board Model and NeoPixel Support ---
import os

_board_model = None

def get_board_model():
    """Reads the BOARD_MODEL config from settings.toml or macros.json."""
    global _board_model
    if _board_model is not None:
        return _board_model
        
    # Check settings.toml first
    val = os.getenv("BOARD_MODEL", None)
    if val is not None:
        _board_model = val.lower().strip()
        return _board_model

    # Fallback to macros.json
    try:
        with open("macros.json", "r") as f:
            data = json.load(f)
            val = data.get("settings", {}).get("board_model", "3x3")
            _board_model = val.lower().strip()
    except Exception:
        _board_model = "3x3"
        
    return _board_model

class BoardNeoPixel:
    def __init__(self, pin, num_pixels=1, brightness=0.3):
        self.num_pixels = num_pixels
        self.brightness = brightness
        self.pin = None
        self._pixels = None
        self._fallback = False
        
        try:
            import neopixel
            self._pixels = neopixel.NeoPixel(pin, num_pixels, brightness=brightness, auto_write=True)
        except ImportError:
            import neopixel_write
            from digitalio import DigitalInOut, Direction
            self.pin = DigitalInOut(pin)
            self.pin.direction = Direction.OUTPUT
            self._fallback = True
            
    def set_color(self, r, g, b):
        if not self._fallback and self._pixels:
            self._pixels[0] = (r, g, b)
        else:
            import neopixel_write
            # Apply brightness manually
            r_val = int(r * self.brightness)
            g_val = int(g * self.brightness)
            b_val = int(b * self.brightness)
            neopixel_write.neopixel_write(self.pin, bytearray([g_val, r_val, b_val]))
            
    def off(self):
        self.set_color(0, 0, 0)

neopixel_led = None
_was_pressed = False
neopixel_color_idx = 0

NEOPIXEL_COLORS = [
    (255, 0, 0),     # Red
    (0, 255, 0),     # Green
    (0, 0, 255),     # Blue
    (255, 255, 0),   # Yellow
    (0, 255, 255),   # Cyan
    (255, 0, 255),   # Magenta
    (255, 127, 0),   # Orange
    (127, 0, 255),   # Purple
]

def init_neopixel():
    global neopixel_led
    model = get_board_model()
    if model in ("1x3", "3x3_pro", "6x2_encoder", "5x3_2encoders"):
        try:
            import board
            neopixel_led = BoardNeoPixel(board.GP16, 1, brightness=0.3)
            # Short green pulse on startup
            neopixel_led.set_color(0, 255, 0)
            import time
            time.sleep(0.08)
            neopixel_led.off()
        except Exception as e:
            print("NeoPixel Init failed:", e)

def update_neopixel(keys_pressed):
    global neopixel_led, _was_pressed, neopixel_color_idx
    model = get_board_model()
    if model not in ("1x3", "3x3_pro", "6x2_encoder", "5x3_2encoders"):
        return
        
    if neopixel_led is None:
        init_neopixel()
        
    if not neopixel_led:
        return
        
    if keys_pressed:
        if not _was_pressed:
            # New press event, change color
            color = NEOPIXEL_COLORS[neopixel_color_idx]
            neopixel_color_idx = (neopixel_color_idx + 1) % len(NEOPIXEL_COLORS)
            neopixel_led.set_color(*color)
        _was_pressed = True
    else:
        if _was_pressed:
            neopixel_led.off()
        _was_pressed = False

