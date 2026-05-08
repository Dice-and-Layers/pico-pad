# RP2040 Macro Keyboard Firmware
# A simple 3x3 macro matrix with CircuitPython
# Supports hotkeys, text strings, and media controls

import board
import time
import usb_hid
import json
import storage
from digitalio import DigitalInOut, Direction, Pull
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode

# --- HID Setup ---
kbd = Keyboard(usb_hid.devices)
layout = KeyboardLayoutUS(kbd)
cc = ConsumerControl(usb_hid.devices)

# Pins for 3x3 Matrix
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

# Load configuration
config = {}
def load_config():
    global config
    try:
        with open("macros.json", "r") as f:
            config = json.load(f)
    except Exception as e:
        print("Error loading macros.json:", e)
        # Fallback empty config
        config = {"macros": []}

load_config()

def get_macro(r, c):
    for m in config.get("macros", []):
        if m.get("row") == r and m.get("col") == c:
            return m
    return None

def execute_macro(macro):
    if not macro: return
    print(f"Executing: {macro.get('label', 'Unnamed')}")
    
    for action in macro.get("actions", []):
        atype = action.get("type")
        
        if atype == "keypress":
            keys = []
            for k in action.get("keys", []):
                if hasattr(Keycode, k):
                    keys.append(getattr(Keycode, k))
            if keys:
                kbd.press(*keys)
                kbd.release_all()
        
        elif atype == "text":
            layout.write(action.get("text", ""))
            
        elif atype == "consumer":
            ckey = action.get("key")
            if hasattr(ConsumerControlCode, ckey):
                cc.send(getattr(ConsumerControlCode, ckey))
        
        time.sleep(0.01)

# State tracking for debouncing
last_state = [[False for _ in range(len(cols))] for _ in range(len(rows))]
debounce_time = config.get("settings", {}).get("debounce", 0.05)

print("Macro Keyboard Ready")

while True:
    for c_idx, col in enumerate(cols):
        col.value = True
        
        for r_idx, row in enumerate(rows):
            current_val = row.value
            
            if current_val and not last_state[r_idx][c_idx]:
                # Key Pressed
                macro = get_macro(r_idx, c_idx)
                if macro:
                    execute_macro(macro)
                time.sleep(debounce_time) # Simple debounce
                
            last_state[r_idx][c_idx] = current_val
            
        col.value = False
    
    # Check for file changes (simple way: check if file was modified)
    # For now, let's just loop. Real-time reloading could be added later.
    time.sleep(0.01)