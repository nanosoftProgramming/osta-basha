// const convertArabicToEnglishNumbers =  (text) => {
//   const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
//   const englishNumbers = ['0','1','2','3','4','5','6','7','8','9'];

//   return text.split('').map(char => {
//     const arabicIndex = arabicNumbers.indexOf(char);
//     if (arabicIndex !== -1) return englishNumbers[arabicIndex];

//     const englishIndex = englishNumbers.indexOf(char);
//     if (englishIndex !== -1) return arabicNumbers[englishIndex];

//     return char;
//   }).join('');
// };
// export default convertArabicToEnglishNumbers;
// 1. تصدير الدالة الأساسية باسم واضح
export const convertArabicToEnglishNumbers = (text, toLang) => {
  if (!text) return '';
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  return text.split('').map(char => {
    const enIndex = englishNumbers.indexOf(char);
    const arIndex = arabicNumbers.indexOf(char);

    if (toLang === 'العربيه' && enIndex !== -1) return arabicNumbers[enIndex];
    if (toLang === 'English' && arIndex !== -1) return englishNumbers[arIndex];
    
    return char;
  }).join('');
};

// 2. تصدير دالة السيرفر
export const formatForAPI = (text) => {
  if (!text) return '';
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let result = text;
  for (let i = 0; i < 10; i++) {
    result = result.replace(arabicNumbers[i], i?.toString());
  }
  return result;
};

