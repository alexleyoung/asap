import { View, SafeAreaView, ScrollView, Image } from 'react-native';

import { images } from '../utils/constants';

const Landing = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="h-full w-full items-center justify-center px-4">
          <Image source={images.logo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Landing;
