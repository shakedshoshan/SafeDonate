
const processText = (text) => {
    // First, remove any characters that are not in the allowed set
    const cleanText = text.replace(/[^א-ת.:,'()\/\-\s~]/g, '');

    return cleanText
        .replace(/([א-ת])~([א-ת])(\s)/g, '$1"$2$3')  // Case a: replace ~ with " and preserve space
        .replace(/~\s/g, '')                         // Case b: remove ~ followed by space
        .replace(/~/g, ' ');                         // Case c: replace remaining ~ with space
};


let inputText = ("להנציח את ה~ה יוסף ולנה וולינסקי ע~י פעילות תרבותית~ חינוכית דתית~ חברתית ומתן עזרה לנזקקים.");
console.log(processText(inputText));