import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function Schedule() {
  return (
    <>
      <Stack.Screen options={{ title: 'Schedule' }} />
      <View className="flex-1 p-8">
        <Text className="text-bold text-4xl">Schedule</Text>
      </View>
    </>
  );
}
