#include QMK_KEYBOARD_H

// Define 4-layer keymap for 6x2 Encoder model
// Output order left-to-right:
// Top row: 1, 2, 3, 4, 5, 6
// Bottom row: 7, 8, 9, 0, -, =
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        TG(1),
        KC_1,    KC_2,    KC_3,    KC_4,    KC_5,    KC_6,
        KC_7,    KC_8,    KC_9,    KC_0,    KC_MINS, KC_EQL
    ),
    [1] = LAYOUT(
        TG(2),
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [2] = LAYOUT(
        TG(3),
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    ),
    [3] = LAYOUT(
        TO(0),
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
        KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS
    )
};

#if defined(ENCODER_MAP_ENABLE)
const uint16_t PROGMEM encoder_map[][NUM_ENCODERS][NUM_DIRECTIONS] = {
    [0] = { ENCODER_CCW_CW(KC_VOLD, KC_VOLU) },
    [1] = { ENCODER_CCW_CW(KC_VOLD, KC_VOLU) },
    [2] = { ENCODER_CCW_CW(KC_VOLD, KC_VOLU) },
    [3] = { ENCODER_CCW_CW(KC_VOLD, KC_VOLU) }
};
#endif

// Intercept legacy HID Cut/Copy/Paste/Undo/Find from VIA and send atomic OS shortcuts
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
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

