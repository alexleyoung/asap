import { SafeAreaView, SectionList, Text, View } from 'react-native';

import { tempTasksData } from '~/utils/constants';

const tasks = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <SectionList
        sections={tempTasksData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => <Text className="text-xl">{title}</Text>}
      />
    </SafeAreaView>
  );
};

export default tasks;
