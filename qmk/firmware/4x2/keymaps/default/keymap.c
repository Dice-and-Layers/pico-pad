#include QMK_KEYBOARD_H

// Custom keycodes
enum custom_keycodes {
    KC_PROF_SW = SAFE_RANGE,
    KC_BL_STEP,
    KC_BL_TOGG
};

// Backlight operation modes
enum backlight_modes {
    BL_MODE_ALL_ON = 0,    // Default: Solid illumination for all 8 keys
    BL_MODE_REACTIVE,      // Reactive: Keys illuminate when pressed
    BL_MODE_LAYER_IND,     // Layer Indicator: Row 0 indicates active profile + reactive keys
    BL_MODE_OFF,           // Backlight disabled
    BL_MODE_COUNT
};

static uint8_t bl_mode = BL_MODE_ALL_ON;

// Standard 4-layer keymap configuration (fully customizable via VIA)
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    // Profile 1 (Layer 0): Default Numpad Keys 1-8
    [0] = LAYOUT(
        KC_1,    KC_2,    KC_3,    KC_4,
        KC_5,    KC_6,    KC_7,    KC_8
    ),
    // Profile 2 (Layer 1): Media & Shortcuts + Backlight / Profile Controls
    [1] = LAYOUT(
        KC_MPRV, KC_MPLY, KC_MNXT, KC_MUTE,
        KC_VOLD, KC_VOLU, KC_BL_STEP, KC_PROF_SW
    ),
    // Profile 3 (Layer 2): Coding / Design Shortcuts (F13-F20)
    [2] = LAYOUT(
        KC_F13,  KC_F14,  KC_F15,  KC_F16,
        KC_F17,  KC_F18,  KC_F19,  KC_F20
    ),
    // Profile 4 (Layer 3): Navigation
    [3] = LAYOUT(
        KC_HOME, KC_UP,   KC_END,  KC_PGUP,
        KC_LEFT, KC_DOWN, KC_RGHT, KC_PGDN
    )
};

// Track currently pressed keys (2 rows x 4 cols)
static bool pressed_keys[2][4] = {
    {false, false, false, false},
    {false, false, false, false}
};

// Target LED states for multiplexing (2 rows x 4 cols)
static bool led_state[2][4] = {
    {true, true, true, true},
    {true, true, true, true}
};

// LED Matrix Pin Definitions
// LED Columns (Cathodes, active low): GP7, GP8, GP9, GP10 (LC1, LC2, LC3, LC4)
// LED Rows (Anodes, active high): GP11, GP12 (LR1, LR2)
static const pin_t led_col_pins[] = {GP7, GP8, GP9, GP10};
static const pin_t led_row_pins[] = {GP11, GP12};

// Process custom keycodes and atomic shortcuts
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    uint8_t row = record->event.key.row;
    uint8_t col = record->event.key.col;

    // Track pressed state for 2x4 matrix keys
    if (row < 2 && col < 4) {
        pressed_keys[row][col] = record->event.pressed;
    }

    // Hardware shortcut: Holding Top-Left (S1) and Top-Right (S4) together cycles backlight mode
    if (record->event.pressed && pressed_keys[0][0] && pressed_keys[0][3]) {
        bl_mode = (bl_mode + 1) % BL_MODE_COUNT;
        return false;
    }

    // Hardware shortcut: Holding Bottom-Left (S5) and Bottom-Right (S8) together cycles profile/layer
    if (record->event.pressed && pressed_keys[1][0] && pressed_keys[1][3]) {
        uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 4;
        layer_clear();
        layer_on(next_layer);
        return false;
    }

    switch (keycode) {
        // Atomic OS shortcuts to avoid stuck modifiers
        case KC_CUT:
            if (record->event.pressed) tap_code16(C(KC_X));
            return false;
        case KC_COPY:
            if (record->event.pressed) tap_code16(C(KC_C));
            return false;
        case KC_PASTE:
            if (record->event.pressed) tap_code16(C(KC_V));
            return false;
        case KC_UNDO:
            if (record->event.pressed) tap_code16(C(KC_Z));
            return false;
        case KC_FIND:
            if (record->event.pressed) tap_code16(C(KC_F));
            return false;

        // Profile switcher keycode
        case KC_PROF_SW:
            if (record->event.pressed) {
                uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 4;
                layer_clear();
                layer_on(next_layer);
            }
            return false;

        // Backlight mode step keycode
        case KC_BL_STEP:
            if (record->event.pressed) {
                bl_mode = (bl_mode + 1) % BL_MODE_COUNT;
            }
            return false;

        // Backlight on/off toggle keycode
        case KC_BL_TOGG:
            if (record->event.pressed) {
                bl_mode = (bl_mode == BL_MODE_OFF) ? BL_MODE_ALL_ON : BL_MODE_OFF;
            }
            return false;

        default:
            return true;
    }
}

// Initialize GPIO pins for 4x2 LED matrix control
void keyboard_pre_init_user(void) {
    for (int i = 0; i < 4; i++) {
        gpio_set_pin_output(led_col_pins[i]);
        gpio_write_pin_high(led_col_pins[i]); // Cathode high = OFF
    }
    for (int i = 0; i < 2; i++) {
        gpio_set_pin_output(led_row_pins[i]);
        gpio_write_pin_low(led_row_pins[i]);  // Anode low = OFF
    }
}

// Startup animation: quick sweep across all 8 LEDs on boot
void keyboard_post_init_user(void) {
    // Sweep top row (L1 -> L4)
    gpio_write_pin_high(led_row_pins[0]);
    for (int c = 0; c < 4; c++) {
        gpio_write_pin_low(led_col_pins[c]);
        wait_ms(25);
        gpio_write_pin_high(led_col_pins[c]);
    }
    gpio_write_pin_low(led_row_pins[0]);

    // Sweep bottom row (L8 -> L5)
    gpio_write_pin_high(led_row_pins[1]);
    for (int c = 3; c >= 0; c--) {
        gpio_write_pin_low(led_col_pins[c]);
        wait_ms(25);
        gpio_write_pin_high(led_col_pins[c]);
    }
    gpio_write_pin_low(led_row_pins[1]);
}

// Non-blocking high-frequency row multiplexer for 4x2 LED backlight matrix
void matrix_scan_user(void) {
    // 1. Calculate target LED buffer based on current mode
    switch (bl_mode) {
        case BL_MODE_ALL_ON:
            for (uint8_t r = 0; r < 2; r++) {
                for (uint8_t c = 0; c < 4; c++) {
                    led_state[r][c] = true;
                }
            }
            break;

        case BL_MODE_REACTIVE:
            for (uint8_t r = 0; r < 2; r++) {
                for (uint8_t c = 0; c < 4; c++) {
                    led_state[r][c] = pressed_keys[r][c];
                }
            }
            break;

        case BL_MODE_LAYER_IND: {
            uint8_t active_layer = get_highest_layer(layer_state) % 4;
            for (uint8_t r = 0; r < 2; r++) {
                for (uint8_t c = 0; c < 4; c++) {
                    led_state[r][c] = pressed_keys[r][c];
                }
            }
            // Indicate active profile on row 0
            led_state[0][active_layer] = true;
            break;
        }

        case BL_MODE_OFF:
        default:
            for (uint8_t r = 0; r < 2; r++) {
                for (uint8_t c = 0; c < 4; c++) {
                    led_state[r][c] = false;
                }
            }
            break;
    }

    // 2. Multiplex LED matrix row-by-row
    static uint8_t active_scan_row = 0;

    // Blank row anodes first to eliminate ghosting
    gpio_write_pin_low(led_row_pins[0]);
    gpio_write_pin_low(led_row_pins[1]);

    // Set column cathodes for active row (Active Low: LOW = ON, HIGH = OFF)
    for (uint8_t col = 0; col < 4; col++) {
        if (led_state[active_scan_row][col]) {
            gpio_write_pin_low(led_col_pins[col]);
        } else {
            gpio_write_pin_high(led_col_pins[col]);
        }
    }

    // Assert the current row anode HIGH
    gpio_write_pin_high(led_row_pins[active_scan_row]);

    // Advance to the opposite row for the next scan cycle
    active_scan_row = (active_scan_row + 1) % 2;
}
