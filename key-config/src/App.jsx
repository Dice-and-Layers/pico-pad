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

  // Load macros from file system
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
      alert("Failed to connect to keyboard. Make sure to select the CIRCUITPY drive.");
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
      alert("Configuration saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save configuration.");
    }
  };

  const updateMacro = (index, newData) => {
    const newMacros = [...macros];
    newMacros[index] = { ...newMacros[index], ...newData };
    setMacros(newMacros);
  };

  const selectedMacro = macros.find(m => m.row === Math.floor(selectedIdx / 3) && m.col === selectedIdx % 3) || {
    row: Math.floor(selectedIdx / 3),
    col: selectedIdx % 3,
    ...DEFAULT_MACRO
  };

  const handleActionChange = (actionIdx, field, value) => {
    const newActions = [...(selectedMacro.actions || [])];
    newActions[actionIdx] = { ...newActions[actionIdx], [field]: value };
    
    // If it's a keypress, value might be a comma-separated string
    if (field === 'keys' && typeof value === 'string') {
        newActions[actionIdx].keys = value.split(',').map(k => k.trim().toUpperCase());
    }

    const macroExists = macros.some(m => m.row === selectedMacro.row && m.col === selectedMacro.col);
    if (!macroExists) {
        setMacros([...macros, { ...selectedMacro, actions: newActions }]);
    } else {
        updateMacro(macros.findIndex(m => m.row === selectedMacro.row && m.col === selectedMacro.col), { actions: newActions });
    }
  };

  const handleLabelChange = (val) => {
    const macroExists = macros.some(m => m.row === selectedMacro.row && m.col === selectedMacro.col);
    if (!macroExists) {
        setMacros([...macros, { ...selectedMacro, label: val }]);
    } else {
        updateMacro(macros.findIndex(m => m.row === selectedMacro.row && m.col === selectedMacro.col), { label: val });
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Antigravity Macro Config</h1>
        <div className={`status-badge ${status === 'Connected' ? 'connected' : ''}`}>
          {status}
        </div>
        <button className="btn btn-primary" onClick={dirHandle ? saveConfig : connectKeyboard}>
          {dirHandle ? 'Save to Keyboard' : 'Connect Keyboard'}
        </button>
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
                  <span className="key-icon">{macro ? (macro.label[0] || '?') : (i + 1)}</span>
                  <span className="key-label">{macro ? macro.label : 'Empty'}</span>
                </div>
              );
            })}
          </div>
          <p style={{color: 'var(--text-dim)', fontSize: '0.9rem'}}>Select a key to configure its macro</p>
        </section>

        <aside className="editor-panel">
          <h3>Edit Key {selectedIdx + 1}</h3>
          
          <div className="input-group">
            <label>Label</label>
            <input 
              type="text" 
              value={selectedMacro.label || ""} 
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Copy"
            />
          </div>

          <div className="action-list">
            <label>Actions</label>
            {selectedMacro.actions?.map((action, ai) => (
              <div key={ai} className="action-item">
                <select 
                  value={action.type} 
                  onChange={(e) => handleActionChange(ai, 'type', e.target.value)}
                >
                  <option value="keypress">Key Combination</option>
                  <option value="text">Type Text</option>
                  <option value="consumer">Media/Consumer Key</option>
                </select>

                {action.type === 'keypress' && (
                  <input 
                    type="text" 
                    value={action.keys?.join(', ') || ""} 
                    onChange={(e) => handleActionChange(ai, 'keys', e.target.value)}
                    placeholder="CONTROL, C"
                  />
                )}

                {action.type === 'text' && (
                  <input 
                    type="text" 
                    value={action.text || ""} 
                    onChange={(e) => handleActionChange(ai, 'text', e.target.value)}
                    placeholder="Hello World"
                  />
                )}

                {action.type === 'consumer' && (
                  <select 
                    value={action.key} 
                    onChange={(e) => handleActionChange(ai, 'key', e.target.value)}
                  >
                    <option value="VOLUME_INCREMENT">Volume Up</option>
                    <option value="VOLUME_DECREMENT">Volume Down</option>
                    <option value="MUTE">Mute</option>
                    <option value="PLAY_PAUSE">Play/Pause</option>
                    <option value="SCAN_NEXT_TRACK">Next Track</option>
                    <option value="SCAN_PREVIOUS_TRACK">Previous Track</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
