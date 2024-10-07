
function replaceTildeWithQuote(text) {
  return text.replace(/~/g, '"');
}

function removeTilde(text) {
  return text.replace(/~/g, "");
}

function replaceTildesAlgorithm(text) {
  // בדיקה שהמחרוזת מכילה רק תווים מותרים
  const cleanText = text.replace(/[^א-ת.:,'`()\/\-\s~]/g, '');

    return cleanText
        .replace(/([א-ת])~([א-ת])/g, '$1"$2')  // Case a: replace ~ with " and preserve space
        .replace(/\(([א-ת])~([א-ת])\)/g, '($1"$2)') // New case: replace ~ with " inside parentheses
        .replace(/~\s/g, ' ')                         // Case b: remove ~ followed by space
        .replace(/~/g, ' ');                         // Case c: replace remaining ~ with space
}

export { replaceTildeWithQuote, removeTilde, replaceTildesAlgorithm };