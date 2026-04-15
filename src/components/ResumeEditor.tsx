import React, { useState } from 'react';
import { ResumeData, Experience, Education } from '../types';
import { Sparkles, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { enhanceSummary, enhanceExperience } from '../lib/gemini';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism.css';
import { motion, AnimatePresence } from 'motion/react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const [enhancingExpId, setEnhancingExpId] = useState<string | null>(null);
  const [expandedExpId, setExpandedExpId] = useState<string | null>(data.experience[0]?.id || null);
  const [expandedEduId, setExpandedEduId] = useState<string | null>(data.education[0]?.id || null);
  const [skillsInput, setSkillsInput] = useState(data.skills.join(', '));
  const [showCSSGuide, setShowCSSGuide] = useState(false);

  // Sync skills input when data.skills changes from outside (e.g. undo/redo)
  React.useEffect(() => {
    const currentSkillsString = data.skills.join(', ');
    // Only update if the normalized versions differ to avoid cursor jumps while typing
    const normalizedInput = skillsInput.split(',').map(s => s.trim()).filter(Boolean).join(', ');
    if (currentSkillsString !== normalizedInput) {
      setSkillsInput(currentSkillsString);
    }
  }, [data.skills]);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleEnhanceSummary = async () => {
    if (!data.summary) return;
    setIsEnhancingSummary(true);
    try {
      const enhanced = await enhanceSummary(data.summary);
      onChange({ ...data, summary: enhanced });
    } catch (error) {
      alert("Failed to enhance summary.");
    } finally {
      setIsEnhancingSummary(false);
    }
  };

  const handleEnhanceExperience = async (id: string, description: string) => {
    if (!description) return;
    setEnhancingExpId(id);
    try {
      const enhanced = await enhanceExperience(description);
      onChange({
        ...data,
        experience: data.experience.map(exp => 
          exp.id === id ? { ...exp, description: enhanced } : exp
        )
      });
    } catch (error) {
      alert("Failed to enhance experience.");
    } finally {
      setEnhancingExpId(null);
    }
  };

  const addExperience = () => {
    const newId = crypto.randomUUID();
    onChange({
      ...data,
      experience: [...data.experience, { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
    setExpandedExpId(newId);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newId = crypto.randomUUID();
    onChange({
      ...data,
      education: [...data.education, { id: newId, institution: '', degree: '', startDate: '', endDate: '', gpa: '' }]
    });
    setExpandedEduId(newId);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const updateSkills = (value: string) => {
    setSkillsInput(value);
    const skillsArray = value.split(',').map(s => s.trim()).filter(Boolean);
    onChange({ ...data, skills: skillsArray });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-20"
    >
      {/* Personal Info */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" 
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Email</label>
            <input 
              type="email" 
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. jane@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Phone</label>
            <input 
              type="text" 
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Location</label>
            <input 
              type="text" 
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">LinkedIn</label>
            <input 
              type="text" 
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. linkedin.com/in/janedoe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Website</label>
            <input 
              type="text" 
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="e.g. janedoe.com"
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Professional Summary</h2>
          <button 
            onClick={handleEnhanceSummary}
            disabled={isEnhancingSummary || !data.summary}
            className="flex items-center gap-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="Enhance summary with AI"
          >
            <Sparkles size={14} />
            {isEnhancingSummary ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
        <textarea 
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all resize-y bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
          placeholder="Briefly describe your professional background and key strengths..."
        />
      </section>

            {/* Experience */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Experience</h2>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {data.experience.map((exp, index) => {
              const isExpanded = expandedExpId === exp.id;
              return (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 12 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                    title={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    <div className="flex-1 font-medium text-zinc-900 dark:text-white truncate pr-4 text-sm sm:text-base">
                      {exp.position || exp.company ? `${exp.position || 'Position'} at ${exp.company || 'Company'}` : 'New Experience'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                        className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove experience"
                      >
                        <Trash2 size={16} />
                      </button>
                      <motion.div 
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-zinc-400 dark:text-zinc-500"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 sm:p-4 pt-0 border-t border-zinc-200 dark:border-zinc-700 mt-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 mt-4">
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Company</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Position</label>
                            <input 
                              type="text" 
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Start Date</label>
                            <input 
                              type="text" 
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                              placeholder="e.g. Jan 2020"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">End Date</label>
                            <input 
                              type="text" 
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                              placeholder="e.g. Present"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description (Bullet Points)</label>
                            <button 
                              onClick={() => handleEnhanceExperience(exp.id, exp.description)}
                              disabled={enhancingExpId === exp.id || !exp.description}
                              className="flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                              title="Enhance description with AI"
                            >
                              <Sparkles size={12} />
                              {enhancingExpId === exp.id ? 'Enhancing...' : 'Enhance'}
                            </button>
                          </div>
                          <textarea 
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all resize-y bg-white dark:bg-zinc-800 font-mono text-sm text-zinc-900 dark:text-white"
                            placeholder="- Achieved X by doing Y..."
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )})}
          </AnimatePresence>
          
          <button 
            onClick={addExperience}
            className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center justify-center gap-2 mt-2"
            title="Add new experience section"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>
      </section>

            {/* Education */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Education</h2>
        
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {data.education.map((edu) => {
              const isExpanded = expandedEduId === edu.id;
              return (
                <motion.div 
                  key={edu.id}
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 12 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => setExpandedEduId(isExpanded ? null : edu.id)}
                    title={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    <div className="flex-1 font-medium text-zinc-900 dark:text-white truncate pr-4 text-sm sm:text-base">
                      {edu.degree || edu.institution ? `${edu.degree || 'Degree'} at ${edu.institution || 'Institution'}` : 'New Education'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                        className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove education"
                      >
                        <Trash2 size={16} />
                      </button>
                      <motion.div 
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-zinc-400 dark:text-zinc-500"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 sm:p-4 pt-0 border-t border-zinc-200 dark:border-zinc-700 mt-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Institution</label>
                            <input 
                              type="text" 
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Degree / Field of Study</label>
                            <input 
                              type="text" 
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Start Date</label>
                            <input 
                              type="text" 
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">End Date</label>
                            <input 
                              type="text" 
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">GPA (Optional)</label>
                            <input 
                              type="text" 
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )})}
          </AnimatePresence>
          
          <button 
            onClick={addEducation}
            className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center justify-center gap-2 mt-2"
            title="Add new education section"
          >
            <Plus size={18} />
            Add Education
          </button>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Skills</h2>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Comma-separated skills</label>
        <textarea 
          value={skillsInput}
          onChange={(e) => updateSkills(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all resize-y bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
          placeholder="React, TypeScript, Node.js, Project Management..."
        />
      </section>

      {/* Custom CSS */}
      <section className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Custom CSS</h2>
          <button 
            onClick={() => setShowCSSGuide(true)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
            title="CSS Styling Guide"
          >
            <Info size={18} />
          </button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Add custom styles to your resume preview. These styles will be included in the PDF export.</p>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 focus-within:border-transparent transition-all bg-zinc-50 dark:bg-zinc-900">
          <Editor
            value={data.customCSS || ''}
            onValueChange={(code) => onChange({ ...data, customCSS: code })}
            highlight={(code) => Prism.highlight(code, Prism.languages.css, 'css')}
            padding={12}
            className="font-mono text-sm text-zinc-900 dark:text-zinc-100"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              minHeight: '150px',
            }}
            textareaClassName="focus:outline-none"
          />
        </div>
      </section>

      {/* CSS Guide Modal */}
      <AnimatePresence>
        {showCSSGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCSSGuide(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-white">CSS Styling Guide</h3>
                <button 
                  onClick={() => setShowCSSGuide(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Common Selectors</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex flex-col">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">.resume-document</code>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">The main container of the resume.</span>
                      </li>
                      <li className="flex flex-col">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">.resume-name</code>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">The full name heading.</span>
                      </li>
                      <li className="flex flex-col">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">section h2</code>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">Section titles (Experience, Education, etc).</span>
                      </li>
                      <li className="flex flex-col">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">h3</code>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">Job titles and Institution names.</span>
                      </li>
                      <li className="flex flex-col">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">section p</code>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">Summary and description text.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Example Snippet</h4>
                    <pre className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto">
{`.resume-name {
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

section h2 {
  color: var(--primary-color);
  border-bottom: 2px solid;
}`}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end">
                <button 
                  onClick={() => setShowCSSGuide(false)}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
