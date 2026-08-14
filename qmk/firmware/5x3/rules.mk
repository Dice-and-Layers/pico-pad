# MCU name
MCU = RP2040

# Bootloader selection
BOOTLOADER = rp2040

# Optimization
LTO_ENABLE = yes

# Custom Active-High Matrix
CUSTOM_MATRIX = lite
SRC += matrix.c

# Enable Encoders and VIA mapping
ENCODER_ENABLE = yes
ENCODER_MAP_ENABLE = yes
