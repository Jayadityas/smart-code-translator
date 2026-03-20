import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";
//Tt's a React wrapper for the Monaco Editor, the same editor used in VS Code.

function CodeEditor({ code, onChange, language, readOnly = false }) {
  return (
    <Editor
      height="70vh"
      language={MONACO_LANGUAGE_MAP[language] || "plaintext"}
      value={code}
      onChange={(v) => onChange(v || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        readOnly,
        padding: { top: 14, bottom: 14 },
        automaticLayout: true,
        tabSize: 2,
        lineNumbers: "on",
        renderLineHighlight: "all",
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        matchBrackets: "always",
        formatOnPaste: true,
        suggestOnTriggerCharacters: true,
        folding: true,
        smoothScrolling: true,
        fixedOverflowWidgets: true,
      }}
      loading={
        <div className="loading-state">
          <p>Loading editor...</p>
        </div>
      }
    />
  );
}

export default CodeEditor;

//We pass the language prop (using the mapping from Step 1) for syntax highlighting,
// theme="vs-dark" for a dark background, and readOnly when the editor should be view-only (like in the output panel). 
// The options configure the editor's behavior — bracket matching, auto-closing quotes, folding, etc.

