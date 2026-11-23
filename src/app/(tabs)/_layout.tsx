import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import type { FeatherName } from '@/components/ui';
import { useStore } from '@/store';
import { colors, fonts, hairline } from '@/theme';

const icon = (name: FeatherName) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Feather name={name} size={21} color={color as string} />;
  };

export default function TabsLayout() {
  const { activeOrders } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.lineStrong,
          borderTopWidth: hairline,
          elevation: 0,
        },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.2 },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Browse', tabBarIcon: icon('search') }} />
      <Tabs.Screen name="sell" options={{ title: 'Sell', tabBarIcon: icon('camera') }} />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Deals',
          tabBarIcon: icon('repeat'),
          tabBarBadge: activeOrders.length || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.forest, fontFamily: fonts.sansSemi, fontSize: 10 },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
