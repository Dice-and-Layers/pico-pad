# ⌨️ QMK User Manual & Pin Mapping: 3x3 Pro Model

This manual provides technical specifications, pin mapping tables, matrix layouts, and setup instructions for flashing QMK onto the **Dice and Layers 3x3 Pro** macro keyboard.

---

## 📐 Hardware Specifications

- **Microcontroller:** RP2040 (RP2040 Zero form factor)
- **Matrix Layout:** 3 Rows x 4 Columns (9 Macro Keys + 1 Dedicated Profile Switcher Button)
- **Feedback Elements:**
  - 3x3 Monochrome Backlight LED Matrix (Indicates active profile and keypress feedback)
  - Onboard NeoPixel WS2812 RGB LED (Pin `GP16`)
- **Display:** SSD1306 OLED (128x64 pixels, I2C interface)

---

## 📌 Pin Mapping Table

| Component Group | Component Net | RP2040 GPIO Pin | Board Pin Function | QMK Configuration Key |
| :--- | :--- | :--- | :--- | :--- |
| **Key Matrix (Rows)** | Row 0 (R1) | `GP0` | Row 0 Input (Keys 1-3, S4 Switcher) | `matrix_pins: { "rows": ["GP0", ... ] }` |
| | Row 1 (R2) | `GP1` | Row 1 Input (Keys 4-6) | |
| | Row 2 (R3) | `GP2` | Row 2 Input (Keys 7-9) | |
| **Key Matrix (Cols)** | Column 0 (C1) | `GP3` | Column 0 Output (Keys 1, 4, 7) | `matrix_pins: { "cols": ["GP3", ... ] }` |
| | Column 1 (C2) | `GP4` | Column 1 Output (Keys 2, 5, 8) | |
| | Column 2 (C3) | `GP5` | Column 2 Output (Keys 3, 6, 9) | |
| | Column 3 (C4) | `GP6` | Column 3 Output (Dedicated S4 Switcher) | |
| **LED Matrix (Cols)** | Col Cathode 0 (LC1) | `GP7` | LED Col 0 Cathode (Active Low) | Custom code control in `keymap.c` |
| | Col Cathode 1 (LC2) | `GP8` | LED Col 1 Cathode (Active Low) | |
| | Col Cathode 2 (LC3) | `GP9` | LED Col 2 Cathode (Active Low) | |
| **LED Matrix (Rows)** | Row Anode 0 (LR1) | `GP10` | LED Row 0 Anode (Active High) | |
| | Row Anode 1 (LR2) | `GP11` | LED Row 1 Anode (Active High) | |
| | Row Anode 2 (LR3) | `GP12` | LED Row 2 Anode (Active High) | |
| **OLED Display** | I2C SDA | `GP14` | I2C Data | `"i2c_driver": "vendor"`, `SDA = GP14` |
| | I2C SCL | `GP15` | I2C Clock | `SCL = GP15` |
| **RGB Backlight** | NeoPixel Data | `GP16` | WS2812 RGB LED Pin | `"rgblight": { "pin": "GP16" }` |

---

## 🗺️ Key Matrix Map (Logical Coordinate & Key Layout)

```
        Col 0 (GP3)        Col 1 (GP4)        Col 2 (GP5)        Col 3 (GP6)
     +------------------+------------------+------------------+------------------+
R0   |    Row 0, Col 0  |    Row 0, Col 1  |    Row 0, Col 2  |    Row 0, Col 3  |
GP0  |    Key 1 (S1)    |    Key 2 (S2)    |    Key 3 (S3)    | [PROFILE SWITCH] |
     +------------------+------------------+------------------+------------------+
R1   |    Row 1, Col 0  |    Row 1, Col 1  |    Row 1, Col 2  |                  |
GP1  |    Key 4 (S5)    |    Key 5 (S6)    |    Key 6 (S7)    |     (Unused)     |
     +------------------+------------------+------------------+------------------+
R2   |    Row 2, Col 0  |    Row 2, Col 1  |    Row 2, Col 2  |                  |
GP2  |    Key 7 (S8)    |    Key 8 (S9)    |    Key 9 (S10)   |     (Unused)     |
     +------------------+------------------+------------------+------------------+
```

---

## 🔌 LED Matrix Wiring & Behavior

The LED matrix consists of 9 backlight LEDs located directly under the main 3x3 keys. It is wired as a separate grid:
- **Rows (Anodes):** Active High (`GP10`, `GP11`, `GP12`). Setting a pin HIGH sends power to the row of LEDs.
- **Columns (Cathodes):** Active Low (`GP7`, `GP8`, `GP9`). Setting a pin LOW sinks current, completing the circuit.

### Visual Indicators:
1. **Keypress Feedback:** When a key is pressed, QMK drives the corresponding row anode HIGH and column cathode LOW to light up the key backlight.
2. **Active Profile Indication:** When no keys are pressed, the first row of the LED matrix indicates which profile is active:
   - **Profile 1:** LED 0 (Row 0, Col 0) lights up.
   - **Profile 2:** LED 1 (Row 0, Col 1) lights up.
   - **Profile 3:** LED 2 (Row 0, Col 2) lights up.

---

## 🚀 Flashing Step-by-Step

1. Put the keyboard into bootloader mode by holding down the **BOOTSEL** button on the internal RP2040 Zero board and plugging it into your computer.
2. Verify that a mass-storage drive named `RPI-RP2` has appeared.
3. Open your QMK build terminal and run:
   ```bash
   qmk flash -kb dice_layers/3x3_pro -keymap default
   ```
4. Once completed, the RP2040 will reboot automatically as a QMK-compatible keyboard.
