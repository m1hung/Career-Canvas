import fs from 'fs';

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix double replacements
  content = content.replace(/dark:text-gray-400 dark:text-gray-500/g, 'dark:text-gray-400');
  content = content.replace(/dark:border-gray-700 dark:border-gray-700/g, 'dark:border-gray-700');
  content = content.replace(/dark:bg-gray-800 dark:bg-gray-800/g, 'dark:bg-gray-800');
  content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
  
  // Add dark mode text and bg to inputs and textareas if missing
  content = content.replace(/<input([^>]+)className="([^"]+)"/g, (match, p1, p2) => {
    let newClass = p2;
    if (!newClass.includes('bg-white') && !newClass.includes('bg-transparent')) {
      newClass += ' bg-white dark:bg-gray-800';
    }
    if (!newClass.includes('text-gray-900')) {
      newClass += ' text-gray-900 dark:text-white';
    }
    return `<input${p1}className="${newClass}"`;
  });

  content = content.replace(/<textarea([^>]+)className="([^"]+)"/g, (match, p1, p2) => {
    let newClass = p2;
    if (!newClass.includes('bg-white') && !newClass.includes('bg-gray-50')) {
      newClass += ' bg-white dark:bg-gray-800';
    }
    if (!newClass.includes('text-gray-900')) {
      newClass += ' text-gray-900 dark:text-white';
    }
    return `<textarea${p1}className="${newClass}"`;
  });

  fs.writeFileSync(filePath, content);
}

cleanFile('src/components/ResumeEditor.tsx');
cleanFile('src/components/ImportModal.tsx');
