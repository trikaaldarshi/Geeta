import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { VerseReader } from './components/VerseReader';
import { AskGita } from './components/AskGita';
import { SearchGita } from './components/SearchGita';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { AiTermsPage } from './components/AiTermsPage';
import { AuthorPage } from './components/AuthorPage';
import { ViewState, Language } from './types';

function App() {
  // Initialize state based on URL parameters for deep linking
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    const chapter = params.get('chapter');
    const verse = params.get('verse');
    
    if (chapter && verse && !isNaN(Number(chapter)) && !isNaN(Number(verse))) {
      return {
        view: 'read' as ViewState,
        target: { chapter: Number(chapter), verse: Number(verse) }
      };
    }
    return {
      view: 'home' as ViewState,
      target: null
    };
  };

  const initialState = getInitialState();

  const [currentView, setCurrentView] = useState<ViewState>(initialState.view);
  const [language, setLanguage] = useState<Language>('hi');
  const [targetVerse, setTargetVerse] = useState<{chapter: number, verse: number} | null>(initialState.target);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigateToVerse = (chapter: number, verse: number) => {
    setTargetVerse({ chapter, verse });
    setCurrentView('read');
  };

  const footerText = language === 'hi' 
    ? '"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" - तुम्हें अपना निर्धारित कर्तव्य करने का अधिकार है, लेकिन तुम कर्म के फलों के हकदार नहीं हो।'
    : '"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."';

  const footerCopyright = language === 'hi'
    ? `© ${new Date().getFullYear()} गीता ज्ञान। रिएक्ट और जेमिनी एआई द्वारा निर्मित।`
    : `© ${new Date().getFullYear()} Gita Wisdom. Built with React & Gemini AI.`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="animate-fade-in flex-grow">
        {currentView === 'home' && (
          <HomePage 
            setView={setCurrentView} 
            setChapter={(id) => {
               navigateToVerse(id, 1);
            }} 
            language={language}
          />
        )}
        {currentView === 'search' && (
          <SearchGita 
            onNavigateToVerse={navigateToVerse} 
            language={language}
          />
        )}
        {currentView === 'read' && (
          <VerseReader 
            initialChapterId={targetVerse?.chapter} 
            initialVerseNum={targetVerse?.verse} 
            language={language}
          />
        )}
        {currentView === 'ask' && (
          <AskGita language={language} />
        )}
        {currentView === 'about' && (
          <AboutPage language={language} />
        )}
        {currentView === 'author' && (
          <AuthorPage language={language} />
        )}
        {currentView === 'aiterms' && (
          <AiTermsPage language={language} />
        )}
        {currentView === 'login' && (
          <AdminLogin 
            onLogin={() => {
              setIsAdminAuthenticated(true);
              setCurrentView('admin');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard onLogout={() => {
              setIsAdminAuthenticated(false);
              setCurrentView('home');
            }} />
          ) : (
            <AdminLogin 
              onLogin={() => {
                setIsAdminAuthenticated(true);
                setCurrentView('admin');
              }}
              onCancel={() => setCurrentView('home')}
            />
          )
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif italic text-lg mb-4 text-stone-300">{footerText}</p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button 
                onClick={() => setCurrentView('about')}
                className="hover:text-amber-500 transition-colors"
              >
                {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
              </button>
              <button 
                onClick={() => setCurrentView('author')}
                className="hover:text-amber-500 transition-colors"
              >
                {language === 'hi' ? 'लेखक' : 'Author'}
              </button>
              <button 
                onClick={() => setCurrentView('aiterms')}
                className="hover:text-amber-500 transition-colors"
              >
                {language === 'hi' ? 'एआई शर्तें' : 'AI Terms'}
              </button>
              <button 
                onClick={() => setCurrentView('login')}
                className="hover:text-amber-500 transition-colors"
              >
                {language === 'hi' ? 'व्यवस्थापक लॉगिन' : 'Admin Login'}
              </button>
            </div>
            <p className="text-sm opacity-60 mt-2">{footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
