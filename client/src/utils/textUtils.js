// export const cleanText = (text) => {
//     return text.replace(/[^א-ת.,:'()\-/\s]/g, '');
//   };
export const cleanText = (text) => {
    const pattern = /[^א-ת.:,'()-/ ]/g
    return text.replace(pattern, '');
  };