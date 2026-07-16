import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../components/CustomBtn';
import { Colors } from '../constants/theme';
import { fetchCategories } from '../hooks/categoriesReducer';
import { changeLocal } from '../hooks/Localization';
import { fetchProfile } from '../hooks/ProfileReducer';
import { ChooseSubCategories, fetchSubCategories } from '../hooks/subCategoriesReducer';
const fontScale = PixelRatio.getFontScale();

const ChooseMultiCategoriesScreen = () => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: categoriesData } = useSelector((state) => state?.categories);
  const { list: subCategoriesData } = useSelector((state) => state?.subCategories);
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [selectedLang, setSelectedLang] = useState(currentLocal?.language === "العربيه" ? "ar" : "en");
  const [category_id, setCategory_id] = useState('')
  const [subCategory_id, setSubCategory_id] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = categoriesData?.map((item) => ({
    label: `    ${currentLocal?.language == "العربيه" ? item.title_ar : item.title_en}`,
    value: item?.id?.toString(),

  }))
  const subCategories = subCategoriesData?.map((item) => ({
    label: `    ${currentLocal?.language == "العربيه" ? item.title_ar : item.title_en}`,
    value: item?.id?.toString(),

  }))

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])
  useEffect(() => {
    if (category_id) {

      dispatch(fetchSubCategories(category_id))

    }
  }, [category_id])
  const handlePress = () => {
    setLoading(true);
    dispatch(ChooseSubCategories({ sub_category_ids: [subCategory_id] }))
      .unwrap()
      .then(() => {
        setLoading(false);
        setCategory_id('');
        setSubCategory_id('');

        dispatch(fetchProfile())
        Alert.alert(currentLocal.home.addedSuccessfully)

      })
      .catch((err) => {
        console.log(err, "errerrerr");

        setLoading(false)
        Alert.alert(err)

      });
  }
  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom+75,

  }]}>

      <View>
        <Text allowFontScaling={false} style={[styles.title, { textAlign: currentLocal.language === "English" ? "left" : "right", marginBottom: 22 }]}>{currentLocal.home.addNewcraft}</Text>

        {/* change language */}
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
          <TouchableOpacity onPress={() => {
            dispatch(changeLocal("ar"));
            setSelectedLang('ar')

          }}>
            <Image
              source={require('../assets/images/emojione_flag-for-saudi-arabia.png')}
              style={selectedLang === 'ar' && styles.active}
            />
            <Text allowFontScaling={false} style={styles.itemText}>{currentLocal.home.arabic}</Text>
          </TouchableOpacity>
        </View>

        {/* form */}

        <View>

          <View style={{ marginBottom: 22 }}>
            {/* categories */}
            <Dropdown
              style={styles.dropdown}
              search

              placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
              selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
              itemTextStyle={{ fontFamily: 'BoldMoto' }}
              iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
              data={categories}
              labelField="label"

              valueField="value"
              placeholder={currentLocal.home.chooseCategoryPlaceholder}
              value={category_id}
              onChange={async (item) => {
                console.log(item);
                setCategory_id(item?.value)

              }}
              renderItem={(item, selected) => (
                <View style={{ padding: 10 }}>
                  <Text allowFontScaling={false}
                    style={{
                      fontFamily: 'BoldMoto',
                      color: '#000',
                      textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                    }}

                  >
                    {item?.label}
                  </Text>
                </View>
              )}
            />
          </View>
          {/* subcaegories */}


          <View style={{ marginBottom: 22 }}>
            {/* <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center" }}>
              <Text allowFontScaling={false} style={styles.name}>
                {currentLocal.home.subCategories_placeholder}</Text>
            
                <Text allowFontScaling={false} style={{ fontSize: 18, color: "red" }}>*</Text>



            </View> */}

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
              selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
              itemTextStyle={{ fontFamily: 'BoldMoto' }}
              data={subCategories}
              iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
              labelField="label"
              valueField="value"
              placeholder={currentLocal.home.chooseSubCategoryPlaceholder}
              value={subCategory_id}
              onChange={item => {
                setSubCategory_id(item.value)
              }}
              renderItem={(item, selected) => (
                <View style={{ padding: 10 }}>
                  <Text allowFontScaling={false}
                    style={{
                      fontFamily: 'BoldMoto',
                      color: '#000',
                      textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                    }}
                  >
                    {item?.label}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>


      <View>

        <CustomBtn title={currentLocal.home.add} onPressFun={handlePress} loading={loading} disabled={loading} />

      </View>
    </View>
  )
}

export default ChooseMultiCategoriesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 16,
    fontFamily: 'BoldMoto',
    marginTop: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 22,
  },
  itemText: {
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
  active: {
    borderWidth: 3,
    borderColor: Colors.light.tint,
    borderRadius: 50,
  },
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
    allowFontScaling: false

  },
  selectedTextStyle: {
    fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
    allowFontScaling: false
  },
})