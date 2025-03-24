/**
 * Formats text with markdown-like syntax
 * - **text** for bold
 * - _text_ for italic
 * - ~text~ for underline
 * 
 * @param {string} text - The text to format
 * @returns {string} - HTML formatted text
 */
export const formatText = (text) => {
  if (!text) return '';

  // Format bold text: **text** -> <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Format italic text: _text_ -> <em>text</em>
  formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');

  // Format underlined text: ~text~ -> <u>text</u>
  formattedText = formattedText.replace(/~(.*?)~/g, '<u>$1</u>');

  // Convert line breaks to <br> tags
  formattedText = formattedText.replace(/\n/g, '<br />');

  return formattedText;
};

/**
 * Checks if text contains formatting markers
 * 
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains formatting
 */
export const hasFormatting = (text) => {
  if (!text) return false;

  const boldPattern = /\*\*(.*?)\*\*/;
  const italicPattern = /_(.*?)_/;
  const underlinePattern = /~(.*?)~/;
  const lineBreakPattern = /\n/;

  return boldPattern.test(text) || italicPattern.test(text) || 
  underlinePattern.test(text) || lineBreakPattern.test(text);
}; 