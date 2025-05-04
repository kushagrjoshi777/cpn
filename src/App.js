import React, { useState } from "react";
import randomColor from "randomcolor";
import chroma from "chroma-js";
import { SketchPicker } from "react-color";
import md5 from "md5";
import "./App.css";

const moodColors = {
  happy: ["#FFD700", "#FF69B4", "#FFB6C1", "#FFA500", "#FFFFE0", "#FFFACD", "#FFE4B5", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FAFAD2", "#FFEBCD"],
  sad: ["#000080", "#4682B4", "#708090", "#2F4F4F", "#1E90FF", "#191970", "#00008B", "#0000CD", "#4169E1", "#6495ED", "#87CEEB", "#87CEFA"],
  calm: ["#ADD8E6", "#B0E0E6", "#E0FFFF", "#AFEEEE", "#F0FFF0", "#E6E6FA", "#D8BFD8", "#DDA0DD", "#EE82EE", "#DA70D6", "#BA55D3", "#9932CC"],
  angry: ["#8B0000", "#B22222", "#DC143C", "#FF0000", "#A52A2A", "#800000", "#B03060", "#C71585", "#FF4500", "#FF6347", "#FF7F50", "#CD5C5C"],
  energetic: ["#FF4500", "#FF8C00", "#FFD700", "#ADFF2F", "#7FFF00", "#32CD32", "#00FF00", "#00FA9A", "#00FFFF", "#1E90FF", "#0000FF", "#8A2BE2"],
  disgusted: ["#556B2F", "#6B8E23", "#808000", "#9ACD32", "#BDB76B", "#556B2F", "#6B8E23", "#808000", "#9ACD32", "#BDB76B", "#556B2F", "#6B8E23"],
  relaxed: ["#98FB98", "#90EE90", "#8FBC8F", "#66CDAA", "#20B2AA", "#48D1CC", "#40E0D0", "#00CED1", "#5F9EA0", "#4682B4", "#B0C4DE", "#ADD8E6"],
  romantic: ["#FF1493", "#FF69B4", "#DB7093", "#FFC0CB", "#C71585", "#FFB6C1", "#FF69B4", "#FF1493", "#DC143C", "#C71585", "#FF6347", "#FF4500"],
  creative: ["#DA70D6", "#BA55D3", "#9370DB", "#8A2BE2", "#7B68EE", "#6A5ACD", "#483D8B", "#663399", "#800080", "#4B0082", "#9400D3", "#8B008B"],
  anxious: ["#696969", "#708090", "#778899", "#A9A9A9", "#D3D3D3", "#C0C0C0", "#BEBEBE", "#A9A9A9", "#808080", "#696969", "#778899", "#708090"],
  horny: ["#FF69B4", "#FF1493", "#DC143C", "#C71585", "#FF6347", "#FF4500", "#FF6EB4", "#FF3366", "#FF0033", "#FF82AB", "#FF2E63", "#FF5E3A"],
  excited: ["#FF4500", "#FF6347", "#FF7F50", "#FF8C00", "#FFA500", "#FFD700", "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2", "#FFEFD5", "#FFE4B5"],
  peaceful: ["#E0FFFF", "#AFEEEE", "#B0E0E6", "#ADD8E6", "#87CEEB", "#87CEFA", "#00BFFF", "#1E90FF", "#6495ED", "#4682B4", "#5F9EA0", "#00CED1"],
  hopeful: ["#98FB98", "#90EE90", "#8FBC8F", "#66CDAA", "#20B2AA", "#3CB371", "#2E8B57", "#228B22", "#006400", "#008000", "#00FF7F", "#7FFF00"]
};

function generateColorFromName(name) {
  if (!name) return "#888888";
  const hex = md5(name);
  return `#${hex.slice(0, 6)}`;
}

const methodOptions = [
  { id: "select", label: "About" },
  { id: "base", label: "Base Colors" },
  { id: "name", label: "By Name" },
  { id: "number", label: "By Birthdate" },
  { id: "mood", label: "By Emotion" },
  { id: "random", label: "Random" }
];

const App = () => {
  const [method, setMethod] = useState("select");
  const [input, setInput] = useState("");
  const [colors, setColors] = useState([]);
  const [pickerColor, setPickerColor] = useState("#ffffff");
  const [pickedColors, setPickedColors] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(null);

  const generateColors = (base) => chroma.scale(["white", base, "black"]).mode("lab").colors(12);

  const handleGenerate = () => {
    let newColors = [];
    if (method === "random") {
      newColors = Array.from({ length: 12 }, () => randomColor());
    } else if (method === "name") {
      const base = generateColorFromName(input);
      newColors = generateColors(base);
    } else if (method === "number") {
      const base = generateColorFromName(input);
      newColors = generateColors(base);
    } else if (method === "mood") {
      
      newColors = moodColors[input] || [];
      if (newColors.length < 12) {
        newColors = Array(Math.ceil(12 / newColors.length)).fill(newColors).flat().slice(0, 12);
      }
    }
    setColors(newColors);
  };

  const handleAddPickedColor = () => {
    if (pickedColors.length < 5 && !pickedColors.includes(pickerColor)) {
      setPickedColors([...pickedColors, pickerColor]);
    }
  };

  const handleRemovePickedColor = (colorToRemove) => {
    setPickedColors(pickedColors.filter(color => color !== colorToRemove));
  };

  const handlePickedColors = () => {
    if (pickedColors.length === 0) return;
    let allColors = pickedColors.flatMap(color => generateColors(color));
    setColors([...new Set(allColors)]);
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1000);
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <header className="header">
        <h1>🎨 Color Palette Generator</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞" : "🌙"}
        </button>
      </header>

      <div className="main-container">
        <nav className="sidebar">
          {methodOptions.map(opt => (
            <button
              key={opt.id}
              className={`nav-btn ${method === opt.id ? "active" : ""}`}
              onClick={() => { setMethod(opt.id); setColors([]); setInput(""); }}
            >
              {opt.label}
            </button>
          ))}
        </nav>
        <main className="content-area">
          {method === "select" && (
            <div className="description">
              <h2>Welcome to the Color Palette Generator!</h2>
              <p>
                Generate beautiful color palettes in several creative ways. <br />
                <b>How to use:</b>
              </p>
              <ul>
                <li>
                  <b>Base Colors:</b> Pick up to 5 custom base colors and generate a palette from them.
                </li>
                <li>
                  <b>By Name:</b> Enter any word or name to get a unique palette based on it.
                </li>
                <li>
                  <b>By Birthdate:</b> Enter a number (like your birthdate) to see a palette just for you.
                </li>
                <li>
                  <b>By Emotion:</b> Choose a mood or emotion for a matching color palette.
                </li>
                <li>
                  <b>Random:</b> Get a totally random palette each time.
                </li>
              </ul>
              <p>
                Click on any color to copy its hex code.<br />
                Switch between light and dark mode for your preferred look!
              </p>
            </div>
          )}

          {method === "base" && (
            <div className="base-controls">
              <div className="color-picker-section">
                <SketchPicker color={pickerColor} onChange={(color) => setPickerColor(color.hex)} />
                <button className="add-btn" onClick={handleAddPickedColor}>
                  Add Base Color
                </button>
                <div className="selected-colors">
                  {pickedColors.map((color, idx) => (
                    <div key={idx} className="selected-color" style={{ backgroundColor: color }}>
                      <span className="color-value">{color}</span>
                      <button className="remove-btn" onClick={() => handleRemovePickedColor(color)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button className="generate-btn" onClick={handlePickedColors}>
                Generate from Base Colors
              </button>
            </div>
          )}

          {method === "name" && (
            <div className="input-section">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter name"
                className="text-input"
              />
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Palette
              </button>
            </div>
          )}

          {method === "number" && (
            <div className="input-section">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter birthdate (e.g., 19901231)"
                className="number-input"
                min="0"
                max="99999999"
              />
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Palette
              </button>
            </div>
          )}

          {method === "mood" && (
            <div className="mood-section">
              <select 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                className="mood-select"
              >
                <option value="">Select Emotion</option>
                {Object.keys(moodColors).map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Palette
              </button>
            </div>
          )}

          {method === "random" && (
            <button className="generate-btn" onClick={handleGenerate}>
              Generate Random Colors
            </button>
          )}

          {colors.length > 0 && (
            <div className="palette-grid">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="color-card"
                  style={{ 
                    backgroundColor: color,
                    color: chroma(color).luminance() > 0.5 ? "#333" : "#fff"
                  }}
                  onClick={() => handleCopyColor(color)}
                >
                  {color}
                  {copied === color && <div className="copied-badge">Copied!</div>}
                </div>
              ))}
            </div>
          )}

          {colors.length > 0 && (
            <button className="clear-btn" onClick={() => setColors([])}>
              Clear Palette
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
