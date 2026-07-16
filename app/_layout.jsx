import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Provider, useSelector } from 'react-redux';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "../hooks/store"
import { useColorScheme } from '@/hooks/use-color-scheme';
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const persistor = persistStore(store);
  useEffect(() => {
  if (Platform.OS === 'android') {
    // لإخفاء الأزرار تماماً (تظهر عند السحب)
    NavigationBar.setVisibilityAsync("hidden");
      }
}, []);
  const [loaded] = useFonts({
    BoldMoto: require('../assets/fonts/NotoKufiArabic-Bold.ttf'),
    MediumMoto: require('../assets/fonts/NotoKufiArabic-Medium.ttf'),
    RegulaMoto: require('../assets/fonts/NotoKufiArabic-Regular.ttf'),
    SemiBoldMoto: require('../assets/fonts/NotoKufiArabic-SemiBold.ttf'),


  });
    useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert("No Internet", "Please check your internet connection");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Splash" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Countries" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Login" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UserType" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Languages" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Privacy" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Aboutus" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Country" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/ChangePassword" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Profile" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/RatingsAndComment" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UsersListContact" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Notifications" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/AllAds" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UserDetails" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Search" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UsersList" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/ProvidersList" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/ShopownerList" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Add" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(users)" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UserProfile" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/UserRatingsAndComment" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/ForgotPassword" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/Code" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/SetNewPassword" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/SearchList" options={{ headerShown: false }} />
            

          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
