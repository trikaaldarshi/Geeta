import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Helper to process italics within a string segment
  const processItalics = (str: string) => {
    return str.split(/(__.*?__)/g).map((part, index) => {
      if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
        return <em key={index} className="italic">{part.slice(2, -2)}</em>;
      }
      return part;
    });
  };

  // Split by bold markers first
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          // It's a bold section. Remove markers and process for nested italics.
          return (
            <strong key={i} className="font-bold text-current">
              {processItalics(part.slice(2, -2))}
            </strong>
          );
        }
        // It's regular text (or text between bold parts). Process for italics.
        return <React.Fragment key={i}>{processItalics(part)}</React.Fragment>;
      })}
    </span>
  );
};
