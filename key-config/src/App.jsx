import React, { useState, useEffect } from 'react';
import './index.css';

const DEFAULT_MACRO = {
  label: "New Macro",
  actions: [{ type: "keypress", keys: ["CONTROL", "C"] }]
};

function App() {
  const [dirHandle, setDirHandle] = useState(null);
  const [macros, setMacros] = useState([]);
  const [settings, setSettings] = useState({ debounce: 0.05 });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [status, setStatus] = useState("Disconnected");
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const connectKeyboard = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setDirHandle(handle);
      
      const fileHandle = await handle.getFileHandle("macros.json");
      const file = await fileHandle.getFile();
      const content = await file.text();
      const data = JSON.parse(content);
      
      setMacros(data.macros || []);
      setSettings(data.settings || { debounce: 0.05 });
      setStatus("Connected");
    } catch (err) {
      console.error(err);
      alert("Failed to connect. Please select the CIRCUITPY drive.");
    }
  };

  const saveConfig = async () => {
    if (!dirHandle) return;
    try {
      const fileHandle = await dirHandle.getFileHandle("macros.json", { create: true });
      const writable = await fileHandle.createWritable();
      const data = { settings, macros };
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const selectedMacro = macros.find(m => m.row === Math.floor(selectedIdx / 3) && m.col === selectedIdx % 3) || {
    row: Math.floor(selectedIdx / 3),
    col: selectedIdx % 3,
    ...DEFAULT_MACRO
  };

  const updateMacroInList = (updatedMacro) => {
    const existingIdx = macros.findIndex(m => m.row === updatedMacro.row && m.col === updatedMacro.col);
    if (existingIdx >= 0) {
      const newMacros = [...macros];
      newMacros[existingIdx] = updatedMacro;
      setMacros(newMacros);
    } else {
      setMacros([...macros, updatedMacro]);
    }
  };

  const handleActionChange = (actionIdx, field, value) => {
    const newActions = [...(selectedMacro.actions || [])];
    let val = value;
    if (field === 'keys' && typeof value === 'string') {
        val = value.split(',').map(k => k.trim().toUpperCase());
    }
    newActions[actionIdx] = { ...newActions[actionIdx], [field]: val };
    updateMacroInList({ ...selectedMacro, actions: newActions });
  };

  const handleLabelChange = (val) => {
    updateMacroInList({ ...selectedMacro, label: val });
  };

  return (
    <div className="container">
      <header>
        <h1>SS Key Config</h1>
        <div className="header-actions">
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

      <div className="main-layout">
        <section className="keyboard-section">
          <div className="grid">
            {[...Array(9)].map((_, i) => {
              const r = Math.floor(i / 3);
              const c = i % 3;
              const macro = macros.find(m => m.row === r && m.col === c);
              return (
                <div 
                  key={i} 
                  className={`key ${selectedIdx === i ? 'selected' : ''}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <span className="key-icon">{macro?.label ? macro.label[0] : (i + 1)}</span>
                  <span className="key-label">{macro?.label || 'Not Configured'}</span>
                </div>
              );
            })}
          </div>
          <p style={{color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500'}}>
            Click a key to edit its macro sequence
          </p>
        </section>

        <aside className="editor-panel">
          <h2 style={{fontSize: '1.2rem'}}>Edit Key {selectedIdx + 1}</h2>
          
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
                <select 
                  value={action.type} 
                  onChange={(e) => handleActionChange(ai, 'type', e.target.value)}
                >
                  <option value="keypress">Hotkeys / Combinations</option>
                  <option value="text">Type Text String</option>
                  <option value="consumer">Media & System Keys</option>
                </select>

                {action.type === 'keypress' && (
                  <div className="input-group">
                    <label style={{fontSize: '0.75rem'}}>Keys (comma separated)</label>
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
                    <label style={{fontSize: '0.75rem'}}>Text to Type</label>
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
                    <label style={{fontSize: '0.75rem'}}>Select Command</label>
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
              </div>
            ))}
          </div>
          
          <button className="btn btn-secondary" style={{marginTop: 'auto'}} onClick={() => {
            const newActions = [...(selectedMacro.actions || []), { type: 'keypress', keys: [] }];
            updateMacroInList({ ...selectedMacro, actions: newActions });
          }}>
            ➕ Add Action
          </button>
        </aside>
      </div>
    </div>
  );
}

export default App;
