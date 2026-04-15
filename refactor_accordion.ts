import fs from 'fs';

let content = fs.readFileSync('src/components/ResumeEditor.tsx', 'utf8');

// 1. Update lucide-react imports
content = content.replace(
  "import { Sparkles, Plus, Trash2, GripVertical } from 'lucide-react';",
  "import { Sparkles, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';"
);

// 2. Add state for expanded items
const stateCode = `  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const [enhancingExpId, setEnhancingExpId] = useState<string | null>(null);
  const [expandedExpId, setExpandedExpId] = useState<string | null>(data.experience[0]?.id || null);
  const [expandedEduId, setExpandedEduId] = useState<string | null>(data.education[0]?.id || null);`;

content = content.replace(
  "  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);\n  const [enhancingExpId, setEnhancingExpId] = useState<string | null>(null);",
  stateCode
);

// 3. Update addExperience and addEducation to expand the new item
const addExpCode = `  const addExperience = () => {
    const newId = crypto.randomUUID();
    onChange({
      ...data,
      experience: [...data.experience, { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
    setExpandedExpId(newId);
  };`;

content = content.replace(
  /  const addExperience = \(\) => \{[\s\S]*?\};\n/,
  addExpCode + '\n'
);

const addEduCode = `  const addEducation = () => {
    const newId = crypto.randomUUID();
    onChange({
      ...data,
      education: [...data.education, { id: newId, institution: '', degree: '', startDate: '', endDate: '', gpa: '' }]
    });
    setExpandedEduId(newId);
  };`;

content = content.replace(
  /  const addEducation = \(\) => \{[\s\S]*?\};\n/,
  addEduCode + '\n'
);

// 4. Refactor Experience rendering
const experienceRender = `      {/* Experience */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
        </div>
        
        <div className="space-y-3">
          {data.experience.map((exp, index) => {
            const isExpanded = expandedExpId === exp.id;
            return (
            <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
              >
                <div className="flex-1 font-medium text-gray-900 dark:text-white truncate pr-4">
                  {exp.position || exp.company ? \`\${exp.position || 'Position'} at \${exp.company || 'Company'}\` : 'New Experience'}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove experience"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="text-gray-400 dark:text-gray-500">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Company</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Position</label>
                      <input 
                        type="text" 
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                      <input 
                        type="text" 
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g. Jan 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                      <input 
                        type="text" 
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description (Bullet Points)</label>
                      <button 
                        onClick={() => handleEnhanceExperience(exp.id, exp.description)}
                        disabled={enhancingExpId === exp.id || !exp.description}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <Sparkles size={12} />
                        {enhancingExpId === exp.id ? 'Enhancing...' : 'Enhance'}
                      </button>
                    </div>
                    <textarea 
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y bg-white dark:bg-gray-800 font-mono text-sm text-gray-900 dark:text-white"
                      placeholder="- Achieved X by doing Y..."
                    />
                  </div>
                </div>
              )}
            </div>
          )})}
          
          <button 
            onClick={addExperience}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>
      </section>`;

content = content.replace(
  /\{\/\* Experience \*\/\}[\s\S]*?\{\/\* Education \*\/\}/,
  experienceRender + '\n\n      {/* Education */}'
);

// 5. Refactor Education rendering
const educationRender = `      {/* Education */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h2>
        
        <div className="space-y-3">
          {data.education.map((edu) => {
            const isExpanded = expandedEduId === edu.id;
            return (
            <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setExpandedEduId(isExpanded ? null : edu.id)}
              >
                <div className="flex-1 font-medium text-gray-900 dark:text-white truncate pr-4">
                  {edu.degree || edu.institution ? \`\${edu.degree || 'Degree'} at \${edu.institution || 'Institution'}\` : 'New Education'}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove education"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="text-gray-400 dark:text-gray-500">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Institution</label>
                      <input 
                        type="text" 
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Degree / Field of Study</label>
                      <input 
                        type="text" 
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                      <input 
                        type="text" 
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                      <input 
                        type="text" 
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">GPA (Optional)</label>
                      <input 
                        type="text" 
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )})}
          
          <button 
            onClick={addEducation}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Plus size={18} />
            Add Education
          </button>
        </div>
      </section>`;

content = content.replace(
  /\{\/\* Education \*\/\}[\s\S]*?\{\/\* Skills \*\/\}/,
  educationRender + '\n\n      {/* Skills */}'
);

fs.writeFileSync('src/components/ResumeEditor.tsx', content);
