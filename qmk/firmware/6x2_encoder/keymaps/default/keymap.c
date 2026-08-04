#include QMK_KEYBOARD_H

// Define standard keymap for the 6x2 Encoder model
// Row 0 has 4 keys (1-4) + Encoder click (mapped as KC_MUTE)
// Row 1 has 4 keys (5-8)
// Row 2 has 4 keys (9-12)
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_1,    KC_2,    KC_3,    KC_4,    KC_MUTE,
        KC_5,    KC_6,    KC_7,    KC_8,
        KC_9,    KC_0,    KC_MINS, KC_EQL
    )
};

// Handle rotary encoder rotation events
#ifdef ENCODER_ENABLE
bool encoder_update_user(uint8_t index, bool clockwise) {
    if (index == 0) { // Onboard main rotary encoder
        if (clockwise) {
            tap_code(KC_VOLU); // Volume Up
        } else {
            tap_code(KC_VOLD); // Volume Down
        }
    }
    return false; // Handled
}
#endif
