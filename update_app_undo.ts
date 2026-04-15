import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update imports
content = content.replace(
  "import React, { useState, useRef } from 'react';",
  "import React, { useState, useRef, useEffect, useCallback } from 'react';"
);

content = content.replace(
  "import { Download, Sparkles, LayoutPanelLeft, FileText, Moon, Sun } from 'lucide-react';",
  "import { Download, Sparkles, LayoutPanelLeft, FileText, Moon, Sun, Undo, Redo } from 'lucide-react';"
);

// 2. Add custom hook before App component
const hookCode = `
function useResumeHistory(initialState: ResumeData) {
  const [history, setHistory] = useState<ResumeData[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const [currentData, setCurrentData] = useState<ResumeData>(initialState);

  useEffect(() => {
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }

    const timer = setTimeout(() => {
      if (JSON.stringify(currentData) !== JSON.stringify(history[currentIndex])) {
        let newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(currentData);
        if (newHistory.length > 50) {
          newHistory = newHistory.slice(newHistory.length - 50);
        }
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentData, history, currentIndex, isUndoRedoAction]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setIsUndoRedoAction(true);
      setCurrentIndex(currentIndex - 1);
      setCurrentData(history[currentIndex - 1]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      setCurrentIndex(currentIndex + 1);
      setCurrentData(history[currentIndex + 1]);
    }
  }, [currentIndex, history]);

  return {
    resumeData: currentData,
    setResumeData: setCurrentData,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
}

export default function App() {`;

content = content.replace("export default function App() {", hookCode);

// 3. Replace useState with custom hook
content = content.replace(
  "const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);",
  "const { resumeData, setResumeData, undo, redo, canUndo, canRedo } = useResumeHistory(initialResumeData);"
);

// 4. Add Undo/Redo buttons to header
const buttonsCode = `
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 mr-2 sm:mr-4 border-r border-gray-200 dark:border-gray-700 pr-3 sm:pr-5">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Undo (Ctrl+Z)"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Redo (Ctrl+Y)"
              >
                <Redo size={18} />
              </button>
            </div>
            <button`;

content = content.replace(
  /<div className="flex items-center gap-3">\s*<button/g,
  buttonsCode
);

// 5. Add keyboard shortcuts
const keyboardShortcuts = `
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handlePrint = useReactToPrint({`;

content = content.replace("  const handlePrint = useReactToPrint({", keyboardShortcuts);

fs.writeFileSync('src/App.tsx', content);
