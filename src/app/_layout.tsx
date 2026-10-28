import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LearnedProvider } from '../learned';
import { useTheme } from '../theme';

export default function RootLayout() {
  const t = useTheme();
  return (
    <LearnedProvider>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.bg },
          headerTintColor: t.ink,
          headerShadowVisible: false,
          headerBackTitle: '返回',
          contentStyle: { backgroundColor: t.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="knot/[id]" options={{ title: '' }} />
      </Stack>
    </LearnedProvider>
  );
}
