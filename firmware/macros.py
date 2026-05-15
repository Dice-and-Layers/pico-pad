"""
PICO BOY - Macro Keyboard Module
--------------------------------
Handles HID keyboard emulation and media controls using a 3x3 matrix.
Reads configuration from macros.json.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import usb_hid
import json
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode

# --- HID Setup ---
kbd = Keyboard(usb_hid.devices)
layout = KeyboardLayoutUS(kbd)
cc = ConsumerControl(usb_hid.devices)

# Load configuration
config = {}
def load_config():
    global config
    try:
        with open("macros.json", "r") as f:
            config = json.load(f)
    except Exception as e:
        print("Error loading macros.json:", e)
        config = {"macros": []}

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
            # Handle common aliases for better compatibility
            aliases = {
                "VOLUME_UP": "VOLUME_INCREMENT",
                "VOLUME_DOWN": "VOLUME_DECREMENT",
                "BRIGHTNESS_UP": "BRIGHTNESS_INCREMENT",
                "BRIGHTNESS_DOWN": "BRIGHTNESS_DECREMENT"
            }
            if ckey in aliases and not hasattr(ConsumerControlCode, ckey):
                ckey = aliases[ckey]
            elif ckey == "VOLUME_INCREMENT" and not hasattr(ConsumerControlCode, ckey):
                if hasattr(ConsumerControlCode, "VOLUME_UP"): ckey = "VOLUME_UP"
            elif ckey == "VOLUME_DECREMENT" and not hasattr(ConsumerControlCode, ckey):
                if hasattr(ConsumerControlCode, "VOLUME_DOWN"): ckey = "VOLUME_DOWN"

            if hasattr(ConsumerControlCode, ckey):
                cc.send(getattr(ConsumerControlCode, ckey))
            else:
                print(f"Error: Consumer key '{ckey}' not found in ConsumerControlCode")
        time.sleep(0.01)

import utils

def run_macros(display, get_keys):
    load_config()
    print("Macro Mode Active")
    
    last_state = [[False for _ in range(3)] for _ in range(3)]
    debounce_time = config.get("settings", {}).get("debounce", 0.05)
    
    if display:
        display.fill(0)
        utils.draw_text(display, "MACRO MODE", 40, 25)
        utils.draw_text(display, "TOP L+R TO EXIT", 30, 45)
        display.show()

    while True:
        keys = get_keys()
        
        # Exit to menu if display exists
        if display and (0, 0) in keys and (0, 2) in keys:
            return

        # Simple matrix scanning logic based on current keys list
        current_pressed = keys
        
        for r in range(3):
            for c in range(3):
                is_pressed = (r, c) in current_pressed
                if is_pressed and not last_state[r][c]:
                    # Pressed
                    macro = get_macro(r, c)
                    if macro:
                        execute_macro(macro)
                    time.sleep(debounce_time)
                last_state[r][c] = is_pressed
        
        time.sleep(0.01)
