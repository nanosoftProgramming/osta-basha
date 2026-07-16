
// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform, PixelRatio } from 'react-native';
// import { HapticTab } from '@/components/HapticTab';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/theme';
// import { useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// const fontScale = PixelRatio.getFontScale();

// export default function TabLayout() {
//   const insets = useSafeAreaInsets();
//   const { list: profile } = useSelector((state) => state.profile);
//   const { currentLocal } = useSelector((state) => state.Localization);
//   const colorScheme = useColorScheme();

//   const isRTL = currentLocal.language === 'العربيه';

//   // تصحيح المنطق: نريد إظهار زر الإضافة لمزود الخدمة وصاحب المتجر
//   const isServiceProvider = profile?.type === "service_provider" || profile?.type === "shop_owner";

//   const tabBarStyle = {
//     flexDirection: isRTL ? 'row-reverse' : 'row',
//     position: 'absolute',
//     ...(Platform.OS !== 'ios' && {
//       bottom: 0,
//       height: insets.bottom * 3 - 20,
//     }),
//   };

//   const getTabs = () => {
//     const baseTabs = [
//       {
//         name: 'index', 
//         title: isRTL ? 'الرئيسية' : 'Home',
//         icon: 'home',
//       },
//       ...(isServiceProvider ? [{
//         name: 'add', 
//         title: isRTL ? 'أضافة' : 'Add',
//         icon: 'add-circle-outline',
//       }] : []),
//       {
//         name: 'settings',
//         title: isRTL ? 'الاعدادات' : 'Settings',
//         icon: 'settings-outline',
//       },
//     ];

//     return isRTL ? baseTabs.reverse() : baseTabs;
//   };

//   const tabs = getTabs();

//   return (
//     <SafeAreaProvider>
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
//         {tabs.map(({ name, title, icon }) => (
//           <Tabs.Screen
//             key={name}
//             name={name}
//             options={{
//               title,
//               tabBarIcon: ({ focused, color }) => (
//                 <Ionicons 
//                   // تغيير شكل الأيقونة عند التحديد لتبدو احترافية
//                   name={focused ? icon.replace('-outline', '') : icon} 
//                   size={28} 
//                   color={color} 
//                 />
//               ),
//             }}
//           />
//         ))}
//       </Tabs>
//     </SafeAreaProvider>
//   );
// }
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, PixelRatio } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/theme';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { list: profile } = useSelector((state) => state.profile);
  const { currentLocal } = useSelector((state) => state.Localization);
  const colorScheme = useColorScheme();

  const isRTL = currentLocal.language === 'العربيه';
  const isServiceProvider = profile?.type === "service_provider" || profile?.type === "shop_owner";

  // استخدام useMemo لضمان عدم إعادة إنشاء المصفوفة أو تغييرها مع كل Render
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        name: 'index',
        title: isRTL ? 'الرئيسية' : 'Home',
        icon: 'home',
      },
      ...(isServiceProvider ? [{
        name: 'add', 
        title: isRTL ? 'أضافة' : 'Add',
        icon: 'add-circle-outline',
      }] : []),
      {
        name: 'settings', 
        title: isRTL ? 'الاعدادات' : 'Settings',
        icon: 'settings-outline',
      },
    ];

    // استخدام [...] لعمل نسخة سطحية قبل عكسها لتجنب التأثير على المصفوفة الأصلية
    return isRTL ? [...baseTabs].reverse() : baseTabs;
  }, [isRTL, isServiceProvider]);

  const tabBarStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    height: 65,
    paddingBottom: 8,
    paddingTop: 5,
    backgroundColor: "#fff",
    position: 'absolute',
    ...(Platform.OS !== 'ios' && {
      bottom: 0,
    }),
  };

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle,
          tabBarLabelStyle: {
            fontFamily: "MediumMoto",
            fontSize: 12,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: isRTL ? 'row-reverse' : 'row', // لضمان محاذاة الأيقونة والنص بشكل صحيح في RTL
          },
          tabBarAllowFontScaling: false,
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
                  name={(focused ? icon.replace('-outline', '') : icon) } 
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