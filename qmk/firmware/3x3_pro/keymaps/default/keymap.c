#include QMK_KEYBOARD_H

// Define custom keycode for profile switching
enum custom_keycodes {
    KC_PROF_SW = SAFE_RANGE
};

// Define standard keymaps for 3 layers (Profile 1, 2, and 3)
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    // Profile 1 (Layer 0): Default Numpad Keys 1-9 & Profile Switcher
    [0] = LAYOUT(
        KC_1,    KC_2,    KC_3,    KC_PROF_SW,
        KC_4,    KC_5,    KC_6,
        KC_7,    KC_8,    KC_9
    ),
    // Profile 2 (Layer 1): Media & Shortcuts
    [1] = LAYOUT(
        KC_MPRV, KC_MPLY, KC_MNXT, KC_PROF_SW,
        KC_VOLD, KC_MUTE, KC_VOLU,
        KC_TRNS, KC_TRNS, KC_TRNS
    ),
    // Profile 3 (Layer 2): Design/Coding Macros (F13-F21)
    [2] = LAYOUT(
        KC_F13,  KC_F14,  KC_F15,  KC_PROF_SW,
        KC_F16,  KC_F17,  KC_F18,
        KC_F19,  KC_F20,  KC_F21
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
        case KC_PROF_SW:
            if (record->event.pressed) {
                // Cycle through profiles 0 -> 1 -> 2 -> 0
                uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 3;
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
    gpio_set_pin_output(GP11); gpio_write_pin_low(GP10);
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
        // Idle: Indicate active profile/layer on row 0 (LED 0-2)
        uint8_t current_layer = get_highest_layer(layer_state);
        pin_t col_pin = (current_layer == 0) ? GP7 : (current_layer == 1) ? GP8 : GP9;
        
        gpio_write_pin_high(GP10); // Row 0 HIGH
        gpio_write_pin_low(col_pin); // Active column cathode LOW
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
            oled_write_ln("> PROFILE 1 (NUM)", false);
            break;
        case 1:
            oled_write_ln("> PROFILE 2 (MED)", false);
            break;
        case 2:
            oled_write_ln("> PROFILE 3 (COD)", false);
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
