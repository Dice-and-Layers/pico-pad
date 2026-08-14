#pragma once

// Raise VIA's macro slot count from the QMK default of 16 to 50.
// The macro storage buffer auto-sizes to whatever EEPROM remains after
// the keymap/encoder tables (RP2040 wear-leveling gives ~4KB total here,
// with room to spare), so no other setting needs to change.
#define DYNAMIC_KEYMAP_MACRO_COUNT 50
