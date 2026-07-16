import { useState } from 'react';
import { Dimensions, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from "../constants/theme";
import { Entypo } from '@expo/vector-icons';
import { locationData } from '../hooks/LoacationSettings';
export default function CustomLabelInput({ phoneState,numberonly, label, multiline, customStyle, value, isPassword, onChangeText, showPassword, setShowPassword }) {
  const { currentLocal } = useSelector((state) => state.Localization);
  const dispatch=useDispatch();
  const location = useSelector((state) => state.location);  
  const isRTL = currentLocal?.language === "العربيه";
  const fontScale = PixelRatio.getFontScale();
  const [countryCode, setCountryCode] = useState(location?.callingCode_en?location?.callingCode_en:"+967");
  const [visible, setVisible] = useState(false);
console.log(location?.callingCode);

  return (
    <View style={styles.container}>
      {isPassword &&
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={
          currentLocal.language === 'العربيه' ?
            { position: "absolute", left: "4%", top: "25%", zIndex: 100000000, }
            :

            { position: "absolute", right: "4%", top: "25%", zIndex: 100000000 }


        }>
          {showPassword ? (
            <Entypo name="eye" size={24} color="#333" />
          ) : (
            <Entypo name="eye-with-line" size={24} color="#333" />
          )}
        </TouchableOpacity>
      }
      <View style={[styles.inputWrapper, isRTL && { flexDirection: 'row-reverse' }]}>
        <CountryPicker
          show={visible}
          textProps={{ allowFontScaling: false }}
          onBackdropPress={() => setVisible(false)}
          lang={currentLocal.language === 'العربيه' ? 'ar' : 'en'}
          inputPlaceholder={currentLocal.home.countrySearchPlaceholder}
          allowFontScaling={false}
          pickerButtonOnPress={async (item) => {
            setCountryCode(item.dial_code);
                  dispatch(locationData({
                      callingCode_en: item.dial_code,
                    }));
            setVisible(false);
          }}
          style={{
            modal: {
              height: Dimensions.get('screen').height / 1.8,
              allowFontScaling: false
            },
            textInput: {
              height: 60, borderRadius: 0, allowFontScaling: false
            },
            countryButtonStyles: {
              height: 50,
              allowFontScaling: false
            },
            dialCode: {
              allowFontScaling: false,
              fontSize: 16 / fontScale,


            },
            countryName: {
              allowFontScaling: false,
              fontSize: 16 / fontScale,

            }

          }}

        />
        {phoneState && (
          <TouchableOpacity
            style={currentLocal?.language==="English"?styles.pickerButtonEN:styles.pickerButton}
            onPress={() => {
              setVisible(true)
            }}
          >

            <Text allowFontScaling={false} style={styles.callingCodeText}>{countryCode}</Text>
          </TouchableOpacity>
        )}


        <View style={{ flex: 1 }}>
          <FloatingLabelInput
            label={label}
            mode="outlined"
        keyboardType={numberonly ? "number-pad":"default"}
            value={value}
            secureTextEntry={!showPassword}
            onChangeText={onChangeText}
            containerStyles={phoneState?currentLocal.language === 'العربيه' ?[styles.phoneinputContainer, customStyle] :[styles.en_phoneinputContainer, customStyle]:[styles.inputContainer, customStyle]}
            inputStyles={{
              textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left',
              fontFamily: 'MediumMoto',
              allowFontScaling: false,
              fontSize: 16 / fontScale,
              height: multiline
                ? Dimensions.get('screen').height / 10
                : 48,
              paddingTop: multiline ? 15 : 10,

            }}
            labelProps={{
              allowFontScaling: false,
            }}


            customInputProps={{
              textAlignVertical: multiline ? 'top' : 'top',
              allowFontScaling: false,

            }}
            labelStyles={{
              fontFamily: 'MediumMoto',
              backgroundColor: 'white',
              position: 'absolute',
              allowFontScaling: false,
              width: "auto",
              [currentLocal.language === 'العربيه' ? 'right' : 'left']: 0,
              top: multiline ? Dimensions.get('screen').height / 20 / 4 : undefined,
              textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left'
            }}
            customLabelStyles={{
              fontSizeFocused: 14,
              topFocused: -25,
              topBlurred: -5,
              allowFontScaling: false,

            }}
            isRTL={currentLocal.language === 'العربيه'}


          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 22,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderStartWidth: 0,
    height: "100%",
    marginStart: -12

  },
  pickerButtonEN: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderEndWidth: 0,
    height: "100%",
    marginEnd: -10

  },
  callingCodeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
  },
  inputStyle: {
    backgroundColor: '#F9F9F9',
    flex: 1,
    height: "100%",

  },
  label: {
    fontFamily: "MediumMoto",
    allowFontScaling: false,


  },

  enLabel: {
    fontFamily: 'MediumMoto',
    allowFontScaling: false,

  },
  inputContainer: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
    borderRadius: 12,

    paddingHorizontal: 8,
    paddingVertical: 4

  },
  phoneinputContainer: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
        borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4

  },
  en_phoneinputContainer: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
        borderTopEndRadius: 12,
    borderBottomEndRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4

  }
});