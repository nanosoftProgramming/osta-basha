// import { Text, TextInput, I18nManager } from 'react-native';
// import { Redirect } from 'expo-router';

// // تنفيذ الإعدادات مرة واحدة فقط عند تحميل الكود
// I18nManager.allowRTL(false);
// I18nManager.forceRTL(false);

// // Text.defaultProps = Text.defaultProps || {};
// // Text.defaultProps.allowFontScaling = false;

// // TextInput.defaultProps = TextInput.defaultProps || {};
// // TextInput.defaultProps.allowFontScaling = false;

// export default function RootLayout() {
//   return <Redirect href="/(routes)/Splash" />;
// }

// export default index
import { Text, TextInput, I18nManager } from 'react-native';
import { Redirect } from 'expo-router';

const index = () => {
  I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

return <Redirect href="/(routes)/Splash" />
}

export default index