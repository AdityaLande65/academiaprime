import React, { useState } from 'react';
import Layout from './components/Layout';
import { AppMode, SectionType, AcademicOutput } from './types';
import { executeAcademicTask } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DRAFT);
  const [input, setInput] = useState('');
  const [section, setSection] = useState<SectionType>(SectionType.ABSTRACT);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<AcademicOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please provide input for the task.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await executeAcademicTask(mode, input, section, context);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getInputLabel = () => {
    switch (mode) {
      case AppMode.DRAFT: return 'Topic or Objective';
      case AppMode.ANALYZE: return 'Paper Text (Abstract or Body)';
      case AppMode.REVIEW: return 'Multiple Paper Findings / Abstracts';
      case AppMode.POLISH: return 'Text to Polish';
      case AppMode.GHOST_WRITER: return 'Draft for Human-Mimicry Transformation';
      default: return 'Source Content';
    }
  };

  const getInputPlaceholder = () => {
    switch (mode) {
      case AppMode.DRAFT: return "Describe your study objective...";
      case AppMode.REVIEW: return "Paste multiple abstracts or key findings here...";
      case AppMode.GHOST_WRITER: return "Paste robotic draft or research concepts to be humanized...";
      default: return "Paste your text here...";
    }
  };

  return (
    <Layout activeMode={mode} onModeChange={(m) => { setMode(m); setOutput(null); setInput(''); setError(null); }}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white min-h-full rounded-2xl p-6 shadow-sm border border-slate-200">
        
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-keyboard text-blue-500"></i> Input Configuration
            </h3>
            
            {mode === AppMode.DRAFT && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Section</label>
                <select 
                  value={section}
                  onChange={(e) => setSection(e.target.value as SectionType)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  {Object.values(SectionType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                {getInputLabel()}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="w-full h-48 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-mono"
              ></textarea>
            </div>

            {(mode === AppMode.DRAFT || mode === AppMode.REVIEW || mode === AppMode.GHOST_WRITER) && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Additional Context / Styling Scope</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={mode === AppMode.GHOST_WRITER ? "e.g., Increase burstiness, focus on clinical nuance..." : "e.g., Target Journal: Nature..."}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : mode === AppMode.GHOST_WRITER 
                    ? 'bg-purple-900 text-white hover:bg-purple-950 shadow-lg hover:shadow-xl active:scale-95'
                    : 'bg-slate-900 text-white hover:bg-black shadow-lg hover:shadow-xl active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  {mode === AppMode.GHOST_WRITER ? 'Calculating Linguistic Chaos...' : 'Synthesizing Academic Narrative...'}
                </>
              ) : (
                <>
                  <i className={`fas ${mode === AppMode.GHOST_WRITER ? 'fa-ghost' : 'fa-microscope'}`}></i>
                  {mode === AppMode.GHOST_WRITER ? 'Bypass Detection' : mode === AppMode.REVIEW ? 'Systematic Review' : 'Perform Action'}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3">
              <i className="fas fa-triangle-exclamation mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className={`fas ${mode === AppMode.GHOST_WRITER ? 'fa-user-secret text-purple-500' : 'fa-file-lines text-blue-500'}`}></i> {mode === AppMode.REVIEW ? 'Thematic Synthesis' : mode === AppMode.GHOST_WRITER ? 'Anti-Detection Draft' : 'Academic Output'}
              </h3>
              {output && (
                <div className="flex gap-2">
                   <button 
                    onClick={() => copyToClipboard(output.text)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
                    title="Copy to Clipboard"
                   >
                     <i className="fas fa-copy"></i>
                   </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
              {output ? (
                <div className="space-y-6">
                  <div className="prose prose-slate max-w-none academic-font text-lg leading-relaxed text-slate-800 whitespace-pre-wrap prose-table:text-sm prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-slate-200">
                    {output.text}
                  </div>
                  
                  {output.groundingSources && output.groundingSources.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Evidence Sources (Search Grounding)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {output.groundingSources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col group shadow-sm"
                          >
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 line-clamp-1">{source.title}</span>
                            <span className="text-[10px] text-slate-400 truncate">{source.uri}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {output.integrityReport && (
                    <div className={`mt-8 p-4 rounded-xl border ${mode === AppMode.GHOST_WRITER ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${mode === AppMode.GHOST_WRITER ? 'text-purple-700' : 'text-blue-700'}`}>
                        <i className={`fas ${mode === AppMode.GHOST_WRITER ? 'fa-dna' : 'fa-shield-check'}`}></i> {mode === AppMode.GHOST_WRITER ? 'Stylometry Analysis' : 'Synthesis Integrity Report'}
                      </h4>
                      <p className={`text-xs italic ${mode === AppMode.GHOST_WRITER ? 'text-purple-600' : 'text-blue-600'}`}>
                        {output.integrityReport}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <i className={`fas ${mode === AppMode.GHOST_WRITER ? 'fa-ghost' : 'fa-layer-group'} text-5xl opacity-20`}></i>
                  <p className="text-sm">Enter content and click generate to view results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
