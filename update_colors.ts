import fs from 'fs';

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace indigo with zinc for a more professional monochromatic look
  content = content.replace(/bg-indigo-600/g, 'bg-zinc-900 dark:bg-zinc-100');
  content = content.replace(/text-indigo-600/g, 'text-zinc-900 dark:text-zinc-100');
  content = content.replace(/border-indigo-600/g, 'border-zinc-900 dark:border-zinc-100');
  
  content = content.replace(/bg-indigo-50/g, 'bg-zinc-100');
  content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-zinc-200');
  
  content = content.replace(/dark:bg-indigo-900\/30/g, 'dark:bg-zinc-800/50');
  content = content.replace(/dark:hover:bg-indigo-900\/50/g, 'dark:hover:bg-zinc-800');
  
  content = content.replace(/dark:text-indigo-400/g, 'dark:text-zinc-100');
  content = content.replace(/dark:border-indigo-400/g, 'dark:border-zinc-100');
  
  content = content.replace(/hover:text-indigo-700/g, 'hover:text-zinc-700 dark:hover:text-zinc-300');
  
  // Replace generic gray with zinc
  content = content.replace(/gray-/g, 'zinc-');
  
  // Replace blue focus rings with zinc
  content = content.replace(/focus:ring-blue-500/g, 'focus:ring-zinc-900 dark:focus:ring-zinc-100');
  content = content.replace(/focus-within:ring-blue-500/g, 'focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100');

  // Fix up the primary button text (since bg is zinc-900/zinc-100, text should be white/zinc-900)
  // "text-white bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200"
  content = content.replace(/text-white bg-zinc-900 dark:bg-zinc-100/g, 'text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100');
  
  // Fix the logo block
  content = content.replace(/w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white font-bold/g, 'w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 font-bold');

  fs.writeFileSync(filePath, content);
}

replaceColors('src/App.tsx');
replaceColors('src/components/ResumeEditor.tsx');
replaceColors('src/components/ImportModal.tsx');
