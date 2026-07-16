import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../constants/theme';
import CustomDropDown from './CustomDropDown';
import { fetchSubCategories } from '../hooks/subCategoriesReducer';

const MultiSubCategories = ({ onChange }) => {
  const dispatch = useDispatch();
    const  list = useSelector((state) => state.authorization.userInfo);
      const { list: categories } = useSelector((state) => state?.categories);
      const { list: subCategories } = useSelector((state) => state?.subCategories);
      const { currentLocal } = useSelector((state) => state.Localization);
const [pairs, setPairs] = useState(
  (list?.profile?.sub_categories || []).map((item) => ({
    categoryId: item?.category_id?.toString() || "",
    subCategoryId: item?.id?.toString() || "",
    subCategories: [], // 👈 لازم Array دايمًا
  }))
);
useEffect(() => {
  if (onChange) {
    // 👇 رجّع بس الـ subCategoryIds أو كل البيانات حسب احتياجك
    const result = pairs.map(item => ({
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
    }));

    onChange(result);
  }
}, [pairs]);


  const categoriesData = useMemo(() => {
    return categories?.map((item) => ({
      label: currentLocal?.language == "العربيه" ? item.title_ar : item.title_en,
      value: item?.id?.toString(),
    })) || [];
  }, [categories, currentLocal.language]);
  const dropdownRenderItem = (item) => (
    <View style={styles.dropdownItem}>
      <Text allowFontScaling={false} style={[styles.dropdownItemText, currentLocal.language == "English" ? styles.enText : styles.arText]}>
        {item.label}
      </Text>
    </View>
  );
  console.log(list?.profile?.sub_categories,"listlist");
  
  const handleCategoryChange = async (index, value) => {
  const updated = [...pairs];
  updated[index].categoryId = value;
  updated[index].subCategoryId = "";

  setPairs(updated); // 👈 مهم قبل API (عشان rerender نظيف)

  const res = await dispatch(fetchSubCategories(value));

  const data = Array.isArray(res?.payload?.data)
    ? res.payload.data
    : [];

  setPairs(prev => {
    const newPairs = [...prev];
    newPairs[index].subCategories = data;
    console.log(newPairs,"newPairsnewPairs");

    return newPairs;
  });
};

// const handleCategoryChange = async (index, value) => {
//   const updated = [...pairs];
//   updated[index].categoryId = value;
//   updated[index].subCategoryId = "";

//   // 👇 call API
//   const res = await dispatch(fetchSubCategories(value));

//   // 👇 خزّن subcategories في نفس الصف
//   updated[index].subCategories = res?.payload || [];

//   setPairs(updated);
// };
useEffect(() => {
  pairs.forEach(async (pair, index) => {
    if (pair.categoryId) {
      const res = await dispatch(fetchSubCategories(pair.categoryId));
console.log(res, "RES");
      setPairs(prev => {
        const updated = [...prev];
updated[index].subCategories = res?.payload?.data || [];
        return updated;
      });
    }
  });
}, []);
  return (
<View >
  <View style={styles.pairBox}>
{pairs.map((pair, index) => (
  <View key={index} style={styles.pairBox}>
    
    <Text
      style={[
        styles.sectionTitle,
        currentLocal.language === 'العربيه' ? styles.arText : styles.enText
      ]}
    >
      {`${currentLocal.language == "English" ? 'Service' : "خدمة"} ${index + 1}`}
    </Text>

    {/* category */}
    <CustomDropDown
      data={categoriesData}
      value={pair.categoryId}
      onChangeFun={(selected) => {
        handleCategoryChange(index, selected.value)
      }}
      placeholder={currentLocal.home.categoriesLabel}
      renderItem={dropdownRenderItem}
    />

    <View style={{ height: 10 }} />

    {/* sub category */}
    <CustomDropDown
      data={
        pair.subCategories?.map((item) => ({
          label: currentLocal?.language == "العربيه"
            ? item.title_ar
            : item.title_en,
          value: item?.id?.toString(),
        })) || []
      }
      value={pair.subCategoryId}
      onChangeFun={(selected) => {
        const updated = [...pairs];
        updated[index].subCategoryId = selected.value;
        setPairs(updated);
      }}
      placeholder={currentLocal.home.subcategoriesLabel}
      renderItem={dropdownRenderItem}
    />

  </View>
))}
        </View>
    </View>
  )
}

export default MultiSubCategories

const styles = StyleSheet.create({
    pairBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
    sectionTitle: {
      fontFamily: 'BoldMoto',
      fontSize: 14,
      marginBottom: 10,
      color: Colors.light.tint,
    },
      arText: { textAlign: "right" },
  enText: { textAlign: "left" },
    dropdownItemText: { fontFamily: 'BoldMoto', color: '#000' },
  dropdownItem: { padding: 10 },


})