import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { initDB } from './services/database';

import '../tamagui-web.css';
import { config } from '../tamagui.config';
import { useFonts } from 'expo-font';


export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '(tabs)', };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        await initDB();
        setDbInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setDbInitialized(true);
      }
    }
  
    initializeApp();
  }, []);
  
  useEffect(() => {
    // Only hide the SplashScreen when both fonts and DB are ready (or fonts failed to load)
    if ((fontsLoaded || fontsError) && dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError, dbInitialized]); // Depend on dbInitialized as well
  

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="new-category-modal" options={{ presentation: 'modal' }} />
          </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
