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
profiles_list = []
active_profile_idx = 0

def load_config():
    global config, profiles_list, active_profile_idx
    try:
        with open("macros.json", "r") as f:
            config = json.load(f)
    except Exception as e:
        print("Error loading macros.json:", e)
        config = {"macros": []}
        
    profiles_dict = config.get("profiles", {})
    if profiles_dict:
        profiles_list = list(profiles_dict.keys())
        active_name = config.get("active_profile", "Default")
        if active_name in profiles_list:
            active_profile_idx = profiles_list.index(active_name)
        else:
            active_profile_idx = 0
    else:
        profiles_list = ["Default"]
        active_profile_idx = 0

def get_current_profile_name():
    if profiles_list:
        return profiles_list[active_profile_idx]
    return "Default"

def get_macro(r, c):
    profiles_dict = config.get("profiles", {})
    if profiles_dict and profiles_list:
        profile_name = profiles_list[active_profile_idx]
        profile_data = profiles_dict.get(profile_name, {})
        for m in profile_data.get("macros", []):
            if m.get("row") == r and m.get("col") == c:
                return m
    else:
        for m in config.get("macros", []):
            if m.get("row") == r and m.get("col") == c:
                return m
    return None

def switch_to_next_profile():
    global active_profile_idx
    if not profiles_list:
        return "Default"
    active_profile_idx = (active_profile_idx + 1) % len(profiles_list)
    return profiles_list[active_profile_idx]

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
        elif atype == "delay":
            duration = action.get("duration", 0.1)
            time.sleep(duration)
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
        elif atype == "launch":
            app_name = action.get("app", "")
            if app_name:
                kbd.press(Keycode.GUI)
                kbd.release_all()
                time.sleep(0.2)
                layout.write(app_name)
                time.sleep(0.15)
                kbd.press(Keycode.ENTER)
                kbd.release_all()
        elif atype == "url":
            url_path = action.get("url", "")
            if url_path:
                kbd.press(Keycode.GUI)
                kbd.press(Keycode.R)
                kbd.release_all()
                time.sleep(0.2)
                layout.write(url_path)
                time.sleep(0.15)
                kbd.press(Keycode.ENTER)
                kbd.release_all()
        time.sleep(0.01)

import utils

def update_display(display):
    if not display: return
    display.fill(0)
    display.rect(0, 0, 128, 64, 1)
    utils.draw_text(display, "MACRO KEYPAD", 28, 4, scale=1)
    display.hline(0, 14, 128, 1)
    
    profile_name = get_current_profile_name()
    utils.draw_text(display, "Active Profile:", 10, 22, scale=1)
    utils.draw_text(display, f"> {profile_name}", 10, 34, scale=1)
    
    display.hline(0, 48, 128, 1)
    utils.draw_text(display, "Hold Top L+R to Exit", 24, 52, scale=1)
    display.show()

def run_macros(display, get_keys):
    load_config()
    print("Macro Mode Active")
    
    model = utils.get_board_model()
    num_cols = 8 if model == "5x3_2encoders" else 6 if model == "6x2_encoder" else 4 if model == "3x3_pro" else 3
    last_state = [[False for _ in range(num_cols)] for _ in range(3)]
    debounce_time = config.get("settings", {}).get("debounce", 0.05)
    last_profile_btn_state = False
    
    if display:
        update_display(display)

    while True:
        keys = get_keys()
        
        # Exit to menu if display exists
        if display and (0, 0) in keys and (0, 2) in keys:
            return

        # Handle profile switch for 3x3_pro model
        if model == "3x3_pro":
            profile_btn_pressed = (0, 3) in keys
            if profile_btn_pressed and not last_profile_btn_state:
                new_prof = switch_to_next_profile()
                print("Switched profile to:", new_prof)
                if display:
                    update_display(display)
                time.sleep(0.2) # Extra debounce for profile switch
            last_profile_btn_state = profile_btn_pressed

        # Simple matrix scanning logic based on current keys list
        current_pressed = keys
        
        for r in range(3):
            for c in range(num_cols):
                is_pressed = (r, c) in current_pressed
                if is_pressed and not last_state[r][c]:
                    # Pressed
                    macro = get_macro(r, c)
                    if macro:
                        execute_macro(macro)
                    time.sleep(debounce_time)
                last_state[r][c] = is_pressed
        
        time.sleep(0.01)




