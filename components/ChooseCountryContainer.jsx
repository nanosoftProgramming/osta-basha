import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import * as countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js";
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountryPicker } from "react-native-country-codes-picker";
import { useDispatch, useSelector } from 'react-redux';
import { locationData } from '../hooks/LoacationSettings';
countries.registerLocale(enLocale);

const ChooseCountryContainer = ({ countries: countriesList }) => {
  const dispatch = useDispatch();
  const { currentLocal } = useSelector((state) => state.Localization);
  const [country, setCountry] = useState(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const getCountryISO = (countryName) => {
    return countries.getAlpha2Code(countryName, "en");
  };



  return (
    <View style={styles.container}>
      <View style={currentLocal?.language==="English"?styles.titleContainer:styles.artitleContainer}>
                <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
          <Text allowFontScaling={false} style={styles.title}>{currentLocal.home.seeMoreText}</Text>

        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.subTitle}>{currentLocal.home.select_country}</Text>


      </View>
      <View style={currentLocal.language==="العربيه"?styles.ar_countriesContainer:styles.countriesContainer}>
        {countriesList.map((item) => {
          return (
            <TouchableOpacity
              style={styles.countryContainer}
              key={item?.id}
              onPress={() => {
                const isoCode = getCountryISO(item?.title_en);
                const callingCode = getCountryCallingCode(isoCode);
                // const callingCodeAr = convertArabicToEnglishNumbers(callingCode, currentLocal.language);

                dispatch(locationData({
                  country_ar: item?.title_ar,
                  country_en: item?.title_en,
                  currancy: item?.currency_en,
                  currancy_ar: item?.currency_ar,
                  callingCode_en: "+" + callingCode,
                  // callingCode_ar: "+" + callingCodeAr,
                  countryCode: isoCode
                }))

                setCountry(item?.id)
              }}
            >
              <View>

                <Image source={{ uri: item?.image }} style={country == item?.id ? styles.activeflagImage : styles.flagImage} />
                <Text allowFontScaling={false} style={styles.name}>{currentLocal.language == 'العربيه' ? item?.title_ar : item?.title_en}</Text>

              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      <CountryPicker
        show={showCountryPicker}
        showCountryCode={false}

        style={{
          modal: {
            height: "75%",
          }
        }}
        lang={currentLocal.language === "العربيه" ? "ar" : "en"}

    pickerButtonOnPress={(item) => {

  dispatch(locationData({
    country_ar: item?.name?.ar,
    country_en: item?.name?.en,
    callingCode_en: item?.dial_code,
    countryCode: item?.code
  }));

  setShowCountryPicker(false);

  // router.push("(routes)/Login");  
                router.push({pathname:"/(routes)/Login",params:{previousScreen: '(routes)/Countries',}})

}}
        onBackdropPress={() => setShowCountryPicker(false)}
      />

    </View>
  )
}

export default ChooseCountryContainer

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    width: "100%",

  },
  subTitle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MediumMoto",
  },
  title: {
    textAlign: "right",
    fontFamily: "BoldMoto",
    fontSize: 15,
    textDecorationLine:"underline"
   },
  countriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ar_countriesContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center"
  },
  countryContainer: {
    width: "49%",
    marginBottom: 22,
    justifyContent: "center",
    alignItems: "center"
  },

  flagImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "white"

  }, activeflagImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: Colors.light.tint
  },

  name: {
    textAlign: "center",
    fontFamily: "BoldMoto",
    marginHorizontal: 5
  },
  titleContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  artitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }


})