import { format } from 'date-fns';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { ScheduleTask } from '~/utils/types';

// Dummy data for demonstration
const dummyTasks: ScheduleTask[] = [
  {
    siid: '1',
    title: 'Complete Project Proposal',
    start: new Date('2023-06-10T09:00:00'),
    end: new Date('2023-06-10T11:00:00'),
    description: 'Finish the project proposal for the client',
    category: 'Work',
    frequency: 'Once',
    uid: 'user1',
    cid: 'calendar1',
    color: '#FF5733',
    due: new Date('2023-06-11T17:00:00'),
    priority: 'High',
    difficulty: 'Medium',
    duration: '2 hours',
    flexible: true,
    auto: true,
  },
  {
    siid: '2',
    title: 'Team Meeting',
    start: new Date('2023-06-12T10:00:00'),
    end: new Date('2023-06-12T11:00:00'),
    description: 'Discuss project updates with the team',
    category: 'Work',
    frequency: 'Weekly',
    uid: 'user1',
    cid: 'calendar1',
    color: '#33FF57',
    due: new Date('2023-06-12T17:00:00'),
    priority: 'Medium',
    difficulty: 'Easy',
    duration: '1 hour',
    flexible: false,
    auto: true,
  },
  {
    siid: '3',
    title: 'Grocery Shopping',
    start: new Date('2023-06-13T15:00:00'),
    end: new Date('2023-06-13T16:00:00'),
    description: 'Buy groceries for the week',
    category: 'Personal',
    frequency: 'Weekly',
    uid: 'user1',
    cid: 'calendar2',
    color: '#3357FF',
    due: new Date('2023-06-13T18:00:00'),
    priority: 'Low',
    difficulty: 'Easy',
    duration: '1 hour',
    flexible: true,
    auto: false,
  },
  {
    siid: '4',
    title: 'Doctor Appointment',
    start: new Date('2023-06-14T09:30:00'),
    end: new Date('2023-06-14T10:00:00'),
    description: 'Annual checkup with the doctor',
    category: 'Health',
    frequency: 'Once',
    uid: 'user2',
    cid: 'calendar3',
    color: '#FF33A1',
    due: new Date('2023-06-14T12:00:00'),
    priority: 'Medium',
    difficulty: 'Easy',
    duration: '30 minutes',
    flexible: false,
    auto: true,
  },
  {
    siid: '5',
    title: 'Finish Reading Book',
    start: new Date('2023-06-15T20:00:00'),
    end: new Date('2023-06-15T22:00:00'),
    description: 'Finish reading the current book for the month',
    category: 'Personal',
    frequency: 'Monthly',
    uid: 'user1',
    cid: 'calendar1',
    color: '#FFD700',
    due: new Date('2023-06-15T23:59:00'),
    priority: 'Low',
    difficulty: 'Medium',
    duration: '2 hours',
    flexible: true,
    auto: false,
  },
  // Add more dummy tasks as needed
];

const TasksPage = () => {
  const [tasks, setTasks] = useState(dummyTasks);

  const toggleComplete = (siid: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.siid === siid ? { ...task, completed: !task.completed } : task))
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderItem = ({ item }: { item: ScheduleTask }) => (
    <View className="flex-row items-center border-b border-gray-200 py-2">
      <View className="flex-1">
        <Text className="font-semibold">{item.title}</Text>
      </View>
      <View className="w-20 items-center">
        <Text className="text-sm text-gray-600">{format(item.due, 'MMM d')}</Text>
      </View>
      <View className="w-20 items-center">
        <View className={`rounded-full px-2 py-1 ${getPriorityColor(item.priority)}`}>
          <Text className="text-xs font-medium text-white">{item.priority}</Text>
        </View>
      </View>
      <View className="w-12 items-center">
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleComplete(item.siid)}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold">Tasks</Text>
      <View className="flex-row items-center bg-gray-100 py-2 font-bold">
        <Text className="flex-1 px-2">Task</Text>
        <Text className="w-20 text-center">Due</Text>
        <Text className="w-20 text-center">Priority</Text>
        <Text className="w-12 text-center">Done</Text>
      </View>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.siid} />
      <TouchableOpacity
        className="mt-4 items-center rounded-full bg-blue-500 px-4 py-2"
        onPress={() => console.log('Add new task')}>
        <Text className="font-bold text-white">Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TasksPage;
