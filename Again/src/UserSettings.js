import React, { useState } from "react";
import "./Settings.css";

function UserSettings() {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.classList.remove("light", "dark", "custom");
    document.documentElement.classList.add(selectedTheme);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting-option">
        <label>Theme:</label>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <button className="save-button">Save Settings</button>
    </div>
  );
}

export default UserSettings;
