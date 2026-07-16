

import { Colors } from '@/constants/theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import SkiltonContainer from '../components/SkiltonContainer';

const NotificationScreen = () => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState([]);
  const userinfo = useSelector((state) => state.authorization);
  const ids = notification?.map((id) => id?.id?.toString());
  
    const getData = async () => {
      const token = userinfo.token;
      try {
        setLoading(true)
        const res = await axios.get(
          `https://nanosoft.technology/osta-basha/api/notification/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"

            },
          }
        );

        setNotification(res.data.data.data);
      } catch (error) {
        console.log(error, 'notificationError');
      }finally{
        setLoading(false)
      }
      try {
        const res = await axios.post(
          `https://nanosoft.technology/osta-basha/api/notification/read`, {
          notification_ids: ids

        },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"

            },
          }
        );

      } catch (error) {
        console.log(error?.response?.data?.message || error.message, 'notificationError');
      }
    };
  useEffect(() => {

    getData();
  }, []);
  const renderSkeleton = () => (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ width: Dimensions.get('window').width - 20, height: 150, borderRadius: 10, backgroundColor: '#E0E0E0' }} />

    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >

                          <CommonHeader
          title={currentLocal.home.Notifications}
        filterState={false}
        currentLocal={currentLocal}

      />
      <FlatList
        data={notification}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
          refreshing={loading}
  onRefresh={getData}

        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            {loading?
<SkiltonContainer
    loading={loading}
    data={renderSkeleton()}
/>
:
      <View style={[{ flexDirection: currentLocal.language == "العربيه" ? 'row-reverse' : "row" }, styles.contentContainer]}>

              {/* الأيقونة الدائرية */}
              <View style={styles.circle}>
                <Text allowFontScaling={false} style={styles.circleText}>
                  {currentLocal.language == 'العربيه' ? 'أ' : 'O'}
                </Text>
              </View>

              {/* النصوص */}
      <View
  style={{
    marginStart: 8,
    flex: 1, // مهم جدا
  }}
>
  <Text
    allowFontScaling={false}
    style={[
      {
        alignSelf:
          currentLocal.language === "English"
            ? "flex-start"
            : "flex-end",
      },
      styles.date,
    ]}
  >
    {item?.created_at?.slice(0, 10)}
  </Text>

  <Text
    allowFontScaling={false}
    style={[
      {
        alignSelf:
          currentLocal.language === "English"
            ? "flex-start"
            : "flex-end",
      },
      styles.name,
    ]}
  >
    {item?.title}
  </Text>

  <Text
    allowFontScaling={false}
    style={[
      {
        alignSelf:
          currentLocal.language === "English"
            ? "flex-start"
            : "flex-end",
      },
      styles.category,
    ]}
  >
    {item?.description}
  </Text>
</View>
            </View>
          }
      
          </View>

        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text allowFontScaling={false} style={styles.emptyText}>
              {currentLocal.home.noitems}
            </Text>
          </View>
        }
      />
      
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  itemWrapper: {
    marginBottom: 18,
  },
  date: {
    fontFamily: 'MediumMoto',
    fontSize: 12,
    color: '#8a8a8a',
    marginBottom: 6,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontFamily: 'BoldMoto',
    fontSize: 14,
    marginBottom: 4,

  },
  category: {
    fontFamily: 'MediumMoto',
    fontSize: 13,
    color: '#5C5F62',

  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  circleText: {
    color: '#fff',
    fontFamily: 'BoldMoto',
    textAlign: 'center',
    fontSize: 16,
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
    textAlign: 'center',
  },
});
