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

// 4 Layers for VIA
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_1, KC_2, KC_3, KC_4,
        KC_5, KC_6, KC_7, KC_8
    ),
    [1] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [2] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [3] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    )
};

static bool pressed_keys[2][4] = {
    {false, false, false, false},
    {false, false, false, false}
};

static bool led_state[2][4] = {
    {true, true, true, true},
    {true, true, true, true}
};

static const pin_t led_col_pins[] = {GP7, GP8, GP9, GP10};
static const pin_t led_row_pins[] = {GP11, GP12};

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    uint8_t row = record->event.key.row;
    uint8_t col = record->event.key.col;

    if (row < 2 && col < 4) {
        pressed_keys[row][col] = record->event.pressed;
    }

    if (record->event.pressed && pressed_keys[0][0] && pressed_keys[0][3]) {
        bl_mode = (bl_mode + 1) % BL_MODE_COUNT;
        return false;
    }

    if (record->event.pressed && pressed_keys[1][0] && pressed_keys[1][3]) {
        uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 4;
        layer_clear();
        layer_on(next_layer);
        return false;
    }

    switch (keycode) {
        case KC_PROF_SW:
            if (record->event.pressed) {
                uint8_t next_layer = (get_highest_layer(layer_state) + 1) % 4;
                layer_clear();
                layer_on(next_layer);
            }
            return false;
        case KC_BL_STEP:
            if (record->event.pressed) {
                bl_mode = (bl_mode + 1) % BL_MODE_COUNT;
            }
            return false;
        case KC_BL_TOGG:
            if (record->event.pressed) {
                bl_mode = (bl_mode == BL_MODE_OFF) ? BL_MODE_ALL_ON : BL_MODE_OFF;
            }
            return false;
        default:
            return true;
    }
}

void keyboard_pre_init_user(void) {
    for (int i = 0; i < 4; i++) {
        gpio_set_pin_output(led_col_pins[i]);
        gpio_write_pin_high(led_col_pins[i]);
    }
    for (int i = 0; i < 2; i++) {
        gpio_set_pin_output(led_row_pins[i]);
        gpio_write_pin_low(led_row_pins[i]);
    }
}

void keyboard_post_init_user(void) {
    gpio_write_pin_high(led_row_pins[0]);
    for (int c = 0; c < 4; c++) {
        gpio_write_pin_low(led_col_pins[c]);
        wait_ms(25);
        gpio_write_pin_high(led_col_pins[c]);
    }
    gpio_write_pin_low(led_row_pins[0]);

    gpio_write_pin_high(led_row_pins[1]);
    for (int c = 3; c >= 0; c--) {
        gpio_write_pin_low(led_col_pins[c]);
        wait_ms(25);
        gpio_write_pin_high(led_col_pins[c]);
    }
    gpio_write_pin_low(led_row_pins[1]);
}

void matrix_scan_user(void) {
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

    static uint8_t active_scan_row = 0;

    gpio_write_pin_low(led_row_pins[0]);
    gpio_write_pin_low(led_row_pins[1]);

    for (uint8_t col = 0; col < 4; col++) {
        if (led_state[active_scan_row][col]) {
            gpio_write_pin_low(led_col_pins[col]);
        } else {
            gpio_write_pin_high(led_col_pins[col]);
        }
    }

    gpio_write_pin_high(led_row_pins[active_scan_row]);
    active_scan_row = (active_scan_row + 1) % 2;
}
