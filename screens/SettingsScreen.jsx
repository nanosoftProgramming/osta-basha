import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from '@/constants/theme';
import { setuserInfo } from '@/hooks/authorizationReducer';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import ActionSheet from 'react-native-actionsheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import apiUrl from '../constants/apiUrl';
import { fetchContactList } from '../hooks/contactList';

const SettingsScreen = () => {
  const logoutSheetRef = useRef();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets(); // Get top/bottom safe area padding
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: contactList, loading: contactListLoading, pagination } = useSelector((state) => state.contactList);
  const userinfo = useSelector((state) => state.authorization);

  const isArabic = currentLocal.language === 'العربيه';
  const [switchStates, setSwitchStates] = useState({
    availability: userinfo?.userInfo?.is_available == 1 ? true : false,
    notifications: false,
  });
  const showLogoutSheet = () => logoutSheetRef.current.show();
  const logoutOptions = [currentLocal.home.yes, currentLocal.home.cancel];

  useEffect(() => {
    dispatch(fetchContactList())
  }, [])




  const handleLogoutSelect = (index) => {
    if (index === 0) {
      dispatch(setuserInfo({
        user: {},
        token: ""
      }))

      router.push({
        pathname: '/(routes)/Login', params: {
          previousScreen: '(tabs)/settings',
        }
      });
    }
  };
  useEffect(() => {

  }, [])
  const toggleSwitch = async (key) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    if ("availability" == key) {
      try {
        const url = `${apiUrl}/user/toggle-available`
        const response = await axios.post(url, {
          is_active: !switchStates.availability ? 0 : 1,
        }, {
          headers: {
            Authorization: `Bearer ${userinfo.token}`,
            "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
          }
        });

      } catch (error) {
        setSwitchStates((prev) => ({ ...prev, [id]: !newState }));
        Alert.alert("خطأ", "فشل في تحديث الحالة، حاول مرة أخرى.");
        console.error("API Error:", error);
      }
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '01004800186';
    const message = 'Hello, I need assistance.';
    const url = `whatsapp://send?phone=+20${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) => {
      console.error('Error opening WhatsApp:', err);
    });
  };
  const isLoggedIn = userinfo?.userInfo && Object.keys(userinfo.userInfo).length !== 0;
  const items =
    userinfo?.userInfo?.type === "client" || userinfo?.userInfo?.type == undefined
      ? [{ id: 1, name: currentLocal.home.editeProfile, goBtnState: true, switchState: false, route: { pathname: Object.keys(userinfo?.userInfo).length !== 0 ? '/(routes)/Profile' : '/(routes)/Login', params: { state: "profile", previousScreen: '(tabs)/settings', } } },
      {
        id: 2, name: currentLocal.home.changePassword, goBtnState: true, switchState: false,
        route: {
          pathname:
            Object.keys(userinfo?.userInfo).length !== 0
              ? '/(routes)/ChangePassword'
              : '/(routes)/Login',

          params: {
            previousScreen: '(tabs)/settings',
          },
        },
      }
        ,
      {
        id: 3, name: currentLocal.home.rateService, goBtnState: true, switchState: false,


        route: { pathname: Object.keys(userinfo?.userInfo).length !== 0 ? '/(routes)/RatingsAndComment' : '/(routes)/Login', params: { previousScreen: '(tabs)/settings', } }
      }

        ,

      {
        id: 4, name: currentLocal.home.providersList, goBtnState: true, switchState: false,

        route: {
          pathname: Object.keys(userinfo?.userInfo).length !== 0 ? '/(routes)/UsersListContact' : '/(routes)/Login',
          params: { state: 'contact', data: JSON.stringify(contactList) ,previousScreen: '(tabs)/settings'},
          contactListLoading: contactListLoading,
          pagination: pagination

        }
      }


        ,
      { id: 5, name: currentLocal.home.language, goBtnState: true, switchState: false, route: '/(routes)/Languages' },
      { id: 6, name: currentLocal.home.country, goBtnState: true, switchState: false, route: '/(routes)/Country' },
      // { id: 7, name: currentLocal.home.Notifications, goBtnState: false, switchState: true, stateKey: 'notifications' },
      { id: 11, name: currentLocal.home.aboutus, goBtnState: true, switchState: false, route: '/(routes)/Aboutus' },
      { id: 8, name: currentLocal.home.Privacy, goBtnState: true, switchState: false, route: '/(routes)/Privacy' },

      ...(isLoggedIn ? [{ id: 9, name: currentLocal.home.logout, goBtnState: true, switchState: false },] : []),
      { id: 10, name: currentLocal.home.technicalsupport, goBtnState: false, switchState: false },
      ] : [
        {
          id: 1, name: currentLocal.home.editeProfile, goBtnState: true, switchState: false,
          route: { pathname: Object.keys(userinfo?.userInfo).length !== 0 ? userinfo.userInfo?.first_name === null ? '/(routes)/Add' : '/(routes)/UserProfile' : '/(routes)/Login', params: { state: "profile",previousScreen: '(tabs)/settings' } }
        },
        {
          id: 2, name: currentLocal.home.changePassword, goBtnState: true, switchState: false,
          route: {
            pathname:
              Object.keys(userinfo?.userInfo).length !== 0
                ? '/(routes)/ChangePassword'
                : '/(routes)/Login',

            params: {
              previousScreen: '(tabs)/settings',
            },
          },
        }
        ,
        {
          id: 3, name: currentLocal.home.myRates, goBtnState: true, switchState: false,


          // route: { pathname: Object.keys(userinfo?.userInfo).length !== 0 ? '/(routes)/UserRatingsAndComment' : 
          //   '/(routes)/Login'

          //  }
          route: {
            pathname:
              Object.keys(userinfo?.userInfo).length !== 0
                ? '/(routes)/UserRatingsAndComment'
                : '/(routes)/Login',

            params: {
              previousScreen: '(tabs)/settings',
            },
          },

        }

        ,
        { id: 4, name: currentLocal.home.language, goBtnState: true, switchState: false, route: '/(routes)/Languages' },
        { id: 5, name: currentLocal.home.active, goBtnState: false, switchState: true, stateKey: 'availability' },
        { id: 6, name: currentLocal.home.aboutus, goBtnState: true, switchState: false, route: '/(routes)/Aboutus' },
        { id: 7, name: currentLocal.home.Privacy, goBtnState: true, switchState: false, route: '/(routes)/Privacy' },
        ...(isLoggedIn ? [{ id: 9, name: currentLocal.home.logout, goBtnState: true, switchState: false },] : []),
        { id: 10, name: currentLocal.home.technicalsupport, goBtnState: false, switchState: false },
      ];

  const handlePressing = (item) => {
    if (item.id === 9) {
      showLogoutSheet();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.settingsContainer}>

      <View style={[styles.container,, { paddingBottom: insets.bottom }]}>
        <Text allowFontScaling={false} style={styles.title}> {currentLocal.home.settings} </Text>

        <FlatList
          style={styles.flatlistContainer}
          data={items}
          keyExtractor={(item) => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 20 }}
          renderItem={({ item }) => {
            const isWhatsApp = item.id === 10;

            const containerStyle = [
              isArabic ? styles.aritemContainer : styles.enitemContainer,
              isWhatsApp ? styles.whatsappContainer : styles.itemContainer,
            ];
            console.log('containerStyle:', containerStyle);

            return (
              <TouchableOpacity
                style={[
                  ...containerStyle

                ]}
                onPress={item.id === 10 ? openWhatsApp : () => handlePressing(item)}
              >

                {item.goBtnState && (
                  <Entypo name={currentLocal.language == 'العربيه' ? "chevron-small-left" : "chevron-small-right"} size={24} color="black" />
                )}

                {item.switchState && item.stateKey && (
                  <Switch
                    trackColor={{ false: '#76777', true: Colors.light.tint }}
                    thumbColor={switchStates[item.stateKey] ? 'white' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(item.stateKey)}
                    value={switchStates[item.stateKey]}
                  />
                )}

                {currentLocal.language === 'العربيه' ? <>
                  {item.id === 10 && (
                    <FontAwesome name="whatsapp" size={28} color="#25D366" />
                  )}
                  <Text allowFontScaling={false} style={styles.itemText}>
                    {item.switchState && item.stateKey
                      ? `${switchStates[item.stateKey] ? currentLocal.home.active : currentLocal.home.inactive}`
                      : item.name}
                  </Text>
                </>
                  :

                  <>
                    <Text allowFontScaling={false} style={styles.itemText}>
                      {item.switchState && item.stateKey
                        ? `${item.name} (${switchStates[item.stateKey] ? currentLocal.home.active : currentLocal.home.inactive})`
                        : item.name}
                    </Text>
                    {item.id === 10 && (
                      <FontAwesome name="whatsapp" size={28} color="#25D366" />
                    )}

                  </>
                }
              </TouchableOpacity>
            )
          }}
          ListFooterComponent={<Text allowFontScaling={false} style={styles.verssionText}>  {Application.nativeApplicationVersion}</Text>
          }
        />
        <ActionSheet
          ref={logoutSheetRef}
          title={currentLocal.home.logout}
          options={logoutOptions}
          cancelButtonIndex={logoutOptions.length - 1}
          onPress={handleLogoutSelect}
          ListFooterComponent={<Text allowFontScaling={false} style={styles.verssionText}>  {Application.nativeApplicationVersion}</Text>
          }
        />
      </View>

    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor:"red"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Dimensions.get('screen').height / 18,
    paddingHorizontal: Dimensions.get('screen').width / 28,
  },
  flatlistContainer: { flex: 1 },
  title: {
    fontSize: 18,
    fontFamily: 'BoldMoto',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemContainer: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 18,

    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  itemText: {
    fontFamily: 'MediumMoto',
    marginHorizontal: 5,
  },
  whatsappContainer: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#25D366',
    padding: 10,
    borderRadius: 5,
  },
  aritemContainer: {
    flexDirection: 'row'
  },
  enitemContainer: {
    flexDirection: 'row-reverse'
  },
  verssionText: {
    textAlign: "center", marginTop: 12, fontFamily: 'MediumMoto',

  }
});
