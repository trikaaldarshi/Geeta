import React from 'react';
import { BookOpen, MessageCircle, Home, Menu, X, Search, Languages } from 'lucide-react';
import { ViewState, Language } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, language, setLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const labels = {
    home: language === 'hi' ? 'होम' : 'Home',
    search: language === 'hi' ? 'खोजें' : 'Search',
    read: language === 'hi' ? 'गीता पढ़ें' : 'Read Gita',
    ask: language === 'hi' ? 'कृष्ण से पूछें' : 'Ask Krishna'
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        currentView === view
          ? 'bg-amber-100 text-amber-700 font-medium'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <span className="text-2xl font-serif font-bold text-amber-600">
              {language === 'hi' ? 'गीता' : 'Gita'}
              <span className="text-stone-800">{language === 'hi' ? 'ज्ञान' : 'Wisdom'}</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem view="home" icon={Home} label={labels.home} />
            <NavItem view="search" icon={Search} label={labels.search} />
            <NavItem view="read" icon={BookOpen} label={labels.read} />
            <NavItem view="ask" icon={MessageCircle} label={labels.ask} />
            
            <div className="h-6 w-px bg-stone-300 mx-2"></div>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm transition-colors"
            >
              <Languages size={16} />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-3">
             <button
              onClick={toggleLanguage}
              className="flex items-center px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs font-bold"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavItem view="home" icon={Home} label={labels.home} />
            <NavItem view="search" icon={Search} label={labels.search} />
            <NavItem view="read" icon={BookOpen} label={labels.read} />
            <NavItem view="ask" icon={MessageCircle} label={labels.ask} />
          </div>
        </div>
      )}
    </nav>
  );
};
