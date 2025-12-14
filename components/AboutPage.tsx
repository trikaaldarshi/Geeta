import React from 'react';
import { Info } from 'lucide-react';
import { Language } from '../types';

interface AboutPageProps {
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language }) => {
  const content = {
    title: language === 'hi' ? 'हमारे बारे में' : 'About Us',
    subtitle: language === 'hi' 
      ? 'प्राचीन ज्ञान और आधुनिक तकनीक का संगम' 
      : 'Bridging Ancient Wisdom with Modern Technology',
    
    missionTitle: language === 'hi' ? 'हमारा उद्देश्य' : 'Our Mission',
    missionText: language === 'hi'
      ? 'गीता ज्ञान एक डिजिटल अभ्यारण्य है जिसे श्रीमद्भगवद्गीता के शाश्वत ज्ञान को सभी के लिए सुलभ बनाने के लिए डिज़ाइन किया गया है। पारंपरिक संस्कृत श्लोकों को आधुनिक अनुवादों और एआई-संचालित अंतर्दृष्टि के साथ जोड़कर, हमारा उद्देश्य प्राचीन आध्यात्मिकता और समकालीन जीवन के बीच की खाई को पाटना है।'
      : 'Gita Wisdom is a digital sanctuary designed to make the eternal wisdom of the Shrimad Bhagavad Gita accessible to everyone. By combining traditional Sanskrit verses with modern translations and AI-powered insights, we aim to bridge the gap between ancient spirituality and contemporary life.'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">{content.title}</h2>
        <p className="text-xl text-amber-600 font-medium">{content.subtitle}</p>
      </div>

      <div className="grid gap-8">
        {/* Mission Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Info size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800">{content.missionTitle}</h3>
          </div>
          <p className="text-stone-600 leading-relaxed text-lg">
            {content.missionText}
          </p>
        </div>
      </div>
      
      <div className="text-center mt-12 text-stone-400 text-sm">
        <p>Version 1.0.0 • © {new Date().getFullYear()} Gita Wisdom</p>
      </div>
    </div>
  );
};
