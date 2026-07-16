// import { Colors } from '@/constants/theme'
// import { clearFilters } from '@/hooks/filterationReducer'
// import { toggleWishlistItem } from '@/hooks/wishlistReducer'
// import { Entypo, Ionicons } from '@expo/vector-icons'
// import Constants from 'expo-constants'
// import { router, usePathname } from 'expo-router'
// import { Dimensions, I18nManager, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { useDispatch, useSelector } from 'react-redux'

// const CommonHeader = ({ title, filterState, toggleFilterModal, wishlist, share,item }) => {
//  const pathname = usePathname();
//      const { currentLocal } = useSelector((state) => state.Localization);

//      const appName = Constants.expoConfig.name;

// const shareProduct = async () => {
//   try {
//     const productTitle = title;
//     const category =
//       currentLocal.language === 'العربيه'
//         ? item?.profile?.sub_category?.category?.title_ar
//         : item?.profile?.sub_category?.category?.title_en;
//     const subCategory =
//       currentLocal.language === 'العربيه'
//         ? item?.profile?.sub_category?.title_ar
//         : item?.profile?.sub_category?.title_en;

//     const productOwner =
//       item?.type === 'shop_owner'
//         ? item?.profile?.shop_name
//         : `${item?.profile?.first_name} ${item?.profile?.last_name}`;

//     // ✅ استخدم رابط ثابت بدل Linking.createURL
//     const url = `https://osta-basha.duckdns.org/product?id=${item?.id}`;

//     const result = await Share.share({
//       message: `شاهد ${productTitle} من ${productOwner} على ${Constants.expoConfig.name}\n${category} - ${subCategory}\n${url}`,
//     });

//     if (result.action === Share.sharedAction) {
//       // shared successfully
//     } else if (result.action === Share.dismissedAction) {
//       // user dismissed share
//     }
//   } catch (error) {
//     alert('حدث خطأ أثناء المشاركة');
//     console.log(error);
//   }
// };

//   const dispatch = useDispatch();
//   const wishlistList = useSelector((state) => state.wishlistReducer);
//   const isWishlisted = wishlistList?.some((i) => i.id === item?.id);

//   const handleToggleWishlist = () => {
//     dispatch(toggleWishlistItem(item&&item));
//   };
//   return (
//     <View style={ currentLocal.language == 'العربيه' ?[styles.container,{flexDirection:"row-reverse"}]:[styles.container,{flexDirection:"row"}]}>
//       {/* 
//       <Text allowFontScaling={false}style={styles.title}>{title}</Text>
//        */}
// <TouchableOpacity onPress={() => {
//                           dispatch(clearFilters());

//         router.back()}} >
//         <Entypo name={currentLocal.language == 'العربيه' ?"chevron-small-right":"chevron-small-left"} size={38} color="#666666" />
//       </TouchableOpacity>
//       <Text allowFontScaling={false}style={styles.title}>{title}</Text>
//       <View>

//         <Drawer.Navigator 
//   screenOptions={{
//     drawerPosition: 'right', // or 'left'
//     drawerStyle: { width: '50%' },
//     drawerType: 'front', 
//   }}
// >
//               <Ionicons name="filter" size={24} color="#666666" />


// </Drawer.Navigator>
//       </View>
// {/* <View style={{ flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
// , alignItems: "center" }}>
//         {wishlist &&Object.keys(userinfo?.userInfo).length !== 0&&
//             <TouchableOpacity
//              style={{}}
//              onPress={handleToggleWishlist}
//            >
//              <Entypo
//                name={isWishlisted?"heart":"heart-outlined"}
//                size={28}
//                color={isWishlisted ?  Colors.light.tint : Colors.light.tint}
//              />
//            </TouchableOpacity>
//         }
//         {share &&
//           <TouchableOpacity style={{ marginStart: 12 }} onPress={shareProduct} >
//             <Entypo name="share-alternative" size={24} color={Colors.light.tint} />


//           </TouchableOpacity>
//         }
//         {filterState ?
//           <TouchableOpacity onPress={toggleFilterModal}>
//             <Ionicons name="filter" size={24} color="#666666" />


//           </TouchableOpacity>
//           :
//           <View></View>

//         }
//       </View> */}
//     </View>
//   )
// }

// export default CommonHeader

// const styles = StyleSheet.create({
//   container: {
// flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: Dimensions.get('screen').width / 75,
//   },
//   gobackBtn: {
//     width: 45,
//     height: 45,
//     backgroundColor: "#E8E8E8",
//     borderRadius: 22,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   title: {
//     fontFamily: "BoldMoto",
//     fontSize: 16
//   }
// })

import React, { useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { clearFilters } from '../hooks/filterationReducer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchtoggleFavorit, fetchWishlist } from '../hooks/wishList';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.9; // عرض الدرج

const CommonHeader = forwardRef(({ title,item, filterState,handleFunction,wishList,favState, filterContent, currentLocal }, ref) => {  // القيمة المشتركة للأنيميشن (تبدأ خارج الشاشة من اليمين)
  const translateX = useSharedValue(width);
  const isOpen = useSharedValue(false);
      const userinfo = useSelector((state) => state.authorization);
  const {list:wishlist,loading:isLoading} = useSelector((state) => state.wishlist)
const isWishlisted = wishlist?.some((i) => i?.user?.id == item?.id);

const dispatch=useDispatch()
  const toggleDrawer = () => {
    if (isOpen.value) {
      translateX.value = withTiming(width); // إغلاق
    } else {
      translateX.value = withTiming(width - DRAWER_WIDTH); // فتح
    }
    isOpen.value = !isOpen.value;
  };
  useImperativeHandle(ref, () => ({
    toggleDrawer
  }));

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen.value ? 1 : 0),
    display: isOpen.value ? 'flex' : 'none',
  }));
  const isFavourite = favState ?? isWishlisted;

  const handleToggleWishlist =async() => {
    try {
    // Wait for the toggle to complete on the server
    await dispatch(fetchtoggleFavorit(item?.id)).unwrap();
    // Then refresh the list
    dispatch(fetchWishlist());
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
    // dispatch(fetchtoggleFavorit(item?.id));
    //     dispatch(fetchWishlist())
    
  };
  return (
    <>
      <View style={[styles.headerContainer, { flexDirection: currentLocal?.language === 'العربيه' ? "row-reverse" : "row" }]}>


        {/* زر الرجوع */}

        <TouchableOpacity onPress={() => {
                dispatch(clearFilters());
                if(handleFunction){
                  handleFunction()
                }else{
          router.back()

                }

        }}>
          <Entypo
            name={currentLocal?.language === 'العربيه' ? "chevron-small-right" : "chevron-small-left"}
            size={38} color="#666"
          />
        </TouchableOpacity>


        {/* العنوان */}
        <Text allowFontScaling={false}  style={styles.title} numberOfLines={1}>{title}</Text>

        {/* زر الفلترة */}
        <View style={styles.iconGroup}>
          {filterState && (
            <TouchableOpacity onPress={toggleDrawer} style={styles.filterBtn}>
              <Ionicons name="filter" size={26} color="#666" />
            </TouchableOpacity>
          )}
          {wishList&&
      Object.keys(userinfo?.userInfo).length !== 0 &&

        <TouchableOpacity
          style={{  }}
          onPress={handleToggleWishlist}
        >

          <Entypo name={isFavourite ? "heart" : "heart-outlined"} size={32} color={isWishlisted ? Colors.light.tint : Colors.light.tint} />

        </TouchableOpacity>
      
}
        </View>

      </View>

      {/* الخلفية المظلمة عند الفتح */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggleDrawer} />
      </Animated.View>

      {/* الدرج الجانبي المتحرك */}
      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={toggleDrawer}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.drawerTitle}>{currentLocal?.language === 'العربيه' ? 'الفلتر' : 'Filters'}</Text>

        </View>

        <View style={styles.drawerBody}>
          {filterContent}
        </View>
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    // height: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
    paddingTop:12
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'BoldMoto',
  },
  iconGroup: { minWidth: 40, alignItems: 'center' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.2,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: "space-between",
    width: "90%",
  },
  drawerTitle: { fontSize: 18, fontFamily: 'BoldMoto' },
  drawerBody: { flex: 1, padding: 20 }
});

export default CommonHeader;