# ⌨️ RP2040 Macro Keyboard

A professional, open-source 3x3 macro keyboard project featuring an RP2040-based firmware and a modern web-based configurator.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![CircuitPython](https://img.shields.io/badge/CircuitPython-9.x-orange.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)

![Configurator Interface](pcb/configurator.png)

## 📸 Project Gallery

### 🖥️ Web Configurator
| Main Interface | Help & Reference |
|:---:|:---:|
| ![Configurator](pcb/configurator.png) | ![Help](pcb/configurator-help.png) |

### 🔌 Hardware & PCB
| PCB Front | PCB Back |
|:---:|:---:|
| ![Front](pcb/pcb%20front.png) | ![Back](pcb/pcb%20back.png) |

### 🛠️ Working Prototype
| Front View | Side View |
|:---:|:---:|
| ![Prototype 1](pcb/working%20prototype.jpeg) | ![Prototype 2](pcb/working%20prototype2.jpeg) |

## 🚀 Features

- **Web-Based Configurator**: Remap keys directly from your browser using the File System Access API. No software installation required!
- **Multi-Action Macros**: Each key can trigger a sequence of actions including hotkeys, text strings, and media controls.
- **Profile Management**: Save and switch between different macro profiles.
- **Dark Mode Support**: Sleek, modern UI with theme persistence.
- **Simple Firmware**: Lightweight CircuitPython firmware that runs on any RP2040 board.

## 🛠️ Hardware Requirements

- **Microcontroller**: Any RP2040-based board (e.g., Raspberry Pi Pico, Adafruit KB2040, Seeed Studio XIAO RP2040).
- **Matrix**: 3x3 mechanical switch matrix (or any configuration, adjustable in `firmware/code.py`).
- **Connection**: USB-C/Micro-USB cable.
- **PCB**: Custom designed PCB (files in `pcb/` folder). [View Schematic](pcb/Schematic_MacroKeyboard_2026-05-12.png)

## 💾 Installation

### 1. Firmware Setup
1. Install **CircuitPython** on your RP2040 board.
2. Copy the contents of the `firmware/` folder to your board's root directory (`CIRCUITPY` drive).
3. Ensure you have the necessary libraries in the `lib/` folder (standard Adafruit HID libraries).

### 2. Configurator Setup
If you want to host your own configurator:
1. Navigate to the `configurator/` directory.
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`
4. Build for production: `npm run build`

## ⚙️ Usage Guide

1. Connect your macro keyboard via USB.
2. Open the [Macro Keyboard Configurator](https://sathishrazor.github.io/mackro-keyz/) in a modern browser (Chrome, Edge, or Opera).
3. Click **Connect** and select the `CIRCUITPY` drive.
4. Select a key in the grid, add your macro actions, and click **Save Config**.
5. Your keyboard will immediately reflect the changes!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the firmware or the configurator.
