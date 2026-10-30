#include QMK_KEYBOARD_H

// Define custom keycode range (KC_PROF_SW is defined in 3x3_pro.h as QK_KB_0)
enum custom_keycodes {
    NEW_SAFE_RANGE = SAFE_RANGE
};

// Define standard keymaps for 5 profiles:
// 0: NUMPAD (Data entry & calculations)
// 1: EXCEL (Formulas, formatting & spreadsheets)
// 2: CODING (IDE navigation, debugging & refactoring)
// 3: OBS (Stream & broadcast hotkeys)
// 4: CUSTOM (Media controls & utilities)
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    // Profile 1 (Layer 0): NUM (Standard Numpad 1-9 & Profile Switcher)
    [0] = LAYOUT(
        KC_P7,   KC_P8,   KC_P9,   KC_PROF_SW,
        KC_P4,   KC_P5,   KC_P6,
        KC_P1,   KC_P2,   KC_P3
    ),

    // Profile 2 (Layer 1): EXCEL (Spreadsheet Formulas & Data Management)
    [1] = LAYOUT(
        KC_F2,      A(KC_EQL),  LCS(KC_L),  KC_PROF_SW,
        C(KC_C),    C(KC_V),    C(KC_1),
        C(KC_Z),    C(KC_T),    C(KC_S)
    ),

    // Profile 3 (Layer 2): CODING (IDE Navigation, Debugging & Refactoring)
    [2] = LAYOUT(
        C(KC_P),    LCS(KC_P),  C(KC_GRV),  KC_PROF_SW,
        LSA(KC_F),  KC_F12,     C(KC_DOT),
        C(KC_SLSH), C(KC_D),    KC_F5
    ),

    // Profile 4 (Layer 3): OBS (Streaming Scenes & Audio Controls using MEH = Ctrl+Shift+Alt)
    [3] = LAYOUT(
        MEH(KC_F1), MEH(KC_F2), MEH(KC_F3), KC_PROF_SW,
        MEH(KC_F4), MEH(KC_F5), MEH(KC_F6),
        MEH(KC_F7), MEH(KC_F8), MEH(KC_F9)
    ),

    // Profile 5 (Layer 4): CUSTOM (Media Controls, Screenshot & System Utility)
    [4] = LAYOUT(
        KC_MPRV,    KC_MPLY,    KC_MNXT,    KC_PROF_SW,
        KC_VOLD,    KC_MUTE,    KC_VOLU,
        KC_CALC,    KC_MYCM,    KC_PSCR
    )
};

// Track currently pressed macro keys (excluding switcher button)
static bool pressed_keys[3][3] = {
    {false, false, false},
    {false, false, false},
    {false, false, false}
};

// Process custom keycodes and track keypress states
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    uint8_t row = record->event.key.row;
    uint8_t col = record->event.key.col;

    // Track pressed state for 3x3 matrix keys to drive the backlights
    if (row < 3 && col < 3) {
        pressed_keys[row][col] = record->event.pressed;
    }

    switch (keycode) {
        // Intercept legacy HID Cut/Copy/Paste/Undo/Find from VIA and send atomic OS shortcuts
        case KC_CUT:
            if (record->event.pressed) {
                tap_code16(C(KC_X));
            }
            return false;
        case KC_COPY:
            if (record->event.pressed) {
                tap_code16(C(KC_C));
            }
            return false;
        case KC_PASTE:
            if (record->event.pressed) {
                tap_code16(C(KC_V));
            }
            return false;
        case KC_UNDO:
            if (record->event.pressed) {
                tap_code16(C(KC_Z));
            }
            return false;
        case KC_FIND:
            if (record->event.pressed) {
                tap_code16(C(KC_F));
            }
            return false;

        // Profile Switcher (Handles both VIA custom action QK_KB_0 and legacy QK_USER_0)
        case KC_PROF_SW:
        case QK_USER_0:
            if (record->event.pressed) {
                // Cycle through profiles 0 -> 1 -> 2 -> 3 -> 4 -> 0
                uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 5;
                layer_clear();
                layer_on(next_layer);
            }
            return false; // Handled
        default:
            return true; // Pass through to QMK
    }
}

// Initialize GPIO pins for 3x3 LED matrix control
void keyboard_pre_init_user(void) {
    // LED Columns (Cathodes, Active Low): GP7, GP8, GP9
    gpio_set_pin_output(GP7); gpio_write_pin_high(GP7);
    gpio_set_pin_output(GP8); gpio_write_pin_high(GP8);
    gpio_set_pin_output(GP9); gpio_write_pin_high(GP9);

    // LED Rows (Anodes, Active High): GP10, GP11, GP12
    gpio_set_pin_output(GP10); gpio_write_pin_low(GP10);
    gpio_set_pin_output(GP11); gpio_write_pin_low(GP11);
    gpio_set_pin_output(GP12); gpio_write_pin_low(GP12);
}

// Multiplex backlights and active profile indicator
void matrix_scan_user(void) {
    // Turn off all LED matrix pins first to clear state
    gpio_write_pin_high(GP7);
    gpio_write_pin_high(GP8);
    gpio_write_pin_high(GP9);
    gpio_write_pin_low(GP10);
    gpio_write_pin_low(GP11);
    gpio_write_pin_low(GP12);

    bool key_is_pressed = false;
    uint8_t active_row = 0;
    uint8_t active_col = 0;

    // Check if any key is currently held
    for (uint8_t r = 0; r < 3; r++) {
        for (uint8_t c = 0; c < 3; c++) {
            if (pressed_keys[r][c]) {
                key_is_pressed = true;
                active_row = r;
                active_col = c;
                break;
            }
        }
        if (key_is_pressed) break;
    }

    if (key_is_pressed) {
        // Light up the specific pressed key LED
        pin_t row_pin = (active_row == 0) ? GP10 : (active_row == 1) ? GP11 : GP12;
        pin_t col_pin = (active_col == 0) ? GP7  : (active_col == 1) ? GP8  : GP9;

        gpio_write_pin_high(row_pin);
        gpio_write_pin_low(col_pin);
    } else {
        // Idle: Indicate active profile/layer (1 to 5) across the LED matrix
        uint8_t current_layer = get_highest_layer(layer_state) % 5;
        // Layers 0-2 light up LEDs on Row 0 (Cols 0-2)
        // Layers 3-4 light up LEDs on Row 1 (Cols 0-1)
        pin_t row_pin = (current_layer < 3) ? GP10 : GP11;
        pin_t col_pin = (current_layer == 0 || current_layer == 3) ? GP7 :
                        (current_layer == 1 || current_layer == 4) ? GP8 : GP9;
        
        gpio_write_pin_high(row_pin);
        gpio_write_pin_low(col_pin);
    }
}

// Draw configuration data on OLED display (SSD1306)
#ifdef OLED_ENABLE
bool oled_task_user(void) {
    oled_write_ln("  MACRO KEYPAD  ", false);
    oled_write_ln("================", false);
    oled_write_ln("", false);
    
    oled_write_ln("Active Profile:", false);
    uint8_t current_layer = get_highest_layer(layer_state);
    switch (current_layer) {
        case 0:
            oled_write_ln("> 1: NUMPAD", false);
            break;
        case 1:
            oled_write_ln("> 2: EXCEL", false);
            break;
        case 2:
            oled_write_ln("> 3: CODING", false);
            break;
        case 3:
            oled_write_ln("> 4: OBS STREAM", false);
            break;
        case 4:
            oled_write_ln("> 5: CUSTOM", false);
            break;
        default:
            oled_write_ln("> DEFAULT", false);
            break;
    }
    oled_write_ln("", false);
    oled_write_ln("================", false);
    return false;
}
#endif
