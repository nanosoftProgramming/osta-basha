import { Colors } from '@/constants/theme'; 
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CardContainer from '../components/CardContainer';
import CommonHeader from '../components/CommonHeader';
import TabsContainer from '../components/TabsContainer';
import { fetchContactList } from '../hooks/contactList';

const UsersListContactScreen = () => {
  const Params = useLocalSearchParams();
  const { currentLocal } = useSelector((state) => state.Localization);
  const [activeCategoryID, setActiveCategoryID] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  
  // 1. جلب البيانات من Redux Store باسم مختلف لتجنب التكرار والـ Shadowing
  const { list: rawContactList, loading: rawLoading, pagination: rawPagination } = useSelector((state) => state.contactList);

  const [page, setPage] = useState(1);

  const contactListLoading = React.useMemo(() => {
    return typeof rawLoading === 'string' ? JSON.parse(rawLoading) : rawLoading;
  }, [rawLoading]);
  const formattedItems = React.useMemo(() => {
  try {
    const data =
      typeof rawContactList === "string"
        ? JSON.parse(rawContactList)
        : rawContactList;

    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.log(e);
    return [];
  }
}, [rawContactList]);

const uniqueSubCategories = React.useMemo(() => {
  if (!Array.isArray(formattedItems)) return [];

  const map = new Map();

  formattedItems.forEach(item => {
    const sub = item?.sub_category;

    if (sub && !map.has(sub.id)) {
      map.set(sub.id, sub);
    }
  });

  return [...map.values()];
}, [formattedItems]);
useEffect(() => {
  if (uniqueSubCategories.length > 0) {
    const exists = uniqueSubCategories.some(
      item => item.id === activeCategoryID
    );

    if (activeCategoryID === null || !exists) {
      setActiveCategoryID(uniqueSubCategories[0].id);
    }
  } else {
    setActiveCategoryID(null);
  }
}, [uniqueSubCategories]);

  const pagination = React.useMemo(() => {
    return typeof rawPagination === 'string' ? JSON.parse(rawPagination) : rawPagination;
  }, [rawPagination]);

  useEffect(() => {
    dispatch(fetchContactList());
  }, [dispatch]);

  // 4. الفلترة التلقائية بناءً على القسم النشط
  const filteredUsers = React.useMemo(() => {
    if (!activeCategoryID) return formattedItems;
    return formattedItems.filter(item => item?.sub_category?.id === activeCategoryID);
  }, [activeCategoryID, formattedItems]);

  // 5. تعيين أول تاب كنشط تلقائياً عند تحميل البيانات أو تحديثها
  useEffect(() => {
    if (formattedItems?.length > 0) {
      // إذا كان التصنيف النشط غير موجود في القائمة المحدثة، قم بتعيين أول عنصر
      const hasActiveCategory = formattedItems.some(item => item?.sub_category?.id === activeCategoryID);
      if (activeCategoryID === null || !hasActiveCategory) {
        setActiveCategoryID(formattedItems[0]?.sub_category?.id);
      }
    } else {
      setActiveCategoryID(null);
    }
  }, [formattedItems]);

const renderItem = ({ item }) => {
  const isSelected = activeCategoryID === item.id;

  return rawLoading?(
    <>
              <View style={{height: 25,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>

    </>
  ):(
    <TouchableOpacity
      style={isSelected ? styles.activeCatContainer : styles.catContainer}
      onPress={() => setActiveCategoryID(item.id)}
    >
      <Text
        allowFontScaling={false}
        style={isSelected ? styles.activeCatText : styles.catText}
      >
        {currentLocal.language === "العربيه"
          ? item.title_ar
          : item.title_en}
      </Text>
    </TouchableOpacity>
  );
};

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchContactList());
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <CommonHeader
          title={currentLocal.home.Users}
          filterState={false}
          currentLocal={currentLocal}
        />
        
        <View style={styles.sectionContainer}>
          <TabsContainer items={uniqueSubCategories} renderItem={renderItem} />
        </View>

        <View style={styles.section}>
          {rawLoading ?
          <View style={{height: 25,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
        :

                <Text allowFontScaling={false} style={currentLocal.language === "English" ? styles.enTitle : styles.arTitle}>
            {currentLocal.home.Users} ({filteredUsers?.length})
          </Text>
        }
  
        </View>

        <View style={[styles.section, { flex: 1 }]}>
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => item?.id?.toString() || index?.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                {rawLoading?
                <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
              :
                <CardContainer item={item?.user} />

              }
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text allowFontScaling={false} style={styles.emptyText}>
                  {currentLocal.home.noOrdersText}
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.light.tint} // تم تعديل اللون ليظهر بشكل أفضل فوق الخلفية البيضاء
                colors={[Colors.light.tint]}
                progressViewOffset={25}
              />
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UsersListContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  sectionContainer: {
    marginTop: 22,
  },
  catContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8, // إضافة padding رأسي لضبط المظهر
    borderWidth: 1,
    borderColor: Colors.light.tint,
    justifyContent: "center",
    marginHorizontal: 4,
    borderRadius: 8
  },
  activeCatContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    justifyContent: "center",
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.tint
  },
  catText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
    color: Colors.light.tint,
  },
  activeCatText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
    color: "#fff",
  },
  enTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "left", 
    marginVertical: 12,
    fontSize: 16
  },
  arTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "right",
    marginVertical: 12,
    fontSize: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'MediumMoto',
    color: '#999',
  },
  itemContainer: {
    marginBottom: 10,
  }
});