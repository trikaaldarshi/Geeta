import React from 'react';
import { Heart, Github, Mail, Globe } from 'lucide-react';
import { Language } from '../types';
import { FormattedText } from './FormattedText';

interface AuthorPageProps {
  language: Language;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ language }) => {
  const content = {
    title: language === 'hi' ? 'लेखक और निर्माण' : 'Author & Build',
    subtitle: language === 'hi' 
      ? 'भक्ति और तकनीक का संगम' 
      : 'Devotion meets Technology',
    
    authorText: language === 'hi'
      ? 'यह एप्लिकेशन **प्रेम और भक्ति** के साथ बनाया गया है। यह आधुनिक वेब प्रौद्योगिकियों की शक्ति और भारतीय विरासत की गहराई का प्रमाण है।'
      : 'This application was built with **love and devotion**. It stands as a testament to the power of modern web technologies and the depth of Indian heritage.',
      
    techStack: language === 'hi' ? 'तकनीकी विवरण' : 'Tech Stack',
    contact: language === 'hi' ? 'संपर्क करें' : 'Contact'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-4">
          <FormattedText text={content.title} />
        </h2>
        <div className="text-xl text-amber-600 dark:text-amber-500 font-medium">
          <FormattedText text={content.subtitle} />
        </div>
      </div>

      <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400">
            <Heart size={24} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">
            <FormattedText text={content.title} />
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              <FormattedText text={content.authorText} />
            </div>
            <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-2 text-sm uppercase tracking-wide">{content.contact}</h4>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-colors text-sm">
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-colors text-sm">
                <Globe size={16} />
                <span>Website</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-colors text-sm">
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-stone-200 dark:border-stone-700">
              <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-4 text-sm uppercase tracking-wide">{content.techStack}</h4>
              <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span> React 18 & TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-400 rounded-full"></span> Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span> Google Gemini AI (2.5 Flash)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span> Lucide Icons
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};