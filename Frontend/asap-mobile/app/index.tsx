import { View, SafeAreaView, ScrollView, Image, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

import { images } from '../utils/constants';

const Landing = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="h-full w-full items-center justify-center px-4">
          {/* <Image source={images.logo} /> */}
          <Link href={'/schedule'}>
            <Text className="text-9xl text-white">Hello</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Landing;
