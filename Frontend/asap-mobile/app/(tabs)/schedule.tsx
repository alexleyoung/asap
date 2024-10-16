import { Stack } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

export default function Schedule() {
  return (
    <>
      <Stack.Screen options={{ title: 'Schedule' }} />
      <SafeAreaView>
        <View className="grid h-screen place-items-center">
          <Text className="text-bold text-4xl">Schedule</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
