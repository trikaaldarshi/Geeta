import React from 'react';
import { Cpu, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AiTermsPageProps {
  language: Language;
}

export const AiTermsPage: React.FC<AiTermsPageProps> = ({ language }) => {
  const content = {
    title: language === 'hi' ? 'एआई शर्तें और अस्वीकरण' : 'AI Terms & Disclaimer',
    subtitle: language === 'hi' 
      ? 'तकनीक की सीमाओं और उपयोग को समझना' 
      : 'Understanding the technology and its limitations',
    
    howItWorksTitle: language === 'hi' ? 'यह कैसे काम करता है' : 'How it Works',
    howItWorksText: language === 'hi'
      ? '"कृष्ण से पूछें" सुविधा गूगल के जेमिनी एआई (Gemini AI) द्वारा संचालित है। यह एक उन्नत भाषा मॉडल है जिसे भगवद गीता के संदर्भ में प्रश्नों का उत्तर देने के लिए निर्देशित किया गया है। यह गीता के श्लोकों और उनके पारंपरिक अर्थों के विशाल डेटाबेस का विश्लेषण करके आपके प्रश्नों के प्रासंगिक उत्तर तैयार करता है।'
      : 'The "Ask Krishna" feature is powered by Google\'s Gemini AI. It is an advanced large language model instructed to answer questions specifically within the context of the Bhagavad Gita. It analyzes the vast database of verses and traditional interpretations to generate relevant responses to your queries.',

    disclaimerTitle: language === 'hi' ? 'महत्वपूर्ण अस्वीकरण' : 'Important Disclaimer',
    disclaimerText: language === 'hi'
      ? 'हालाँकि एआई सटीक और सम्मानजनक होने का प्रयास करता है, यह एक मशीन है, कोई प्रबुद्ध गुरु नहीं। इसकी प्रतिक्रियाओं में त्रुटियां हो सकती हैं। इसका उपयोग चिंतन और मनन के लिए एक उपकरण के रूप में किया जाना चाहिए, न कि पेशेवर मानसिक स्वास्थ्य सलाह या पूर्ण शास्त्रीय अधिकार के रूप में। भावनात्मक संकट के मामलों में, कृपया किसी योग्य पेशेवर से संपर्क करें।'
      : 'While the AI strives to be accurate and respectful, it is a machine, not an enlightened guru. Its responses may contain errors or hallucinations. It should be used as a tool for contemplation and reflection, not as professional mental health advice or absolute scriptural authority. In cases of emotional distress, please consult a qualified professional.',

    privacyTitle: language === 'hi' ? 'डेटा और गोपनीयता' : 'Data & Privacy',
    privacyText: language === 'hi'
      ? 'आपकी बातचीत का उपयोग केवल आपको प्रतिक्रिया प्रदान करने के लिए किया जाता है। हम व्यक्तिगत पहचान योग्य जानकारी संग्रहीत नहीं करते हैं। कृपया एआई के साथ चैट करते समय कोई भी संवेदनशील व्यक्तिगत जानकारी साझा न करें।'
      : 'Your interactions are processed solely to provide you with a response. We do not store personally identifiable information from your chat sessions. Please do not share sensitive personal details while chatting with the AI.',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">{content.title}</h2>
        <p className="text-xl text-indigo-600 font-medium">{content.subtitle}</p>
      </div>

      <div className="grid gap-8">
        {/* Technology Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <Cpu size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800">{content.howItWorksTitle}</h3>
          </div>
          <p className="text-stone-600 leading-relaxed text-lg mb-4">
            {content.howItWorksText}
          </p>
          <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 p-3 rounded-lg w-fit">
            <Sparkles size={16} className="text-amber-500" />
            <span>Powered by Google Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-700">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-amber-900">{content.disclaimerTitle}</h3>
          </div>
          <p className="text-amber-900/80 leading-relaxed font-medium">
            {content.disclaimerText}
          </p>
        </div>

        {/* Privacy Section */}
        <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-stone-200 rounded-full text-stone-600">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800">{content.privacyTitle}</h3>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {content.privacyText}
          </p>
        </div>
      </div>
    </div>
  );
};
