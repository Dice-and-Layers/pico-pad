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

# Initialize Mouse HID with safe fallback
mouse = None
MOUSE_BUTTONS = {
    "LEFT": 1,
    "RIGHT": 2,
    "MIDDLE": 4,
    "BACK": 8,
    "FORWARD": 16,
}
try:
    from adafruit_hid.mouse import Mouse
    mouse = Mouse(usb_hid.devices)
    MOUSE_BUTTONS["LEFT"] = Mouse.LEFT_BUTTON
    MOUSE_BUTTONS["RIGHT"] = Mouse.RIGHT_BUTTON
    MOUSE_BUTTONS["MIDDLE"] = Mouse.MIDDLE_BUTTON
    MOUSE_BUTTONS["BACK"] = Mouse.BACK_BUTTON
    MOUSE_BUTTONS["FORWARD"] = Mouse.FORWARD_BUTTON
except Exception as e:
    print("Warning: Mouse HID could not be initialized:", e)

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
    # Modifiers
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
    "LGUI": "LEFT_GUI",
    "RGUI": "RIGHT_GUI",
    "LMETA": "LEFT_GUI",
    "RMETA": "RIGHT_GUI",
    # Navigation & Control
    "ESC": "ESCAPE",
    "DEL": "DELETE",
    "INS": "INSERT",
    "PGUP": "PAGE_UP",
    "PGDN": "PAGE_DOWN",
    "PAGEUP": "PAGE_UP",
    "PAGEDOWN": "PAGE_DOWN",
    "UP": "UP_ARROW",
    "DOWN": "DOWN_ARROW",
    "LEFT": "LEFT_ARROW",
    "RIGHT": "RIGHT_ARROW",
    "RETURN": "ENTER",
    "SPACEBAR": "SPACE",
    "BS": "BACKSPACE",
    "BKSP": "BACKSPACE",
    "CAPS": "CAPS_LOCK",
    "CAPSLOCK": "CAPS_LOCK",
    "PRTSC": "PRINT_SCREEN",
    "PRINTSCREEN": "PRINT_SCREEN",
    "PRINT_SCRN": "PRINT_SCREEN",
    "SNAPSHOT": "PRINT_SCREEN",
    "SCROLLLOCK": "SCROLL_LOCK",
    "SCRLK": "SCROLL_LOCK",
    "PAUSE_BREAK": "PAUSE",
    "BREAK": "PAUSE",
    "APP": "APPLICATION",
    "APPS": "APPLICATION",
    "MENU": "APPLICATION",
    # Function Keys (F1 - F24 aliases)
    "FN1": "F1", "FN2": "F2", "FN3": "F3", "FN4": "F4", "FN5": "F5", "FN6": "F6",
    "FN7": "F7", "FN8": "F8", "FN9": "F9", "FN10": "F10", "FN11": "F11", "FN12": "F12",
    "FN13": "F13", "FN14": "F14", "FN15": "F15", "FN16": "F16", "FN17": "F17", "FN18": "F18",
    "FN19": "F19", "FN20": "F20", "FN21": "F21", "FN22": "F22", "FN23": "F23", "FN24": "F24",
    "FN_1": "F1", "FN_2": "F2", "FN_3": "F3", "FN_4": "F4", "FN_5": "F5", "FN_6": "F6",
    "FN_7": "F7", "FN_8": "F8", "FN_9": "F9", "FN_10": "F10", "FN_11": "F11", "FN_12": "F12",
    "FN_13": "F13", "FN_14": "F14", "FN_15": "F15", "FN_16": "F16", "FN_17": "F17", "FN_18": "F18",
    "FN_19": "F19", "FN_20": "F20", "FN_21": "F21", "FN_22": "F22", "FN_23": "F23", "FN_24": "F24",
    # Number Row (0 - 9)
    "0": "ZERO", "1": "ONE", "2": "TWO", "3": "THREE", "4": "FOUR",
    "5": "FIVE", "6": "SIX", "7": "SEVEN", "8": "EIGHT", "9": "NINE",
    # Punctuation & Symbols
    "-": "MINUS",
    "=": "EQUALS",
    "EQUAL": "EQUALS",
    "[": "LEFT_BRACKET",
    "]": "RIGHT_BRACKET",
    "LBRACKET": "LEFT_BRACKET",
    "RBRACKET": "RIGHT_BRACKET",
    "\\": "BACKSLASH",
    ";": "SEMICOLON",
    "'": "QUOTE",
    "\"": "QUOTE",
    "APOSTROPHE": "QUOTE",
    "`": "GRAVE_ACCENT",
    "GRAVE": "GRAVE_ACCENT",
    "BACKTICK": "GRAVE_ACCENT",
    "TILDE": "GRAVE_ACCENT",
    ",": "COMMA",
    ".": "PERIOD",
    "DOT": "PERIOD",
    "/": "FORWARD_SLASH",
    "SLASH": "FORWARD_SLASH",
    "#": "POUND",
    # Numpad Digits (0 - 9)
    "NUMPAD_0": "KEYPAD_ZERO", "NUMPAD0": "KEYPAD_ZERO", "KP_0": "KEYPAD_ZERO", "KP0": "KEYPAD_ZERO", "NUM_0": "KEYPAD_ZERO", "PAD_0": "KEYPAD_ZERO",
    "NUMPAD_1": "KEYPAD_ONE",  "NUMPAD1": "KEYPAD_ONE",  "KP_1": "KEYPAD_ONE",  "KP1": "KEYPAD_ONE",  "NUM_1": "KEYPAD_ONE",  "PAD_1": "KEYPAD_ONE",
    "NUMPAD_2": "KEYPAD_TWO",  "NUMPAD2": "KEYPAD_TWO",  "KP_2": "KEYPAD_TWO",  "KP2": "KEYPAD_TWO",  "NUM_2": "KEYPAD_TWO",  "PAD_2": "KEYPAD_TWO",
    "NUMPAD_3": "KEYPAD_THREE","NUMPAD3": "KEYPAD_THREE","KP_3": "KEYPAD_THREE","KP3": "KEYPAD_THREE","NUM_3": "KEYPAD_THREE","PAD_3": "KEYPAD_THREE",
    "NUMPAD_4": "KEYPAD_FOUR", "NUMPAD4": "KEYPAD_FOUR", "KP_4": "KEYPAD_FOUR", "KP4": "KEYPAD_FOUR", "NUM_4": "KEYPAD_FOUR", "PAD_4": "KEYPAD_FOUR",
    "NUMPAD_5": "KEYPAD_FIVE", "NUMPAD5": "KEYPAD_FIVE", "KP_5": "KEYPAD_FIVE", "KP5": "KEYPAD_FIVE", "NUM_5": "KEYPAD_FIVE", "PAD_5": "KEYPAD_FIVE",
    "NUMPAD_6": "KEYPAD_SIX",  "NUMPAD6": "KEYPAD_SIX",  "KP_6": "KEYPAD_SIX",  "KP6": "KEYPAD_SIX",  "NUM_6": "KEYPAD_SIX",  "PAD_6": "KEYPAD_SIX",
    "NUMPAD_7": "KEYPAD_SEVEN","NUMPAD7": "KEYPAD_SEVEN","KP_7": "KEYPAD_SEVEN","KP7": "KEYPAD_SEVEN","NUM_7": "KEYPAD_SEVEN","PAD_7": "KEYPAD_SEVEN",
    "NUMPAD_8": "KEYPAD_EIGHT","NUMPAD8": "KEYPAD_EIGHT","KP_8": "KEYPAD_EIGHT","KP8": "KEYPAD_EIGHT","NUM_8": "KEYPAD_EIGHT","PAD_8": "KEYPAD_EIGHT",
    "NUMPAD_9": "KEYPAD_NINE", "NUMPAD9": "KEYPAD_NINE", "KP_9": "KEYPAD_NINE", "KP9": "KEYPAD_NINE", "NUM_9": "KEYPAD_NINE", "PAD_9": "KEYPAD_NINE",
    # Numpad Operators & Controls
    "NUMPAD_DOT": "KEYPAD_PERIOD", "NUMPAD_PERIOD": "KEYPAD_PERIOD", "KP_DOT": "KEYPAD_PERIOD", "KP_PERIOD": "KEYPAD_PERIOD", "NUM_DOT": "KEYPAD_PERIOD",
    "NUMPAD_PLUS": "KEYPAD_PLUS", "NUMPAD_ADD": "KEYPAD_PLUS", "KP_PLUS": "KEYPAD_PLUS", "KP_ADD": "KEYPAD_PLUS",
    "NUMPAD_MINUS": "KEYPAD_MINUS", "NUMPAD_SUBTRACT": "KEYPAD_MINUS", "KP_MINUS": "KEYPAD_MINUS", "KP_SUBTRACT": "KEYPAD_MINUS",
    "NUMPAD_MULTIPLY": "KEYPAD_ASTERISK", "NUMPAD_STAR": "KEYPAD_ASTERISK", "KP_MULTIPLY": "KEYPAD_ASTERISK", "KP_STAR": "KEYPAD_ASTERISK", "KEYPAD_MULTIPLY": "KEYPAD_ASTERISK", "KEYPAD_STAR": "KEYPAD_ASTERISK",
    "NUMPAD_DIVIDE": "KEYPAD_FORWARD_SLASH", "NUMPAD_SLASH": "KEYPAD_FORWARD_SLASH", "KP_DIVIDE": "KEYPAD_FORWARD_SLASH", "KP_SLASH": "KEYPAD_FORWARD_SLASH", "KEYPAD_DIVIDE": "KEYPAD_FORWARD_SLASH", "KEYPAD_SLASH": "KEYPAD_FORWARD_SLASH",
    "NUMPAD_ENTER": "KEYPAD_ENTER", "KP_ENTER": "KEYPAD_ENTER",
    "NUMPAD_EQUALS": "KEYPAD_EQUALS", "KP_EQUALS": "KEYPAD_EQUALS",
    "NUMLOCK": "KEYPAD_NUMLOCK", "NUM_LOCK": "KEYPAD_NUMLOCK", "NUMPAD_LOCK": "KEYPAD_NUMLOCK", "NUMPADLOCK": "KEYPAD_NUMLOCK"
}

def resolve_keycodes(key_names):
    resolved = []
    for k in key_names:
        if not isinstance(k, str):
            continue
        k_str = k.strip()
        k_upper = k_str.upper()
        # 1. Lookup in alias map (case-insensitive, fallback to original)
        name = KEY_ALIASES.get(k_upper, KEY_ALIASES.get(k_str, k_upper))
        # 2. Check Keycode attributes
        if hasattr(Keycode, name):
            resolved.append(getattr(Keycode, name))
        elif hasattr(Keycode, k_upper):
            resolved.append(getattr(Keycode, k_upper))
        elif hasattr(Keycode, k_str):
            resolved.append(getattr(Keycode, k_str))
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
        elif atype in ("mouse_click", "mouse"):
            if mouse:
                btn_str = str(action.get("button", "LEFT")).strip().upper()
                btn = MOUSE_BUTTONS.get(btn_str, MOUSE_BUTTONS["LEFT"])
                click_type = action.get("click_type", "click")
                mods = resolve_keycodes(action.get("modifiers", []))

                if mods:
                    kbd.press(*mods)
                    time.sleep(0.01)

                if click_type == "double_click":
                    mouse.click(btn)
                    time.sleep(0.05)
                    mouse.click(btn)
                else:
                    mouse.click(btn)

                if mods:
                    time.sleep(0.01)
                    kbd.release(*mods)
            else:
                print("Warning: Mouse not available for mouse action")
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
    
    # Track keys and mouse buttons that are currently held down per matrix position (row, col)
    held_keys = {}       # (r, c) -> list of keycodes
    held_mouse = {}      # (r, c) -> (button_code, list of modifier keycodes)
    
    if display:
        update_display(display)

    def release_all_inputs():
        if held_keys:
            kbd.release_all()
            held_keys.clear()
        if held_mouse:
            if mouse:
                try:
                    mouse.release_all()
                except Exception:
                    pass
            kbd.release_all()
            held_mouse.clear()

    try:
        while True:
            keys = get_keys()
            
            # Exit to menu if display exists
            if display and (0, 0) in keys and (0, 2) in keys:
                release_all_inputs()
                return

            # Handle profile switch for 3x3_pro model (dedicated GP6 pin at (0, 3))
            if model == "3x3_pro":
                profile_btn_pressed = (0, 3) in keys
                # Fallback profile switch if dedicated button (0, 3) is unassigned in JSON
                if get_macro(0, 3) is None:
                    if profile_btn_pressed and not last_profile_btn_state:
                        release_all_inputs()
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
                        release_all_inputs()
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
                            # Case 1: Single keypress action -> keep pressed until physically released
                            if len(actions) == 1 and actions[0].get("type") == "keypress":
                                kcodes = resolve_keycodes(actions[0].get("keys", []))
                                if kcodes:
                                    print(f"Holding: {macro.get('label', 'Unnamed')} -> {kcodes}")
                                    kbd.press(*kcodes)
                                    held_keys[(r, c)] = kcodes
                            # Case 2: Single mouse click action with hold mode -> keep mouse button & modifiers pressed
                            elif len(actions) == 1 and actions[0].get("type") in ("mouse_click", "mouse") and actions[0].get("click_type") == "hold":
                                if mouse:
                                    btn_str = str(actions[0].get("button", "LEFT")).strip().upper()
                                    btn = MOUSE_BUTTONS.get(btn_str, MOUSE_BUTTONS["LEFT"])
                                    mods = resolve_keycodes(actions[0].get("modifiers", []))
                                    if mods:
                                        kbd.press(*mods)
                                        time.sleep(0.01)
                                    mouse.press(btn)
                                    held_mouse[(r, c)] = (btn, mods)
                                    print(f"Holding Mouse: {macro.get('label', 'Unnamed')} -> {btn_str}")
                                else:
                                    print("Warning: Mouse not available for hold")
                            else:
                                switched = execute_macro(macro)
                                if switched:
                                    release_all_inputs()
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
                        if (r, c) in held_mouse:
                            btn, mods = held_mouse.pop((r, c))
                            if mouse:
                                try:
                                    mouse.release(btn)
                                except Exception as e:
                                    print("Error releasing mouse button:", e)
                                    mouse.release_all()
                            if mods:
                                try:
                                    kbd.release(*mods)
                                except Exception as e:
                                    print("Error releasing modifiers:", e)
                                    kbd.release_all()
                        time.sleep(debounce_time)

                    last_state[r][c] = is_pressed
            
            # Safety net: if no keys physically pressed, ensure no stuck held keys or mouse buttons
            if not current_pressed and (held_keys or held_mouse):
                release_all_inputs()

            time.sleep(0.01)
    finally:
        release_all_inputs()




