# PICO BOY - Firmware Organization

This directory has been reorganized to support different hardware configurations and improve modularity.

## Directory Structure

- **`with-display/`**: Contains the standard `code.py` for users with an OLED display.
- **`no-display/`**: Contains a minimal `code.py` for users who only want macro keyboard functionality without a display.
- **`games/`**: All arcade game modules are now stored here.
- **`lib/`**: Required CircuitPython libraries.
- **`sd/`**: Placeholder for SD card files (if applicable).
- **Core Files**: `macros.py`, `utils.py`, `macros.json`, and `settings.toml` are shared across both versions.

## How to Install

1.  Choose your version (**with-display** or **no-display**).
2.  Copy the `code.py` from that folder to the root of your Raspberry Pi Pico (CIRCUITPY drive).
3.  Copy all other files and folders from this `firmware/` directory to the root of your Pico.
    *   **Note**: Ensure the `games/` folder is copied if you are using the display version.

## Hardware Pin Mapping

The firmware is designed for a Raspberry Pi Pico. Here are the default connections for the OLED display and the 3x3 key matrix.

### 📺 SSD1306 OLED Display (128x64 I2C)

| Display Pin | Raspberry Pi Pico GP Pin | Pico Physical Pin | Function |
| :--- | :--- | :--- | :--- |
| **VCC** | `3V3 OUT` | **Pin 36** | Power (3.3V) |
| **GND** | `GND` | **Pin 38** (or any GND) | Ground |
| **SCL** | `GP17` | **Pin 22** | I2C Clock |
| **SDA** | `GP16` | **Pin 21** | I2C Data |

### ⌨️ 3x3 Matrix Keyboard

#### **Column Pins (Outputs)**
| Column | Pico GP Pin | Pico Physical Pin |
| :--- | :--- | :--- |
| **Column 0** | `GP5` | **Pin 7** |
| **Column 1** | `GP6` | **Pin 9** |
| **Column 2** | `GP7` | **Pin 10** |

#### **Row Pins (Inputs with Pull-Down)**
| Row | Pico GP Pin | Pico Physical Pin |
| :--- | :--- | :--- |
| **Row 0** | `GP2` | **Pin 4** |
| **Row 1** | `GP3` | **Pin 5** |
| **Row 2** | `GP4` | **Pin 6** |

### 🎯 Key Action Map

```
      Col 0 (GP5)        Col 1 (GP6)        Col 2 (GP7)
   +------------------+------------------+------------------+
   |                  |                  |                  |
R  |      (0, 0)      |    (0, 1) [▲]    |      (0, 2)      |
o  |                  |    Menu: Up      |                  |
w  +------------------+------------------+------------------+
0  |                  |                  |                  |
(  |      (1, 0)      |  (1, 1) [SELECT] |      (1, 2)      |
G  |                  |   Launch / OK    |                  |
P  +------------------+------------------+------------------+
2  |                  |                  |                  |
)  |      (2, 0)      |    (2, 1) [▼]    |      (2, 2)      |
   |                  |   Menu: Down     |                  |
   +------------------+------------------+------------------+
```

* **Menu Navigation**: Press Row 0, Col 1 `(0, 1)` for **Up**, Row 2, Col 1 `(2, 1)` for **Down**, and Row 1, Col 1 `(1, 1)` to **Select**.
* **Exit Macro Mode**: Hold the top-left key `(0, 0)` and top-right key `(0, 2)` together to return to the launcher.

---

### ⌨️ 1x3 Direct Keyboard & LED Layout (RP2040 Zero)

This model utilizes direct-to-pin connections for high responsiveness, three status LEDs, and an onboard NeoPixel for dynamic RGB color cycling.

#### **Key Inputs (Inputs with Pull-Up / Active Low)**
| Switch | Pico/Zero GP Pin | Pico Physical Pin | Physical Position | Macro Coordinate |
| :--- | :--- | :--- | :--- | :--- |
| **K1 (Key 1)** | `GP0` | **Pin 1** | **Left** | Row 0, Col 0 `(0, 0)` |
| **K3 (Key 3)** | `GP2` | **Pin 3** | **Middle** | Row 0, Col 1 `(0, 1)` |
| **K2 (Key 2)** | `GP1` | **Pin 2** | **Right** | Row 0, Col 2 `(0, 2)` |

#### **Single LEDs (Outputs / Active High)**
| Net Label | Pico/Zero GP Pin | Target LED | Physical Position | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | `GP5` | **L1** (Key 1) | **Left** | Lights up when K1 (Left) is pressed |
| **L3** | `GP3` | **L3** (Key 3) | **Middle** | Lights up when K3 (Middle) is pressed |
| **L2** | `GP4` | **L2** (Key 2) | **Right** | Lights up when K2 (Right) is pressed |

#### **🌈 Onboard NeoPixel RGB LED**
*   **Data Pin:** `GP16`
*   **Behavior:** On keypress, flashes brightly and cycles colors through a vibrant spectrum, turning off when the key is released.

---

### ⌨️ 3x3 Pro Matrix Keyboard & LED Matrix Layout (RP2040 Zero)

This premium model features a 3x3 key matrix plus a dedicated profile switcher button, a 3x3 LED matrix for backlight feedback and active profile indication, and support for the onboard NeoPixel.

#### **Key Matrix Pins**
* **Rows (Inputs with Pull-Down):** R1 -> `GP0`, R2 -> `GP1`, R3 -> `GP2`
* **Columns (Outputs):** C1 -> `GP3`, C2 -> `GP4`, C3 -> `GP5`, C4 -> `GP6` (C4 connects only to the S4 profile switch button)

#### **Key Action Map**
```
      Col 0 (GP3)        Col 1 (GP4)        Col 2 (GP5)        Col 3 (GP6)
   +------------------+------------------+------------------+------------------+
R  |      (0, 0)      |      (0, 1)      |      (0, 2)      |      (0, 3)      |
o  |      Key 1       |      Key 2       |      Key 3       | [PROFILE SWITCH] |
w  +------------------+------------------+------------------+------------------+
0  |                  |                  |                  |                  |
   |      (1, 0)      |      (1, 1)      |      (1, 2)      |                  |
R  |      Key 4       |      Key 5       |      Key 6       |    (Unused)      |
o  +------------------+------------------+------------------+------------------+
w  |                  |                  |                  |                  |
1  |      (2, 0)      |      (2, 1)      |      (2, 2)      |                  |
   |      Key 7       |      Key 8       |      Key 9       |    (Unused)      |
   +------------------+------------------+------------------+------------------+
```

#### **LED Matrix Pins**
* **LED Columns (Cathodes - Active Low Outputs):** LC1 -> `GP7`, LC2 -> `GP8`, LC3 -> `GP9`
* **LED Rows (Anodes - Active High Outputs):** LR1 -> `GP10`, LR2 -> `GP11`, LR3 -> `GP12`

#### **🌈 Onboard NeoPixel RGB LED**
* **Data Pin:** `GP16`
* **Behavior:** Cycles color spectrum when macro keys are pressed.

#### **Feedback & Profile Indicator**
* **Key Press Feedback:** The corresponding LED in the 3x3 matrix turns on when that key is pressed.
* **Active Profile Indication:** When idle (no keys pressed), the top row of the LED matrix indicates the active profile (LED 0 for Profile 1, LED 1 for Profile 2, LED 2 for Profile 3).
* **Display version:** The OLED is connected on `GP15` (SCL) and `GP14` (SDA) and shows the active profile name dynamically.

---

## ⚙️ How to Configure Board Model

You can tell the firmware which board model (1x3, 3x3, or 3x3_pro) is currently connected using two methods:

### Method A: settings.toml (Recommended for Hardware configuration)
Create a `settings.toml` file in the root of your `CIRCUITPY` drive and specify the model name:
```toml
BOARD_MODEL = "3x3_pro"
# Or use "1x3", or "3x3" (Default)
```

### Method B: Via Web Configurator
The web configurator saves your chosen board layout in the `macros.json` configuration file under `"settings": {"board_model": "1x3"}`. The firmware will automatically parse this if no `settings.toml` configuration is found.


