import translate from "translate";
translate.engine = "google";

// دالة مساعدة لتحويل الأرقام العربية/الفارسية إلى إنجليزية برمجياً
const convertToEnDigits = (str) => {
  return String(str).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
                    .replace(/[۰-۹]/g, (d) => "۰۱۲۳٤۵۶۷۸۹".indexOf(d));
};

export const translateAll = async (textInput, targetLang, numberInput = null) => {
  try {
    // 1. ترجمة النصوص
    let translatedText = "";
    if (textInput && textInput.trim() !== "") {
      translatedText = await translate(textInput, { to: targetLang });
    }

    // 2. معالجة الأرقام
    let formattedNumber = null;
    if (numberInput !== null && numberInput !== "") {
      // تحويل الأرقام العربية إلى إنجليزية أولاً لحل مشكلة NaN
      let cleanNumber = convertToEnDigits(numberInput);
      
      // إزالة أي رموز غير رقمية (مثل المسافات أو الفواصل)
      cleanNumber = cleanNumber.replace(/[^\d]/g, '');

      const locale = targetLang === 'ar' ? 'ar-EG' : 'en-US';
      
      formattedNumber = new Intl.NumberFormat(locale, { 
        useGrouping: false // لضمان عدم وجود فواصل
      }).format(cleanNumber);
    }

    return { 
      translatedText: translatedText || "", 
      formattedNumber: formattedNumber || String(numberInput) 
    };
  } catch (error) {
    console.error("Translation Error:", error);
    return { translatedText: textInput, formattedNumber: String(numberInput) };
  }
};