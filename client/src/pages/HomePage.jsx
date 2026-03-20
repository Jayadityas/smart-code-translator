/*The HomePage is the main workspace where users write code and perform operations. 
It has a toolbar with four action tabs, a source code editor, and an output panel. */

import { useState } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import { STARTER_CODE } from '../constants/languages.js';
import { translateCode, analyzeComplexity, optimizeCode, explainCode } from '../services/codeService.js';
import '../styles/home.css';

const ACTIONS = ['translate', 'analyze', 'optimize', 'explain']; //It defines the operation tabs

function HomePage() {
  const [code, setCode] = useState(STARTER_CODE.python);
  const [sourceLanguage, setSourceLanguage] = useState('python');
  const [targetLanguage, setTargetLanguage] = useState('java');
  const [activeAction, setActiveAction] = useState('translate'); //activeAction determines which API endpoints to call and how to display the result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
//Handling Source Language Change
const handleSourceChange = (langId) => {
  setSourceLanguage(langId);
  if (STARTER_CODE[langId]) setCode(STARTER_CODE[langId]);
  setResult(null);
};

//Handling Language Swap (Translate Mode)
const handleSwap = () => {
  if (activeAction !== "translate") return;
  setSourceLanguage(targetLanguage);
  setTargetLanguage(sourceLanguage);
  if (result?.translatedCode) {
    setCode(result.translatedCode);
    setResult(null);
  }
};
/*The swap button switches source and target languages. If there's a translated result, 
it moves the translated code into the source editor — so users can chain translations */


//Copying Output to Clipboard
const handleCopy = async () => {
  if (!result) return;
  let text = "";
  if (activeAction === "translate") text = result.translatedCode || "";
  else if (activeAction === "optimize") text = result.optimizedCode || "";
  else if (activeAction === "explain") text = result.explanation || "";
  else if (activeAction === "analyze")
    text = `Time: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n\n${result.explanation || ""}`;
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    toast.error("Failed to copy");
  }
};
/*Each action type has a different output shape, so we extract the right text based on activeAction.
 navigator.clipboard.writeText() copies the text to the clipboard. 
The copied state flips to true for 2 seconds to show "Copied!" feedback. */


//How the Run Button Works
const handleRun = async () => {
  if (!code.trim()) return toast.error("Please write some code first.");
  if (!sourceLanguage) return toast.error("Select a source language.");
  if (activeAction === "translate" && !targetLanguage)
    return toast.error("Select a target language.");

  setLoading(true);
  setResult(null);
  try {
    const fns = {
      translate: () => translateCode(code, sourceLanguage, targetLanguage),
      analyze: () => analyzeComplexity(code, sourceLanguage),
      optimize: () => optimizeCode(code, sourceLanguage),
      explain: () => explainCode(code, sourceLanguage),
    };
    setResult(await fns[activeAction]());
    toast.success("Done!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
/*Instead of a switch statement, we use an object lookup — fns[activeAction]() calls the right service function (from Step 2) based on which tab is active. 
This pattern is cleaner when all cases have the same structure. We validate the input first, 
show a loading spinner, then display the result or an error toast. */



//Rendering the HomePage
return (
  <div className="home">
    {/* Toolbar with action tabs and run button */}
    <div className="toolbar">
      <div className="action-tabs">
        {ACTIONS.map((a) => (
          <button
            key={a}
            className={`action-tab ${activeAction === a ? "active" : ""}`}
            onClick={() => {
              setActiveAction(a);
              setResult(null);
            }}
          >
            {a}
          </button>
        ))}
      </div>
      <button className="run-btn" onClick={handleRun} disabled={loading}>
        {loading ? "Running..." : "Run"}
      </button>
    </div>

    {/* Two-panel layout: Source and Output */}
    <div className="panels">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <span className="panel-label">Source</span>
            <LanguageSelector
              value={sourceLanguage}
              onChange={handleSourceChange}
            />
          </div>
          <button className="clear-btn" onClick={() => setCode("")}>
            Clear
          </button>
        </div>
        <div className="panel-body">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={sourceLanguage}
          />
        </div>
      </div>

      <div className="swap-area">
        {activeAction === "translate" ? (
          <button
            className="swap-btn"
            onClick={handleSwap}
            title="Swap languages"
          >
            &#8644;
          </button>
        ) : (
          <span className="swap-arrow">&#8594;</span>
        )}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <span className="panel-label">
              {activeAction === "translate" ? "Target" : "Output"}
            </span>
            {activeAction === "translate" && (
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
              />
            )}
            {result && activeAction !== "translate" && (
              <span className="action-badge">{activeAction}</span>
            )}
          </div>
          {result && (
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <div className="panel-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Processing...</p>
            </div>
          ) : (
            <OutputPanel
              result={result}
              action={activeAction}
              targetLanguage={
                activeAction === "translate" ? targetLanguage : sourceLanguage
              }
            />
          )}
        </div>
      </div>
    </div>
  </div>
);


}

export default HomePage;