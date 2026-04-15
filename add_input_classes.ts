import fs from 'fs';

function addClasses(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/className="([^"]*transition-all[^"]*)"/g, (match, p1) => {
    let newClass = p1;
    if (newClass.includes('focus:ring-blue-500') || newClass.includes('focus:ring-indigo-500')) {
      if (!newClass.includes('bg-white') && !newClass.includes('bg-gray-50')) {
        newClass += ' bg-white dark:bg-gray-800';
      }
      if (!newClass.includes('text-gray-900')) {
        newClass += ' text-gray-900 dark:text-white';
      }
    }
    return `className="${newClass}"`;
  });

  fs.writeFileSync(filePath, content);
}

addClasses('src/components/ResumeEditor.tsx');
addClasses('src/components/ImportModal.tsx');
