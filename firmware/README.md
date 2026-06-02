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

