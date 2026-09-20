import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <Text className="text-3xl font-bold text-slate-950 dark:text-white">
        Full Stack Template
      </Text>
      <Text className="mt-3 text-center text-base text-slate-600 dark:text-slate-300">
        Replace this route with your first feature.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
