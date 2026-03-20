import { LANGUAGES } from "../constants/languages.js";
import "../styles/components.css";

function LanguageSelector({ value, onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="lang-select"
    >
      <option value="">Select</option>
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;

//A simple dropdown that renders all supported languages from Step 1. 
//When the user selects a language, it calls onChange with the selected language ID (e.g., 'python', 'java').