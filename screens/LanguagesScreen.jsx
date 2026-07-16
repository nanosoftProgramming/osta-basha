import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import { changeLocal } from '../hooks/Localization';
import CustomBtn from '../components/CustomBtn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LanguagesScreen = () => {
    const insets = useSafeAreaInsets();

  const { currentLocal } = useSelector((state) => state.Localization);
  const { userInfo } = useSelector((state) => state.authorization);
  const dispatch = useDispatch();
  const [selectedLang, setSelectedLang] = useState(currentLocal?.language === "العربيه" ? "ar" : "en");

  const handleVerify = () => {
    if (userInfo?.type === "service_provider") {
      router.push('(users)/settings')

    } else if (userInfo?.type === "shop_owner") {
      router.push('(users)/settings')

    } else {
      router.push('(tabs)/settings')

    }
  }

  return (
    <View style={[styles.container,{paddingBottom:insets.bottom+10}]}>
      <View>
               <CommonHeader
          title={currentLocal.home.choose_language}
          filterState={false}
          currentLocal={currentLocal}
  
        />
        <View
          style={{

          }}
        >
          <Image source={require("../assets/images/LangImg.png")}
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              marginTop: 22
            }}
          />
        </View>
        <View>
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
              dispatch(changeLocal("en"));
              setSelectedLang('en')


            }}>
              <Image
                source={require('../assets/images/emojione_flag-for-united-states.png')}
                style={selectedLang === 'en' && styles.active}
              />
              <Text allowFontScaling={false} style={styles.itemText}>{currentLocal.home.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(changeLocal("ar"));
                setSelectedLang('ar')

              }}
            >
              <Image
                source={require('../assets/images/emojione_flag-for-saudi-arabia.png')}
                style={selectedLang === 'ar' && styles.active}
              />
              <Text allowFontScaling={false} style={styles.itemText}>{currentLocal.home.arabic}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
                  <CustomBtn title={currentLocal.home.edit} onPressFun={handleVerify}  />

      </View>

    </View>
  );
};

export default LanguagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
    justifyContent: 'space-between'
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'MediumMoto',
    marginTop: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: Dimensions.get('screen').height / 10,
  },
  itemText: {
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
  active: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderRadius: 50,
  },
  btnContainer: {
    backgroundColor: Colors.light.tint,
    height: Dimensions.get('screen').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 22,
    marginHorizontal: 22

  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BoldMoto',
  },
});
