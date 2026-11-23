import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Newsreader_400Regular_Italic, Newsreader_500Medium, useFonts } from '@expo-google-fonts/newsreader';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { StoreProvider } from '@/store';
import { colors, fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Newsreader_500Medium, Newsreader_400Regular_Italic,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="listing/[id]" />
        <Stack.Screen name="collection/[id]" />
        <Stack.Screen name="reserve/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="offer/[id]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.56],
            sheetGrabberVisible: true,
            sheetCornerRadius: 28,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
        <Stack.Screen
          name="order/[id]"
          options={{
            headerShown: true,
            title: 'Order',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.forest,
            headerTitleStyle: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink },
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack>
    </StoreProvider>
  );
}
