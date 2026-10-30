import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import img1x3 from './models-images/1x3.jpg';
import img3x3 from './models-images/3x3.jpg';
import img3x3Pro from './models-images/3x3_pro.jpg';
import img4x2 from './models-images/4x2.png';
import img5x3 from './models-images/5x3.png';
import img6x2 from './models-images/6x2.png';


const DEFAULT_MACRO = {
  label: "New Macro",
  actions: [{ type: "keypress", keys: ["CONTROL", "C"] }]
};

const PRESETS = {
  '4x2': [
    {
      name: "Productivity & Media",
      description: "Essential copy, paste, media controls, and shortcuts for 8-key pad.",
      macros: [
        { row: 0, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 0, col: 1, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 0, col: 2, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 0, col: 3, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 1, col: 0, label: "Vol Down", actions: [{ type: "consumer", key: "VOLUME_DECREMENT" }] },
        { row: 1, col: 1, label: "Mute", actions: [{ type: "consumer", key: "MUTE" }] },
        { row: 1, col: 2, label: "Vol Up", actions: [{ type: "consumer", key: "VOLUME_INCREMENT" }] },
        { row: 1, col: 3, label: "Play/Pause", actions: [{ type: "consumer", key: "PLAY_PAUSE" }] }
      ]
    },
    {
      name: "Streamer & Gaming",
      description: "Mic mute, deafen, OBS recording, screenshots, and instant app launchers.",
      macros: [
        { row: 0, col: 0, label: "Mic Mute", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "M"] }] },
        { row: 0, col: 1, label: "Deafen", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "D"] }] },
        { row: 0, col: 2, label: "OBS Record", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "S"] }] },
        { row: 0, col: 3, label: "Clip Save", actions: [{ type: "keypress", keys: ["ALT", "F10"] }] },
        { row: 1, col: 0, label: "Screenshot", actions: [{ type: "keypress", keys: ["GUI", "SHIFT", "S"] }] },
        { row: 1, col: 1, label: "Discord", actions: [{ type: "launch", app: "discord" }] },
        { row: 1, col: 2, label: "OBS Studio", actions: [{ type: "launch", app: "obs64" }] },
        { row: 1, col: 3, label: "Task Mgr", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "ESCAPE"] }] }
      ]
    }
  ],
  '1x3': [
    {
      name: "Developer Basics",
      description: "Quick access to copy, paste, and terminal commands.",
      macros: [
        { row: 0, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 0, col: 1, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 0, col: 2, label: "Terminal", actions: [{ type: "keypress", keys: ["CONTROL", "GRAVE"] }] }
      ]
    },
    {
      name: "Media Controller",
      description: "Simple media track and play controls.",
      macros: [
        { row: 0, col: 0, label: "Prev Track", actions: [{ type: "consumer", key: "SCAN_PREVIOUS_TRACK" }] },
        { row: 0, col: 1, label: "Play/Pause", actions: [{ type: "consumer", key: "PLAY_PAUSE" }] },
        { row: 0, col: 2, label: "Next Track", actions: [{ type: "consumer", key: "SCAN_NEXT_TRACK" }] }
      ]
    },
    {
      name: "App Quick Launcher",
      description: "One-click open for VS Code, Chrome, and Calculator.",
      macros: [
        { row: 0, col: 0, label: "VS Code", actions: [{ type: "launch", app: "code" }] },
        { row: 0, col: 1, label: "Chrome", actions: [{ type: "launch", app: "chrome" }] },
        { row: 0, col: 2, label: "Calculator", actions: [{ type: "launch", app: "calc" }] }
      ]
    },
    {
      name: "Mouse Quick-Clicks",
      description: "Left Click, Middle Click (Wheel), and Right Click for rapid mouse actions.",
      macros: [
        { row: 0, col: 0, label: "Left Click", actions: [{ type: "mouse_click", button: "LEFT", click_type: "click", modifiers: [] }] },
        { row: 0, col: 1, label: "Mid Click", actions: [{ type: "mouse_click", button: "MIDDLE", click_type: "click", modifiers: [] }] },
        { row: 0, col: 2, label: "Right Click", actions: [{ type: "mouse_click", button: "RIGHT", click_type: "click", modifiers: [] }] }
      ]
    }
  ],
  '3x3': [
    {
      name: "Office Productivity",
      description: "Essential copy, paste, undo, search, and printing macros.",
      macros: [
        { row: 0, col: 0, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 0, col: 1, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 0, col: 2, label: "Redo", actions: [{ type: "keypress", keys: ["CONTROL", "Y"] }] },
        { row: 1, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 1, col: 1, label: "Cut", actions: [{ type: "keypress", keys: ["CONTROL", "X"] }] },
        { row: 1, col: 2, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 2, col: 0, label: "Select All", actions: [{ type: "keypress", keys: ["CONTROL", "A"] }] },
        { row: 2, col: 1, label: "Find", actions: [{ type: "keypress", keys: ["CONTROL", "F"] }] },
        { row: 2, col: 2, label: "Print", actions: [{ type: "keypress", keys: ["CONTROL", "P"] }] }
      ]
    },
    {
      name: "3D Modeling & Numpad Viewports",
      description: "Blender/CAD standard viewport navigation (Top, Front, Right, Camera, Focus) and numpad combinations.",
      macros: [
        { row: 0, col: 0, label: "Top View", actions: [{ type: "keypress", keys: ["NUMPAD_7"] }] },
        { row: 0, col: 1, label: "Front View", actions: [{ type: "keypress", keys: ["NUMPAD_1"] }] },
        { row: 0, col: 2, label: "Right View", actions: [{ type: "keypress", keys: ["NUMPAD_3"] }] },
        { row: 1, col: 0, label: "Focus Sel", actions: [{ type: "keypress", keys: ["NUMPAD_PERIOD"] }] },
        { row: 1, col: 1, label: "Camera View", actions: [{ type: "keypress", keys: ["NUMPAD_0"] }] },
        { row: 1, col: 2, label: "Align Cam", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "NUMPAD_0"] }] },
        { row: 2, col: 0, label: "Ortho/Persp", actions: [{ type: "keypress", keys: ["NUMPAD_5"] }] },
        { row: 2, col: 1, label: "Bottom View", actions: [{ type: "keypress", keys: ["CONTROL", "NUMPAD_7"] }] },
        { row: 2, col: 2, label: "Render", actions: [{ type: "keypress", keys: ["F12"] }] }
      ]
    },
    {
      name: "Mouse & Desktop Utilities",
      description: "Mouse clicks, Middle click wheel, Double click, and modifier click combinations.",
      macros: [
        { row: 0, col: 0, label: "Left Click", actions: [{ type: "mouse_click", button: "LEFT", click_type: "click", modifiers: [] }] },
        { row: 0, col: 1, label: "Double Click", actions: [{ type: "mouse_click", button: "LEFT", click_type: "double_click", modifiers: [] }] },
        { row: 0, col: 2, label: "Right Click", actions: [{ type: "mouse_click", button: "RIGHT", click_type: "click", modifiers: [] }] },
        { row: 1, col: 0, label: "Ctrl+Click", actions: [{ type: "mouse_click", button: "LEFT", click_type: "click", modifiers: ["CONTROL"] }] },
        { row: 1, col: 1, label: "Mid Click", actions: [{ type: "mouse_click", button: "MIDDLE", click_type: "click", modifiers: [] }] },
        { row: 1, col: 2, label: "Shift+Click", actions: [{ type: "mouse_click", button: "LEFT", click_type: "click", modifiers: ["SHIFT"] }] },
        { row: 2, col: 0, label: "Back", actions: [{ type: "mouse_click", button: "BACK", click_type: "click", modifiers: [] }] },
        { row: 2, col: 1, label: "Click & Drag", actions: [{ type: "mouse_click", button: "LEFT", click_type: "hold", modifiers: [] }] },
        { row: 2, col: 2, label: "Forward", actions: [{ type: "mouse_click", button: "FORWARD", click_type: "click", modifiers: [] }] }
      ]
    },
    {
      name: "Streamer & Gamer Pack",
      description: "Quick commands for Discord, OBS, and recording clips.",
      macros: [
        { row: 0, col: 0, label: "Mute Mic", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "M"] }] },
        { row: 0, col: 1, label: "Deafen", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "D"] }] },
        { row: 0, col: 2, label: "Discord", actions: [{ type: "launch", app: "discord" }] },
        { row: 1, col: 0, label: "OBS Start", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "S"] }] },
        { row: 1, col: 1, label: "OBS Stop", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "T"] }] },
        { row: 1, col: 2, label: "OBS", actions: [{ type: "launch", app: "obs64" }] },
        { row: 2, col: 0, label: "Screenshot", actions: [{ type: "keypress", keys: ["GUI", "SHIFT", "S"] }] },
        { row: 2, col: 1, label: "Save Clip", actions: [{ type: "keypress", keys: ["ALT", "F10"] }] },
        { row: 2, col: 2, label: "Game Menu", actions: [{ type: "keypress", keys: ["GUI", "G"] }] }
      ]
    },
    {
      name: "System Controls",
      description: "Control volume, desktop layouts, and open system panels.",
      macros: [
        { row: 0, col: 0, label: "Task Mgr", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "ESCAPE"] }] },
        { row: 0, col: 1, label: "Lock PC", actions: [{ type: "keypress", keys: ["GUI", "L"] }] },
        { row: 0, col: 2, label: "Settings", actions: [{ type: "keypress", keys: ["GUI", "I"] }] },
        { row: 1, col: 0, label: "Close App", actions: [{ type: "keypress", keys: ["ALT", "F4"] }] },
        { row: 1, col: 1, label: "Minimize", actions: [{ type: "keypress", keys: ["GUI", "D"] }] },
        { row: 1, col: 2, label: "Explorer", actions: [{ type: "keypress", keys: ["GUI", "E"] }] },
        { row: 2, col: 0, label: "Vol Down", actions: [{ type: "consumer", key: "VOLUME_DECREMENT" }] },
        { row: 2, col: 1, label: "Mute", actions: [{ type: "consumer", key: "MUTE" }] },
        { row: 2, col: 2, label: "Vol Up", actions: [{ type: "consumer", key: "VOLUME_INCREMENT" }] }
      ]
    }
  ],
  '3x3_pro': [],
  '6x2_encoder': [
    {
      name: "Standard Keypad (1-12 + Dial)",
      description: "Standard 1 through 12 key labels with encoder button and volume controls.",
      macros: [
        { row: 0, col: 0, label: "1", actions: [{ type: "text", text: "1" }] },
        { row: 0, col: 1, label: "2", actions: [{ type: "text", text: "2" }] },
        { row: 0, col: 2, label: "3", actions: [{ type: "text", text: "3" }] },
        { row: 0, col: 3, label: "4", actions: [{ type: "text", text: "4" }] },
        { row: 1, col: 1, label: "5", actions: [{ type: "text", text: "5" }] },
        { row: 1, col: 0, label: "6", actions: [{ type: "text", text: "6" }] },
        { row: 2, col: 0, label: "7", actions: [{ type: "text", text: "7" }] },
        { row: 2, col: 1, label: "8", actions: [{ type: "text", text: "8" }] },
        { row: 2, col: 2, label: "9", actions: [{ type: "text", text: "9" }] },
        { row: 2, col: 3, label: "10", actions: [{ type: "text", text: "10" }] },
        { row: 1, col: 3, label: "11", actions: [{ type: "text", text: "11" }] },
        { row: 1, col: 2, label: "12", actions: [{ type: "text", text: "12" }] },
        { row: 0, col: 5, label: "Mute", actions: [{ type: "consumer", key: "MUTE" }] },
        { row: 2, col: 4, label: "Vol Down", actions: [{ type: "consumer", key: "VOLUME_DECREMENT" }] },
        { row: 2, col: 5, label: "Vol Up", actions: [{ type: "consumer", key: "VOLUME_INCREMENT" }] }
      ]
    },
    {
      name: "Video / Audio Editor",
      description: "Speed up timeline scrubbing and edit slicing.",
      macros: [
        { row: 0, col: 0, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 0, col: 1, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 0, col: 2, label: "Redo", actions: [{ type: "keypress", keys: ["CONTROL", "Y"] }] },
        { row: 0, col: 3, label: "Cut Tool", actions: [{ type: "keypress", keys: ["C"] }] },
        { row: 1, col: 1, label: "Select", actions: [{ type: "keypress", keys: ["V"] }] },
        { row: 1, col: 0, label: "Ripple Cut", actions: [{ type: "keypress", keys: ["SHIFT", "DELETE"] }] },
        { row: 2, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 2, col: 1, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 2, col: 2, label: "Delete", actions: [{ type: "keypress", keys: ["DELETE"] }] },
        { row: 2, col: 3, label: "Import", actions: [{ type: "keypress", keys: ["CONTROL", "I"] }] },
        { row: 1, col: 3, label: "Export", actions: [{ type: "keypress", keys: ["CONTROL", "M"] }] },
        { row: 1, col: 2, label: "Split", actions: [{ type: "keypress", keys: ["CONTROL", "K"] }] },
        { row: 0, col: 5, label: "Play/Pause", actions: [{ type: "consumer", key: "PLAY_PAUSE" }] },
        { row: 2, col: 4, label: "Zoom Out", actions: [{ type: "keypress", keys: ["CONTROL", "MINUS"] }] },
        { row: 2, col: 5, label: "Zoom In", actions: [{ type: "keypress", keys: ["CONTROL", "EQUAL"] }] }
      ]
    },
    {
      name: "Developer & Git Suite",
      description: "Quick commands for terminal controls and Git commands.",
      macros: [
        { row: 0, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 0, col: 1, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 0, col: 2, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 0, col: 3, label: "Search", actions: [{ type: "keypress", keys: ["CONTROL", "F"] }] },
        { row: 1, col: 1, label: "Terminal", actions: [{ type: "keypress", keys: ["CONTROL", "GRAVE"] }] },
        { row: 1, col: 0, label: "Run Dev", actions: [{ type: "text", text: "npm run dev\n" }] },
        { row: 2, col: 0, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 2, col: 1, label: "Format", actions: [{ type: "keypress", keys: ["ALT", "SHIFT", "F"] }] },
        { row: 2, col: 2, label: "Cmd Pal", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "P"] }] },
        { row: 2, col: 3, label: "VS Code", actions: [{ type: "launch", app: "code" }] },
        { row: 1, col: 3, label: "Chrome", actions: [{ type: "launch", app: "chrome" }] },
        { row: 1, col: 2, label: "Git Status", actions: [{ type: "text", text: "git status\n" }] },
        { row: 0, col: 5, label: "Mute", actions: [{ type: "consumer", key: "MUTE" }] },
        { row: 2, col: 4, label: "Vol Down", actions: [{ type: "consumer", key: "VOLUME_DECREMENT" }] },
        { row: 2, col: 5, label: "Vol Up", actions: [{ type: "consumer", key: "VOLUME_INCREMENT" }] }
      ]
    }
  ],
  '5x3_2encoders': [
    {
      name: "Ultimate Streamer Studio",
      description: "Total control over OBS recording, Discord, volume, and layouts.",
      macros: [
        { row: 0, col: 0, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 0, col: 1, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 0, col: 2, label: "Redo", actions: [{ type: "keypress", keys: ["CONTROL", "Y"] }] },
        { row: 0, col: 3, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 0, col: 4, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 0, col: 5, label: "Play/Pause", actions: [{ type: "consumer", key: "PLAY_PAUSE" }] },
        { row: 0, col: 6, label: "Vol Down", actions: [{ type: "consumer", key: "VOLUME_DECREMENT" }] },
        { row: 0, col: 7, label: "Vol Up", actions: [{ type: "consumer", key: "VOLUME_INCREMENT" }] },
        
        { row: 1, col: 0, label: "OBS Start", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "S"] }] },
        { row: 1, col: 1, label: "OBS Stop", actions: [{ type: "keypress", keys: ["CONTROL", "ALT", "T"] }] },
        { row: 1, col: 2, label: "Mic Mute", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "M"] }] },
        { row: 1, col: 3, label: "Deafen", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "D"] }] },
        { row: 1, col: 4, label: "Screenshot", actions: [{ type: "keypress", keys: ["GUI", "SHIFT", "S"] }] },
        { row: 1, col: 5, label: "Mute", actions: [{ type: "consumer", key: "MUTE" }] },
        { row: 1, col: 6, label: "Zoom Out", actions: [{ type: "keypress", keys: ["CONTROL", "MINUS"] }] },
        { row: 1, col: 7, label: "Zoom In", actions: [{ type: "keypress", keys: ["CONTROL", "EQUAL"] }] },
        
        { row: 2, col: 0, label: "Discord", actions: [{ type: "launch", app: "discord" }] },
        { row: 2, col: 1, label: "OBS", actions: [{ type: "launch", app: "obs64" }] },
        { row: 2, col: 2, label: "Chrome", actions: [{ type: "launch", app: "chrome" }] },
        { row: 2, col: 3, label: "Calculator", actions: [{ type: "launch", app: "calc" }] },
        { row: 2, col: 4, label: "Close App", actions: [{ type: "keypress", keys: ["ALT", "F4"] }] }
      ]
    },
    {
      name: "CAD & Design Pro",
      description: "Excellent layout for CAD modeling and vector drawing suites.",
      macros: [
        { row: 0, col: 0, label: "Save", actions: [{ type: "keypress", keys: ["CONTROL", "S"] }] },
        { row: 0, col: 1, label: "Undo", actions: [{ type: "keypress", keys: ["CONTROL", "Z"] }] },
        { row: 0, col: 2, label: "Redo", actions: [{ type: "keypress", keys: ["CONTROL", "Y"] }] },
        { row: 0, col: 3, label: "Select", actions: [{ type: "keypress", keys: ["SPACE"] }] },
        { row: 0, col: 4, label: "Esc", actions: [{ type: "keypress", keys: ["ESCAPE"] }] },
        { row: 0, col: 5, label: "View Home", actions: [{ type: "keypress", keys: ["HOME"] }] },
        { row: 0, col: 6, label: "Brush -", actions: [{ type: "keypress", keys: ["BRACKET_LEFT"] }] },
        { row: 0, col: 7, label: "Brush +", actions: [{ type: "keypress", keys: ["BRACKET_RIGHT"] }] },
        
        { row: 1, col: 0, label: "Line", actions: [{ type: "keypress", keys: ["L"] }] },
        { row: 1, col: 1, label: "Circle", actions: [{ type: "keypress", keys: ["C"] }] },
        { row: 1, col: 2, label: "Move", actions: [{ type: "keypress", keys: ["M"] }] },
        { row: 1, col: 3, label: "Rotate", actions: [{ type: "keypress", keys: ["R"] }] },
        { row: 1, col: 4, label: "Scale", actions: [{ type: "keypress", keys: ["S"] }] },
        { row: 1, col: 5, label: "Pan Mode", actions: [{ type: "keypress", keys: ["P"] }] },
        { row: 1, col: 6, label: "Zoom Out", actions: [{ type: "keypress", keys: ["CONTROL", "MINUS"] }] },
        { row: 1, col: 7, label: "Zoom In", actions: [{ type: "keypress", keys: ["CONTROL", "EQUAL"] }] },
        
        { row: 2, col: 0, label: "Copy", actions: [{ type: "keypress", keys: ["CONTROL", "C"] }] },
        { row: 2, col: 1, label: "Paste", actions: [{ type: "keypress", keys: ["CONTROL", "V"] }] },
        { row: 2, col: 2, label: "Delete", actions: [{ type: "keypress", keys: ["DELETE"] }] },
        { row: 2, col: 3, label: "Group", actions: [{ type: "keypress", keys: ["CONTROL", "G"] }] },
        { row: 2, col: 4, label: "Ungroup", actions: [{ type: "keypress", keys: ["CONTROL", "SHIFT", "G"] }] }
      ]
    }
  ]
};

PRESETS['3x3_pro'] = PRESETS['3x3'].map(preset => ({
  ...preset,
  macros: [
    ...preset.macros,
    { row: 0, col: 3, label: "Switch Layer", actions: [{ type: "profile_switch" }] }
  ]
}));

PRESETS['6x2'] = PRESETS['6x2_encoder'];
PRESETS['5x3'] = PRESETS['5x3_2encoders'];

const STANDARD_KEYCODES = [
  {
    category: "Function Row (F1 – F24)",
    icon: "⚡",
    description: "Standard function keys and extended macro triggers",
    keys: [
      { name: "F1", aliases: ["f1", "FN1"], desc: "Function 1 (Help, Screen brightness)" },
      { name: "F2", aliases: ["f2", "FN2"], desc: "Function 2 (Rename file/item)" },
      { name: "F3", aliases: ["f3", "FN3"], desc: "Function 3 (Find next/Search)" },
      { name: "F4", aliases: ["f4", "FN4"], desc: "Function 4 (Address bar / Alt+F4 Close)" },
      { name: "F5", aliases: ["f5", "FN5"], desc: "Function 5 (Refresh/Reload page)" },
      { name: "F6", aliases: ["f6", "FN6"], desc: "Function 6 (Focus address bar)" },
      { name: "F7", aliases: ["f7", "FN7"], desc: "Function 7 (Caret browsing, Spell check)" },
      { name: "F8", aliases: ["f8", "FN8"], desc: "Function 8 (Boot menu, Safe mode)" },
      { name: "F9", aliases: ["f9", "FN9"], desc: "Function 9 (Compile code, Refresh doc)" },
      { name: "F10", aliases: ["f10", "FN10"], desc: "Function 10 (Activate menu bar)" },
      { name: "F11", aliases: ["f11", "FN11"], desc: "Function 11 (Toggle Fullscreen)" },
      { name: "F12", aliases: ["f12", "FN12"], desc: "Function 12 (Developer tools / Save As)" },
      { name: "F13", aliases: ["f13", "FN13"], desc: "Extended F13 (Ideal for OBS & custom macros)" },
      { name: "F14", aliases: ["f14", "FN14"], desc: "Extended F14 (Dedicated macro trigger)" },
      { name: "F15", aliases: ["f15", "FN15"], desc: "Extended F15 (Dedicated macro trigger)" },
      { name: "F16", aliases: ["f16", "FN16"], desc: "Extended F16 (Dedicated macro trigger)" },
      { name: "F17", aliases: ["f17", "FN17"], desc: "Extended F17 (Dedicated macro trigger)" },
      { name: "F18", aliases: ["f18", "FN18"], desc: "Extended F18 (Dedicated macro trigger)" },
      { name: "F19", aliases: ["f19", "FN19"], desc: "Extended F19 (Dedicated macro trigger)" },
      { name: "F20", aliases: ["f20", "FN20"], desc: "Extended F20 (Dedicated macro trigger)" },
      { name: "F21", aliases: ["f21", "FN21"], desc: "Extended F21 (Dedicated macro trigger)" },
      { name: "F22", aliases: ["f22", "FN22"], desc: "Extended F22 (Dedicated macro trigger)" },
      { name: "F23", aliases: ["f23", "FN23"], desc: "Extended F23 (Dedicated macro trigger)" },
      { name: "F24", aliases: ["f24", "FN24"], desc: "Extended F24 (Dedicated macro trigger)" },
    ]
  },
  {
    category: "Modifiers & System",
    icon: "🎛️",
    description: "Modifier keys for hotkeys and system-level actions",
    keys: [
      { name: "CONTROL", aliases: ["CTRL"], desc: "Control modifier key" },
      { name: "SHIFT", aliases: ["LSHIFT", "RSHIFT"], desc: "Shift modifier key" },
      { name: "ALT", aliases: ["OPT", "OPTION"], desc: "Alt / Option modifier key" },
      { name: "GUI", aliases: ["WIN", "CMD", "COMMAND", "SUPER"], desc: "Windows / Command key" },
      { name: "LEFT_CONTROL", aliases: ["LCTRL"], desc: "Left Control key" },
      { name: "RIGHT_CONTROL", aliases: ["RCTRL"], desc: "Right Control key" },
      { name: "LEFT_SHIFT", aliases: ["LSHIFT"], desc: "Left Shift key" },
      { name: "RIGHT_SHIFT", aliases: ["RSHIFT"], desc: "Right Shift key" },
      { name: "LEFT_ALT", aliases: ["LALT"], desc: "Left Alt key" },
      { name: "RIGHT_ALT", aliases: ["RALT"], desc: "Right Alt key" },
      { name: "LEFT_GUI", aliases: ["LGUI", "LWIN"], desc: "Left Windows/Cmd key" },
      { name: "RIGHT_GUI", aliases: ["RGUI", "RWIN"], desc: "Right Windows/Cmd key" },
      { name: "CAPS_LOCK", aliases: ["CAPS", "CAPSLOCK"], desc: "Caps Lock toggle" },
      { name: "APPLICATION", aliases: ["APP", "APPS", "MENU"], desc: "Context Menu / App key" },
    ]
  },
  {
    category: "Navigation & Editing",
    icon: "🧭",
    description: "Cursor navigation and document editing controls",
    keys: [
      { name: "ENTER", aliases: ["RETURN"], desc: "Enter / Return key" },
      { name: "ESCAPE", aliases: ["ESC"], desc: "Escape key" },
      { name: "BACKSPACE", aliases: ["BS", "BKSP"], desc: "Backspace / Delete back" },
      { name: "TAB", aliases: ["tab"], desc: "Tabulator key" },
      { name: "SPACE", aliases: ["SPACEBAR"], desc: "Spacebar" },
      { name: "INSERT", aliases: ["INS"], desc: "Insert key" },
      { name: "DELETE", aliases: ["DEL"], desc: "Delete forward" },
      { name: "HOME", aliases: ["home"], desc: "Home (line / document start)" },
      { name: "END", aliases: ["end"], desc: "End (line / document end)" },
      { name: "PAGE_UP", aliases: ["PGUP", "PAGEUP"], desc: "Page Up scroll" },
      { name: "PAGE_DOWN", aliases: ["PGDN", "PAGEDOWN"], desc: "Page Down scroll" },
      { name: "PRINT_SCREEN", aliases: ["PRTSC", "PRINTSCREEN", "SNAPSHOT"], desc: "Print Screen / Snapshot" },
      { name: "SCROLL_LOCK", aliases: ["SCRLK", "SCROLLLOCK"], desc: "Scroll Lock" },
      { name: "PAUSE", aliases: ["BREAK", "PAUSE_BREAK"], desc: "Pause / Break" },
    ]
  },
  {
    category: "Direction Arrows",
    icon: "🎯",
    description: "4-way directional navigation arrows",
    keys: [
      { name: "UP_ARROW", aliases: ["UP"], desc: "Up arrow" },
      { name: "DOWN_ARROW", aliases: ["DOWN"], desc: "Down arrow" },
      { name: "LEFT_ARROW", aliases: ["LEFT"], desc: "Left arrow" },
      { name: "RIGHT_ARROW", aliases: ["RIGHT"], desc: "Right arrow" },
    ]
  },
  {
    category: "Alphanumeric (A–Z & 0–9)",
    icon: "🔤",
    description: "Standard letter keys and top number row",
    keys: [
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(ch => ({
        name: ch,
        aliases: [ch.toLowerCase()],
        desc: `Letter ${ch}`
      })),
      { name: "ONE", aliases: ["1"], desc: "Number 1" },
      { name: "TWO", aliases: ["2"], desc: "Number 2" },
      { name: "THREE", aliases: ["3"], desc: "Number 3" },
      { name: "FOUR", aliases: ["4"], desc: "Number 4" },
      { name: "FIVE", aliases: ["5"], desc: "Number 5" },
      { name: "SIX", aliases: ["6"], desc: "Number 6" },
      { name: "SEVEN", aliases: ["7"], desc: "Number 7" },
      { name: "EIGHT", aliases: ["8"], desc: "Number 8" },
      { name: "NINE", aliases: ["9"], desc: "Number 9" },
      { name: "ZERO", aliases: ["0"], desc: "Number 0" },
    ]
  },
  {
    category: "Punctuation & Symbols",
    icon: "🔣",
    description: "Standard keyboard symbol and punctuation keys",
    keys: [
      { name: "MINUS", aliases: ["-"], desc: "Minus / Hyphen (-)" },
      { name: "EQUALS", aliases: ["=", "EQUAL"], desc: "Equals (=)" },
      { name: "LEFT_BRACKET", aliases: ["[", "LBRACKET"], desc: "Left Bracket ([)" },
      { name: "RIGHT_BRACKET", aliases: ["]", "RBRACKET"], desc: "Right Bracket (])" },
      { name: "BACKSLASH", aliases: ["\\"], desc: "Backslash (\\)" },
      { name: "SEMICOLON", aliases: [";"], desc: "Semicolon (;)" },
      { name: "QUOTE", aliases: ["'", "\"", "APOSTROPHE"], desc: "Quote / Apostrophe (')" },
      { name: "GRAVE_ACCENT", aliases: ["`", "GRAVE", "BACKTICK", "TILDE"], desc: "Grave accent / Backtick (`)" },
      { name: "COMMA", aliases: [","], desc: "Comma (,)" },
      { name: "PERIOD", aliases: [".", "DOT"], desc: "Period / Full stop (.)" },
      { name: "FORWARD_SLASH", aliases: ["/", "SLASH"], desc: "Forward slash (/)" },
      { name: "POUND", aliases: ["#"], desc: "Pound / Hash (#)" },
    ]
  },
  {
    category: "Numeric Keypad",
    icon: "🔢",
    description: "Dedicated numpad digits and arithmetic controls",
    keys: [
      { name: "KEYPAD_ZERO", aliases: ["NUMPAD_0", "NUMPAD0", "KP_0"], desc: "Numpad 0" },
      { name: "KEYPAD_ONE", aliases: ["NUMPAD_1", "NUMPAD1", "KP_1"], desc: "Numpad 1" },
      { name: "KEYPAD_TWO", aliases: ["NUMPAD_2", "NUMPAD2", "KP_2"], desc: "Numpad 2" },
      { name: "KEYPAD_THREE", aliases: ["NUMPAD_3", "NUMPAD3", "KP_3"], desc: "Numpad 3" },
      { name: "KEYPAD_FOUR", aliases: ["NUMPAD_4", "NUMPAD4", "KP_4"], desc: "Numpad 4" },
      { name: "KEYPAD_FIVE", aliases: ["NUMPAD_5", "NUMPAD5", "KP_5"], desc: "Numpad 5" },
      { name: "KEYPAD_SIX", aliases: ["NUMPAD_6", "NUMPAD6", "KP_6"], desc: "Numpad 6" },
      { name: "KEYPAD_SEVEN", aliases: ["NUMPAD_7", "NUMPAD7", "KP_7"], desc: "Numpad 7" },
      { name: "KEYPAD_EIGHT", aliases: ["NUMPAD_8", "NUMPAD8", "KP_8"], desc: "Numpad 8" },
      { name: "KEYPAD_NINE", aliases: ["NUMPAD_9", "NUMPAD9", "KP_9"], desc: "Numpad 9" },
      { name: "KEYPAD_PLUS", aliases: ["NUMPAD_PLUS", "KP_PLUS"], desc: "Numpad Add (+)" },
      { name: "KEYPAD_MINUS", aliases: ["NUMPAD_MINUS", "KP_MINUS"], desc: "Numpad Subtract (-)" },
      { name: "KEYPAD_ASTERISK", aliases: ["NUMPAD_MULTIPLY", "KP_MULTIPLY", "NUMPAD_STAR"], desc: "Numpad Multiply (*)" },
      { name: "KEYPAD_FORWARD_SLASH", aliases: ["NUMPAD_DIVIDE", "KP_DIVIDE", "NUMPAD_SLASH"], desc: "Numpad Divide (/)" },
      { name: "KEYPAD_PERIOD", aliases: ["NUMPAD_PERIOD", "NUMPAD_DOT", "KP_PERIOD"], desc: "Numpad Decimal (.)" },
      { name: "KEYPAD_ENTER", aliases: ["NUMPAD_ENTER", "KP_ENTER"], desc: "Numpad Enter" },
      { name: "KEYPAD_NUMLOCK", aliases: ["NUMPAD_LOCK", "NUMLOCK", "NUM_LOCK"], desc: "Num Lock toggle" },
      { name: "KEYPAD_EQUALS", aliases: ["NUMPAD_EQUALS", "KP_EQUALS"], desc: "Numpad Equals (=)" },
    ]
  },
  {
    category: "Media & Consumer Controls",
    icon: "🎵",
    description: "Consumer Control audio, playback, and system controls",
    keys: [
      { name: "VOLUME_INCREMENT", aliases: ["VOLUME_UP"], desc: "Increase volume" },
      { name: "VOLUME_DECREMENT", aliases: ["VOLUME_DOWN"], desc: "Decrease volume" },
      { name: "MUTE", aliases: ["AUDIO_MUTE"], desc: "Mute audio output" },
      { name: "PLAY_PAUSE", aliases: ["PLAY"], desc: "Play / Pause media" },
      { name: "SCAN_NEXT_TRACK", aliases: ["NEXT_TRACK"], desc: "Next track (⏩)" },
      { name: "SCAN_PREVIOUS_TRACK", aliases: ["PREV_TRACK"], desc: "Previous track (⏪)" },
    ]
  }
];

const VIRTUAL_KB_ROWS = [
  // Row 1: Function row
  [
    { label: 'Esc', key: 'ESCAPE', wide: true },
    { label: 'F1', key: 'F1' },
    { label: 'F2', key: 'F2' },
    { label: 'F3', key: 'F3' },
    { label: 'F4', key: 'F4' },
    { label: 'F5', key: 'F5' },
    { label: 'F6', key: 'F6' },
    { label: 'F7', key: 'F7' },
    { label: 'F8', key: 'F8' },
    { label: 'F9', key: 'F9' },
    { label: 'F10', key: 'F10' },
    { label: 'F11', key: 'F11' },
    { label: 'F12', key: 'F12' }
  ],
  // Row 2: Number row
  [
    { label: '`~', key: 'GRAVE_ACCENT' },
    { label: '1', key: 'ONE' },
    { label: '2', key: 'TWO' },
    { label: '3', key: 'THREE' },
    { label: '4', key: 'FOUR' },
    { label: '5', key: 'FIVE' },
    { label: '6', key: 'SIX' },
    { label: '7', key: 'SEVEN' },
    { label: '8', key: 'EIGHT' },
    { label: '9', key: 'NINE' },
    { label: '0', key: 'ZERO' },
    { label: '-_', key: 'MINUS' },
    { label: '=+', key: 'EQUALS' },
    { label: '⌫', key: 'BACKSPACE', wide: true }
  ],
  // Row 3: Tab & QWERTY
  [
    { label: 'Tab', key: 'TAB', wide: true },
    { label: 'Q', key: 'Q' },
    { label: 'W', key: 'W' },
    { label: 'E', key: 'E' },
    { label: 'R', key: 'R' },
    { label: 'T', key: 'T' },
    { label: 'Y', key: 'Y' },
    { label: 'U', key: 'U' },
    { label: 'I', key: 'I' },
    { label: 'O', key: 'O' },
    { label: 'P', key: 'P' },
    { label: '[{', key: 'LEFT_BRACKET' },
    { label: ']}', key: 'RIGHT_BRACKET' },
    { label: '\\|', key: 'BACKSLASH' }
  ],
  // Row 4: Caps & Home row
  [
    { label: 'Caps', key: 'CAPS_LOCK', wide: true },
    { label: 'A', key: 'A' },
    { label: 'S', key: 'S' },
    { label: 'D', key: 'D' },
    { label: 'F', key: 'F' },
    { label: 'G', key: 'G' },
    { label: 'H', key: 'H' },
    { label: 'J', key: 'J' },
    { label: 'K', key: 'K' },
    { label: 'L', key: 'L' },
    { label: ';:', key: 'SEMICOLON' },
    { label: '\'"', key: 'QUOTE' },
    { label: '↵ Enter', key: 'ENTER', wider: true }
  ],
  // Row 5: Shift & Bottom row
  [
    { label: '⇧ Shift', key: 'SHIFT', wider: true },
    { label: 'Z', key: 'Z' },
    { label: 'X', key: 'X' },
    { label: 'C', key: 'C' },
    { label: 'V', key: 'V' },
    { label: 'B', key: 'B' },
    { label: 'N', key: 'N' },
    { label: 'M', key: 'M' },
    { label: ',<', key: 'COMMA' },
    { label: '.>', key: 'PERIOD' },
    { label: '/?', key: 'FORWARD_SLASH' },
    { label: '⇧ Shift', key: 'RIGHT_SHIFT', wider: true }
  ],
  // Row 6: Modifiers & Space
  [
    { label: 'Ctrl', key: 'CONTROL', wide: true },
    { label: 'Win', key: 'GUI', wide: true },
    { label: 'Alt', key: 'ALT', wide: true },
    { label: 'Space', key: 'SPACE', space: true },
    { label: 'Alt', key: 'RIGHT_ALT', wide: true },
    { label: 'Menu', key: 'APPLICATION', wide: true },
    { label: 'Ctrl', key: 'RIGHT_CONTROL', wide: true }
  ]
];

const VIRTUAL_NAV_KEYS = [
  { label: 'PrtSc', key: 'PRINT_SCREEN' },
  { label: 'ScrLk', key: 'SCROLL_LOCK' },
  { label: 'Pause', key: 'PAUSE' },
  { label: 'Ins', key: 'INSERT' },
  { label: 'Home', key: 'HOME' },
  { label: 'PgUp', key: 'PAGE_UP' },
  { label: 'Del', key: 'DELETE' },
  { label: 'End', key: 'END' },
  { label: 'PgDn', key: 'PAGE_DOWN' },
  { label: '↑ Up', key: 'UP_ARROW' },
  { label: '↓ Down', key: 'DOWN_ARROW' },
  { label: '← Left', key: 'LEFT_ARROW' },
  { label: '→ Right', key: 'RIGHT_ARROW' }
];

const isKeyInAction = (keys, keyName) => {
  if (!Array.isArray(keys) || keys.length === 0 || !keyName) return false;
  const upper = String(keyName).toUpperCase();
  return keys.some(k => {
    const ku = String(k).toUpperCase();
    if (ku === upper) return true;
    if (upper === 'CONTROL' && (ku === 'CTRL' || ku === 'LCTRL' || ku === 'RCTRL')) return true;
    if (upper === 'SHIFT' && (ku === 'LSHIFT' || ku === 'RSHIFT')) return true;
    if (upper === 'ALT' && (ku === 'LALT' || ku === 'RALT' || ku === 'OPT' || ku === 'OPTION')) return true;
    if (upper === 'GUI' && (ku === 'WIN' || ku === 'CMD' || ku === 'COMMAND' || ku === 'SUPER' || ku === 'WINDOWS')) return true;
    if (upper === 'ENTER' && ku === 'RETURN') return true;
    if (upper === 'ESCAPE' && ku === 'ESC') return true;
    if (upper === 'DELETE' && ku === 'DEL') return true;
    if (upper === 'INSERT' && ku === 'INS') return true;
    if (upper === 'BACKSPACE' && (ku === 'BS' || ku === 'BKSP')) return true;
    if (upper === 'PAGE_UP' && (ku === 'PGUP' || ku === 'PAGEUP')) return true;
    if (upper === 'PAGE_DOWN' && (ku === 'PGDN' || ku === 'PAGEDOWN')) return true;
    if (upper === 'UP_ARROW' && ku === 'UP') return true;
    if (upper === 'DOWN_ARROW' && ku === 'DOWN') return true;
    if (upper === 'LEFT_ARROW' && ku === 'LEFT') return true;
    if (upper === 'RIGHT_ARROW' && ku === 'RIGHT') return true;
    if (upper === 'KEYPAD_NUMLOCK' && (ku === 'NUMLOCK' || ku === 'NUM_LOCK' || ku === 'NUMPAD_LOCK')) return true;
    if (upper === 'ONE' && ku === '1') return true;
    if (upper === 'TWO' && ku === '2') return true;
    if (upper === 'THREE' && ku === '3') return true;
    if (upper === 'FOUR' && ku === '4') return true;
    if (upper === 'FIVE' && ku === '5') return true;
    if (upper === 'SIX' && ku === '6') return true;
    if (upper === 'SEVEN' && ku === '7') return true;
    if (upper === 'EIGHT' && ku === '8') return true;
    if (upper === 'NINE' && ku === '9') return true;
    if (upper === 'ZERO' && ku === '0') return true;
    return false;
  });
};

function App() {
  const [dirHandle, setDirHandle] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('configurator_theme') || 'dark');
  const [showHelp, setShowHelp] = useState(false);
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('macro_profiles');
      return saved ? JSON.parse(saved) : { "Default": { macros: [], settings: { debounce: 0.05, board_model: '3x3' } } };
    } catch (e) {
      console.error("Failed to parse profiles", e);
      return { "Default": { macros: [], settings: { debounce: 0.05, board_model: '3x3' } } };
    }
  });
  const [activeProfile, setActiveProfile] = useState(() => localStorage.getItem('active_profile') || 'Default');
  const [macros, setMacros] = useState(profiles[activeProfile]?.macros || []);
  const [settings, setSettings] = useState(profiles[activeProfile]?.settings || { debounce: 0.05, board_model: '3x3' });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [status, setStatus] = useState("Disconnected");

  // Modal State
  const [modal, setModal] = useState({ open: false, title: '', value: '', type: '', onConfirm: null });

  // Gallery State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryModel, setGalleryModel] = useState('3x3');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);

  // Flow & Action Editor State
  const [openNumpad, setOpenNumpad] = useState({});
  const [openExtendedFn, setOpenExtendedFn] = useState({});
  const [openKeyboardDrawer, setOpenKeyboardDrawer] = useState({});
  const [keyboardClusterTab, setKeyboardClusterTab] = useState('full');
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);
  const [boardConfigOpen, setBoardConfigOpen] = useState(false);

  // Help View State
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const [helpSelectedCategory, setHelpSelectedCategory] = useState('All');
  const [copiedKeycode, setCopiedKeycode] = useState(null);

  const copyKeycodeToClipboard = (codeName) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(codeName).then(() => {
        setCopiedKeycode(codeName);
        showToast(`Copied ${codeName} to clipboard!`, 2000);
        setTimeout(() => setCopiedKeycode(null), 2000);
      }).catch(() => {
        setCopiedKeycode(codeName);
        setTimeout(() => setCopiedKeycode(null), 2000);
      });
    } else {
      setCopiedKeycode(codeName);
      setTimeout(() => setCopiedKeycode(null), 2000);
    }
  };

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);

  const showToast = (msg, duration = 3500) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage('');
    }, duration);
  };

  const openGallery = () => {
    let bm = settings.board_model || '3x3';
    if (bm === '6x2') bm = '6x2_encoder';
    if (bm === '5x3') bm = '5x3_2encoders';
    setGalleryModel(bm);
    setSelectedPresetIdx(0);
    setGalleryOpen(true);
  };

  const applyPresetToProfile = (presetOverride) => {
    const preset = presetOverride || PRESETS[galleryModel]?.[selectedPresetIdx];
    if (!preset) return;

    // Deep clone preset macros to ensure presets remain untouched
    const clonedMacros = JSON.parse(JSON.stringify(preset.macros || []));

    // Normalize board model
    let targetModel = galleryModel;
    if (targetModel === '6x2') targetModel = '6x2_encoder';
    if (targetModel === '5x3') targetModel = '5x3_2encoders';

    const newSettings = { ...settings, board_model: targetModel };

    setMacros(clonedMacros);
    setSettings(newSettings);
    setSelectedIdx(0);

    setProfiles(prev => {
      const updated = {
        ...prev,
        [activeProfile]: {
          macros: clonedMacros,
          settings: newSettings
        }
      };
      try {
        localStorage.setItem('macro_profiles', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save to localStorage", err);
      }
      return updated;
    });

    setGalleryOpen(false);
    showToast(`✅ Applied "${preset.name}" preset to profile "${activeProfile}"!${dirHandle ? ' Click "Save Config" to flash to keyboard.' : ''}`);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('configurator_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    localStorage.setItem('macro_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('active_profile', activeProfile);
  }, [activeProfile]);

  const updateCurrentProfile = (newMacros, newSettings) => {
    setProfiles(prev => ({
      ...prev,
      [activeProfile]: { 
        macros: newMacros || macros, 
        settings: newSettings || settings 
      }
    }));
  };

  const createProfile = () => {
    setModal({
      open: true,
      title: 'New Profile Name',
      value: '',
      type: 'input',
      onConfirm: (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        if (profiles[trimmedName]) return alert("Profile already exists!");
        
        const currentModel = settings.board_model || '3x3';
        const newProfileData = { macros: [], settings: { debounce: 0.05, board_model: currentModel } };
        setProfiles(prev => ({ 
          ...prev, 
          [activeProfile]: { macros, settings },
          [trimmedName]: newProfileData 
        }));
        setActiveProfile(trimmedName);
        setMacros([]);
        setSettings({ debounce: 0.05, board_model: currentModel });
        setModal(m => ({ ...m, open: false }));
      }
    });
  };

  const saveAsProfile = () => {
    setModal({
      open: true,
      title: 'Save Profile As',
      value: activeProfile + ' (Copy)',
      type: 'input',
      onConfirm: (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        if (profiles[trimmedName]) return alert("Profile already exists!");

        const newProfileData = { macros: [...macros], settings: { ...settings } };
        setProfiles(prev => ({ 
          ...prev, 
          [activeProfile]: { macros, settings },
          [trimmedName]: newProfileData 
        }));
        setActiveProfile(trimmedName);
        setModal(m => ({ ...m, open: false }));
      }
    });
  };

  const switchProfile = (name) => {
    setProfiles(prev => ({
      ...prev,
      [activeProfile]: { macros, settings }
    }));
    setActiveProfile(name);
    const p = profiles[name] || { macros: [], settings: { debounce: 0.05, board_model: '3x3' } };
    setMacros(p.macros || []);
    setSettings(p.settings || { debounce: 0.05, board_model: '3x3' });
  };

  const deleteProfile = (name) => {
    if (name === "Default") return alert("Cannot delete Default profile.");
    
    setModal({
      open: true,
      title: `Delete profile "${name}"?`,
      value: '',
      type: 'confirm',
      onConfirm: () => {
        const newProfiles = { ...profiles };
        delete newProfiles[name];
        setProfiles(newProfiles);
        if (activeProfile === name) {
          setActiveProfile("Default");
          const p = newProfiles["Default"] || { macros: [], settings: { debounce: 0.05, board_model: '3x3' } };
          setMacros(p.macros || []);
          setSettings(p.settings || { debounce: 0.05, board_model: '3x3' });
        }
        setModal(m => ({ ...m, open: false }));
      }
    });
  };

  const connectKeyboard = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setDirHandle(handle);

      let boardModelFromToml = null;
      try {
        const tomlHandle = await handle.getFileHandle("settings.toml");
        const tomlFile = await tomlHandle.getFile();
        const tomlContent = await tomlFile.text();
        const match = tomlContent.match(/BOARD_MODEL\s*=\s*["']([^"']+)["']/i);
        if (match && match[1]) {
          boardModelFromToml = match[1].trim().toLowerCase();
        }
      } catch (tomlErr) {
        console.log("No settings.toml found or failed to parse, falling back to macros.json settings");
      }

      const fileHandle = await handle.getFileHandle("macros.json");
      const file = await fileHandle.getFile();
      const content = await file.text();
      const data = JSON.parse(content);

      const loadedSettings = data.settings || { debounce: 0.05, board_model: '3x3' };
      if (boardModelFromToml) {
        loadedSettings.board_model = boardModelFromToml;
      }
      setSettings(loadedSettings);

      if (data.profiles) {
        setProfiles(data.profiles);
        const activeProf = data.active_profile || Object.keys(data.profiles)[0] || 'Default';
        setActiveProfile(activeProf);
        setMacros(data.profiles[activeProf]?.macros || []);
      } else {
        const loadedMacros = data.macros || [];
        const initialProfiles = { "Default": { macros: loadedMacros, settings: loadedSettings } };
        setProfiles(initialProfiles);
        setActiveProfile("Default");
        setMacros(loadedMacros);
      }
      setStatus("Connected");
    } catch (err) {
      console.error(err);
      alert("Failed to connect. Please select the CIRCUITPY drive.");
    }
  };

  const saveConfig = async () => {
    if (!dirHandle) return;
    try {
      // 1. Save macros.json
      const fileHandle = await dirHandle.getFileHandle("macros.json", { create: true });
      const writable = await fileHandle.createWritable();
      
      const updatedProfiles = {
        ...profiles,
        [activeProfile]: { macros, settings }
      };
      
      const data = {
        settings,
        active_profile: activeProfile,
        profiles: updatedProfiles,
        macros: macros
      };
      
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      setProfiles(updatedProfiles);

      // 2. Save settings.toml
      try {
        const tomlHandle = await dirHandle.getFileHandle("settings.toml", { create: true });
        const tomlWritable = await tomlHandle.createWritable();
        const tomlContent = `BOARD_MODEL="${settings.board_model || '3x3'}"\n`;
        await tomlWritable.write(tomlContent);
        await tomlWritable.close();
      } catch (tomlErr) {
        console.error("Failed to save settings.toml", tomlErr);
      }

      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const is1x3 = settings.board_model === '1x3';
  const is3x3Pro = settings.board_model === '3x3_pro';
  const is4x2 = settings.board_model === '4x2';
  const is6x2 = settings.board_model === '6x2_encoder' || settings.board_model === '6x2';
  const is5x3_2encoders = settings.board_model === '5x3_2encoders' || settings.board_model === '5x3';

  const getModelImage = (model) => {
    switch (model) {
      case '1x3': return img1x3;
      case '3x3_pro': return img3x3Pro;
      case '4x2': return img4x2;
      case '6x2':
      case '6x2_encoder': return img6x2;
      case '5x3':
      case '5x3_2encoders': return img5x3;
      case '3x3':
      default:
        return img3x3;
    }
  };
  const modelImage = getModelImage(settings.board_model);


  const getKeyCoordinates = (model, index) => {
    if (model === '1x3') {
      return { row: 0, col: index };
    } else if (model === '4x2') {
      return { row: Math.floor(index / 4), col: index % 4 };
    } else if (model === '3x3_pro') {
      if (index === 9) {
        return { row: 0, col: 3 };
      }
      return {
        row: Math.floor(index / 3),
        col: index % 3
      };
    } else if (model === '6x2_encoder' || model === '6x2') {
      const keyMap6x2 = [
        { row: 0, col: 0 }, // Key 1
        { row: 0, col: 1 }, // Key 2
        { row: 0, col: 2 }, // Key 3
        { row: 0, col: 3 }, // Key 4
        { row: 1, col: 1 }, // Key 5
        { row: 1, col: 0 }, // Key 6
        { row: 2, col: 0 }, // Key 7
        { row: 2, col: 1 }, // Key 8
        { row: 2, col: 2 }, // Key 9
        { row: 2, col: 3 }, // Key 10
        { row: 1, col: 3 }, // Key 11
        { row: 1, col: 2 }, // Key 12
        { row: 0, col: 5 }, // ENC Button Switch
        { row: 2, col: 4 }, // CCW
        { row: 2, col: 5 }  // CW
      ];
      if (index >= 0 && index < keyMap6x2.length) {
        return keyMap6x2[index];
      }
    } else if (model === '5x3_2encoders' || model === '5x3') {
      if (index >= 0 && index <= 14) {
        return { row: Math.floor(index / 5), col: index % 5 };
      } else if (index === 15) {
        return { row: 0, col: 5 }; // Encoder 1 Switch
      } else if (index === 16) {
        return { row: 1, col: 5 }; // Encoder 2 Switch
      } else if (index === 17) {
        return { row: 0, col: 6 }; // Encoder 1 CCW
      } else if (index === 18) {
        return { row: 0, col: 7 }; // Encoder 1 CW
      } else if (index === 19) {
        return { row: 1, col: 6 }; // Encoder 2 CCW
      } else if (index === 20) {
        return { row: 1, col: 7 }; // Encoder 2 CW
      }
    }
    return {
      row: Math.floor(index / 3),
      col: index % 3
    };
  };

  const getSelectedKeyName = () => {
    if (settings.board_model === '3x3_pro') {
      if (selectedIdx === 9) return 'Profile Switch Button (SW)';
      return `Key ${selectedIdx + 1}`;
    } else if (settings.board_model === '6x2_encoder' || settings.board_model === '6x2') {
      if (selectedIdx === 12) return 'Encoder Button (ENC)';
      if (selectedIdx === 13) return 'Encoder Rotation CCW (↺)';
      if (selectedIdx === 14) return 'Encoder Rotation CW (↻)';
      return `Key ${selectedIdx + 1}`;
    } else if (settings.board_model === '5x3_2encoders' || settings.board_model === '5x3') {
      if (selectedIdx === 15) return 'Encoder 1 Button (ENC1)';
      if (selectedIdx === 16) return 'Encoder 2 Button (ENC2)';
      if (selectedIdx === 17) return 'Encoder 1 Rotation CCW (↺)';
      if (selectedIdx === 18) return 'Encoder 1 Rotation CW (↻)';
      if (selectedIdx === 19) return 'Encoder 2 Rotation CCW (↺)';
      if (selectedIdx === 20) return 'Encoder 2 Rotation CW (↻)';
      if (selectedIdx > 14) return `Key ${selectedIdx}`;
      return `Key ${selectedIdx + 1}`;
    }
    return `Key ${selectedIdx + 1}`;
  };

  const coords = getKeyCoordinates(settings.board_model, selectedIdx);
  const defaultMacroForCoords = (settings.board_model === '3x3_pro' && coords.row === 0 && coords.col === 3)
    ? { row: coords.row, col: coords.col, label: "Switch Layer", actions: [{ type: "profile_switch" }] }
    : { row: coords.row, col: coords.col, ...DEFAULT_MACRO };
  const selectedMacro = macros.find(m => m.row === coords.row && m.col === coords.col) || defaultMacroForCoords;

  const updateMacroInList = (updatedMacro) => {
    const existingIdx = macros.findIndex(m => m.row === updatedMacro.row && m.col === updatedMacro.col);
    let newMacros;
    if (existingIdx >= 0) {
      newMacros = [...macros];
      newMacros[existingIdx] = updatedMacro;
    } else {
      newMacros = [...macros, updatedMacro];
    }
    setMacros(newMacros);
    updateCurrentProfile(newMacros, null);
  };

  const handleProfileSwitchClick = () => {
    const keys = Object.keys(profiles);
    if (keys.length <= 1) return;
    const currentIdx = keys.indexOf(activeProfile);
    const nextIdx = (currentIdx + 1) % keys.length;
    switchProfile(keys[nextIdx]);
  };

  const handleSelectKey = (i) => {
    setSelectedIdx(i);
    const mCoords = getKeyCoordinates(settings.board_model || '3x3', i);
    const m = macros.find(macro => macro.row === mCoords.row && macro.col === mCoords.col);
    if (m && m.actions && m.actions.length > 0) {
      setSelectedStepIdx(0);
    } else {
      setSelectedStepIdx('trigger');
    }
  };

  const renderKey = (i) => {
    const coords = getKeyCoordinates(settings.board_model, i);
    const macro = macros.find(m => m.row === coords.row && m.col === coords.col);
    
    let displayNum = i + 1;
    let extraClass = '';
    
    if (settings.board_model === '3x3_pro') {
      if (i === 9) {
        displayNum = 'SW';
        extraClass = 'profile-btn';
      }
    } else if (settings.board_model === '6x2_encoder' || settings.board_model === '6x2') {
      if (i === 12) {
        displayNum = 'ENC';
        extraClass = 'encoder-key';
      } else if (i === 13) {
        displayNum = '↺ CCW';
        extraClass = 'encoder-ccw';
      } else if (i === 14) {
        displayNum = '↻ CW';
        extraClass = 'encoder-cw';
      } else {
        displayNum = i + 1;
      }
    } else if (settings.board_model === '5x3_2encoders' || settings.board_model === '5x3') {
      if (i === 15) {
        displayNum = 'ENC1';
        extraClass = 'encoder-key';
      } else if (i === 16) {
        displayNum = 'ENC2';
        extraClass = 'encoder-key';
      } else if (i === 17) {
        displayNum = 'E1 ↺';
        extraClass = 'encoder-ccw';
      } else if (i === 18) {
        displayNum = 'E1 ↻';
        extraClass = 'encoder-cw';
      } else if (i === 19) {
        displayNum = 'E2 ↺';
        extraClass = 'encoder-ccw';
      } else if (i === 20) {
        displayNum = 'E2 ↻';
        extraClass = 'encoder-cw';
      }
    }
    
    const isProfileSwitch = macro?.actions?.some(a => a.type === 'profile_switch' || a.type === 'layer_switch');
    const is3x3ProSwitch = settings.board_model === '3x3_pro' && i === 9;
    const mouseAction = macro?.actions?.find(a => a.type === 'mouse_click' || a.type === 'mouse');

    let iconChar = displayNum;
    let labelText = isProfileSwitch ? 'Switch Layer' : is3x3ProSwitch ? 'Profile Switch' : 'Not Configured';

    if (macro?.label) {
      labelText = macro.label;
      iconChar = mouseAction ? '🖱️' : macro.label[0];
    } else if (mouseAction) {
      iconChar = '🖱️';
      let btnLabel = mouseAction.button === 'RIGHT' ? 'R-Click' : mouseAction.button === 'MIDDLE' ? 'M-Click' : mouseAction.button === 'BACK' ? 'Back' : mouseAction.button === 'FORWARD' ? 'Fwd' : mouseAction.click_type === 'double_click' ? '2x-Click' : mouseAction.click_type === 'hold' ? 'Drag' : 'L-Click';
      if (mouseAction.modifiers && mouseAction.modifiers.length > 0) {
        const modPrefix = mouseAction.modifiers.map(m => m === 'CONTROL' ? 'Ctrl' : m === 'SHIFT' ? 'Shift' : m === 'ALT' ? 'Alt' : 'Win').join('+');
        labelText = `${modPrefix}+${btnLabel}`;
      } else {
        labelText = btnLabel;
      }
    } else if (isProfileSwitch || is3x3ProSwitch) {
      iconChar = '🔄';
    }

    const hasActions = macro && Array.isArray(macro.actions) && macro.actions.length > 0;
    const isConfigured = Boolean(macro?.label || hasActions || isProfileSwitch || is3x3ProSwitch);

    return (
      <div
        key={i}
        className={`key ${selectedIdx === i ? 'selected' : ''} ${isConfigured ? 'is-configured' : 'is-unconfigured'} ${extraClass} ${isProfileSwitch || is3x3ProSwitch ? 'profile-btn' : ''}`}
        onClick={() => handleSelectKey(i)}
        title={`Key ${i + 1}: ${labelText}`}
      >
        <div className="keycap-dish">
          <div className="key-header-meta">
            <span className="key-number-tag">{displayNum}</span>
            <span className={`key-status-dot ${isConfigured ? 'active' : ''}`} />
          </div>
          <span className="key-icon">{iconChar}</span>
          <span className="key-label">{labelText}</span>
        </div>
      </div>
    );
  };

  const handleActionChange = (actionIdx, field, value) => {
    const newActions = [...(selectedMacro.actions || [])];
    let val = value;
    if (field === 'keys' && typeof value === 'string') {
      val = value.split(',').map(k => k.trim().toUpperCase()).filter(Boolean);
    }
    
    // Create the updated action
    const updatedAction = { ...newActions[actionIdx], [field]: val };
    
    // If we changed the type, clean up old fields and set default values
    if (field === 'type') {
      const type = value;
      delete updatedAction.keys;
      delete updatedAction.text;
      delete updatedAction.key;
      delete updatedAction.duration;
      delete updatedAction.app;
      delete updatedAction.url;
      delete updatedAction.button;
      delete updatedAction.click_type;
      delete updatedAction.modifiers;
      
      if (type === 'keypress') {
        updatedAction.keys = ['CONTROL', 'C'];
      } else if (type === 'mouse_click') {
        updatedAction.button = 'LEFT';
        updatedAction.click_type = 'click';
        updatedAction.modifiers = [];
      } else if (type === 'text') {
        updatedAction.text = '';
      } else if (type === 'consumer') {
        updatedAction.key = 'PLAY_PAUSE';
      } else if (type === 'delay') {
        updatedAction.duration = 0.2;
      } else if (type === 'launch') {
        updatedAction.app = '';
      } else if (type === 'url') {
        updatedAction.url = 'https://';
      } else if (type === 'profile_switch') {
        // No extra parameters needed
      }
    }
    
    newActions[actionIdx] = updatedAction;
    updateMacroInList({ ...selectedMacro, actions: newActions });
  };

  const insertKeyToKeypress = (actionIdx, keyName) => {
    const action = selectedMacro.actions?.[actionIdx] || {};
    const currentKeys = Array.isArray(action.keys) ? [...action.keys] : [];
    const isModifier = ['CONTROL', 'SHIFT', 'ALT', 'GUI'].includes(keyName);
    let newKeys;
    if (isModifier) {
      if (isKeyInAction(currentKeys, keyName)) {
        newKeys = currentKeys.filter(k => !isKeyInAction([k], keyName));
      } else {
        newKeys = [keyName, ...currentKeys];
      }
    } else {
      if (isKeyInAction(currentKeys, keyName)) {
        newKeys = currentKeys.filter(k => !isKeyInAction([k], keyName));
      } else {
        newKeys = [...currentKeys, keyName];
      }
    }
    handleActionChange(actionIdx, 'keys', newKeys.join(', '));
  };

  const toggleMouseModifier = (actionIdx, modName) => {
    const action = selectedMacro.actions?.[actionIdx] || {};
    const currentMods = Array.isArray(action.modifiers) ? [...action.modifiers] : [];
    let newMods;
    if (currentMods.includes(modName)) {
      newMods = currentMods.filter(m => m !== modName);
    } else {
      newMods = [...currentMods, modName];
    }
    handleActionChange(actionIdx, 'modifiers', newMods);
  };

  const removeAction = (actionIdx) => {
    const newActions = (selectedMacro.actions || []).filter((_, i) => i !== actionIdx);
    updateMacroInList({ ...selectedMacro, actions: newActions });
    if (newActions.length === 0) {
      setSelectedStepIdx('trigger');
    } else if (selectedStepIdx >= newActions.length) {
      setSelectedStepIdx(newActions.length - 1);
    } else if (selectedStepIdx === actionIdx) {
      setSelectedStepIdx(Math.max(0, actionIdx - 1));
    }
  };

  const handleLabelChange = (val) => {
    updateMacroInList({ ...selectedMacro, label: val });
  };

  const moveAction = (fromIdx, direction) => {
    const toIdx = fromIdx + direction;
    const currentActions = [...(selectedMacro.actions || [])];
    if (toIdx < 0 || toIdx >= currentActions.length) return;
    const temp = currentActions[fromIdx];
    currentActions[fromIdx] = currentActions[toIdx];
    currentActions[toIdx] = temp;
    updateMacroInList({ ...selectedMacro, actions: currentActions });
    setSelectedStepIdx(toIdx);
  };

  const duplicateAction = (idx) => {
    const currentActions = [...(selectedMacro.actions || [])];
    const cloned = JSON.parse(JSON.stringify(currentActions[idx]));
    currentActions.splice(idx + 1, 0, cloned);
    updateMacroInList({ ...selectedMacro, actions: currentActions });
    setSelectedStepIdx(idx + 1);
  };

  const addActionWithType = (type = 'keypress') => {
    let newAction = { type };
    if (type === 'keypress') newAction.keys = ['CONTROL', 'C'];
    else if (type === 'mouse_click') { newAction.button = 'LEFT'; newAction.click_type = 'click'; newAction.modifiers = []; }
    else if (type === 'text') newAction.text = '';
    else if (type === 'consumer') newAction.key = 'PLAY_PAUSE';
    else if (type === 'delay') newAction.duration = 0.2;
    else if (type === 'launch') newAction.app = '';
    else if (type === 'url') newAction.url = 'https://';
    else if (type === 'profile_switch') { /* no extra params */ }
    
    const newActions = [...(selectedMacro.actions || []), newAction];
    updateMacroInList({ ...selectedMacro, actions: newActions });
    setSelectedStepIdx(newActions.length - 1);
  };

  const getActionDisplayDetails = (action) => {
    switch (action.type) {
      case 'keypress': {
        const keys = action.keys || [];
        return {
          icon: '⌨️',
          category: 'Key Combination',
          color: '#3b82f6',
          renderContent: () => (
            <div className="flow-keys-wrap">
              {keys.length > 0 ? (
                keys.map((k, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="flow-plus">+</span>}
                    <kbd className="flow-keycap">{k}</kbd>
                  </React.Fragment>
                ))
              ) : (
                <span className="flow-empty-param">No keys configured (click to edit)</span>
              )}
            </div>
          ),
          shortDesc: keys.length > 0 ? keys.join(' + ') : 'Empty Hotkey'
        };
      }
      case 'mouse_click': {
        const btn = action.button || 'LEFT';
        const mode = action.click_type || 'click';
        const mods = action.modifiers || [];
        const modeLabel = mode === 'double_click' ? 'Double Click' : mode === 'hold' ? 'Hold & Drag' : 'Single Click';
        return {
          icon: '🖱️',
          category: 'Mouse Action',
          color: '#8b5cf6',
          renderContent: () => (
            <div className="flow-mouse-wrap">
              <span className="flow-chip mouse-btn-chip">{btn} BUTTON</span>
              <span className="flow-chip mouse-mode-chip">{modeLabel}</span>
              {mods.length > 0 && (
                <span className="flow-chip mouse-mods-chip">with {mods.join(' + ')}</span>
              )}
            </div>
          ),
          shortDesc: `${btn} Button (${modeLabel})`
        };
      }
      case 'text': {
        const textVal = action.text || '';
        return {
          icon: '🔤',
          category: 'Type Text String',
          color: '#10b981',
          renderContent: () => (
            <div className="flow-text-wrap">
              <code className="flow-code-block">{textVal ? `"${textVal}"` : '(No text entered)'}</code>
            </div>
          ),
          shortDesc: textVal ? `"${textVal.length > 25 ? textVal.slice(0, 25) + '...' : textVal}"` : 'Empty Text'
        };
      }
      case 'consumer': {
        const consumerKey = action.key || '';
        const consumerMap = {
          VOLUME_INCREMENT: 'Volume Up (+)',
          VOLUME_DECREMENT: 'Volume Down (-)',
          MUTE: 'Mute Audio',
          PLAY_PAUSE: 'Play / Pause',
          SCAN_NEXT_TRACK: 'Next Track (⏩)',
          SCAN_PREVIOUS_TRACK: 'Previous Track (⏪)'
        };
        const friendlyName = consumerMap[consumerKey] || consumerKey || 'No command selected';
        return {
          icon: '🎵',
          category: 'Media & System',
          color: '#06b6d4',
          renderContent: () => (
            <div className="flow-consumer-wrap">
              <span className="flow-chip consumer-chip">{friendlyName}</span>
            </div>
          ),
          shortDesc: friendlyName
        };
      }
      case 'delay': {
        const durationSec = action.duration !== undefined ? action.duration : 0.1;
        const durationMs = Math.round(durationSec * 1000);
        return {
          icon: '⏱️',
          category: 'Wait / Delay',
          color: '#f59e0b',
          renderContent: () => (
            <div className="flow-delay-wrap">
              <span className="flow-chip delay-chip">⏳ {durationSec.toFixed(2)}s ({durationMs} ms)</span>
              <div className="flow-delay-bar-bg">
                <div 
                  className="flow-delay-bar-fill" 
                  style={{ width: `${Math.min(100, Math.max(15, (durationSec / 1.0) * 100))}%` }} 
                />
              </div>
            </div>
          ),
          shortDesc: `Wait ${durationMs}ms`
        };
      }
      case 'launch': {
        const appName = action.app || '';
        return {
          icon: '🚀',
          category: 'Launch Application',
          color: '#ef4444',
          renderContent: () => (
            <div className="flow-launch-wrap">
              <span className="flow-chip launch-chip">run: <code>{appName || 'none'}</code></span>
            </div>
          ),
          shortDesc: appName ? `Open ${appName}` : 'Launch App'
        };
      }
      case 'url': {
        const urlVal = action.url || '';
        return {
          icon: '🌐',
          category: 'Open Web URL',
          color: '#0284c7',
          renderContent: () => (
            <div className="flow-url-wrap">
              <span className="flow-chip url-chip">🔗 {urlVal || 'No URL specified'}</span>
            </div>
          ),
          shortDesc: urlVal || 'Open URL'
        };
      }
      case 'profile_switch': {
        return {
          icon: '🔄',
          category: 'Profile / Layer Switch',
          color: '#d946ef',
          renderContent: () => (
            <div className="flow-switch-wrap">
              <span className="flow-chip switch-chip">Cycle to Next Profile Layer</span>
            </div>
          ),
          shortDesc: 'Switch Profile'
        };
      }
      default:
        return {
          icon: '⚡',
          category: 'Action',
          color: 'var(--accent-color)',
          renderContent: () => <span>{action.type}</span>,
          shortDesc: action.type
        };
    }
  };

  const renderActionFlowTree = () => {
    const actions = selectedMacro.actions || [];
    const keyName = getSelectedKeyName();
    const hasActions = actions.length > 0;

    return (
      <div className="action-flow-section">
        <div className="flow-header">
          <div className="flow-title-group">
            <div className="flow-title-row">
              <span className="flow-icon-pulse">⚡</span>
              <h3 className="flow-heading">Visual Action Flow</h3>
              <span className="flow-key-badge">{keyName}</span>
            </div>
            <p className="flow-subtitle">
              Execution sequence for <strong>"{selectedMacro.label || 'Untitled Macro'}"</strong> (Row {coords.row}, Col {coords.col})
            </p>
          </div>

          <div className="flow-header-actions">
            <span className="flow-step-counter">
              {actions.length} {actions.length === 1 ? 'Step' : 'Steps'}
            </span>
            {hasActions && (
              <button 
                type="button" 
                className="btn btn-secondary flow-clear-btn"
                onClick={() => updateMacroInList({ ...selectedMacro, actions: [] })}
                title="Clear all actions for this key"
              >
                Clear Flow
              </button>
            )}
          </div>
        </div>

        <div className="flow-tree-container">
          {/* ROOT TRIGGER NODE */}
          <div 
            className={`flow-node flow-trigger-node ${selectedStepIdx === 'trigger' ? 'focused-step' : ''}`}
            onClick={() => setSelectedStepIdx('trigger')}
            style={{ cursor: 'pointer' }}
            title="Click to view Trigger & Key options in the Options Menu"
          >
            <div className="flow-node-bullet trigger-bullet">
              <span className="flow-bullet-ping"></span>
              <span className="flow-bullet-dot"></span>
            </div>
            <div className="flow-node-content trigger-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="trigger-badge">EVENT TRIGGER</div>
                {selectedStepIdx === 'trigger' && (
                  <span className="flow-active-badge">● Active in Options Menu</span>
                )}
              </div>
              <div className="trigger-title">
                {is6x2 && selectedIdx >= 12
                  ? `Hardware Dial: ${keyName}`
                  : is5x3_2encoders && selectedIdx >= 15
                  ? `Hardware Encoder: ${keyName}`
                  : `Key Press: ${keyName}`}
              </div>
              <div className="trigger-meta">
                Row {coords.row}, Col {coords.col} • Hardware Interrupt
              </div>
            </div>
          </div>

          {/* ROOT CONNECTOR LINE */}
          <div className="flow-connector">
            <div className="flow-connector-line"></div>
            <div className="flow-connector-pill">
              <span className="flow-connector-arrow">↓</span>
              <span>triggers sequence</span>
            </div>
          </div>

          {/* ACTION NODES IN THE PIPELINE */}
          {hasActions ? (
            actions.map((action, ai) => {
              const details = getActionDisplayDetails(action);
              const isSelected = selectedStepIdx === ai;
              const isFirst = ai === 0;
              const isLast = ai === actions.length - 1;

              return (
                <React.Fragment key={ai}>
                  <div 
                    className={`flow-node flow-step-node ${isSelected ? 'focused-step' : ''}`}
                    onClick={() => setSelectedStepIdx(ai)}
                    style={{ cursor: 'pointer' }}
                    title={`Click to open Step ${ai + 1} in the Options Menu`}
                  >
                    <div className="flow-node-bullet step-bullet" style={{ borderColor: details.color, color: details.color }}>
                      {ai + 1}
                    </div>

                    <div className="flow-node-card" style={{ '--step-accent': details.color }}>
                      <div className="flow-card-header">
                        <div className="flow-card-type-row">
                          <span className="flow-type-icon">{details.icon}</span>
                          <span className="flow-type-label">{details.category}</span>
                          <span className="flow-step-num-pill">Step {ai + 1}</span>
                          {isSelected && (
                            <span className="flow-active-badge">● Editing in Options</span>
                          )}
                        </div>

                        <div className="flow-card-controls" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="flow-ctrl-btn"
                            disabled={isFirst}
                            onClick={() => moveAction(ai, -1)}
                            title="Move step earlier"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="flow-ctrl-btn"
                            disabled={isLast}
                            onClick={() => moveAction(ai, 1)}
                            title="Move step later"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            className="flow-ctrl-btn"
                            onClick={() => duplicateAction(ai)}
                            title="Duplicate this step"
                          >
                            ⎘
                          </button>
                          <button
                            type="button"
                            className="flow-ctrl-btn flow-delete-btn"
                            onClick={() => removeAction(ai)}
                            title="Remove this step"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="flow-card-body">
                        {details.renderContent()}
                      </div>
                    </div>
                  </div>

                  <div className="flow-connector">
                    <div className="flow-connector-line"></div>
                    <div className="flow-connector-pill">
                      <span className="flow-connector-arrow">↓</span>
                      <span>then</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="flow-empty-state">
              <div className="flow-empty-icon">⚡</div>
              <div className="flow-empty-title">No Actions Configured Yet</div>
              <p className="flow-empty-desc">
                When you press <strong>{keyName}</strong>, nothing will trigger. Add an action below or pick a preset to build your automated workflow!
              </p>
            </div>
          )}

          {/* ADD STEP NODE AT THE END OF THE FLOW */}
          <div className="flow-add-step-node">
            <div className="flow-add-header">
              <span className="flow-add-icon">➕</span>
              <span>Add Action Step to Pipeline</span>
            </div>
            <div className="flow-quick-add-group">
              <button 
                type="button" 
                className="flow-quick-btn keypress-btn"
                onClick={() => addActionWithType('keypress')}
              >
                ⌨️ Hotkey
              </button>
              <button 
                type="button" 
                className="flow-quick-btn mouse-btn"
                onClick={() => addActionWithType('mouse_click')}
              >
                🖱️ Mouse
              </button>
              <button 
                type="button" 
                className="flow-quick-btn text-btn"
                onClick={() => addActionWithType('text')}
              >
                🔤 Text
              </button>
              <button 
                type="button" 
                className="flow-quick-btn consumer-btn"
                onClick={() => addActionWithType('consumer')}
              >
                🎵 Media
              </button>
              <button 
                type="button" 
                className="flow-quick-btn delay-btn"
                onClick={() => addActionWithType('delay')}
              >
                ⏱️ Delay
              </button>
              <button 
                type="button" 
                className="flow-quick-btn launch-btn"
                onClick={() => addActionWithType('launch')}
              >
                🚀 Launch
              </button>
              <button 
                type="button" 
                className="flow-quick-btn url-btn"
                onClick={() => addActionWithType('url')}
              >
                🌐 Web URL
              </button>
              <button 
                type="button" 
                className="flow-quick-btn switch-btn"
                onClick={() => addActionWithType('profile_switch')}
              >
                🔄 Switch Layer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContextualOptionsMenu = () => {
    const actions = selectedMacro.actions || [];
    const hasActions = actions.length > 0;
    const isTriggerActive = selectedStepIdx === 'trigger' || !hasActions;
    const activeStep = hasActions && typeof selectedStepIdx === 'number' && selectedStepIdx < actions.length
      ? actions[selectedStepIdx]
      : null;

    if (isTriggerActive || !activeStep) {
      // TRIGGER / KEY OPTIONS VIEW
      return (
        <div className="options-view-container">
          <div className="options-view-header">
            <div className="options-header-top">
              <span className="options-header-tag">⚡ KEY TRIGGER OPTIONS</span>
              <span className="options-step-count">{actions.length} {actions.length === 1 ? 'Step' : 'Steps'}</span>
            </div>
            <h2 className="options-heading">{getSelectedKeyName()}</h2>
            <div className="options-sub-meta">
              Row {coords.row}, Col {coords.col} • Hardware Interrupt
            </div>
          </div>

          <div className="options-section">
            <div className="input-group">
              <label className="options-field-label">Macro Display Label</label>
              <input
                type="text"
                className="options-input"
                value={selectedMacro.label || ""}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. Photoshop Copy, Mute Mic..."
              />
              <span className="options-field-hint">Label displayed on the keycap in the matrix</span>
            </div>
          </div>

          <div className="options-section">
            <label className="options-field-label">Action Pipeline ({actions.length})</label>
            {hasActions ? (
              <div className="options-steps-summary-list">
                {actions.map((act, idx) => {
                  const details = getActionDisplayDetails(act);
                  return (
                    <div 
                      key={idx} 
                      className="options-step-chip-item"
                      onClick={() => setSelectedStepIdx(idx)}
                      title={`Configure Step ${idx + 1}`}
                    >
                      <div className="options-step-chip-left">
                        <span className="options-step-chip-num">#{idx + 1}</span>
                        <span className="options-step-chip-icon">{details.icon}</span>
                        <div className="options-step-chip-info">
                          <span className="options-step-chip-title">{details.category}</span>
                          <span className="options-step-chip-desc">{details.shortDesc}</span>
                        </div>
                      </div>
                      <span className="options-step-chip-arrow">➔</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="options-empty-card">
                <span>No action steps configured for this key yet.</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  Use the quick buttons below the flow tree on the left to add your first action!
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ACTIVE ACTION STEP OPTIONS VIEW
    const currentAction = activeStep;
    const ai = selectedStepIdx;
    const details = getActionDisplayDetails(currentAction);

    return (
      <div className="options-view-container">
        {/* Step Inspector Navigation & Header */}
        <div className="options-view-header">
          <div className="options-header-top">
            <div className="options-nav-pills">
              <button 
                type="button" 
                className="options-nav-btn"
                disabled={ai === 0}
                onClick={() => setSelectedStepIdx(ai - 1)}
                title="Go to previous step"
              >
                ◀ Prev
              </button>
              <span className="options-step-badge">
                Step {ai + 1} of {actions.length}
              </span>
              <button 
                type="button" 
                className="options-nav-btn"
                disabled={ai === actions.length - 1}
                onClick={() => setSelectedStepIdx(ai + 1)}
                title="Go to next step"
              >
                Next ▶
              </button>
            </div>

            <div className="options-actions-tools">
              <button 
                type="button" 
                className="options-tool-btn" 
                onClick={() => duplicateAction(ai)}
                title="Duplicate step"
              >
                ⎘
              </button>
              <button 
                type="button" 
                className="options-tool-btn delete-tool" 
                onClick={() => removeAction(ai)}
                title="Delete this step"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="options-title-row">
            <span className="options-type-icon">{details.icon}</span>
            <div>
              <h2 className="options-heading">{details.category}</h2>
              <div className="options-sub-meta">Configuring Step #{ai + 1} for {getSelectedKeyName()}</div>
            </div>
          </div>
        </div>

        {/* 1. Action Type Selector */}
        <div className="options-section">
          <div className="input-group">
            <label className="options-field-label">Action Type</label>
            <select
              className="options-select"
              value={currentAction.type}
              onChange={(e) => handleActionChange(ai, 'type', e.target.value)}
            >
              <option value="keypress">⌨️ Hotkeys & Key Combinations</option>
              <option value="mouse_click">🖱️ Mouse Click Action</option>
              <option value="text">🔤 Type Text String</option>
              <option value="consumer">🎵 Media & System Keys</option>
              <option value="delay">⏱️ Introduce Delay / Pause</option>
              <option value="launch">🚀 Launch Application</option>
              <option value="url">🌐 Open Web URL</option>
              <option value="profile_switch">🔄 Switch Profile Layer</option>
            </select>
          </div>
        </div>

        {/* 2. Contextual Parameters Based on Action Type */}
        <div className="options-section options-params-section">
          {currentAction.type === 'keypress' && (
            <div className="options-param-group">
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="options-field-label">Keys (Comma Separated)</label>
                  <span className="options-field-hint">e.g. CONTROL, C</span>
                </div>
                <input
                  type="text"
                  className="options-input"
                  value={currentAction.keys?.join(', ') || ""}
                  onChange={(e) => handleActionChange(ai, 'keys', e.target.value)}
                  placeholder="CONTROL, C"
                />
              </div>

              {/* Modifiers Bar */}
              <div className="options-sub-group">
                <label className="options-field-label">Modifier Keys</label>
                <div className="options-chips-row">
                  {[
                    { label: 'Ctrl', key: 'CONTROL' },
                    { label: 'Shift', key: 'SHIFT' },
                    { label: 'Alt', key: 'ALT' },
                    { label: 'Win/Cmd', key: 'GUI' }
                  ].map(m => {
                    const isActive = isKeyInAction(currentAction.keys, m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        className={`options-chip-toggle ${isActive ? 'active' : ''}`}
                        onClick={() => insertKeyToKeypress(ai, m.key)}
                      >
                        {isActive ? `✓ ${m.label}` : `+ ${m.label}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Function Keys Row (F1 – F12 & F13 – F24) */}
              <div className="options-sub-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="options-field-label">Function Keys (F1 – F12)</label>
                  <button
                    type="button"
                    className="options-sub-link-btn"
                    onClick={() => setOpenExtendedFn(prev => ({ ...prev, [ai]: !prev[ai] }))}
                  >
                    {openExtendedFn[ai] ? '▲ Hide F13–F24' : '▾ Show F13–F24'}
                  </button>
                </div>
                <div className="fn-keys-cluster-container">
                  <div className="fn-keys-cluster">
                    {['F1', 'F2', 'F3', 'F4'].map(fk => {
                      const isActive = isKeyInAction(currentAction.keys, fk);
                      return (
                        <button
                          key={fk}
                          type="button"
                          className={`options-fn-btn ${isActive ? 'active' : ''}`}
                          onClick={() => insertKeyToKeypress(ai, fk)}
                          title={`Toggle ${fk}`}
                        >
                          {fk}
                        </button>
                      );
                    })}
                  </div>
                  <div className="fn-keys-cluster">
                    {['F5', 'F6', 'F7', 'F8'].map(fk => {
                      const isActive = isKeyInAction(currentAction.keys, fk);
                      return (
                        <button
                          key={fk}
                          type="button"
                          className={`options-fn-btn ${isActive ? 'active' : ''}`}
                          onClick={() => insertKeyToKeypress(ai, fk)}
                          title={`Toggle ${fk}`}
                        >
                          {fk}
                        </button>
                      );
                    })}
                  </div>
                  <div className="fn-keys-cluster">
                    {['F9', 'F10', 'F11', 'F12'].map(fk => {
                      const isActive = isKeyInAction(currentAction.keys, fk);
                      return (
                        <button
                          key={fk}
                          type="button"
                          className={`options-fn-btn ${isActive ? 'active' : ''}`}
                          onClick={() => insertKeyToKeypress(ai, fk)}
                          title={`Toggle ${fk}`}
                        >
                          {fk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {openExtendedFn[ai] && (
                  <div className="fn-keys-extended-grid" style={{ marginTop: '0.4rem' }}>
                    {['F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24'].map(fk => {
                      const isActive = isKeyInAction(currentAction.keys, fk);
                      return (
                        <button
                          key={fk}
                          type="button"
                          className={`options-fn-btn extended ${isActive ? 'active' : ''}`}
                          onClick={() => insertKeyToKeypress(ai, fk)}
                          title={`Toggle ${fk}`}
                        >
                          {fk}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Common Functional Keys */}
              <div className="options-sub-group">
                <label className="options-field-label">Quick Navigation & Control</label>
                <div className="options-chips-row">
                  {[
                    { label: 'Enter ↵', key: 'ENTER' },
                    { label: 'Tab ⇥', key: 'TAB' },
                    { label: 'Esc', key: 'ESCAPE' },
                    { label: 'Backspace ⌫', key: 'BACKSPACE' },
                    { label: 'Space ␣', key: 'SPACE' },
                    { label: 'Delete ⌦', key: 'DELETE' },
                    { label: 'Home', key: 'HOME' },
                    { label: 'End', key: 'END' },
                    { label: 'PgUp', key: 'PAGE_UP' },
                    { label: 'PgDn', key: 'PAGE_DOWN' },
                    { label: '↑ Up', key: 'UP_ARROW' },
                    { label: '↓ Down', key: 'DOWN_ARROW' },
                    { label: '← Left', key: 'LEFT_ARROW' },
                    { label: '→ Right', key: 'RIGHT_ARROW' }
                  ].map(k => {
                    const isActive = isKeyInAction(currentAction.keys, k.key);
                    return (
                      <button
                        key={k.key}
                        type="button"
                        className={`options-key-chip ${isActive ? 'active' : ''}`}
                        onClick={() => insertKeyToKeypress(ai, k.key)}
                        title={`Toggle ${k.key}`}
                      >
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Standard Keyboard Palette Collapsible Drawer */}
              <div className="options-sub-group">
                <button
                  type="button"
                  className={`options-drawer-toggle ${openKeyboardDrawer[ai] ? 'active' : ''}`}
                  onClick={() => setOpenKeyboardDrawer(prev => ({ ...prev, [ai]: !prev[ai] }))}
                >
                  <span>⌨️ Visual Standard Keyboard Palette</span>
                  <span>{openKeyboardDrawer[ai] ? '▲ Hide Keyboard' : '▾ Open Visual Keyboard'}</span>
                </button>

                {openKeyboardDrawer[ai] && (
                  <div className="virtual-keyboard-drawer">
                    <div className="virtual-keyboard-tabs">
                      <button
                        type="button"
                        className={`virtual-tab-btn ${keyboardClusterTab === 'full' ? 'active' : ''}`}
                        onClick={() => setKeyboardClusterTab('full')}
                      >
                        Standard 60%/TKL
                      </button>
                      <button
                        type="button"
                        className={`virtual-tab-btn ${keyboardClusterTab === 'nav' ? 'active' : ''}`}
                        onClick={() => setKeyboardClusterTab('nav')}
                      >
                        Navigation Cluster
                      </button>
                      <button
                        type="button"
                        className={`virtual-tab-btn ${keyboardClusterTab === 'numpad' ? 'active' : ''}`}
                        onClick={() => setKeyboardClusterTab('numpad')}
                      >
                        Numpad
                      </button>
                    </div>

                    {keyboardClusterTab === 'full' && (
                      <div className="virtual-kb-scroll-wrap">
                        <div className="virtual-kb-rows">
                          {VIRTUAL_KB_ROWS.map((row, rIdx) => (
                            <div key={rIdx} className="virtual-kb-row">
                              {row.map(kItem => {
                                const active = isKeyInAction(currentAction.keys, kItem.key);
                                const extraCls = kItem.space ? 'key-space' : kItem.wider ? 'key-wider' : kItem.wide ? 'key-wide' : '';
                                return (
                                  <button
                                    key={kItem.key + rIdx}
                                    type="button"
                                    className={`virtual-kb-key ${extraCls} ${active ? 'active' : ''}`}
                                    onClick={() => insertKeyToKeypress(ai, kItem.key)}
                                    title={`Toggle ${kItem.key}`}
                                  >
                                    {kItem.label}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {keyboardClusterTab === 'nav' && (
                      <div className="virtual-nav-grid">
                        {VIRTUAL_NAV_KEYS.map(kItem => {
                          const active = isKeyInAction(currentAction.keys, kItem.key);
                          return (
                            <button
                              key={kItem.key}
                              type="button"
                              className={`virtual-kb-key ${active ? 'active' : ''}`}
                              onClick={() => insertKeyToKeypress(ai, kItem.key)}
                              title={`Toggle ${kItem.key}`}
                              style={{ height: '36px' }}
                            >
                              {kItem.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {keyboardClusterTab === 'numpad' && (
                      <div className="quick-numpad-grid">
                        {[
                          { label: 'NumLk', key: 'KEYPAD_NUMLOCK' },
                          { label: '/', key: 'KEYPAD_FORWARD_SLASH' },
                          { label: '*', key: 'KEYPAD_ASTERISK' },
                          { label: '-', key: 'KEYPAD_MINUS' },
                          { label: '7', key: 'KEYPAD_SEVEN' },
                          { label: '8', key: 'KEYPAD_EIGHT' },
                          { label: '9', key: 'KEYPAD_NINE' },
                          { label: '+', key: 'KEYPAD_PLUS' },
                          { label: '4', key: 'KEYPAD_FOUR' },
                          { label: '5', key: 'KEYPAD_FIVE' },
                          { label: '6', key: 'KEYPAD_SIX' },
                          { label: '↵ Enter', key: 'KEYPAD_ENTER' },
                          { label: '1', key: 'KEYPAD_ONE' },
                          { label: '2', key: 'KEYPAD_TWO' },
                          { label: '3', key: 'KEYPAD_THREE' },
                          { label: '=', key: 'KEYPAD_EQUALS' },
                          { label: '0', key: 'KEYPAD_ZERO' },
                          { label: '.', key: 'KEYPAD_PERIOD' }
                        ].map(np => {
                          const active = isKeyInAction(currentAction.keys, np.key);
                          return (
                            <button
                              key={np.key}
                              type="button"
                              className={`numpad-key-btn ${active ? 'active' : ''}`}
                              onClick={() => insertKeyToKeypress(ai, np.key)}
                              title={`Toggle ${np.key}`}
                            >
                              {np.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Numpad Collapsible Drawer */}
              <div className="options-sub-group">
                <button
                  type="button"
                  className={`options-drawer-toggle ${openNumpad[ai] ? 'active' : ''}`}
                  onClick={() => setOpenNumpad(prev => ({ ...prev, [ai]: !prev[ai] }))}
                >
                  <span>🔢 Numeric Numpad Pad</span>
                  <span>{openNumpad[ai] ? '▲ Hide' : '▾ Show'}</span>
                </button>

                {openNumpad[ai] && (
                  <div className="quick-numpad-grid" style={{ marginTop: '0.6rem' }}>
                    {[
                      { label: '7', key: 'NUMPAD_7' },
                      { label: '8', key: 'NUMPAD_8' },
                      { label: '9', key: 'NUMPAD_9' },
                      { label: '/', key: 'NUMPAD_DIVIDE' },
                      { label: '4', key: 'NUMPAD_4' },
                      { label: '5', key: 'NUMPAD_5' },
                      { label: '6', key: 'NUMPAD_6' },
                      { label: '*', key: 'NUMPAD_MULTIPLY' },
                      { label: '1', key: 'NUMPAD_1' },
                      { label: '2', key: 'NUMPAD_2' },
                      { label: '3', key: 'NUMPAD_3' },
                      { label: '-', key: 'NUMPAD_MINUS' },
                      { label: '0', key: 'NUMPAD_0' },
                      { label: '.', key: 'NUMPAD_PERIOD' },
                      { label: '+', key: 'NUMPAD_PLUS' },
                      { label: '↵ Enter', key: 'NUMPAD_ENTER' },
                      { label: 'NumLk', key: 'NUMPAD_LOCK' }
                    ].map(np => {
                      const active = isKeyInAction(currentAction.keys, np.key);
                      return (
                        <button
                          key={np.key}
                          type="button"
                          className={`numpad-key-btn ${active ? 'active' : ''}`}
                          onClick={() => insertKeyToKeypress(ai, np.key)}
                          title={`Toggle ${np.key}`}
                        >
                          {np.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentAction.type === 'mouse_click' && (
            <div className="options-param-group">
              <div className="input-group">
                <label className="options-field-label">Target Button</label>
                <div className="options-segmented-bar">
                  {['LEFT', 'RIGHT', 'MIDDLE'].map(btn => (
                    <button
                      key={btn}
                      type="button"
                      className={`options-segment-btn ${(currentAction.button || 'LEFT') === btn ? 'active' : ''}`}
                      onClick={() => handleActionChange(ai, 'button', btn)}
                    >
                      {btn === 'LEFT' ? 'Left Click' : btn === 'RIGHT' ? 'Right Click' : 'Middle / Wheel'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="options-field-label">Click Type</label>
                <div className="options-segmented-bar">
                  {[
                    { label: 'Single Click', val: 'click' },
                    { label: 'Double Click', val: 'double_click' },
                    { label: 'Hold / Drag', val: 'hold' },
                    { label: 'Release', val: 'release' }
                  ].map(mode => (
                    <button
                      key={mode.val}
                      type="button"
                      className={`options-segment-btn ${(currentAction.click_type || 'click') === mode.val ? 'active' : ''}`}
                      onClick={() => handleActionChange(ai, 'click_type', mode.val)}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="options-field-label">Modifier Keys</label>
                <div className="options-chips-row">
                  {[
                    { label: 'Ctrl', key: 'CONTROL' },
                    { label: 'Shift', key: 'SHIFT' },
                    { label: 'Alt', key: 'ALT' },
                    { label: 'Win/Cmd', key: 'GUI' }
                  ].map(m => {
                    const isActive = (currentAction.modifiers || []).includes(m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        className={`options-chip-toggle ${isActive ? 'active' : ''}`}
                        onClick={() => toggleMouseModifier(ai, m.key)}
                      >
                        {isActive ? `✓ ${m.label}` : `+ ${m.label}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentAction.type === 'text' && (
            <div className="options-param-group">
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="options-field-label">Text to Type</label>
                  <span className="options-field-hint">{(currentAction.text || '').length} characters</span>
                </div>
                <textarea
                  className="options-textarea"
                  rows={4}
                  value={currentAction.text || ""}
                  onChange={(e) => handleActionChange(ai, 'text', e.target.value)}
                  placeholder="Enter characters, code snippets, or text to type automatically..."
                />
                <span className="options-field-hint">Simulates typing character-by-character on hardware trigger</span>
              </div>
            </div>
          )}

          {currentAction.type === 'consumer' && (
            <div className="options-param-group">
              <label className="options-field-label">Media / System Command</label>
              <div className="options-media-grid">
                {[
                  { label: 'Volume Up', key: 'VOLUME_INCREMENT', icon: '🔊' },
                  { label: 'Volume Down', key: 'VOLUME_DECREMENT', icon: '🔉' },
                  { label: 'Mute Audio', key: 'MUTE', icon: '🔇' },
                  { label: 'Play / Pause', key: 'PLAY_PAUSE', icon: '⏯️' },
                  { label: 'Next Track', key: 'SCAN_NEXT_TRACK', icon: '⏭️' },
                  { label: 'Previous Track', key: 'SCAN_PREVIOUS_TRACK', icon: '⏮️' }
                ].map(cmd => (
                  <button
                    key={cmd.key}
                    type="button"
                    className={`options-media-btn ${(currentAction.key || 'PLAY_PAUSE') === cmd.key ? 'active' : ''}`}
                    onClick={() => handleActionChange(ai, 'key', cmd.key)}
                  >
                    <span className="options-media-icon">{cmd.icon}</span>
                    <span className="options-media-label">{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentAction.type === 'delay' && (
            <div className="options-param-group">
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="options-field-label">Delay Duration</label>
                  <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>
                    {currentAction.duration || 0.2}s ({Math.round((currentAction.duration || 0.2) * 1000)}ms)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="2.0"
                  step="0.05"
                  value={currentAction.duration || 0.2}
                  onChange={(e) => handleActionChange(ai, 'duration', parseFloat(e.target.value) || 0.2)}
                  className="options-range-slider"
                />
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  max="10.0"
                  className="options-input"
                  value={currentAction.duration || 0.2}
                  onChange={(e) => handleActionChange(ai, 'duration', parseFloat(e.target.value) || 0.2)}
                />
              </div>

              <div className="options-sub-group">
                <label className="options-field-label">Quick Presets</label>
                <div className="options-chips-row">
                  {[0.05, 0.1, 0.25, 0.5, 1.0, 2.0].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      className={`options-chip-toggle ${(currentAction.duration || 0.2) === sec ? 'active' : ''}`}
                      onClick={() => handleActionChange(ai, 'duration', sec)}
                    >
                      {sec < 1 ? `${Math.round(sec * 1000)}ms` : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentAction.type === 'launch' && (
            <div className="options-param-group">
              <div className="input-group">
                <label className="options-field-label">Application Executable or Command</label>
                <input
                  type="text"
                  className="options-input"
                  value={currentAction.app || ""}
                  onChange={(e) => handleActionChange(ai, 'app', e.target.value)}
                  placeholder="e.g. code, chrome, calc, discord"
                />
              </div>

              <div className="options-sub-group">
                <label className="options-field-label">Popular App Presets</label>
                <div className="options-chips-row">
                  {[
                    { label: 'VS Code', app: 'code' },
                    { label: 'Google Chrome', app: 'chrome' },
                    { label: 'Terminal / CMD', app: 'cmd' },
                    { label: 'Calculator', app: 'calc' },
                    { label: 'Discord', app: 'discord' },
                    { label: 'OBS Studio', app: 'obs64' },
                    { label: 'Spotify', app: 'spotify' },
                    { label: 'Notepad', app: 'notepad' }
                  ].map(p => (
                    <button
                      key={p.app}
                      type="button"
                      className={`options-chip-toggle ${(currentAction.app || '') === p.app ? 'active' : ''}`}
                      onClick={() => handleActionChange(ai, 'app', p.app)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentAction.type === 'url' && (
            <div className="options-param-group">
              <div className="input-group">
                <label className="options-field-label">Web URL Destination</label>
                <input
                  type="text"
                  className="options-input"
                  value={currentAction.url || ""}
                  onChange={(e) => handleActionChange(ai, 'url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              {currentAction.url && (
                <a 
                  href={currentAction.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="options-test-url-btn"
                >
                  🔗 Test Open URL ↗
                </a>
              )}
            </div>
          )}

          {currentAction.type === 'profile_switch' && (
            <div className="options-param-group">
              <div className="profile-switch-info-box" style={{ margin: 0 }}>
                <span>🔄 <strong>Layer Switcher:</strong> When this action triggers, the firmware immediately cycles to the next active profile layer and changes the status indicator NeoPixel LED color.</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Macro Label Footer */}
        <div className="options-footer-label-box">
          <div className="input-group" style={{ margin: 0 }}>
            <label className="options-field-label">Key Macro Label</label>
            <input
              type="text"
              className="options-input"
              value={selectedMacro.label || ""}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Copy, Play, Undo"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderPreviewGrid = () => {
    const preset = PRESETS[galleryModel]?.[selectedPresetIdx];
    if (!preset) return <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Select a preset to preview</div>;

    const presetMacros = preset.macros;
    
    const is1x3 = galleryModel === '1x3';
    const is3x3 = galleryModel === '3x3';
    const is3x3Pro = galleryModel === '3x3_pro';
    const is4x2 = galleryModel === '4x2';
    const is6x2 = galleryModel === '6x2_encoder' || galleryModel === '6x2';
    const is5x3 = galleryModel === '5x3_2encoders' || galleryModel === '5x3';
    
    const getGridClass = () => {
      if (is3x3Pro) return 'grid-3x3-pro';
      if (is4x2) return 'grid-4x2';
      if (is6x2) return 'grid-6x2';
      if (is1x3) return 'grid-1x3';
      if (is5x3) return 'grid-5x3_2encoders';
      return 'grid-3x3';
    };

    const renderPreviewKey = (i) => {
      const coords = getKeyCoordinates(galleryModel, i);
      const m = presetMacros.find(macro => macro.row === coords.row && macro.col === coords.col);
      
      let displayNum = i + 1;
      let extraClass = '';
      
      if (galleryModel === '3x3_pro') {
        if (i === 9) {
          displayNum = 'SW';
          extraClass = 'profile-btn';
        }
      } else if (galleryModel === '6x2_encoder' || galleryModel === '6x2') {
        if (i === 12) {
          displayNum = 'ENC';
          extraClass = 'encoder-key';
        } else if (i === 13) {
          displayNum = '↺ CCW';
          extraClass = 'encoder-ccw';
        } else if (i === 14) {
          displayNum = '↻ CW';
          extraClass = 'encoder-cw';
        } else {
          displayNum = i + 1;
        }
      } else if (galleryModel === '5x3_2encoders' || galleryModel === '5x3') {
        if (i === 15) {
          displayNum = 'ENC1';
          extraClass = 'encoder-key';
        } else if (i === 16) {
          displayNum = 'ENC2';
          extraClass = 'encoder-key';
        } else if (i === 17) {
          displayNum = 'E1 ↺';
          extraClass = 'encoder-ccw';
        } else if (i === 18) {
          displayNum = 'E1 ↻';
          extraClass = 'encoder-cw';
        } else if (i === 19) {
          displayNum = 'E2 ↺';
          extraClass = 'encoder-ccw';
        } else if (i === 20) {
          displayNum = 'E2 ↻';
          extraClass = 'encoder-cw';
        }
      }

      const isProfileSwitch = m?.actions?.some(a => a.type === 'profile_switch' || a.type === 'layer_switch');
      const is3x3ProSwitch = galleryModel === '3x3_pro' && i === 9;
      const mouseAction = m?.actions?.find(a => a.type === 'mouse_click' || a.type === 'mouse');

      let iconChar = displayNum;
      let labelText = isProfileSwitch || is3x3ProSwitch ? 'Switch Layer' : 'Empty';

      if (m?.label) {
        labelText = m.label;
        iconChar = mouseAction ? '🖱️' : m.label[0];
      } else if (mouseAction) {
        iconChar = '🖱️';
        let btnLabel = mouseAction.button === 'RIGHT' ? 'R-Click' : mouseAction.button === 'MIDDLE' ? 'M-Click' : mouseAction.button === 'BACK' ? 'Back' : mouseAction.button === 'FORWARD' ? 'Fwd' : mouseAction.click_type === 'double_click' ? '2x-Click' : mouseAction.click_type === 'hold' ? 'Drag' : 'L-Click';
        if (mouseAction.modifiers && mouseAction.modifiers.length > 0) {
          const modPrefix = mouseAction.modifiers.map(mod => mod === 'CONTROL' ? 'Ctrl' : mod === 'SHIFT' ? 'Shift' : mod === 'ALT' ? 'Alt' : 'Win').join('+');
          labelText = `${modPrefix}+${btnLabel}`;
        } else {
          labelText = btnLabel;
        }
      } else if (isProfileSwitch || is3x3ProSwitch) {
        iconChar = '🔄';
      }

      const hasActions = m && Array.isArray(m.actions) && m.actions.length > 0;
      const isConfigured = Boolean(m?.label || hasActions || isProfileSwitch || is3x3ProSwitch);

      return (
        <div key={i} className={`key preview-key ${isConfigured ? 'is-configured' : 'is-unconfigured'} ${extraClass} ${isProfileSwitch || is3x3ProSwitch ? 'profile-btn' : ''}`} style={{ cursor: 'default' }}>
          <div className="keycap-dish">
            <div className="key-header-meta">
              <span className="key-number-tag">{displayNum}</span>
              <span className={`key-status-dot ${isConfigured ? 'active' : ''}`} />
            </div>
            <span className="key-icon" style={{ fontSize: '1.2rem' }}>{iconChar}</span>
            <span className="key-label" style={{ fontSize: '0.65rem' }}>{labelText}</span>
          </div>
        </div>
      );
    };

    if (is3x3Pro) {
      return (
        <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
          {[0, 1, 2].map(i => renderPreviewKey(i))}
          {renderPreviewKey(9)}
          {[3, 4, 5].map(i => renderPreviewKey(i))}
          <div className="key-placeholder"></div>
          {[6, 7, 8].map(i => renderPreviewKey(i))}
          <div className="key-placeholder"></div>
        </div>
      );
    }

    if (is4x2) {
      return (
        <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => renderPreviewKey(i))}
        </div>
      );
    }

    if (is6x2) {
      return (
        <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
          {[0, 1, 2, 3, 4, 5].map(i => renderPreviewKey(i))}
          {[6, 7, 8, 9, 10, 11].map(i => renderPreviewKey(i))}
          <div className="key-placeholder"></div>
          <div className="key-placeholder"></div>
          <div className="key-placeholder"></div>
          {renderPreviewKey(12)}
          {renderPreviewKey(13)}
          {renderPreviewKey(14)}
        </div>
      );
    }

    if (is5x3) {
      return (
        <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
          {[0, 1, 2, 3, 4].map(i => renderPreviewKey(i))}
          {renderPreviewKey(15)}
          {renderPreviewKey(17)}
          {renderPreviewKey(18)}
          
          {[5, 6, 7, 8, 9].map(i => renderPreviewKey(i))}
          {renderPreviewKey(16)}
          {renderPreviewKey(19)}
          {renderPreviewKey(20)}
          
          {[10, 11, 12, 13, 14].map(i => renderPreviewKey(i))}
          <div className="key-placeholder"></div>
          <div className="key-placeholder"></div>
          <div className="key-placeholder"></div>
        </div>
      );
    }

    return (
      <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
        {[...Array(is1x3 ? 3 : 9)].map((_, i) => renderPreviewKey(i))}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
            </svg>
          </div>
          <div className="brand-titles">
            <div className="brand-name">
              <span>PICO PAD</span>
              <span className="brand-badge">STUDIO</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="profile-manager">
            <span className="profile-manager-label">Layer:</span>
            <select value={activeProfile} onChange={(e) => switchProfile(e.target.value)} className="profile-select">
              {Object.keys(profiles).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="profile-btn-group">
              <button className="icon-btn" onClick={createProfile} title="Create New Profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <button className="icon-btn" onClick={saveAsProfile} title="Duplicate Profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </button>
              <button className="icon-btn delete" onClick={() => deleteProfile(activeProfile)} title="Delete Profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>

          <div className="header-divider" />

          <button className="header-pill-btn" onClick={openGallery} title="Open mappings presets gallery">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Presets</span>
          </button>
          <button className="header-pill-btn" onClick={() => setShowHelp(!showHelp)} title="Keycodes Reference & Help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Reference</span>
          </button>
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          
          <div className={`status-badge ${status === 'Connected' ? 'connected' : ''}`}>
            <span className="status-indicator-dot" />
            <span>{status}</span>
          </div>

          <button className={`btn ${dirHandle ? 'btn-save' : 'btn-primary'}`} onClick={dirHandle ? saveConfig : connectKeyboard}>
            {dirHandle ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Save Config</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.1"/></svg>
                <span>Connect</span>
              </>
            )}
          </button>
        </div>
      </header>

      {showHelp ? (
        <div className="help-view">
          <div className="help-card">
            <div className="help-header">
              <div>
                <h2>Configurator Help & Standard Keycodes Reference</h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Complete reference for all keys on standard keyboards with backward compatibility guide
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowHelp(false)}>Close Help</button>
            </div>

            {/* Backward Compatibility Guarantee Banner */}
            <div className="help-compatibility-banner">
              <span className="help-compat-icon">🛡️</span>
              <div className="help-compat-text">
                <h4>100% Backward & Forward Compatible</h4>
                <p>
                  Both this web configurator and the CircuitPython firmware (<code style={{ color: '#10b981' }}>macros.py</code>) accept standard Adafruit HID names, short aliases (e.g., <strong>CTRL</strong>, <strong>ESC</strong>, <strong>WIN</strong>, <strong>F1–F24</strong>), digits (<strong>0–9</strong>), direct symbols (<strong>-</strong>, <strong>=</strong>, <strong>[</strong>, <strong>]</strong>, etc.), and case-insensitive strings. Existing profiles and JSON files continue to work without any modifications.
                </p>
              </div>
            </div>

            <div className="help-grid">
              <section className="help-section">
                <h3>🚀 Quick Start</h3>
                <ol>
                  <li>Click <b>Connect</b> and select your <b>CIRCUITPY</b> drive root folder.</li>
                  <li>Click any key on the macro pad grid to view or customize its action sequence.</li>
                  <li>Add action steps: <b>Hotkey</b> (keypress), <b>Mouse</b>, <b>Text</b>, <b>Media</b>, <b>Delay</b>, <b>App Launch</b>, or <b>Layer Switch</b>.</li>
                  <li>Click <b>Save Config</b> to write <code style={{ fontSize: '0.75rem' }}>macros.json</code> and <code style={{ fontSize: '0.75rem' }}>settings.toml</code> directly to your keyboard.</li>
                </ol>
              </section>

              <section className="help-section">
                <h3>💡 Common Shortcuts & Function Key Combos</h3>
                <ul className="help-list">
                  <li><b>Copy / Paste:</b> <code>CONTROL, C</code> / <code>CONTROL, V</code></li>
                  <li><b>Close Window:</b> <code>ALT, F4</code></li>
                  <li><b>Refresh / Dev Tools:</b> <code>F5</code> / <code>F12</code></li>
                  <li><b>Toggle Fullscreen:</b> <code>F11</code></li>
                  <li><b>Task Manager:</b> <code>CONTROL, SHIFT, ESCAPE</code></li>
                  <li><b>Lock PC / Run:</b> <code>GUI, L</code> / <code>GUI, R</code></li>
                </ul>
              </section>

              <section className="help-section" style={{ gridColumn: 'span 2' }}>
                <h3>🖥️ Opening Applications</h3>
                <p>You can chain multiple actions to launch apps or run system commands:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="example-box" style={{ margin: 0 }}>
                    <strong>Example: Open VS Code</strong>
                    <ol>
                      <li>Action 1 (Hotkey): <code>GUI</code></li>
                      <li>Action 2 (Text): <code>code</code></li>
                      <li>Action 3 (Hotkey): <code>ENTER</code></li>
                    </ol>
                  </div>
                  <div className="example-box" style={{ margin: 0 }}>
                    <strong>Example: Open Notepad</strong>
                    <ol>
                      <li>Action 1 (Hotkey): <code>GUI</code></li>
                      <li>Action 2 (Text): <code>notepad</code></li>
                      <li>Action 3 (Hotkey): <code>ENTER</code></li>
                    </ol>
                  </div>
                </div>
              </section>
            </div>

            {/* Comprehensive Standard Keyboard Keycodes Guide */}
            <div className="help-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3>⌨️ Complete Standard Keyboard Keycodes Directory</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Click any card to copy its keycode to clipboard
                </span>
              </div>
              <p>
                Use these exact keycodes or their aliases in your Hotkey action's <strong>Keys</strong> field (comma separated, e.g. <code>ALT, F4</code> or <code>CONTROL, SHIFT, ESCAPE</code>):
              </p>

              {/* Search Bar */}
              <div className="help-search-bar">
                <span className="help-search-icon">🔍</span>
                <input
                  type="text"
                  className="help-search-input"
                  placeholder="Filter keycodes, aliases, or functions (e.g. F1, Enter, PrintScreen, Alt, Arrow, Numpad)..."
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                />
                {helpSearchQuery && (
                  <button
                    type="button"
                    className="help-search-clear"
                    onClick={() => setHelpSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="help-category-tabs">
                {['All', ...STANDARD_KEYCODES.map(c => c.category)].map(catName => (
                  <button
                    key={catName}
                    type="button"
                    className={`help-cat-pill ${helpSelectedCategory === catName ? 'active' : ''}`}
                    onClick={() => setHelpSelectedCategory(catName)}
                  >
                    {catName}
                  </button>
                ))}
              </div>

              {/* Keycodes Catalog Cards */}
              <div className="help-keycodes-catalog">
                {(() => {
                  const q = helpSearchQuery.trim().toLowerCase();
                  const filteredCats = STANDARD_KEYCODES.map(cat => {
                    if (helpSelectedCategory !== 'All' && cat.category !== helpSelectedCategory) {
                      return null;
                    }
                    const matched = cat.keys.filter(k => {
                      if (!q) return true;
                      return (
                        k.name.toLowerCase().includes(q) ||
                        k.desc.toLowerCase().includes(q) ||
                        (k.aliases && k.aliases.some(a => a.toLowerCase().includes(q))) ||
                        cat.category.toLowerCase().includes(q)
                      );
                    });
                    if (matched.length === 0) return null;
                    return { ...cat, keys: matched };
                  }).filter(Boolean);

                  if (filteredCats.length === 0) {
                    return (
                      <div className="help-empty-search">
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔍</div>
                        <strong>No keycodes match "{helpSearchQuery}"</strong>
                        <p style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>
                          Try searching for function keys like <code>F1</code>, modifiers like <code>CONTROL</code>, or arrows like <code>UP</code>.
                        </p>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ marginTop: '0.8rem' }}
                          onClick={() => { setHelpSearchQuery(''); setHelpSelectedCategory('All'); }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    );
                  }

                  return filteredCats.map(cat => (
                    <div key={cat.category} className="help-category-card">
                      <div className="help-category-card-header">
                        <div className="help-cat-title">
                          <span>{cat.icon}</span>
                          <span>{cat.category}</span>
                          <span style={{ fontSize: '0.72rem', background: 'var(--border-color)', color: 'var(--text-dim)', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                            {cat.keys.length} keys
                          </span>
                        </div>
                        <span className="help-cat-desc">{cat.description}</span>
                      </div>

                      <div className="help-keys-grid">
                        {cat.keys.map(kItem => {
                          const isCopied = copiedKeycode === kItem.name;
                          return (
                            <div
                              key={kItem.name}
                              className={`help-key-badge-card ${isCopied ? 'copied' : ''}`}
                              onClick={() => copyKeycodeToClipboard(kItem.name)}
                              title={`Click to copy "${kItem.name}" to clipboard`}
                            >
                              <div className="help-key-top-row">
                                <span className="help-key-name">{kItem.name}</span>
                                <span className="help-copy-btn">
                                  {isCopied ? '✓ Copied' : '📋 Copy'}
                                </span>
                              </div>
                              <span className="help-key-desc">{kItem.desc}</span>
                              {kItem.aliases && kItem.aliases.length > 0 && (
                                <div className="help-key-aliases">
                                  <span className="help-alias-label">Aliases:</span>
                                  {kItem.aliases.map(al => (
                                    <span key={al} className="help-alias-tag">{al}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-layout">
          <section className="keyboard-section">
            <div className="macropad-chassis">
              <div className="chassis-header">
                <div className="chassis-badge">
                  <span className="chassis-indicator"></span>
                  <span className="chassis-model-name">
                    {settings.board_model ? settings.board_model.toUpperCase().replace('_', ' ') : '3X3'} MATRIX
                  </span>
                </div>
                <div className="chassis-spec">
                  <span className="spec-item">CIRCUITPY HID</span>
                  <span className="spec-dot">•</span>
                  <span className="spec-item">{settings.debounce || 0.05}s Debounce</span>
                </div>
              </div>

              <div className="keyboard-hardware-area">
                <div className={`grid ${is3x3Pro ? 'grid-3x3-pro' : is4x2 ? 'grid-4x2' : is6x2 ? 'grid-6x2' : is1x3 ? 'grid-1x3' : is5x3_2encoders ? 'grid-5x3_2encoders' : 'grid-3x3'}`}>
                  {is3x3Pro ? (
                    <>
                      {/* Row 1 */}
                      {[0, 1, 2].map(i => renderKey(i))}
                      {renderKey(9)}
                      
                      {/* Row 2 */}
                      {[3, 4, 5].map(i => renderKey(i))}
                      <div className="key-placeholder"></div>
                      
                      {/* Row 3 */}
                      {[6, 7, 8].map(i => renderKey(i))}
                      <div className="key-placeholder"></div>
                    </>
                  ) : is4x2 ? (
                    [0, 1, 2, 3, 4, 5, 6, 7].map(i => renderKey(i))
                  ) : is6x2 ? (
                    <>
                      {/* Row 1: Keys 1 to 6 */}
                      {[0, 1, 2, 3, 4, 5].map(i => renderKey(i))}
                      
                      {/* Row 2: Keys 7 to 12 */}
                      {[6, 7, 8, 9, 10, 11].map(i => renderKey(i))}
                      
                      {/* Row 3: Encoder Controls */}
                      <div className="key-placeholder"></div>
                      <div className="key-placeholder"></div>
                      <div className="key-placeholder"></div>
                      {renderKey(12)}
                      {renderKey(13)}
                      {renderKey(14)}
                    </>
                  ) : is5x3_2encoders ? (
                    <>
                      {/* Row 1 */}
                      {[0, 1, 2, 3, 4].map(i => renderKey(i))}
                      {renderKey(15)}
                      {renderKey(17)}
                      {renderKey(18)}
                      
                      {/* Row 2 */}
                      {[5, 6, 7, 8, 9].map(i => renderKey(i))}
                      {renderKey(16)}
                      {renderKey(19)}
                      {renderKey(20)}
                      
                      {/* Row 3 */}
                      {[10, 11, 12, 13, 14].map(i => renderKey(i))}
                      <div className="key-placeholder"></div>
                      <div className="key-placeholder"></div>
                      <div className="key-placeholder"></div>
                    </>
                  ) : (
                    [...Array(is1x3 ? 3 : 9)].map((_, i) => renderKey(i))
                  )}
                </div>
              </div>

              <div className="chassis-footer">
                <span className="keyboard-hint-text">
                  {is3x3Pro 
                    ? "Click keys 1-9 or the SW profile button to edit."
                    : is4x2
                    ? "Click keys 1-8 to edit macro sequences for your 4x2 matrix."
                    : is6x2
                    ? "Click a key or dial action to edit. ENC is the encoder switch, and ↺/↻ are rotation actions."
                    : is5x3_2encoders
                    ? "Click a key or dial action to edit. ENC1/2 are encoder switches, and E1/E2 ↺/↻ are rotation actions."
                    : "Click any key to inspect or customize its macro sequence"}
                </span>
                <div className="chassis-selected-key-pill">
                  <span className="pill-dot"></span>
                  <span>Active: <strong>{getSelectedKeyName()}</strong></span>
                </div>
              </div>
            </div>

            {/* Visual Action Flow Tree */}
            {renderActionFlowTree()}
          </section>

          <aside className="editor-panel options-inspector-panel">
            {/* 1. Sleek Hardware Board Config Accordion */}
            <div className="board-config-accordion">
              <button 
                type="button" 
                className="board-config-accordion-toggle"
                onClick={() => setBoardConfigOpen(!boardConfigOpen)}
                title="Toggle Keyboard Hardware Settings"
              >
                <div className="board-config-toggle-left">
                  <span className="board-config-icon">⌨️</span>
                  <div>
                    <div className="board-config-title">Hardware Config</div>
                    <div className="board-config-sub">
                      {settings.board_model || '3x3'} • {settings.debounce || 0.05}s debounce
                    </div>
                  </div>
                </div>
                <span className="accordion-chevron">{boardConfigOpen ? '▲' : '▾'}</span>
              </button>

              {boardConfigOpen && (
                <div className="board-config-expanded-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div className="input-group" style={{ minWidth: 0 }}>
                      <label>Board Model</label>
                      <select
                        value={settings.board_model || '3x3'}
                        onChange={(e) => {
                          const modelVal = e.target.value;
                          const newSettings = { ...settings, board_model: modelVal };
                          setSettings(newSettings);
                          updateCurrentProfile(null, newSettings);
                          
                          let maxIdx = 8;
                          if (modelVal === '1x3') maxIdx = 2;
                          else if (modelVal === '4x2') maxIdx = 7;
                          else if (modelVal === '3x3_pro') maxIdx = 9;
                          else if (modelVal === '6x2_encoder' || modelVal === '6x2') maxIdx = 14;
                          else if (modelVal === '5x3_2encoders' || modelVal === '5x3') maxIdx = 20;
                          
                          if (selectedIdx > maxIdx) {
                            setSelectedIdx(0);
                            setSelectedStepIdx(0);
                          }
                        }}
                        style={{ padding: '0.5rem 0.6rem', fontSize: '0.82rem', width: '100%', textOverflow: 'ellipsis' }}
                      >
                        <option value="3x3">3x3 Model (9 Keys)</option>
                        <option value="1x3">1x3 Model (3 Keys)</option>
                        <option value="4x2">4x2 Model (8 Keys)</option>
                        <option value="3x3_pro">3x3 Pro (9 Keys + Switch)</option>
                        <option value="6x2_encoder">6x2 Dial (12 Keys + Dial)</option>
                        <option value="5x3_2encoders">5x3 Dual Dial (15 Keys + 2 Dials)</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ minWidth: 0 }}>
                      <label>Debounce (s)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="1.0"
                        value={settings.debounce || 0.05}
                        onChange={(e) => {
                          const newSettings = { ...settings, debounce: parseFloat(e.target.value) || 0.05 };
                          setSettings(newSettings);
                          updateCurrentProfile(null, newSettings);
                        }}
                        style={{ padding: '0.5rem 0.6rem', fontSize: '0.82rem', width: '100%' }}
                      />
                    </div>
                  </div>
                  
                  {modelImage && (
                    <div className="board-preview-card" style={{ marginTop: '0.65rem' }}>
                      <img src={modelImage} alt={`${settings.board_model} layout reference`} className="board-preview-img" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Contextual Options Menu for the Selected Flow Step */}
            {renderContextualOptionsMenu()}
          </aside>
        </div>
      )}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modal.title}</h3>
            {modal.type === 'input' && (
              <input 
                type="text" 
                value={modal.value} 
                onChange={(e) => setModal({ ...modal, value: e.target.value })}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && modal.onConfirm(modal.value)}
              />
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal({ ...modal, open: false })}>Cancel</button>
              <button className="btn btn-primary" onClick={() => modal.onConfirm(modal.value)}>
                {modal.type === 'confirm' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {galleryOpen && (
        <div className="modal-overlay gallery-overlay">
          <div className="modal-content gallery-modal-content">
            <div className="gallery-header">
              <h2>🎨 Mappings Gallery & Presets</h2>
              <button className="btn btn-secondary close-gallery-btn" onClick={() => setGalleryOpen(false)}>×</button>
            </div>
            
            <div className="gallery-layout">
              {/* Left Panel: Preset List */}
              <div className="gallery-sidebar">
                <div className="input-group">
                  <label style={{ fontWeight: '700' }}>Filter by Model</label>
                  <select 
                    value={galleryModel === '6x2' ? '6x2_encoder' : galleryModel === '5x3' ? '5x3_2encoders' : galleryModel} 
                    onChange={(e) => {
                      setGalleryModel(e.target.value);
                      setSelectedPresetIdx(0);
                    }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <option value="3x3">3x3 Model (9 Keys)</option>
                    <option value="1x3">1x3 Model (3 Keys)</option>
                    <option value="4x2">4x2 Model (8 Keys)</option>
                    <option value="3x3_pro">3x3 Pro (9 Keys + Switch)</option>
                    <option value="6x2_encoder">6x2 Dial (12 Keys + Dial)</option>
                    <option value="5x3_2encoders">5x3 Dual Dial (15 Keys + 2 Dials)</option>
                  </select>
                </div>
                
                <div className="presets-list">
                  {(PRESETS[galleryModel] || []).length === 0 ? (
                    <div style={{ padding: '2rem 1rem', color: 'var(--text-dim)', textAlign: 'center', fontWeight: '500' }}>
                      No presets found.
                    </div>
                  ) : (
                    (PRESETS[galleryModel] || []).map((preset, idx) => (
                      <div 
                        key={idx} 
                        className={`preset-card ${selectedPresetIdx === idx ? 'active' : ''}`}
                        onClick={() => setSelectedPresetIdx(idx)}
                      >
                        <h4>{preset.name}</h4>
                        <p>{preset.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Right Panel: Interactive Grid Preview */}
              <div className="gallery-preview-panel">
                <div className="gallery-preview-header-row">
                  <div>
                    <h3>Layout Map Preview</h3>
                    <div className="preview-info">
                      Showing mapping for: <strong>{PRESETS[galleryModel]?.[selectedPresetIdx]?.name || 'N/A'}</strong>
                    </div>
                  </div>
                  {getModelImage(galleryModel) && (
                    <img src={getModelImage(galleryModel)} alt="Model layout reference" className="gallery-model-thumb" />
                  )}
                </div>
                
                {/* Visual Preview Grid */}
                <div className="preview-grid-container">
                  {renderPreviewGrid()}
                </div>
                
                <div className="gallery-actions">
                  <button className="btn btn-secondary" onClick={() => setGalleryOpen(false)}>Cancel</button>
                  <button 
                    className="btn btn-primary" 
                    disabled={!PRESETS[galleryModel]?.[selectedPresetIdx]}
                    onClick={() => applyPresetToProfile()}
                  >
                    💾 Apply Preset to "{activeProfile}"
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
          <button className="toast-close-btn" onClick={() => setToastMessage('')}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
