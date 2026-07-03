# ⌨️ QMK User Manual & Pin Mapping: 6x2 Encoder Model

This manual provides technical specifications, pin mapping tables, matrix layouts, and setup instructions for flashing QMK onto the **Dice and Layers 6x2 Encoder** macro keyboard.

---

## 📐 Hardware Specifications

- **Microcontroller:** RP2040 (RP2040 Zero form factor)
- **Matrix Layout:** 3 Rows x 6 Columns electrically (Physical layout is 12 keys + 1 Rotary Encoder Click)
- **Controls:**
  - 12 Mechanical switches
  - 1 Rotary Encoder (Incremental) with click switch
- **Feedback Elements:**
  - Onboard NeoPixel WS2812 RGB LED (Pin `GP16`)

---

## 📌 Pin Mapping Table

| Component Group | Component Net | RP2040 GPIO Pin | Board Pin Function | QMK Configuration Key |
| :--- | :--- | :--- | :--- | :--- |
| **Key Matrix (Rows)** | Row 0 (R1) | `GP12` | Row 0 Input (Keys & Encoder Switch) | `matrix_pins: { "rows": ["GP12", ... ] }` |
| | Row 1 (R2) | `GP13` | Row 1 Input | |
| | Row 2 (R3) | `GP14` | Row 2 Input | |
| **Key Matrix (Cols)** | Column 0 (C1) | `GP6` | Column 0 Output | `matrix_pins: { "cols": ["GP6", ... ] }` |
| | Column 1 (C2) | `GP7` | Column 1 Output | |
| | Column 2 (C3) | `GP8` | Column 2 Output | |
| | Column 3 (C4) | `GP9` | Column 3 Output | |
| | Column 4 (C5) | `GP10` | Column 4 Output | |
| | Column 5 (C6) | `GP11` | Column 5 Output | |
| **Rotary Encoder** | Encoder A (ROT_A) | `GP2` | Encoder Clock/A Pin | `"encoder": { "rotary": [ { "pin_a": "GP2", "pin_b": "GP3" } ] }` |
| | Encoder B (ROT_B) | `GP3` | Encoder Data/B Pin | |
| | Encoder Switch | Matrix (0, 5) | Encoder Click Button (mapped electrically) | `KC_NO` in matrix or keymap coordinate (0, 5) |
| **RGB Backlight** | NeoPixel Data | `GP16` | WS2812 RGB LED Pin | `"rgblight": { "pin": "GP16" }` |

---

## 🗺️ Key Matrix Map (Logical Coordinate & Key Layout)

The physical keyboard consists of 12 keys arranged in a 6x2 grid, with the rotary encoder located at the upper-right or side. Electrically, it is wired as a **3x6 matrix** where the encoder click is wired directly at Row 0, Column 5.

```
        Col 0 (GP6)        Col 1 (GP7)        Col 2 (GP8)        Col 3 (GP9)        Col 4 (GP10)       Col 5 (GP11)
     +------------------+------------------+------------------+------------------+------------------+------------------+
R0   |    Row 0, Col 0  |    Row 0, Col 1  |    Row 0, Col 2  |    Row 0, Col 3  |    Row 0, Col 4  |    Row 0, Col 5  |
GP12 |      Key 1       |      Key 2       |      Key 3       |      Key 4       |      Key 5       |  [ENCODER CLICK] |
     +------------------+------------------+------------------+------------------+------------------+------------------+
R1   |    Row 1, Col 0  |    Row 1, Col 1  |    Row 1, Col 2  |    Row 1, Col 3  |    Row 1, Col 4  |    Row 1, Col 5  |
GP13 |      Key 6       |      Key 7       |      Key 8       |      Key 9       |      Key 10      |      Key 11      |
     +------------------+------------------+------------------+------------------+------------------+------------------+
R2   |    Row 2, Col 0  |    Row 2, Col 1  |    Row 2, Col 2  |    Row 2, Col 3  |    Row 2, Col 4  |    Row 2, Col 5  |
GP14 |      (Unused)    |     (Unused)     |     (Unused)     |     (Unused)     |     (Unused)     |     (Unused)     |
     +------------------+------------------+------------------+------------------+------------------+------------------+
```
*Note: In the CircuitPython firmware, virtual keycodes are generated at `(2, 4)` and `(2, 5)` to simulate encoder rotation. In QMK, virtual matrix coordinates are **not required** because QMK supports encoders natively via hardware interrupts. The encoder actions are configured in the `keymap.c` file using the `encoder_update_user` callback.*

---

## 🎛️ Rotary Encoder Functionality in QMK

QMK allows you to map custom behaviors to the encoder rotation. By default, the encoder is configured to perform volume control:
- **Clockwise (CW) Rotation:** Increases volume (`KC_VOLU`)
- **Counter-Clockwise (CCW) Rotation:** Decreases volume (`KC_VOLD`)
- **Encoder Click (SW1):** Mutes volume (`KC_MUTE`)

This configuration is easily customizable in the default `keymap.c` file.

---

## 🚀 Flashing Step-by-Step

1. Put the keyboard into bootloader mode by holding down the **BOOTSEL** button on the internal RP2040 Zero board and plugging it into your computer.
2. Verify that a mass-storage drive named `RPI-RP2` has appeared.
3. Open your QMK build terminal and run:
   ```bash
   qmk flash -kb dice_layers/6x2_encoder -keymap default
   ```
4. Once completed, the RP2040 will reboot automatically as a QMK-compatible keyboard.
