# MCU name
MCU = RP2040

# Bootloader selection
BOOTLOADER = rp2040

# Build Options
BOOTMAGIC_ENABLE = yes      # Enable Bootmagic Lite
MOUSEKEY_ENABLE = yes       # Mouse keys
EXTRAKEY_ENABLE = yes       # Audio control and System control
CONSOLE_ENABLE = no         # Console for debug
COMMAND_ENABLE = no         # Commands for debug and configuration
NKRO_ENABLE = yes           # Enable N-Key Rollover

# OLED Display Support
OLED_ENABLE = yes
OLED_DRIVER = ssd1306
I2C_DRIVER = vendor

# Optimization
LTO_ENABLE = yes

# WS2812 RGB Driver for RP2040 (PIO)
RGBLIGHT_ENABLE = yes
WS2812_DRIVER = vendor

# Dynamic Keymap EEPROM Support
VIA_ENABLE = yes
EEPROM_ENABLE = yes

# Custom Active-High Matrix
CUSTOM_MATRIX = lite
SRC += matrix.c
