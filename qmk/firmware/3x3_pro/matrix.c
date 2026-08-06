#include "matrix.h"
#include "quantum.h"
#include "gpio.h"
#include "wait.h"

static const pin_t col_pins[] = {GP3, GP4, GP5, GP6};
static const pin_t row_pins[] = {GP0, GP1, GP2};

void matrix_init_custom(void) {
    for (int i = 0; i < 4; i++) {
        gpio_set_pin_output(col_pins[i]);
        gpio_write_pin_low(col_pins[i]);
    }
    for (int i = 0; i < 3; i++) {
        gpio_set_pin_input_low(row_pins[i]); // active high, so pull down
    }
}

bool matrix_scan_custom(matrix_row_t current_matrix[]) {
    bool matrix_has_changed = false;

    for (int col = 0; col < 4; col++) {
        gpio_write_pin_high(col_pins[col]);
        wait_us(30);

        for (int row = 0; row < 3; row++) {
            bool state = gpio_read_pin(row_pins[row]); // Active high!
            bool current_state = (current_matrix[row] & (1 << col)) ? true : false;
            
            if (state != current_state) {
                current_matrix[row] ^= (1 << col);
                matrix_has_changed = true;
            }
        }
        gpio_write_pin_low(col_pins[col]);
    }
    return matrix_has_changed;
}
