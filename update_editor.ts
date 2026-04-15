import fs from 'fs';

let content = fs.readFileSync('src/components/ResumeEditor.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-white dark:bg-gray-800');
content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-gray-700');
content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-gray-700');
content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-gray-900');
content = content.replace(/bg-indigo-50/g, 'bg-indigo-50 dark:bg-indigo-900\/30');
content = content.replace(/text-indigo-600/g, 'text-indigo-600 dark:text-indigo-400');
content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-indigo-100 dark:hover:bg-indigo-900\/50');
content = content.replace(/text-gray-400/g, 'text-gray-400 dark:text-gray-500');
content = content.replace(/hover:text-red-500/g, 'hover:text-red-500 dark:hover:text-red-400');
content = content.replace(/border-gray-300/g, 'border-gray-300 dark:border-gray-600');
content = content.replace(/hover:border-gray-400/g, 'hover:border-gray-400 dark:hover:border-gray-500');
content = content.replace(/hover:text-gray-700/g, 'hover:text-gray-700 dark:hover:text-gray-300');

fs.writeFileSync('src/components/ResumeEditor.tsx', content);

let modalContent = fs.readFileSync('src/components/ImportModal.tsx', 'utf8');
modalContent = modalContent.replace(/bg-white/g, 'bg-white dark:bg-gray-800');
modalContent = modalContent.replace(/bg-gray-50\/50/g, 'bg-gray-50/50 dark:bg-gray-800/50');
modalContent = modalContent.replace(/border-gray-100/g, 'border-gray-100 dark:border-gray-700');
modalContent = modalContent.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
modalContent = modalContent.replace(/text-gray-400/g, 'text-gray-400 dark:text-gray-500');
modalContent = modalContent.replace(/hover:text-gray-600/g, 'hover:text-gray-600 dark:hover:text-gray-300');
modalContent = modalContent.replace(/hover:bg-gray-100/g, 'hover:bg-gray-100 dark:hover:bg-gray-700');
modalContent = modalContent.replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-300');
modalContent = modalContent.replace(/border-gray-200/g, 'border-gray-200 dark:border-gray-700');
modalContent = modalContent.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-300');

fs.writeFileSync('src/components/ImportModal.tsx', modalContent);
