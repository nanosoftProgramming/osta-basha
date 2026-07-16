import { Colors } from '@/constants/theme'; // Ensure you have this Colors file in place
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
// import i18n from '@/i18n'; // Your i18n config file

const CustomCard = ({ item }) => {
      const { currentLocal } = useSelector((state) => state.Localization);

  // const handleWhatsApp = async () => {
    
  //     const message = 'مرحبًا';
  //     const url = `https://wa.me/${item?.client?.whatsapp_country_code+item?.client?.whatsapp}?text=${encodeURIComponent(message)}`;

    
  //       const supported = await Linking.canOpenURL(url);
  //       if (supported) {
  //         await Linking.openURL(url);
  //       } else {
  //         Alert.alert( 'لا يمكن فتح واتساب. تأكد من تثبيت التطبيق.');
  //       }

  // };

//   const handleWhatsApp = async () => {
//       const message = 'مرحبًا';
//       const whatsappNumber =item?.client?.whatsapp_country_code+item?.client?.whatsapp
// if(item?.client?.whatsapp==null){

// } else{

// }     
//       // const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
//       //   const supported = await Linking.canOpenURL(url);
//       //   if (supported) {
//       //     await Linking.openURL(url);
//       //   } else {
//       //     Alert.alert( 'لا يمكن فتح واتساب. تأكد من تثبيت التطبيق.');
//       //   }
 
 
//   };

      const handleCall =async () => {
       
        const phoneNumber = `tel:${item?.client?.country_code+item?.client?.phone}`; // replace with actual number
        Linking.openURL(phoneNumber);

      }
      const openInGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  Linking.openURL(url).catch(err => console.error('Error opening map:', err));
};
const isValidName = (name) =>
  typeof name === "string" &&
  name.trim() !== "" &&
  name.trim().toLowerCase() !== "null" &&
  name.trim().toLowerCase() !== "undefined";

  return (
    <View style={styles.card}>
    
{isValidName(item?.client?.first_name) && (
  <Text allowFontScaling={false}
    style={
      currentLocal.language === 'العربيه'
        ? [styles.label, { textAlign: "right" }]
        : [styles.label, { textAlign: "left" }]
    }
  >
    {currentLocal.home.clientLabel}{" "}
    <Text allowFontScaling={false}style={styles.value}>
      {item?.client?.first_name} {item?.client?.last_name}
    </Text>
  </Text>
)}

<Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "right" }] : [styles.label, { textAlign: "left" }]}>
  {currentLocal.home.phoneLabel} <Text allowFontScaling={false}style={styles.value}>{item?.client?.phone}</Text>
</Text>

      <View style={styles.rowBetween}>
    <Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "right" }] : [styles.label, { textAlign: "left" }]}>
  {currentLocal.home.dateLabel} <Text allowFontScaling={false}style={styles.value}>{item?.created_at?.slice(0, 10)}</Text>
</Text>
<Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "right" }] : [styles.label, { textAlign: "left" }]}>
  {currentLocal.home.timeLabel} <Text allowFontScaling={false}style={styles.value}>{item?.created_at?.slice(10)}</Text>
</Text>
      </View>
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginVertical:12}}>
{/* <TouchableOpacity style={styles.boxContainer} onPress={handleWhatsApp}>
<FontAwesome name="whatsapp" size={25} color="#fff" />
</TouchableOpacity> */}
<TouchableOpacity style={styles.boxContainer} onPress={handleCall}>
<FontAwesome name="phone" size={25} color="#fff" />

</TouchableOpacity>
<TouchableOpacity style={styles.boxContainer} onPress={() => openInGoogleMaps(item?.client?.lat, item?.client?.long)}>
<FontAwesome6 name="location-dot" size={24} color="white" />
  </TouchableOpacity>
</View>
    </View>
  );
};

const getStateStyle = (state) => {
  switch (state) {
    case 'تم التوصيل':
      return styles.delivered;
    case 'قيد التوصيل':
      return styles.pending;
    case 'ملغي':
      return styles.cancelled;
    default:
      return {};
  }
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5D21D2',
  },
  label: {
    fontSize: 12,
    color: '#444',
    marginBottom: 3,
    fontFamily:"SemiBoldMoto"
  },
  value: {
    fontWeight: '500',
    color: '#333',
    fontFamily:"SemiBoldMoto"

  },
  state: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily:"SemiBoldMoto"

  },
  delivered: {
    backgroundColor: '#DFF5E1',
    color: '#228B22',
  },
  pending: {
    backgroundColor: '#FFF5D6',
    color: '#D97904',
  },
  cancelled: {
    backgroundColor: '#FDE8E8',
    color: '#D32F2F',
  },
      boxContainer:{
  backgroundColor:Colors.light.tint,
  width: "30%",
  borderRadius:12,
  paddingVertical:12,
  flexDirection:"row",
  justifyContent:"center",
  alignItems:"center"
      },
      textBox:{
          color:"#fff",
          fontFamily:"MediumMoto",
          marginEnd:7
      }
});


