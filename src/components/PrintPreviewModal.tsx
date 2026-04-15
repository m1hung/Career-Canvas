import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { ResumePreview, TemplateType } from './ResumePreview';
import { ResumeData, PaperSize, Orientation } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (paperSize: PaperSize, orientation: Orientation) => void;
  data: ResumeData;
  template: TemplateType;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  data,
  template,
}) => {
  const [paperSize, setPaperSize] = React.useState<PaperSize>('A4');
  const [orientation, setOrientation] = React.useState<Orientation>('portrait');
  const [zoom, setZoom] = React.useState(0.8);

  // Auto-adjust zoom based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setZoom(0.5);
      else if (window.innerWidth < 1024) setZoom(0.6);
      else setZoom(0.8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <Printer size={20} className="text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Print Preview</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Review your resume before exporting</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto p-6 sm:p-10 bg-zinc-200/50 dark:bg-zinc-950 flex flex-col lg:flex-row gap-8">
              {/* Controls Sidebar */}
              <div className="w-full lg:w-64 space-y-6">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Page Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Paper Size</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['A4', 'Letter'] as PaperSize[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => setPaperSize(size)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                              paperSize === size
                                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                            }`}
                            title={`Set paper size to ${size}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Orientation</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['portrait', 'landscape'] as Orientation[]).map((o) => (
                          <button
                            key={o}
                            onClick={() => setOrientation(o)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all capitalize ${
                              orientation === o
                                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                            }`}
                            title={`Set orientation to ${o}`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Zoom</label>
                        <span className="text-xs font-mono text-zinc-400">{Math.round(zoom * 100)}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                      />
                      <div className="relative h-4 mt-1">
                        <button 
                          onClick={() => setZoom(0.5)}
                          className="absolute left-0 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                          50%
                        </button>
                        <button 
                          onClick={() => setZoom(1)}
                          className="absolute text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 -translate-x-1/2"
                          style={{ left: '50%' }}
                        >
                          100%
                        </button>
                        <button 
                          onClick={() => setZoom(1.5)}
                          className="absolute right-0 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                          150%
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    <strong>Pro Tip:</strong> Ensure your browser's print settings match these selections for the best results.
                  </p>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="flex-1 flex justify-center overflow-auto bg-zinc-300/30 dark:bg-zinc-950/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 min-h-[500px]">
                <div 
                  className="shadow-2xl transition-all duration-200 origin-top"
                  style={{ 
                    zoom: zoom,
                    WebkitZoom: zoom,
                    msZoom: zoom,
                  } as React.CSSProperties}
                >
                  <ResumePreview 
                    data={data} 
                    template={template} 
                    paperSize={paperSize} 
                    orientation={orientation} 
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPrint(paperSize, orientation);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Confirm & </span>Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
