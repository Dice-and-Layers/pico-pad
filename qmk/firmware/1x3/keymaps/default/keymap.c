#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_A, KC_B, KC_C
    ),
    [1] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [2] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [3] = LAYOUT(
        KC_TRNS, KC_TRNS, KC_TRNS
    )
};

void keyboard_post_init_user(void) {
    // Setup LED pins based on Python code (Left -> GP5, Middle -> GP3, Right -> GP4)
    gpio_set_pin_output(GP5);
    gpio_set_pin_output(GP3);
    gpio_set_pin_output(GP4);
    
    // Premium startup animation
    gpio_write_pin_high(GP5);
    wait_ms(60);
    gpio_write_pin_low(GP5);
    
    gpio_write_pin_high(GP3);
    wait_ms(60);
    gpio_write_pin_low(GP3);
    
    gpio_write_pin_high(GP4);
    wait_ms(60);
    gpio_write_pin_low(GP4);
    
    // Reverse
    gpio_write_pin_high(GP4);
    wait_ms(60);
    gpio_write_pin_low(GP4);
    
    gpio_write_pin_high(GP3);
    wait_ms(60);
    gpio_write_pin_low(GP3);
    
    gpio_write_pin_high(GP5);
    wait_ms(60);
    gpio_write_pin_low(GP5);
}

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    // LED feedback on keypress
    if (record->event.pressed) {
        if (record->event.key.col == 0) {
            gpio_write_pin_high(GP5);
        } else if (record->event.key.col == 1) {
            gpio_write_pin_high(GP3);
        } else if (record->event.key.col == 2) {
            gpio_write_pin_high(GP4);
        }
    } else {
        if (record->event.key.col == 0) {
            gpio_write_pin_low(GP5);
        } else if (record->event.key.col == 1) {
            gpio_write_pin_low(GP3);
        } else if (record->event.key.col == 2) {
            gpio_write_pin_low(GP4);
        }
    }
    switch (keycode) {
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
        default:
            return true;
    }
}
