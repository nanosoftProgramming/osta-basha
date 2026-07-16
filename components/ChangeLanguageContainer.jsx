import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { changeLocal } from '../hooks/Localization';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '@/constants/theme';

const ChangeLanguageContainer = ({ title }) => {
    const dispatch = useDispatch();
      const { currentLocal } = useSelector((state) => state.Localization);
  const [selectedLang, setSelectedLang] = useState(currentLocal?.language === "العربيه" ? "ar" : "en");

  return (
    <View style={styles.container}>
      {title&&
          <Text allowFontScaling={false} style={styles.subTitle}>{title}</Text>
      }
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
              dispatch(changeLocal('en'))
              setSelectedLang('en')
            }
            }>
              <Image source={require('../assets/images/emojione_flag-for-united-states.png')}
                style={selectedLang === 'en' && styles.active}

              />
              <Text allowFontScaling={false} style={styles.itemText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              dispatch(changeLocal('ar'))

              setSelectedLang('ar')

            }

            }>
              <Image source={require('../assets/images/emojione_flag-for-saudi-arabia.png')}
                style={selectedLang === 'ar' && styles.active}

              />
              <Text allowFontScaling={false} style={styles.itemText}>العربية</Text>
            </TouchableOpacity>
          </View>
    </View>
  )
}

export default ChangeLanguageContainer

const styles = StyleSheet.create({
  container:{
    width:"100%",

  },
  subTitle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MediumMoto",
    marginTop: 22
  },
    itemContainer: {
    flexDirection: "row",
     justifyContent: "space-around", 
     flexWrap: "wrap",
      marginVertical: 22,
  },
  itemText: {
    marginTop: 5,
    textAlign: "center",
    fontFamily: "BoldMoto",
  },
    active: {
    borderWidth: 3,
    borderColor: Colors.light.tint,
    borderRadius: 50,
  },

})