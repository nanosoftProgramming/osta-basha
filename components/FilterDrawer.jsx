import Slider from '@react-native-community/slider';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilters, filterData } from '../hooks/filterationReducer';
import { fetchSubCategories } from '../hooks/subCategoriesReducer';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7; // Half of the screen

export default function FilterDrawer({ state, toggleDrawer }) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState();
  const [experience, setExperience] = useState(null);
  const [category, setCategory] = useState(null);

  const [day, setDay] = useState(null);
  const stateItem = useSelector((state) => state?.filterReducer);
  const [subCategoryId, setSubCategoryId] = useState(null);

  const { list: categories, loading: categoriesLoading } = useSelector((state) => state?.categories);

  const { list: subCategoriesData } = useSelector((state) => state?.subCategories);
  const { list: users } = useSelector((state) => state?.users);
  const maxPrice = useMemo(() => {
    if (!users || users.length === 0) return 700; // Default fallback

    const prices = users
      ?.map(item => {
        // Ensure we check the correct path to the price
        const price = Number(item?.profile?.price);
        return !isNaN(price) ? price : 0;
      });

    const highest = Math.max(...prices);

    // Return highest found, or fallback to 700 if all prices were 0
    return highest > 0 ? highest + 50 : 700;
  }, [users]);
  // const maxPrice = useMemo(() => {
  //   const prices = users
  //     ?.map(item => Number(item?.profile?.price))
  //     ?.filter(price => !isNaN(price));

  //   return prices?.length ? Math.max(...prices) : 0;
  // }, [users]);
  console.log(maxPrice, "maxPrice");

  // Shared value for animation (Initial position is off-screen)
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const { currentLocal } = useSelector((state) => state.Localization);
  console.log(category, "category");

  useEffect(() => {
    setSubCategoryId(stateItem?.filter?.[0]?.subcategorry_id)

    if (category) {
      dispatch(fetchSubCategories(category))

    } else {
      dispatch(fetchSubCategories(stateItem?.filter?.[0]?.category_id))

    }
  }, [stateItem?.filter?.[0]?.category_id, category, stateItem])
  // const toggleDrawer = () => {
  //   if (isOpen) {
  //     translateX.value = withTiming(-DRAWER_WIDTH); // Slide out
  //   } else {
  //     translateX.value = withTiming(0); // Slide in
  //   }
  //   setIsOpen(!isOpen);
  // };
  useEffect(() => {
    setSubCategoryId(stateItem?.filter?.[0]?.sub_category_id)
    setPrice(stateItem?.filter?.[0]?.price)
    setExperience(stateItem?.filter?.[0]?.experience)
  }, [stateItem?.filter?.[0]?.sub_category_id, stateItem?.filter?.[0]?.price, stateItem?.filter?.[0]?.experience])

  const renderSubCategories = () => {
    return (
      <View style={[styles.row, { flexDirection: currentLocal.language === 'العربيه' ? "row-reverse" : "row" }]}>
        {subCategoriesData.map((exp, idx) => (
          <TouchableOpacity
            key={exp.id || idx}
            style={[
              styles.expButton,
              (subCategoryId === exp.id) && styles.selectedExp]}
            onPress={() => setSubCategoryId(exp.id)}
          >
            <Text
              allowFontScaling={false}
              style={[styles.expText, (subCategoryId === exp.id) && { color: '#fff' }]}
            >
              {currentLocal.language === 'العربيه' ? exp?.title_ar : exp.title_en}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderCategories = () => {


    return (
      <View style={currentLocal.language == 'العربيه' ? [styles.row, { flexDirection: "row-reverse" }] : [styles.row, { flexDirection: "row" }]}>
        {categories.map((exp, idx) => {

          return (
            <TouchableOpacity
key={exp.id || idx}
              style={[
                styles.expButton,
                category === exp.id && styles.selectedExp,
              ]}
              onPress={() => {
                console.log(exp.id, "exp.id");
                console.log(category);
                
                setCategory(exp.id)
              }}
            >
              <Text allowFontScaling={false} style={currentLocal?.language == "العربيه" ? styles.expText : [styles.expText, { fontSize: 12 }]}>{currentLocal?.language == "العربيه" ? exp.title_ar : exp.title_en}</Text>

            </TouchableOpacity>
          )
        })}
      </View>
    );
  };
  const renderworkingHours = () => {

    return (
      <View style={currentLocal.language == 'العربيه' ? [styles.row, { flexDirection: "row-reverse" }] : [styles.row, { flexDirection: "row" }]}>

        {[currentLocal.home.Sunday, currentLocal.home.Monday, currentLocal.home.Tuesday, currentLocal.home.Wednesday, currentLocal.home.Thursday, currentLocal.home.Friday, currentLocal.home.Saturday].map((exp, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.expButton,
                day === exp && styles.selectedExp,
              ]}
              onPress={() => {
                setDay(exp)

              }}
            >
              <Text allowFontScaling={false} style={{ fontFamily: 'SemiBoldMoto' }}>{exp}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  };
  const renderexperience_years_placeholder = () => {

    return (
      <View style={currentLocal.language == 'العربيه' ? [styles.row, { flexDirection: "row-reverse" }] : [styles.row, { flexDirection: "row" }]}>

        {[1, 2, 3, 4, '5+'].map((exp, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.expButton,
              experience === exp && styles.selectedExp,
            ]}
            onPress={() => {
              setExperience(exp == "5+" ? "inc5" : exp)

            }}
          >
            <Text allowFontScaling={false} style={{ fontFamily: 'SemiBoldMoto' }}>{exp}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };
  const renderexaverageCostLabel = () => {

    return (
      <>
        <Slider
          style={{ width: '90%' }}
          minimumValue={0}
          maximumValue={Number(maxPrice + 50) || 700}
          step={10}
          value={price}
          onValueChange={setPrice}
          minimumTrackTintColor="#7D3CFF"
        />
        <Text allowFontScaling={false} style={styles.priceText}> {price}</Text>

      </>)
  };
  const items = state === "categories"
    ? [
      { id: 1, name: currentLocal.home.subcategoriesLabel, content: renderSubCategories() },
      { id: 3, name: currentLocal.home.experience_years_placeholder, content: renderexperience_years_placeholder() },
      { id: 4, name: currentLocal.home.averageCostLabel, content: renderexaverageCostLabel() },
    ]
    : [
      { id: 0, name: currentLocal.home.categoriesLabel, content: renderCategories() },
      { id: 1, name: currentLocal.home.subcategoriesLabel, content: renderSubCategories() },
      { id: 3, name: currentLocal.home.experience_years_placeholder, content: renderexperience_years_placeholder() },

      ...(state !== "shop-owners"
        ? [
          {
            id: 4,
            name: currentLocal.home.averageCostLabel,
            content: renderexaverageCostLabel(),
          },
        ]
        : []),
    ];
  console.log(state);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item?.id?.toString()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 20 : 20 }}
        renderItem={({ item }) => {

          return (
            <View style={styles.itemContainer}>
              <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "right" }] : [styles.label, { textAlign: "left" }]}>{item?.name}</Text>
              <View>{item?.content}</View>
            </View>
          )
        }}
      />

      <>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.resetButton}
            onPress={() => {
              if (state == "categories") {
                dispatch(filterData({ experience: null, day: null, price: null, subcategorry_id: null }));

              } else {
                dispatch(clearFilters());
                setCategory(null);

              }
              // dispatch(filterData({ experience: null, day: null, price: null }));
              toggleDrawer()
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#7D3CFF', fontFamily: 'SemiBoldMoto' }}>
              {currentLocal.home.resetText}
            </Text>

          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}
            onPress={() => {
              dispatch(filterData({ experience: experience, day: day, category_id: category, subcategorry_id: subCategoryId, price: price }));

              toggleDrawer()


              // closeModal()
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#fff', fontFamily: 'SemiBoldMoto' }}>
              {currentLocal.home.searchText}
            </Text>
          </TouchableOpacity>
        </View>
      </>
      {/* Overlay Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer()
          }
        />
      )}

      {/* Animated Side Drawer */}
      {/* <Animated.View style={[styles.drawer, animatedStyle]}>
        <Text style={styles.title}>Filters</Text>
        <View style={styles.content}>
           <Text>Category</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={toggleDrawer}>
          <Text>Apply</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 28 },
  button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 8 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    zIndex: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16, marginVertical: 10, fontFamily: "SemiBoldMoto", textAlign: "right"

  },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 40 },
  content: { marginTop: 20, gap: 15 },
  closeBtn: { marginTop: 'auto', padding: 15, backgroundColor: '#eee', alignItems: 'center' },
  row: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  expButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
    borderColor: '#ccc',
  },
  selectedExp: {
    backgroundColor: '#7D3CFF',
    borderColor: '#7D3CFF',
    color: '#fff',
    fontFamily: "SemiBoldMoto"
  },
  expText: {
    fontFamily: "SemiBoldMoto"
  },
  priceText: { marginVertical: 5, fontFamily: "SemiBoldMoto" },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: "90%",
  },
  resetButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#7D3CFF',
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    width: "49%",
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#7D3CFF',
    borderRadius: 10,
    alignItems: 'center',
    width: "49%",


  }
});