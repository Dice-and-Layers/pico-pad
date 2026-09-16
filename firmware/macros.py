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

KEY_ALIASES = {
    "CTRL": "CONTROL",
    "LCTRL": "LEFT_CONTROL",
    "RCTRL": "RIGHT_CONTROL",
    "LSHIFT": "LEFT_SHIFT",
    "RSHIFT": "RIGHT_SHIFT",
    "LALT": "LEFT_ALT",
    "RALT": "RIGHT_ALT",
    "OPT": "ALT",
    "OPTION": "ALT",
    "CMD": "GUI",
    "COMMAND": "GUI",
    "WIN": "GUI",
    "WINDOWS": "GUI",
    "SUPER": "GUI",
    "ESC": "ESCAPE",
    "DEL": "DELETE",
    "INS": "INSERT",
    "PGUP": "PAGE_UP",
    "PGDN": "PAGE_DOWN",
    "UP": "UP_ARROW",
    "DOWN": "DOWN_ARROW",
    "LEFT": "LEFT_ARROW",
    "RIGHT": "RIGHT_ARROW",
    "RETURN": "ENTER",
}

def resolve_keycodes(key_names):
    resolved = []
    for k in key_names:
        if not isinstance(k, str):
            continue
        k_upper = k.strip().upper()
        name = KEY_ALIASES.get(k_upper, k_upper)
        if hasattr(Keycode, name):
            resolved.append(getattr(Keycode, name))
        elif hasattr(Keycode, k):
            resolved.append(getattr(Keycode, k))
        else:
            print(f"Warning: Keycode '{k}' not found in Keycode")
    return resolved

def switch_to_next_profile():
    global active_profile_idx
    if not profiles_list:
        return "Default"
    active_profile_idx = (active_profile_idx + 1) % len(profiles_list)
    return profiles_list[active_profile_idx]

def execute_macro(macro):
    if not macro: return False
    print(f"Executing: {macro.get('label', 'Unnamed')}")
    for action in macro.get("actions", []):
        atype = action.get("type")
        if atype == "keypress":
            keys = resolve_keycodes(action.get("keys", []))
            if keys:
                kbd.press(*keys)
                time.sleep(0.02)
                kbd.release(*keys)
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
                kbd.release(Keycode.GUI)
                time.sleep(0.2)
                layout.write(app_name)
                time.sleep(0.15)
                kbd.press(Keycode.ENTER)
                kbd.release(Keycode.ENTER)
        elif atype in ("profile_switch", "layer_switch"):
            new_prof = switch_to_next_profile()
            print("Switched profile to:", new_prof)
            utils.flash_neopixel_profile(active_profile_idx)
            time.sleep(0.2)
            return True
        elif atype == "url":
            url_path = action.get("url", "")
            if url_path:
                kbd.press(Keycode.GUI, Keycode.R)
                kbd.release(Keycode.GUI, Keycode.R)
                time.sleep(0.2)
                layout.write(url_path)
                time.sleep(0.15)
                kbd.press(Keycode.ENTER)
                kbd.release(Keycode.ENTER)
        time.sleep(0.01)
    return False

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
    num_cols = 8 if model == "5x3_2encoders" else 6 if model == "6x2_encoder" else 4 if model in ("3x3_pro", "4x2") else 3
    num_rows = 2 if model == "4x2" else 3
    last_state = [[False for _ in range(num_cols)] for _ in range(num_rows)]
    debounce_time = config.get("settings", {}).get("debounce", 0.05)
    last_profile_btn_state = False
    
    # Track keys that are currently held down per matrix position (row, col) -> list of keycodes
    held_keys = {}
    
    if display:
        update_display(display)

    try:
        while True:
            keys = get_keys()
            
            # Exit to menu if display exists
            if display and (0, 0) in keys and (0, 2) in keys:
                if held_keys:
                    kbd.release_all()
                    held_keys.clear()
                return

            # Handle profile switch for 3x3_pro model (dedicated GP6 pin at (0, 3))
            if model == "3x3_pro":
                profile_btn_pressed = (0, 3) in keys
                # Fallback profile switch if dedicated button (0, 3) is unassigned in JSON
                if get_macro(0, 3) is None:
                    if profile_btn_pressed and not last_profile_btn_state:
                        if held_keys:
                            kbd.release_all()
                            held_keys.clear()
                        new_prof = switch_to_next_profile()
                        print("Switched profile to:", new_prof)
                        utils.flash_neopixel_profile(active_profile_idx)
                        if display:
                            update_display(display)
                        time.sleep(0.2) # Extra debounce for profile switch
                last_profile_btn_state = profile_btn_pressed
            elif model == "6x2_encoder":
                # Fallback layer switch if encoder button (0, 5) is unassigned in JSON
                if get_macro(0, 5) is None:
                    profile_btn_pressed = (0, 5) in keys
                    if profile_btn_pressed and not last_profile_btn_state:
                        if held_keys:
                            kbd.release_all()
                            held_keys.clear()
                        new_prof = switch_to_next_profile()
                        print("Switched profile to:", new_prof)
                        utils.flash_neopixel_profile(active_profile_idx)
                        if display:
                            update_display(display)
                        time.sleep(0.2)
                    last_profile_btn_state = profile_btn_pressed

            # Simple matrix scanning logic based on current keys list
            current_pressed = keys
            
            for r in range(num_rows):
                for c in range(num_cols):

                    is_pressed = (r, c) in current_pressed
                    was_pressed = last_state[r][c]
                    
                    if is_pressed and not was_pressed:
                        # Pressed (Key Down)
                        macro = get_macro(r, c)
                        if macro:
                            actions = macro.get("actions", [])
                            # If macro is a single keypress action, keep it pressed until physically released
                            if len(actions) == 1 and actions[0].get("type") == "keypress":
                                kcodes = resolve_keycodes(actions[0].get("keys", []))
                                if kcodes:
                                    print(f"Holding: {macro.get('label', 'Unnamed')} -> {kcodes}")
                                    kbd.press(*kcodes)
                                    held_keys[(r, c)] = kcodes
                            else:
                                switched = execute_macro(macro)
                                if switched:
                                    if held_keys:
                                        kbd.release_all()
                                        held_keys.clear()
                                    if display:
                                        update_display(display)
                        time.sleep(debounce_time)
                    elif not is_pressed and was_pressed:
                        # Released (Key Up)
                        if (r, c) in held_keys:
                            kcodes = held_keys.pop((r, c))
                            try:
                                kbd.release(*kcodes)
                            except Exception as e:
                                print("Error releasing keys:", e)
                                kbd.release_all()
                        time.sleep(debounce_time)

                    last_state[r][c] = is_pressed
            
            # Safety net: if no keys physically pressed, ensure no stuck held keys
            if not current_pressed and held_keys:
                kbd.release_all()
                held_keys.clear()

            time.sleep(0.01)
    finally:
        if held_keys:
            kbd.release_all()
            held_keys.clear()




