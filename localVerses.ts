import { LocalVerseContent } from './types';

// Add your custom verses here. Keys are formatted as "Chapter-Verse" (e.g., "1-1", "2-47")
export const LOCAL_VERSES: Record<string, LocalVerseContent> = {
  "1-1": {
    sanskrit: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
    transliteration: "dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva kim akurvata sañjaya",
    translations: {
      en: "O Sanjaya, assembled in the holy land of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?",
      hi: "हे संजय! धर्मभूमि कुरुक्षेत्र में एकत्रित, युद्ध की इच्छा रखने वाले मेरे और पाण्डु के पुत्रों ने क्या किया?"
    },
    meanings: {
      en: "Dhritarashtra asks Sanjaya about the situation on the battlefield. His question reveals his attachment to his own sons (mamakah) distinguishing them from the sons of Pandu, highlighting his lack of neutrality. This sets the stage for the conflict.",
      hi: "धृतराष्ट्र संजय से युद्धभूमि की स्थिति के बारे में पूछते हैं। उनका प्रश्न उनके अपने पुत्रों (मामकाः) के प्रति उनके मोह को दर्शाता है, जो उन्हें पाण्डु के पुत्रों से अलग करता है। यह उनकी निष्पक्षता की कमी को उजागर करता है और संघर्ष की पृष्ठभूमि तैयार करता है।"
    }
  },
  "2-47": {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi",
    translations: {
      en: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
      hi: "तुम्हें अपना निर्धारित कर्तव्य करने का अधिकार है, लेकिन तुम कर्म के फलों के हकदार नहीं हो। अपने आप को अपने कर्मों के परिणामों का कारण कभी मत समझो, और न ही अकर्मण्यता (कर्म न करने) में आसक्त होओ।"
    },
    meanings: {
      en: "This is one of the most famous verses of the Gita. Krishna advises Arjuna to focus entirely on the action itself (Karma) without worrying about the outcome. Attachment to results causes anxiety and hinders performance. One should do their duty selflessly.",
      hi: "यह गीता के सबसे प्रसिद्ध श्लोकों में से एक है। कृष्ण अर्जुन को सलाह देते हैं कि वे परिणाम की चिंता किए बिना पूरी तरह से कर्म पर ध्यान केंद्रित करें। परिणामों के प्रति आसक्ति चिंता का कारण बनती है और प्रदर्शन में बाधा डालती है। व्यक्ति को निस्वार्थ भाव से अपना कर्तव्य करना चाहिए।"
    }
  }
};

export const getLocalVerse = (chapter: number, verse: number): LocalVerseContent | null => {
  const key = `${chapter}-${verse}`;
  return LOCAL_VERSES[key] || null;
};
