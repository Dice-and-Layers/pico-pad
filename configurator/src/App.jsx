import React, { useState, useEffect } from 'react';
import './index.css';
import img1x3 from './models-images/1x3.jpg';
import img3x3 from './models-images/3x3.jpg';
import img3x3Pro from './models-images/3x3_pro.jpg';
import img6x2 from './models-images/6x2.jpg';
import img5x3_2encoders from './models-images/5x3_2encoders.png';
import img4x2 from './models-images/4x2.png';


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

PRESETS['3x3_pro'] = PRESETS['3x3'];

function App() {
  const [dirHandle, setDirHandle] = useState(null);
  const [theme, setTheme] = useState('light');
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

  const openGallery = () => {
    setGalleryModel(settings.board_model || '3x3');
    setSelectedPresetIdx(0);
    setGalleryOpen(true);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
  const is6x2 = settings.board_model === '6x2_encoder';
  const is5x3_2encoders = settings.board_model === '5x3_2encoders';

  const getModelImage = (model) => {
    switch (model) {
      case '1x3': return img1x3;
      case '3x3_pro': return img3x3Pro;
      case '4x2': return img4x2;
      case '6x2_encoder': return img6x2;
      case '5x3_2encoders': return img5x3_2encoders;
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
    } else if (model === '6x2_encoder') {
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
    } else if (model === '5x3_2encoders') {
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
    if (settings.board_model === '6x2_encoder') {
      if (selectedIdx === 12) return 'Encoder Button (ENC)';
      if (selectedIdx === 13) return 'Encoder Rotation CCW (↺)';
      if (selectedIdx === 14) return 'Encoder Rotation CW (↻)';
      return `Key ${selectedIdx + 1}`;
    } else if (settings.board_model === '5x3_2encoders') {
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
  const selectedMacro = macros.find(m => m.row === coords.row && m.col === coords.col) || {
    row: coords.row,
    col: coords.col,
    ...DEFAULT_MACRO
  };

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

  const renderKey = (i) => {
    const coords = getKeyCoordinates(settings.board_model, i);
    const macro = macros.find(m => m.row === coords.row && m.col === coords.col);
    
    let displayNum = i + 1;
    let extraClass = '';
    
    if (settings.board_model === '6x2_encoder') {
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
    } else if (settings.board_model === '5x3_2encoders') {
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
    
    return (
      <div
        key={i}
        className={`key ${selectedIdx === i ? 'selected' : ''} ${extraClass}`}
        onClick={() => setSelectedIdx(i)}
      >
        <span className="key-icon">{macro?.label ? macro.label[0] : displayNum}</span>
        <span className="key-label">{macro?.label || 'Not Configured'}</span>
      </div>
    );
  };

  const handleActionChange = (actionIdx, field, value) => {
    const newActions = [...(selectedMacro.actions || [])];
    let val = value;
    if (field === 'keys' && typeof value === 'string') {
      val = value.split(',').map(k => k.trim().toUpperCase());
    }
    
    // Create the updated action
    const updatedAction = { ...newActions[actionIdx], [field]: val };
    
    // If we changed the type, clean up old fields and set default values
    if (field === 'type') {
      const type = value;
      // Remove other fields
      delete updatedAction.keys;
      delete updatedAction.text;
      delete updatedAction.key;
      delete updatedAction.duration;
      delete updatedAction.app;
      delete updatedAction.url;
      
      if (type === 'keypress') {
        updatedAction.keys = [];
      } else if (type === 'text') {
        updatedAction.text = '';
      } else if (type === 'consumer') {
        updatedAction.key = '';
      } else if (type === 'delay') {
        updatedAction.duration = 0.1;
      } else if (type === 'launch') {
        updatedAction.app = '';
      } else if (type === 'url') {
        updatedAction.url = '';
      }
    }
    
    newActions[actionIdx] = updatedAction;
    updateMacroInList({ ...selectedMacro, actions: newActions });
  };

  const removeAction = (actionIdx) => {
    const newActions = (selectedMacro.actions || []).filter((_, i) => i !== actionIdx);
    updateMacroInList({ ...selectedMacro, actions: newActions });
  };

  const handleLabelChange = (val) => {
    updateMacroInList({ ...selectedMacro, label: val });
  };

  const renderPreviewGrid = () => {
    const preset = PRESETS[galleryModel]?.[selectedPresetIdx];
    if (!preset) return <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Select a preset to preview</div>;

    const presetMacros = preset.macros;
    
    const is1x3 = galleryModel === '1x3';
    const is3x3 = galleryModel === '3x3';
    const is3x3Pro = galleryModel === '3x3_pro';
    const is4x2 = galleryModel === '4x2';
    const is6x2 = galleryModel === '6x2_encoder';
    const is5x3 = galleryModel === '5x3_2encoders';
    
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
      
      if (galleryModel === '6x2_encoder') {
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
      } else if (galleryModel === '5x3_2encoders') {
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

      return (
        <div key={i} className={`key preview-key ${extraClass}`} style={{ cursor: 'default' }}>
          <span className="key-icon" style={{ fontSize: '1.2rem' }}>{m?.label ? m.label[0] : displayNum}</span>
          <span className="key-label" style={{ fontSize: '0.65rem' }}>{m?.label || 'Empty'}</span>
        </div>
      );
    };

    if (is3x3Pro) {
      return (
        <div className={`grid ${getGridClass()}`} style={{ pointerEvents: 'none' }}>
          {[0, 1, 2].map(i => renderPreviewKey(i))}
          <div className="key profile-btn" style={{ cursor: 'default' }}>
            <span className="key-icon" style={{ fontSize: '1.2rem' }}>🔄</span>
            <span className="key-label" style={{ fontSize: '0.65rem' }}>Switch</span>
          </div>
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
      <header>
        <h1>Pico Pad Configurator</h1>
        <div className="header-actions">
          <div className="profile-manager">
            <select value={activeProfile} onChange={(e) => switchProfile(e.target.value)}>
              {Object.keys(profiles).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <button className="icon-btn" onClick={createProfile} title="New Empty Profile">➕</button>
            <button className="icon-btn" onClick={saveAsProfile} title="Save Current As New Profile">💾</button>
            <button className="icon-btn delete" onClick={() => deleteProfile(activeProfile)} title="Delete Profile">🗑️</button>
          </div>
          <button className="help-toggle" onClick={openGallery} title="Open mappings presets gallery">
            🎨 Gallery
          </button>
          <button className="help-toggle" onClick={() => setShowHelp(!showHelp)} title="How to use">
            ❓ Help
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className={`status-badge ${status === 'Connected' ? 'connected' : ''}`}>
            {status}
          </div>
          <button className="btn btn-primary" onClick={dirHandle ? saveConfig : connectKeyboard}>
            {dirHandle ? '💾 Save Config' : '🔌 Connect'}
          </button>
        </div>
      </header>

      {showHelp ? (
        <div className="help-view">
          <div className="help-card">
            <div className="help-header">
              <h2>Configurator Help & Reference</h2>
              <button className="btn btn-primary" onClick={() => setShowHelp(false)}>Close Help</button>
            </div>

            <div className="help-grid">
              <section className="help-section">
                <h3>🚀 Quick Start</h3>
                <ol>
                  <li>Click <b>Connect</b> and select your <b>CIRCUITPY</b> drive.</li>
                  <li>Select a key in the grid to edit.</li>
                  <li>Add actions to the sequence.</li>
                  <li>Click <b>Save Config</b> to update the keyboard.</li>
                </ol>
              </section>

              <section className="help-section">
                <h3>⌨️ Special Keys Reference</h3>
                <p>Use these exact names in the "Keys" field (comma separated):</p>
                <div className="key-ref-grid">
                  <code>CONTROL</code> <code>ALT</code> <code>SHIFT</code>
                  <code>GUI</code> (Win) <code>ENTER</code> <code>SPACE</code>
                  <code>TAB</code> <code>ESCAPE</code> <code>DELETE</code>
                  <code>BACKSPACE</code> <code>UP_ARROW</code> <code>DOWN_ARROW</code>
                </div>
              </section>

              <section className="help-section">
                <h3>💡 Common Shortcuts</h3>
                <ul className="help-list">
                  <li><b>Copy:</b> <code>CONTROL, C</code></li>
                  <li><b>Paste:</b> <code>CONTROL, V</code></li>
                  <li><b>Task Manager:</b> <code>CONTROL, SHIFT, ESCAPE</code></li>
                  <li><b>Lock PC:</b> <code>GUI, L</code></li>
                </ul>
              </section>

              <section className="help-section">
                <h3>🖥️ Opening Applications</h3>
                <p>You can chain multiple actions to launch apps:</p>
                <div className="example-box">
                  <strong>Example: Open VS Code</strong>
                  <ol>
                    <li>Action 1 (Keypress): <code>GUI</code></li>
                    <li>Action 2 (Text): <code>code</code></li>
                    <li>Action 3 (Keypress): <code>ENTER</code></li>
                  </ol>
                </div>
                <div className="example-box">
                  <strong>Example: Open Notepad</strong>
                  <ol>
                    <li>Action 1 (Keypress): <code>GUI</code></li>
                    <li>Action 2 (Text): <code>notepad</code></li>
                    <li>Action 3 (Keypress): <code>ENTER</code></li>
                  </ol>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-layout">
          <section className="keyboard-section">
            <div className={`grid ${is3x3Pro ? 'grid-3x3-pro' : is4x2 ? 'grid-4x2' : is6x2 ? 'grid-6x2' : is1x3 ? 'grid-1x3' : is5x3_2encoders ? 'grid-5x3_2encoders' : 'grid-3x3'}`}>
              {is3x3Pro ? (
                <>
                  {/* Row 1 */}
                  {[0, 1, 2].map(i => renderKey(i))}
                  <div className="key profile-btn" onClick={handleProfileSwitchClick} title="Click to switch active profile preview">
                    <span className="key-icon">🔄</span>
                    <span className="key-label">Profile Switch</span>
                  </div>
                  
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
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>
              {is3x3Pro 
                ? "Click macro keys 1-9 to edit. The 🔄 button switches profiles."
                : is4x2
                ? "Click keys 1-8 to edit macro sequences for your 4x2 matrix."
                : is6x2
                ? "Click a key or dial action to edit. ENC is the encoder switch, and ↺/↻ are rotation actions."
                : is5x3_2encoders
                ? "Click a key or dial action to edit. ENC1/2 are encoder switches, and E1/E2 ↺/↻ are rotation actions."
                : "Click a key to edit its macro sequence"}
            </p>
          </section>

          <aside className="editor-panel">
            {/* Global Settings Section */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-color)' }}>Keyboard Config</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
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
                      else if (modelVal === '6x2_encoder') maxIdx = 14;
                      else if (modelVal === '5x3_2encoders') maxIdx = 20;
                      
                      if (selectedIdx > maxIdx) {
                        setSelectedIdx(0);
                      }
                    }}
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <option value="3x3">3x3 Model</option>
                    <option value="1x3">1x3 Model</option>
                    <option value="4x2">4x2 Model (8 Keys)</option>
                    <option value="3x3_pro">3x3 Pro Model</option>
                    <option value="6x2_encoder">6x2 Encoder Model</option>
                    <option value="5x3_2encoders">5x3 2-Encoder Model</option>
                  </select>
                </div>
                <div className="input-group">
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
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              
              {/* Board Layout Reference Image */}
              {modelImage && (
                <div className="board-preview-card">
                  <h3>Layout Reference</h3>
                  <img src={modelImage} alt={`${settings.board_model} layout reference`} className="board-preview-img" />
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '1.2rem' }}>Edit {getSelectedKeyName()}</h2>

            <div className="input-group">
              <label>Macro Label</label>
              <input
                type="text"
                value={selectedMacro.label || ""}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. Photoshop Copy"
              />
            </div>

            <div className="action-list">
              <label>Actions Sequence</label>
              {selectedMacro.actions?.map((action, ai) => (
                <div key={ai} className="action-item">
                  <div className="action-header">
                    <select
                      value={action.type}
                      onChange={(e) => handleActionChange(ai, 'type', e.target.value)}
                    >
                      <option value="keypress">Hotkeys / Combinations</option>
                      <option value="text">Type Text String</option>
                      <option value="consumer">Media & System Keys</option>
                      <option value="delay">Introduce Delay</option>
                      <option value="launch">Launch Application</option>
                      <option value="url">Open Web URL</option>
                    </select>
                    <button className="remove-btn" onClick={() => removeAction(ai)} title="Remove Action">×</button>
                  </div>

                  {action.type === 'keypress' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>Keys (comma separated)</label>
                      <input
                        type="text"
                        value={action.keys?.join(', ') || ""}
                        onChange={(e) => handleActionChange(ai, 'keys', e.target.value)}
                        placeholder="CONTROL, C"
                      />
                    </div>
                  )}

                  {action.type === 'text' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>Text to Type</label>
                      <input
                        type="text"
                        value={action.text || ""}
                        onChange={(e) => handleActionChange(ai, 'text', e.target.value)}
                        placeholder="Enter your text here..."
                      />
                    </div>
                  )}

                  {action.type === 'consumer' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>Select Command</label>
                      <select
                        value={action.key}
                        onChange={(e) => handleActionChange(ai, 'key', e.target.value)}
                      >
                        <option value="">Select an action...</option>
                        <option value="VOLUME_INCREMENT">Volume Up</option>
                        <option value="VOLUME_DECREMENT">Volume Down</option>
                        <option value="MUTE">Mute Audio</option>
                        <option value="PLAY_PAUSE">Play / Pause</option>
                        <option value="SCAN_NEXT_TRACK">Next Track</option>
                        <option value="SCAN_PREVIOUS_TRACK">Previous Track</option>
                      </select>
                    </div>
                  )}

                  {action.type === 'delay' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>Delay Duration (seconds)</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.01"
                        max="10.0"
                        value={action.duration || 0.1}
                        onChange={(e) => handleActionChange(ai, 'duration', parseFloat(e.target.value) || 0.1)}
                        placeholder="e.g. 0.5"
                      />
                    </div>
                  )}

                  {action.type === 'launch' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>Application Name / Run Command</label>
                      <input
                        type="text"
                        value={action.app || ""}
                        onChange={(e) => handleActionChange(ai, 'app', e.target.value)}
                        placeholder="e.g. notepad, chrome, cmd"
                      />
                    </div>
                  )}

                  {action.type === 'url' && (
                    <div className="input-group">
                      <label style={{ fontSize: '0.75rem' }}>URL Link (https://...)</label>
                      <input
                        type="text"
                        value={action.url || ""}
                        onChange={(e) => handleActionChange(ai, 'url', e.target.value)}
                        placeholder="e.g. https://github.com"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => {
              const newActions = [...(selectedMacro.actions || []), { type: 'keypress', keys: [] }];
              updateMacroInList({ ...selectedMacro, actions: newActions });
            }}>
              ➕ Add Action
            </button>
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
                    value={galleryModel} 
                    onChange={(e) => {
                      setGalleryModel(e.target.value);
                      setSelectedPresetIdx(0);
                    }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <option value="3x3">3x3 Model</option>
                    <option value="1x3">1x3 Model</option>
                    <option value="4x2">4x2 Model (8 Keys)</option>
                    <option value="3x3_pro">3x3 Pro Model</option>
                    <option value="6x2_encoder">6x2 Encoder Model</option>
                    <option value="5x3_2encoders">5x3 2-Encoder Model</option>
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
                <h3>Layout Map Preview</h3>
                <div className="preview-info">
                  Showing mapping for: <strong>{PRESETS[galleryModel]?.[selectedPresetIdx]?.name || 'N/A'}</strong>
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
                    onClick={() => {
                      const preset = PRESETS[galleryModel][selectedPresetIdx];
                      if (confirm(`Apply "${preset.name}"? This will overwrite the macros in your active profile ("${activeProfile}").`)) {
                        setMacros(preset.macros);
                        const newSettings = { ...settings, board_model: galleryModel };
                        setSettings(newSettings);
                        updateCurrentProfile(preset.macros, newSettings);
                        setSelectedIdx(0);
                        setGalleryOpen(false);
                      }
                    }}
                  >
                    💾 Apply Preset to Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
