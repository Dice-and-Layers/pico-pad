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
