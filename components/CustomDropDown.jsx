// // import { Dimensions, PixelRatio, StyleSheet, Text, View } from 'react-native'
// // import React from 'react'
// // import { Dropdown } from 'react-native-element-dropdown'
// // import { Colors } from '../constants/theme'
// // import { useSelector } from 'react-redux'
// // const fontScale = PixelRatio.getFontScale();

// // const CustomDropDown = ({ data, value, onChangeFun, renderItem ,placeholder}) => {
//   // const { currentLocal } = useSelector((state) => state.Localization);

// //   return (
// //     <>
// //       <Dropdown
// //         style={styles.dropdown}
// //         placeholderStyle={[styles.placeholderStyle, currentLocal.language == 'العربيه' ? styles.arText : styles.enText]}
// //         selectedTextStyle={[styles.selectedTextStyle, currentLocal.language == 'العربيه' ? styles.arText : styles.enText]}
// //         itemTextStyle={styles.textStyle}
// //         iconStyle={currentLocal.language == 'العربيه' ? styles.ariconStyle : styles.eniconStyle}

// //         data={data}
// //         labelField="label"
// //         valueField="value"
// //         placeholder={placeholder}
// //         value={value}
// //         onChange={onChangeFun}
// //         renderItem={renderItem}
// //       />    </>
// //   )
// // }

// // export default CustomDropDown


// import { Dimensions, PixelRatio, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { Dropdown } from 'react-native-element-dropdown';
// import { Colors } from '../constants/theme'
// import { useSelector } from 'react-redux'
// const fontScale = PixelRatio.getFontScale();

// const CustomDropDown = ({ data, value, onChangeFun, renderItem ,placeholder}) => {
//   console.log(data,"data");
//   console.log(value,"value");
//   console.log(onChangeFun,"onChangeFun");
//   console.log(renderItem,"renderItem");
//   console.log(placeholder,"placeholder");

//   const { currentLocal } = useSelector((state) => state.Localization);



  
//   return (
//     <View>
//       <Text>CustomDropDown</Text>
//     </View>
//   )
// }

// export default CustomDropDown




import { Dimensions, PixelRatio, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../constants/theme';
import { useSelector } from 'react-redux';

const fontScale = PixelRatio.getFontScale();

const CustomDropDown = ({ data, value, onChangeFun, renderItem, placeholder }) => {
  const { currentLocal } = useSelector((state) => state.Localization);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={[styles.placeholderStyle, currentLocal.language === 'العربيه' ? styles.arText : styles.enText]}
      selectedTextStyle={[styles.selectedTextStyle, currentLocal.language === 'العربيه' ? styles.arText : styles.enText]}
      itemTextStyle={styles.textStyle}
      containerStyle={styles.containerStyle}
      iconStyle={currentLocal.language === 'العربيه' ? styles.ariconStyle : styles.eniconStyle}
      data={data || []}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={onChangeFun}
      renderItem={renderItem}
      // لإصلاح مشاكل الرندر في بعض الإصدارات:
      activeColor="#f0f0f0"
    />
  );
};

export default React.memo(CustomDropDown); // استخدام memo لتحسين الأداء

const styles = StyleSheet.create({
  dropdown: {
    height: Dimensions.get('screen').height / 16,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  placeholderStyle: {
    fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
    color: "#ddd"

  },
  enText: {
    textAlign: "left"
  },
  arText: {
    textAlign: "right"
  },


  textStyle: { fontFamily: 'BoldMoto' },
  ariconStyle: { position: "absolute", left: 10 },
  eniconStyle: { position: "absolute", right: 10 },
    
  selectedTextStyle: {
      fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
  },
})
