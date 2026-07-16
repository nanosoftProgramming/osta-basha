import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'; // Ensure you have this Colors file in place
import { useSelector } from 'react-redux';
import { PixelRatio } from 'react-native';
const fontScale = PixelRatio.getFontScale();

const CustomInput = ({ ref, placeholder, placeholderTextColor, secureTextEntry, value, onChangeText, multiline = false,
}) => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const isRTL = currentLocal.language === 'العربيه';


  return (
    <TextInput
      ref={ref}
      placeholder={placeholder}
      style={[
        styles.input,
        multiline && styles.multilineInput,
        { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
      ]}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"} // key for multiline

    />
  )
}

export default CustomInput

const styles = StyleSheet.create({
  input: {
    fontFamily: "MediumMoto",
    color: "#000000",
    borderWidth: 1,
    borderColor: Colors.light.tint,
    minHeight: Dimensions.get('screen').height / 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 16 / fontScale,
    marginHorizontal: 2

  },
  multilineInput: {
    minHeight: Dimensions.get('screen').height / 8,
    paddingTop: 10,
  }
})