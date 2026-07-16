// import { Tabs } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
// import { useSelector } from 'react-redux';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const {currentLocal}=useSelector((state) => state.Localization);
// if(currentLocal?.language=="English"){
//   return (
// <Tabs
//   screenOptions={{
//     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//     headerShown: false,
//     tabBarButton: HapticTab,

//     tabBarStyle: {
//       height: 65,
//       paddingBottom: 8,
//       paddingTop: 5,
//       backgroundColor: "#fff",
//     },

//     tabBarLabelStyle: {
//       fontFamily: "MediumMoto",
//       fontSize: 12,
//     },

//     tabBarItemStyle: {
//       justifyContent: "center",
//       alignItems: "center",
//     },

//     tabBarAllowFontScaling: false
//   }}
// >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="map"
//         options={{
//           title:currentLocal.home.map,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
//         }}
//       />   

//          <Tabs.Screen
//         name="wishlist"
//         options={{
//           title:currentLocal.home.wishlist,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
//         }}
//       />
//          <Tabs.Screen
//         name="settings"
//         options={{
//           title:currentLocal.home.settings,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }else{
//     return (
// <Tabs
//   screenOptions={{
//     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//     headerShown: false,
//     tabBarButton: HapticTab,

//     tabBarStyle: {
//       height: 65,
//       paddingBottom: 8,
//       paddingTop: 5,
//       backgroundColor: "#fff",
//     },

//     tabBarLabelStyle: {
//       fontFamily: "MediumMoto",
//       fontSize: 12,
//     },

//     tabBarItemStyle: {
//       justifyContent: "center",
//       alignItems: "center",
//     },

//     tabBarAllowFontScaling: false
//   }}
// >
  
  

//          <Tabs.Screen
//         name="settings"
//         options={{
//           title:currentLocal.home.settings,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
//         }}
//       />
//                <Tabs.Screen
//         name="wishlist"
//         options={{
//           title:currentLocal.home.wishlist,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
//         }}
//       />
//           <Tabs.Screen
//         name="map"
//         options={{
//           title:currentLocal.home.map,
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
//         }}
//       />   
//           <Tabs.Screen
//         name="index"
//         options={{
//           title: 'الرئيسية',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
// }


import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { PixelRatio, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const fontScale = PixelRatio.getFontScale();

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { list: profile } = useSelector((state) => state.profile);
  const { currentLocal } = useSelector((state) => state.Localization);
  const colorScheme = useColorScheme();

  const isRTL = currentLocal.language === 'العربيه';

  // تصحيح المنطق: نريد إظهار زر الإضافة لمزود الخدمة وصاحب المتجر
  const isServiceProvider = profile?.type === "service_provider" || profile?.type === "shop_owner";

  const tabBarStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    position: 'absolute',
    ...(Platform.OS !== 'ios' && {
      bottom: 0,
      height: insets.bottom * 3 - 20,
    }),
  };

  // بناء القوائم ديناميكياً
  const getTabs = () => {
    const baseTabs = [
      {
        name: 'index',
        title: isRTL ? 'الرئيسية' : 'Home',
        icon: 'home',
      },

      {
        name: 'map', // ملف settings.js
        title: isRTL ? 'الخريطة' : 'Map',
        icon: 'map-outline',
      },
            {
        name: 'wishlist', // ملف settings.js
        title: isRTL ? 'المفضلة' : 'Wishlist',
        icon: 'heart-outline',
      },
        {
        name: 'settings', // ملف settings.js
        title: isRTL ? 'الاعدادات' : 'Settings',
        icon: 'settings-outline',
      },
    ];

    // عكس الترتيب في حالة اللغة العربية لضمان تجربة مستخدم (RTL) صحيحة
    return isRTL ? baseTabs.reverse() : baseTabs;
  };

  const tabs = getTabs();

  return (
    <SafeAreaProvider>
<Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,

    tabBarStyle: {
      height: 65,
      paddingBottom: 8,
      paddingTop: 5,
      backgroundColor: "#fff",
    },

    tabBarLabelStyle: {
      fontFamily: "MediumMoto",
      fontSize: 12,
    },

    tabBarItemStyle: {
      justifyContent: "center",
      alignItems: "center",
    },

    tabBarAllowFontScaling: false
  }}
>
        {tabs.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons 
                  // تغيير شكل الأيقونة عند التحديد لتبدو احترافية
                  name={focused ? icon.replace('-outline', '') : icon} 
                  size={28} 
                  color={color} 
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </SafeAreaProvider>
  );
}