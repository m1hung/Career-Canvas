import React, { forwardRef } from 'react';
import { ResumeData, PaperSize, Orientation } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type TemplateType = 'modern' | 'classic' | 'minimal';

interface ResumePreviewProps {
  data: ResumeData;
  template?: TemplateType;
  paperSize?: PaperSize;
  orientation?: Orientation;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ 
  data, 
  template = 'modern',
  paperSize = 'A4',
  orientation = 'portrait'
}, ref) => {
  const { personalInfo, summary, experience, education, skills, accentColor = "#2563eb" } = data;

  // Dimensions in pixels at 96 DPI
  const dimensions = {
    A4: { width: 794, height: 1123 },
    Letter: { width: 816, height: 1056 }
  };

  const currentSize = dimensions[paperSize];
  const width = orientation === 'portrait' ? currentSize.width : currentSize.height;
  const minHeight = orientation === 'portrait' ? currentSize.height : currentSize.width;

  const renderContactInfo = (className: string = "", iconSize: number = 14) => (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm ${className}`}>
      {personalInfo.email && (
        <div className="flex items-center gap-1">
          <Mail size={iconSize} />
          <span>{personalInfo.email}</span>
        </div>
      )}
      {personalInfo.phone && (
        <div className="flex items-center gap-1">
          <Phone size={iconSize} />
          <span>{personalInfo.phone}</span>
        </div>
      )}
      {personalInfo.location && (
        <div className="flex items-center gap-1">
          <MapPin size={iconSize} />
          <span>{personalInfo.location}</span>
        </div>
      )}
      {personalInfo.linkedin && (
        <div className="flex items-center gap-1">
          <Linkedin size={iconSize} />
          <span>{personalInfo.linkedin}</span>
        </div>
      )}
      {personalInfo.website && (
        <div className="flex items-center gap-1">
          <Globe size={iconSize} />
          <span>{personalInfo.website}</span>
        </div>
      )}
    </div>
  );

  const renderModern = () => (
    <div>
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
        <h1 className="resume-name text-4xl font-bold tracking-tight mb-2" style={{ color: accentColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {renderContactInfo("mt-3 text-zinc-600 dark:text-zinc-400")}
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700" style={{ borderBottomColor: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {summary}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700" style={{ borderBottomColor: accentColor }}>
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>{exp.position}</h3>
                  <span className="text-xs font-medium whitespace-nowrap ml-4 text-zinc-500 dark:text-zinc-400">
                    {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">{exp.company}</div>
                <div className="text-sm leading-relaxed whitespace-pre-line pl-4 text-zinc-700 dark:text-zinc-400" style={{ textIndent: '-1rem' }}>
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700" style={{ borderBottomColor: accentColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>{edu.institution}</h3>
                  <span className="text-xs font-medium whitespace-nowrap ml-4 text-zinc-500 dark:text-zinc-400">
                    {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="text-sm text-zinc-700 dark:text-zinc-300">{edu.degree}</div>
                  {edu.gpa && <div className="text-xs text-zinc-500 dark:text-zinc-400">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700" style={{ borderBottomColor: accentColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {skills.map((skill, index) => (
              <React.Fragment key={index}>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{skill}</span>
                {index < skills.length - 1 && <span className="text-zinc-300 dark:text-zinc-600">•</span>}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderClassic = () => (
    <div>
      <header className="text-center mb-6">
        <h1 className="resume-name text-4xl font-bold tracking-tight mb-3 uppercase" style={{ color: accentColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-zinc-700 dark:text-zinc-300">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.linkedin && personalInfo.website && <span>|</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-3 border-y py-1 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600" style={{ borderColor: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 text-justify">
            {summary}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-4 border-y py-1 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600" style={{ borderColor: accentColor }}>
            Professional Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>{exp.company}</h3>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-style: italic mb-2 text-zinc-800 dark:text-zinc-200">{exp.position}</div>
                <div className="text-sm leading-relaxed whitespace-pre-line pl-4 text-zinc-800 dark:text-zinc-300" style={{ textIndent: '-1rem' }}>
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-4 border-y py-1 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600" style={{ borderColor: accentColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>{edu.institution}</h3>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <div className="text-sm text-zinc-800 dark:text-zinc-200">{edu.degree}</div>
                  {edu.gpa && <div className="text-sm text-zinc-700 dark:text-zinc-300">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-4 border-y py-1 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600" style={{ borderColor: accentColor }}>
            Skills
          </h2>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 text-center leading-relaxed">
            {skills.join(' • ')}
          </p>
        </section>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column */}
      <div className="w-full md:w-1/3 space-y-6">
        <header>
          <h1 className="resume-name text-3xl font-bold tracking-tight mb-1" style={{ color: accentColor }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
        </header>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>
            Contact
          </h2>
          <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </section>

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>
              Skills
            </h2>
            <div className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              {skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{edu.degree}</h3>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{edu.institution}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3 space-y-6">
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>
              Profile
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100" style={{ color: accentColor }}>{exp.position}</h3>
                  <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {exp.company} • {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-line pl-4 text-zinc-700 dark:text-zinc-300" style={{ textIndent: '-1rem' }}>
                    {exp.description.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div 
      ref={ref} 
      className="resume-document mx-auto shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
      style={{ 
        width: `${width}px`,
        minHeight: `${minHeight}px`,
        padding: '40px 48px',
        fontFamily: data.fontFamily ? `'${data.fontFamily}', sans-serif` : undefined
      }}
    >
      {data.customCSS && <style dangerouslySetInnerHTML={{ __html: data.customCSS }} />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={template}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {template === 'modern' && renderModern()}
          {template === 'classic' && renderClassic()}
          {template === 'minimal' && renderMinimal()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
