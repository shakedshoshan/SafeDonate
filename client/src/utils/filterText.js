
function replaceTildeWithQuote(text) {
  return text.replace(/~/g, '"');
}

function removeChars(text) {
  return text.replace(/[^א-ת.:,'()-/ ]/g, " ");
}

function removeTilde(text) {
  return text.replace(/~/g, "");
}

export { replaceTildeWithQuote, removeChars, removeTilde };