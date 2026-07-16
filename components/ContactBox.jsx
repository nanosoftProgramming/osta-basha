
import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert, Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const ContactBox = ({ dataItem,subcategories }) => {
  const userinfo = useSelector((state) => state.authorization);
  const { currentLocal } = useSelector((state) => state.Localization);

//   const handleWhatsApp = async () => {
//     if (Object.keys(userinfo?.userInfo).length !== 0) {
//       const message = 'مرحبًا';
//       const token = userinfo.token;
//       const whatsappNumber =dataItem?.whatsapp_country_code + dataItem?.whatsapp
//       // const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
// const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

//       try {
//         await axios.post(
//           `https://nanosoft.technology/osta-basha/api/client/contact`,
//           { contactable_id: dataItem?.id },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Accept-Language": currentLocal.language === "العربيه" ? "ar" : "en",
//             },
//           }
//         );

//         const supported = await Linking.canOpenURL(url);
//         if (supported) {
//           await Linking.openURL(url);
//         } else {
//           Alert.alert( 'لا يمكن فتح واتساب. تأكد من تثبيت التطبيق.');
//         }
//       } catch (error) {
//         console.log("WhatsApp Error:", error);
//         Alert.alert("خطأ", error?.response?.data?.message || error.message || "حدث خطأ أثناء فتح واتساب");
//       }
//     } else {
//       router.push('(routes)/Login');
//     }
//   };

const handleWhatsApp = async () => {
  if(subcategories!=null){
  if (Object.keys(userinfo?.userInfo).length !== 0) {
const message = currentLocal.home.whatsappMsg

const token = userinfo.token;
    const whatsappNumber =dataItem?.whatsapp_country_code+dataItem?.whatsapp;

    const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    const fallbackUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    try {
      await axios.post(
        `https://nanosoft.technology/osta-basha/api/client/contact`,
        { contactable_id: dataItem?.id,sub_category_id:subcategories },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": currentLocal.language === "العربيه" ? "ar" : "en",
          },
        }
      );

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(fallbackUrl); // 👈 fallback للمتصفح
      }
    } catch (error) {
      Alert.alert("خطأ", error?.response?.data?.message || error.message || "حدث خطأ أثناء فتح واتساب");
    }
  } else {
    router.push('(routes)/Login');
  }
}else{
  Alert.alert(currentLocal.home.chooseSubCategoryPlaceholder)
}

};

  const handleCall = async () => {
    if(subcategories!=null){
    if (Object.keys(userinfo?.userInfo).length !== 0) {
      const token = userinfo.token;
      const phoneNumber = `tel:${dataItem?.country_code}${dataItem?.phone}`;
console.log(dataItem?.id);

      try {
        await axios.post(
          `https://nanosoft.technology/osta-basha/api/client/contact`,
          { contactable_id: dataItem?.id,sub_category_id:subcategories },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": currentLocal.language === "العربيه" ? "ar" : "en",
            },
          }
        );

        const supported = await Linking.canOpenURL(phoneNumber);
        if (supported) {
          await Linking.openURL(phoneNumber);
        } else {
          Alert.alert( 'الجهاز لا يدعم الاتصال الهاتفي');
        }
      } catch (error) {
        Alert.alert("خطأ", error?.response?.data?.message || error.message || "حدث خطأ أثناء الاتصال");
      }
    } else {
      router.push('(routes)/Login');
    }
  }
    else{
  Alert.alert(currentLocal.home.chooseSubCategoryPlaceholder)
}
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.boxContainer} onPress={handleWhatsApp}>
        <Text allowFontScaling={false}style={styles.textBox}>{currentLocal.home.useWhatsAppText}</Text>
        <FontAwesome name="whatsapp" size={25} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.boxContainer} onPress={handleCall}>
        <Text allowFontScaling={false}style={styles.textBox}>{currentLocal.home.Callbyphone}</Text>
        <FontAwesome name="phone" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ContactBox;

const styles = StyleSheet.create({
  container: {
    marginVertical: 22,
    flexDirection: 'row',
    paddingHorizontal: Dimensions.get('screen').width / 28,
    justifyContent: 'space-between',
  },
  boxContainer: {
    backgroundColor: Colors.light.tint,
    width: '49%',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    color: '#fff',
    fontFamily: 'MediumMoto',
    marginEnd: 7,
  },
});
