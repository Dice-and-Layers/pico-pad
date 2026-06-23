import React, { useState, useEffect } from 'react';
import './index.css';

const DEFAULT_MACRO = {
  label: "New Macro",
  actions: [{ type: "keypress", keys: ["CONTROL", "C"] }]
};

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

      const fileHandle = await handle.getFileHandle("macros.json");
      const file = await fileHandle.getFile();
      const content = await file.text();
      const data = JSON.parse(content);

      const loadedSettings = data.settings || { debounce: 0.05, board_model: '3x3' };
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
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const is1x3 = settings.board_model === '1x3';
  const is3x3Pro = settings.board_model === '3x3_pro';

  const selectedMacro = macros.find(m => {
    const r = is1x3 ? 0 : Math.floor(selectedIdx / 3);
    const c = is1x3 ? selectedIdx : selectedIdx % 3;
    return m.row === r && m.col === c;
  }) || {
    row: is1x3 ? 0 : Math.floor(selectedIdx / 3),
    col: is1x3 ? selectedIdx : selectedIdx % 3,
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
    const r = is1x3 ? 0 : Math.floor(i / 3);
    const c = is1x3 ? i : i % 3;
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
      
      if (type === 'keypress') {
        updatedAction.keys = [];
      } else if (type === 'text') {
        updatedAction.text = '';
      } else if (type === 'consumer') {
        updatedAction.key = '';
      } else if (type === 'delay') {
        updatedAction.duration = 0.1;
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

  return (
    <div className="container">
      <header>
        <h1>SS Key Config</h1>
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
            <div className={`grid ${is3x3Pro ? 'grid-3x3-pro' : is1x3 ? 'grid-1x3' : 'grid-3x3'}`}>
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
              ) : (
                [...Array(is1x3 ? 3 : 9)].map((_, i) => renderKey(i))
              )}
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>
              {is3x3Pro 
                ? "Click macro keys 1-9 to edit. The 🔄 button switches profiles."
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
                      if (modelVal === '1x3' && selectedIdx >= 3) {
                        setSelectedIdx(0);
                      }
                    }}
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <option value="3x3">3x3 Model</option>
                    <option value="1x3">1x3 Model</option>
                    <option value="3x3_pro">3x3 Pro Model</option>
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
            </div>

            <h2 style={{ fontSize: '1.2rem' }}>Edit Key {selectedIdx + 1}</h2>

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
    </div>
  );
}

export default App;
