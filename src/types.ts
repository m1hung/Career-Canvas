export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export type FontOption = 'Inter' | 'Roboto' | 'Playfair Display' | 'Merriweather' | 'Montserrat' | 'Open Sans';
export type PaperSize = 'A4' | 'Letter';
export type Orientation = 'portrait' | 'landscape';

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  customCSS?: string;
  fontFamily?: FontOption;
  accentColor?: string;
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "janedoe.com",
    linkedin: "linkedin.com/in/janedoe",
  },
  accentColor: "#2563eb",
  summary: "Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior developers.",
  experience: [
    {
      id: "1",
      company: "Tech Innovators Inc.",
      position: "Senior Frontend Engineer",
      startDate: "Jan 2021",
      endDate: "Present",
      description: "- Led the migration of a legacy monolithic frontend to a modern React-based micro-frontend architecture, improving page load times by 40%.\n- Mentored a team of 4 junior developers, conducting code reviews and pair programming sessions.\n- Implemented a comprehensive CI/CD pipeline for the frontend using GitHub Actions.",
    },
    {
      id: "2",
      company: "Web Solutions LLC",
      position: "Software Developer",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      description: "- Developed and maintained multiple client-facing web applications using React and Node.js.\n- Collaborated with UX/UI designers to implement responsive and accessible interfaces.\n- Optimized database queries, reducing API response times by an average of 200ms.",
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      startDate: "Aug 2014",
      endDate: "May 2018",
      gpa: "3.8",
    }
  ],
  skills: [
    "JavaScript (ES6+)", "TypeScript", "React", "Node.js", "GraphQL", "Tailwind CSS", "Git", "Docker", "AWS"
  ],
  fontFamily: 'Inter',
  customCSS: `/* Complex Custom CSS Test */
.resume-document {
  --primary-color: #2563eb;
  --text-color: #1f2937;
}

.resume-name {
  background: linear-gradient(45deg, var(--primary-color), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

section h2 {
  position: relative;
  display: inline-block;
}

section h2::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

section:hover h2::after {
  transform: scaleX(1);
  transform-origin: left;
}`
};
