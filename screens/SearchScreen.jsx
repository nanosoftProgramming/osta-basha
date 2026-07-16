// // // import { router } from 'expo-router';
// // // import { useState } from 'react';
// // // import {
// // //     Dimensions,
// // //     ScrollView,
// // //     StyleSheet,
// // //     Text,
// // //     TextInput,
// // //     TouchableOpacity,
// // //     View
// // // } from 'react-native';
// // // import { PixelRatio } from 'react-native';

// // // import { useSelector } from 'react-redux';
// // // import CardContainer from '../components/CardContainer';
// // // import CommonHeader from '../components/CommonHeader';


// // // export default function SearchScreen() {
// // // const [search, setSearch] = useState('');
// // //   const [searchList, setSearchList] = useState([]);
// const { currentLocal } = useSelector((state) => state.Localization);
// // //   const stateItem = useSelector((state) => state);

// // //   const combinedArray = [
// // //     ...(stateItem?.shopsOwnerReducer?.shopsOwner || []),
// // //     ...(stateItem?.providersReducer?.providers || []),
// // //   ];
  //   const normalizeToEnglishNumbers = (text) => {
  //   const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  //   const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  //   return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  // };

// // // const handleSearch = (text) => {

  // setSearch(normalizeToEnglishNumbers(text));

// // //   if (text.trim() === '') {
// // //     setSearchList([]);
// // //     return;
// // //   }

// // //   const lowerText = normalizeToEnglishNumbers(text).toLowerCase();

// // //   const filtered = combinedArray.filter((user) => {
// // //     const firstName = user.first_name?.toLowerCase() || '';
// // //     const lastName = user.last_name?.toLowerCase() || '';
// // //     const fullName = `${firstName} ${lastName}`;
// // //     const phone = user.phone?.toLowerCase() || '';
// // //     const countrycode = user.country_code?.toLowerCase() || '';
// // //   const fullPhone = `${countrycode}${phone}`;



// // //     return (
// // //       firstName.includes(lowerText) ||
// // //       lastName.includes(lowerText) ||
// // //       fullName.includes(lowerText) ||
// // //       phone.includes(lowerText)||
// // //       countrycode.includes(lowerText)||
// // //   fullPhone.includes(lowerText)  


// // //     );
// // //   });

// // //   setSearchList(filtered);
// // // };

// // //   const renderCardList = (list) => (
// // //     <>
// // //       {list.length!==0&&list?.slice(0, 5).map((item) => (
// // //         <View key={item?.id}>
// // //           <CardContainer item={item} />
// // //         </View>
// // //       ))}
// // //       <TouchableOpacity
// // //         style={{ paddingVertical: 22, justifyContent: "center", alignItems: "center" }}
// // //         onPress={() => {
// // //           router.push({
// // //             pathname: '/(routes)/UsersList',
// // //             params: { state: 'search', data: JSON.stringify(list) },
// // //           });
// // //         }}
// // //       >
// // //         <Text allowFontScaling={false}style={styles.seeMore}>{currentLocal.home.seeMoreText}</Text>
// // //       </TouchableOpacity>
// // //     </>
// // //   );

// // //   return (
// // // <View style={styles.container}>
// // //   <CommonHeader
// // //     title={currentLocal.home.search}
// // //     wishlist={false}
// // //     share={false}
// // //   />

// // // <TextInput
// // //   placeholder={currentLocal.home.searchPlaceholder}
// // //   value={search}
// // //   onChangeText={handleSearch}
// // //   style={[
// // //     styles.searchInput,
// // //     { textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left' },
// // //   ]}
// // // />

// // //       {search.trim() !== '' ? (
// // //         searchList.length > 0 ? (
// // //           <ScrollView showsVerticalScrollIndicator={false}>
// // //             {renderCardList(searchList)}
// // //           </ScrollView>
// // //         ) : (
// // //           <View style={styles.noResultContainer}>
// // //             <Text allowFontScaling={false}style={styles.noResultText}>
// // //               {currentLocal.home.noResults ||currentLocal.home.noitems}
// // //             </Text>
// // //           </View>
// // //         )
// // //       ) : (
// // //         <ScrollView showsVerticalScrollIndicator={false}>
// // //           {renderCardList(combinedArray)}
// // //         </ScrollView>
// // //       )}
// // //     </View>
// // //   );
// // // }



// // const SearchScreen = () => {
// const [search, setSearch] = useState('');
//   const [searchList, setSearchList] = useState([]);
// //   const { currentLocal } = useSelector((state) => state.Localization);
// //   const { list: users,loading:usersLoading } = useSelector((state) => state?.users);
// //   const dispatch = useDispatch();
// // const isLoading=false;
// // const fetchData = () => {
// //   dispatch(fetchUsers());
// // }
// //   useEffect(() => {
// // fetchData();
// //   }, [dispatch])
// // useEffect(() => {
// //   if (users) {
// //     setSearchList(users);
// //   }
// // }, [users]);
// // const normalizeToEnglishNumbers = (value) => {
// //   if (!value) return ''; // إرجاع نص فارغ بدلاً من 0

// //   const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
// //   const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// //   // تحويل الأرقام العربية فقط مع الحفاظ على نوع البيانات String
// //   return String(value).replace(/[٠-٩]/g, (char) => {
// //     const index = arabicNumbers.indexOf(char);
// //     return index !== -1 ? englishNumbers[index] : char;
// //   });
// // };
// const handleSearch = (text) => {

//   setSearch(normalizeToEnglishNumbers(text));

//   if (text.trim() === '') {
//     setSearchList(users);
//     return;
//   }

//   const lowerText = normalizeToEnglishNumbers(text).toLowerCase();

//   const filtered = users.filter((user) => {
//     const firstName = user.first_name?.toLowerCase() || '';
//     const lastName = user.last_name?.toLowerCase() || '';
//     const fullName = `${firstName} ${lastName}`;
//     const phone = user.phone || '';
//     const countrycode = user.country_code?.toLowerCase() || '';
//   const fullPhone = `${countrycode}${phone}`;



//     return (
//       firstName.includes(lowerText) ||
//       lastName.includes(lowerText) ||
//       fullName.includes(lowerText) ||
//       phone.includes(lowerText)||
//       countrycode.includes(lowerText)||
//   fullPhone.includes(lowerText)  


//     );
//   });

//   setSearchList(filtered);


// };
// //   return (
// //     <View style={styles.container}>
// //       <CommonHeader
// //         title={currentLocal.home.search}
// //         wishlist={false}
// //         share={false}
// //       />
// <TextInput
//   placeholder={currentLocal.home.searchPlaceholder}
//   value={search}
//   onChangeText={handleSearch}
//   style={[
//     styles.searchInput,
//     { textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left' },
//   ]}
// />
// <Text style={currentLocal.language == "English" ? styles.enTitle : styles.arTitle}>{currentLocal.home.Users} ({searchList?.length})</Text>
// <View>
// //         <FlatList
// //           data={searchList}
// //           keyExtractor={(item) => item.id?.toString()}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={{
// //             paddingBottom: Platform.OS === "ios" ? 180 : 0, flexGrow: 1,
// //           }}
// //           renderItem={({ item }) => {
// //             return (

// //               <View style={styles.itemContainer}>
// //                 <CardContainer item={item} />
// //               </View>
// //             )
// //           }}
// //           ListEmptyComponent={
// //             <View style={styles.emptyContainer}>
// //               <Text allowFontScaling={false} style={styles.emptyText}>{currentLocal.home.noitems}</Text>
// //             </View>
// //           } 
// //               refreshing={isLoading}
// //             onRefresh={fetchData}
// //             refreshControl={
// //               <RefreshControl
// //                 refreshing={isLoading}
// //                 onRefresh={fetchData}
// //                 tintColor={Colors.light.tint}
// //                 colors={[Colors.light.tint]}
// //                 progressViewOffset={25}
// //               />
// //             }
// //           />
// //       </View>
// //     </View>
// //   )
// // }

// // export default SearchScreen

import { Colors } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, PixelRatio, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CardContainer from '../components/CardContainer';
import CommonHeader from '../components/CommonHeader';
import { fetchSearch } from '../hooks/users';
import Seemore from './Seemore';
import UserListContainer from '../components/UserListContainer';
const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const SearchScreen = () => {
  const dispatch=useDispatch()
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: users, loading: usersLoading, pagination } = useSelector((state) => state?.users);
    const locationInfo = useSelector((state) => state.location);
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(1);
    const normalizeToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };

    const fetchData = (pageNumber = 1) => {
  
      const data = {
        page: pageNumber,
        paginated: 2,
        country: locationInfo?.country_en,
          ...(search && { query: search }),

      }
  
      if (locationInfo?.country_en) {
        dispatch(fetchSearch(data))
      }
    }
    const handleRefresh = () => {
    setPage(1);
    setAllUsers([]); // مسح البيانات القديمة
    fetchData(1);
  };
    useEffect(() => {
      if (users) {
        if (page === 1) {
          setAllUsers(users);
        } else {
          setAllUsers(prev => [...prev, ...users]);
        }
      }
    }, [users]);
  
    // useEffect(() => {
    //   setPage(1);
    //   fetchData(1);
    // }, [locationInfo?.country_en,search]);
    const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    };
  const handleSearch = (text) => {

  setSearch(normalizeToEnglishNumbers(text));

    // if (text.trim() === '') {
    //   setSearchList(users);
    //   return;
    // }

    // const lowerText = normalizeToEnglishNumbers(text).toLowerCase();

    // const filtered = users.filter((user) => {
    //   const firstName = user.first_name?.toLowerCase() || '';
    //   const lastName = user.last_name?.toLowerCase() || '';
    //   const fullName = `${firstName} ${lastName}`;
    //   const phone = user.phone || '';
    //   const countrycode = user.country_code?.toLowerCase() || '';
    //   const fullPhone = `${countrycode}${phone}`;



    //   return (
    //     firstName.includes(lowerText) ||
    //     lastName.includes(lowerText) ||
    //     fullName.includes(lowerText) ||
    //     phone.includes(lowerText) ||
    //     countrycode.includes(lowerText) ||
    //     fullPhone.includes(lowerText)


    //   );
    // });

    // setSearchList(filtered);


  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        {/* {usersLoading && <LoadingScreen />} */}

        <CommonHeader
          title={currentLocal.home.search}
          filterState={false}
          currentLocal={currentLocal}
        />

        <TextInput
          placeholder={currentLocal.home.searchPlaceholder}
          value={search}
          onChangeText={handleSearch}
          style={[
            styles.searchInput,
            { textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left' },
          ]}
        />
        {/* <Text allowFontScaling={false}  style={currentLocal.language == "English" ? styles.enTitle : styles.arTitle}>{currentLocal.home.Users} ({allUsers?.length})</Text>
        <>
          <FlatList
            data={allUsers ? allUsers : filteredShops}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 0 : 0, flexGrow: 1,
            }}
            renderItem={({ item }) => {
              return (

                <View style={styles.itemContainer}>
                  <CardContainer item={item} />
                </View>
              )
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text allowFontScaling={false} style={styles.emptyText}>{ currentLocal.home.noitems}</Text>
              </View>
            }
            refreshing={usersLoading}
            refreshControl={
              <RefreshControl
                refreshing={usersLoading}
                onRefresh={handleRefresh}
                tintColor={Colors.light.tint}
                colors={[Colors.light.tint]}
                progressViewOffset={25}
              />
            }

          />

        </>
            {pagination?.meta?.total !== allUsers?.length &&

            <Seemore
              onPressFun={handleLoadMore}
            />
          } */}
          <UserListContainer
        id={null}
        usersData={allUsers ? allUsers : filteredShops}

          />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,

  },
  subCategoryContainer: {
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSbCategoryContainer: {
    borderWidth: 2,
    borderColor: Colors?.light?.tint,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "center"
  },

  enTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "left", marginVertical: 12,
    fontSize: 16
  },
  arTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "right",
    marginVertical: 12,
    fontSize: 16

  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    marginTop: 22,
    fontFamily: 'MediumMoto',
    fontSize: 16 / fontScale,

  },
});
