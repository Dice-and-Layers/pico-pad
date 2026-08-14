# Dice and Layers Macropad - User Guide

Thank you for purchasing the Dice and Layers Macropad! This guide will help you get started, customize your keybindings using VIA, and update your firmware if needed.

---

## 🚀 Getting Started

Your macropad comes pre-flashed with QMK firmware and is ready to use out of the box. 
Simply plug the macropad into your computer using a USB-C cable. Your computer will automatically recognize it as a keyboard, and you can start using the default macros immediately.

---

## 🎨 Customizing Keys with VIA

You can easily change what each key does using **VIA**, a free web-based tool. No software installation or coding is required!

### Step 1: Download Your Layout File
Locate the `.json` layout file for your specific macropad model from the files provided to you (e.g., `via_3x3_pro.json`, `via_6x2_encoder.json`, etc.). Keep this file handy.

### Step 2: Open VIA Web App
Open a Chromium-based browser (like Google Chrome or Microsoft Edge) and go to:
**[usevia.app](https://usevia.app/)**

### Step 3: Enable the Design Tab
1. Click on the **Settings** icon (the gear icon at the top).
2. Toggle on the **"Show Design tab"** option.

### Step 4: Load Your Keyboard Design
1. Click on the **Design** tab (the paintbrush icon at the top).
2. Click **"Load Draft Def"** and select the `.json` layout file for your macropad.

### Step 5: Authorize and Remap
1. Click on the **Configure** tab (the keyboard icon at the top).
2. Click the **"Authorize device +"** button and select your macropad from the popup list to connect it.
3. You will now see a visual representation of your macropad. Click on any key on the screen, then select a new function from the options below to instantly remap it!

---

## 🛠️ Updating Firmware

If you ever need to restore your macropad or update to a new pre-compiled firmware (`.uf2` file), follow these steps:

1. **Enter BOOTSEL Mode:**
   - **Physical Button:** If your case allows access, hold down the **BOOTSEL** button on the microcontroller while plugging in the USB cable.
   - **Double-Tap Reset:** Quickly double-press the **RESET** button if accessible.
2. **Mount the Drive:** Your computer will recognize a new USB mass storage drive named `RPI-RP2`.
3. **Flash the Firmware:** Drag and drop your `.uf2` firmware file onto the `RPI-RP2` drive. The drive will automatically disconnect, and the macropad will reboot with the new firmware.

---
<div style="page-break-after: always"></div>

*Note: The following sections are intended for advanced users and developers who wish to compile QMK firmware from source code. You do not need to read further if you are just using the macropad!*

---

## 💻 Advanced: QMK Compilation Guide

### 📋 Prerequisites

To compile QMK firmware locally, you will need a QMK build environment. Follow these setup steps for your operating system.

### 1. Install QMK CLI

#### 🪟 Windows
1. Install **MSYS2** by downloading the installer from [msys2.org](https://www.msys2.org/).
2. Run the **MSYS2 UCRT64** terminal and run the following command to install Git and Python:
   ```bash
   pacman -S git python3-pip
   ```
3. Install QMK CLI using pip:
   ```bash
   python3 -m pip install --user qmk
   ```

#### 🍎 macOS
1. Install **Homebrew** from [brew.sh](https://brew.sh/).
2. Install QMK CLI:
   ```bash
   brew install qmk/qmk/qmk
   ```

#### 🐧 Linux (Ubuntu/Debian)
1. Install system updates and dependencies:
   ```bash
   sudo apt update
   sudo apt install -y git python3-pip
   ```
2. Install QMK CLI:
   ```bash
   python3 -m pip install --user qmk
   ```

---

### 🛠️ QMK Environment Setup

1. Initialize QMK. This will clone the official `qmk_firmware` repository to your computer (usually in your user directory):
   ```bash
   qmk setup
   ```
   *Note: Press `y` when asked to clone the submodules and install the packages/dependencies.*

2. Verify that the build environment is working by compiling a default keyboard layout:
   ```bash
   qmk compile -kb gmmk/pro -km default
   ```

---

### 📥 Adding Custom Keyboards to QMK

To use the configuration files provided in this repository:
1. Locate your local `qmk_firmware/` directory (created during `qmk setup`).
2. Navigate to `qmk_firmware/keyboards/`.
3. Create a directory named `dice_layers` (representing the brand):
   ```bash
   mkdir -p qmk_firmware/keyboards/dice_layers
   ```
4. Copy the respective model folders from this project's `qmk/firmware/` directory to the newly created `dice_layers` folder:
   - Copy `qmk/firmware/3x3_pro` to `qmk_firmware/keyboards/dice_layers/3x3_pro`
   - Copy `qmk/firmware/6x2_encoder` to `qmk_firmware/keyboards/dice_layers/6x2_encoder`

---

### 🚀 Compiling and Flashing the Firmware

Ensure your keyboard is connected via USB and is placed in **BOOTSEL** (bootloader) mode.

#### How to enter BOOTSEL mode:
1. **Physical Button (Standard):** Hold down the **BOOTSEL** button on the RP2040 board while plugging in the USB cable.
2. **Double-Tap Reset:** Quickly double-press the **RESET** button on the RP2040 board.
3. Once in BOOTSEL mode, the RP2040 will appear as a USB mass storage drive (usually named `RPI-RP2`).

#### Compilation & Flash Commands:

**For the 3x3 Pro Model:**
```bash
qmk flash -kb dice_layers/3x3_pro -km default
```

**For the 6x2 Encoder Model:**
```bash
qmk flash -kb dice_layers/6x2_encoder -km default
```

*Note: The `qmk flash` command will automatically build the `.uf2` file and search for the connected RP2040 bootloader drive to copy the firmware over.*

---

### 🔍 Troubleshooting & Tuning

#### 1. Keypresses Do Not Register (Diode Direction Issue)
In custom handwired or custom PCB layouts, the physical orientation of diodes determines whether keypresses are read correctly.
- If you flash the firmware, but pressing keys produces no output, you might need to swap the diode direction configuration.
- Open `info.json` for your keyboard model.
- Find the `"diode_direction"` field and change it:
  - If it is `"ROW2COL"`, change it to `"COL2ROW"`.
  - If it is `"COL2ROW"`, change it to `"ROW2COL"`.
- Compile and flash again.

#### 2. Encoder Rotation Swapped
- If rotating the encoder clockwise performs a counter-clockwise action (and vice versa):
  - In `info.json` for the `6x2_encoder` model, find the `"encoder"` configurations under the `"pins"` array.
  - Swap the two pin definitions: e.g. change `["GP2", "GP3"]` to `["GP3", "GP2"]`.
  - Compile and flash again.
