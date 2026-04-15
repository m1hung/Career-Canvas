import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Sparkles, LayoutPanelLeft, FileText, Moon, Sun, Undo, Redo, Type } from 'lucide-react';
import { ResumeData, initialResumeData, FontOption, PaperSize, Orientation } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview, TemplateType } from './components/ResumePreview';
import { ImportModal } from './components/ImportModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { Logo } from './components/Logo';


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

const STORAGE_KEY = 'resume-builder-data';

export default function App() {
  const [initialData] = useState<ResumeData>(() => {
    if (typeof window === 'undefined') return initialResumeData;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved resume data', e);
        return initialResumeData;
      }
    }
    return initialResumeData;
  });

  const { resumeData, setResumeData, undo, redo, canUndo, canRedo } = useResumeHistory(initialData);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [template, setTemplate] = useState<TemplateType>('modern');
  
  const componentRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  
  // Auto-scale preview to fit container
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container || activeTab !== 'preview') return;

    const updateScale = () => {
      const containerWidth = container.offsetWidth;
      const resumeWidth = 794; // Standard A4 width in px at 96 DPI
      const padding = window.innerWidth < 640 ? 32 : 64; // sm:p-8 or p-4
      const availableWidth = containerWidth - padding;
      
      if (availableWidth < resumeWidth) {
        setPreviewScale(availableWidth / resumeWidth);
      } else {
        setPreviewScale(1);
      }
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    updateScale();

    return () => observer.disconnect();
  }, [activeTab]);

  // Auto-save to local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeData]);

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

  const handlePrint = (paperSize: PaperSize = 'A4', orientation: Orientation = 'portrait') => {
    const originalTitle = document.title;
    document.title = `${resumeData.personalInfo.fullName || 'Resume'}_Resume`;
    
    // Inject print styles
    const style = document.createElement('style');
    style.id = 'print-page-style';
    style.innerHTML = `
      @page {
        size: ${paperSize} ${orientation};
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          background: white !important;
        }
        .resume-document {
          box-shadow: none !important;
          margin: 0 !important;
          width: 100% !important;
          min-height: 100% !important;
          border: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    document.head.removeChild(style);
    document.title = originalTitle;
  };

  const handleImport = (importedData: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...importedData.personalInfo },
      summary: importedData.summary || prev.summary,
      experience: importedData.experience || prev.experience,
      education: importedData.education || prev.education,
      skills: importedData.skills || prev.skills,
      customCSS: importedData.customCSS !== undefined ? importedData.customCSS : prev.customCSS,
    }));
  };

  const updateAccentColor = (color: string) => {
    setResumeData(prev => ({ ...prev, accentColor: color }));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 shadow-sm transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1 mr-1 sm:mr-4 border-r border-zinc-200 dark:border-zinc-700 pr-1.5 sm:pr-5">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Undo (Ctrl+Z)"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Redo (Ctrl+Y)"
              >
                <Redo size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <label htmlFor="accentColor" className="cursor-pointer flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: resumeData.accentColor || '#2563eb' }}
                />
                <span className="hidden lg:inline text-xs font-medium text-zinc-600 dark:text-zinc-400">Accent</span>
              </label>
              <input
                id="accentColor"
                type="color"
                value={resumeData.accentColor || '#2563eb'}
                onChange={(e) => updateAccentColor(e.target.value)}
                className="sr-only"
              />
            </div>
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="hidden md:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Import resume text with AI"
            >
              <Sparkles size={16} />
              <span className="hidden lg:inline">Import with AI</span>
            </button>
            <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
              title="Export resume as PDF"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-16 z-20 transition-colors duration-300">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'editor' ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <LayoutPanelLeft size={16} />
          Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'preview' ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <FileText size={16} />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Left Panel: Editor */}
        <div className={`w-full lg:w-[45%] xl:w-[40%] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 ${
          activeTab === 'editor' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="p-0 sm:p-6 lg:p-8">
            <div className="p-4 sm:p-0">
              <div className="mb-6 lg:hidden">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <Sparkles size={16} />
                  Import with AI
                </button>
              </div>
              <ResumeEditor data={resumeData} onChange={setResumeData} />
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div 
          ref={previewContainerRef}
          className={`preview-panel w-full lg:w-[55%] xl:w-[60%] bg-zinc-200/50 dark:bg-zinc-950 flex-col items-center p-4 sm:p-8 transition-colors duration-300 ${
            activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="lg:sticky lg:top-24 w-full flex flex-col items-center max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            {/* Controls */}
            <div className="w-full max-w-[850px] mx-auto mb-4 flex flex-wrap items-center justify-center sm:justify-end gap-3">
            {/* Font Selector */}
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm px-3 py-1.5 border border-zinc-200 dark:border-zinc-700">
              <Type size={16} className="text-zinc-500" />
              <select
                value={resumeData.fontFamily || 'Inter'}
                onChange={(e) => setResumeData({ ...resumeData, fontFamily: e.target.value as FontOption })}
                className="bg-transparent text-sm font-medium text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
              >
                {['Inter', 'Roboto', 'Playfair Display', 'Merriweather', 'Montserrat', 'Open Sans'].map((font) => (
                  <option key={font} value={font} className="dark:bg-zinc-800">
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Switcher */}
            <div className="inline-flex bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-1 border border-zinc-200 dark:border-zinc-700">
              {(['modern', 'classic', 'minimal'] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200 ${
                    template === t 
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

            <div 
              className="w-full mx-auto transform origin-top transition-transform"
              style={{ transform: `scale(${previewScale})` }}
            >
              {/* The actual printable component */}
              <ResumePreview ref={componentRef} data={resumeData} template={template} />
            </div>
        </div>
      </div>
    </main>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
      />

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        onPrint={handlePrint}
        data={resumeData}
        template={template}
      />
    </div>
  );
}
