import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
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
    completed: false, // Added completed: false
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
    completed: false, // Added completed: false
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
    completed: false, // Added completed: false
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
    completed: false, // Added completed: false
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
    completed: false, // Added completed: false
  },
  // Add more dummy tasks as needed
];

const TasksPage = () => {
  const [tasks, setTasks] = useState(dummyTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ScheduleTask>>({
    title: '',
    description: '',
    due: new Date(),
    priority: 'Medium',
    difficulty: 'Medium',
    duration: '',
    flexible: false,
    auto: false,
  });

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

  const addTask = () => {
    const task: ScheduleTask = {
      ...newTask,
      siid: Date.now().toString(),
      start: new Date(),
      end: new Date(),
      category: 'Default',
      frequency: 'Once',
      uid: 'user1',
      cid: 'calendar1',
      color: '#000000',
    } as ScheduleTask;

    setTasks([...tasks, task]);
    setModalVisible(false);
    setNewTask({
      title: '',
      description: '',
      due: new Date(),
      priority: 'Medium',
      difficulty: 'Medium',
      duration: '',
      flexible: false,
      auto: false,
    });
  };

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
        onPress={() => setModalVisible(true)}>
        <Text className="font-bold text-white">Add New Task</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
          <View className="max-h-5/6 w-5/6 rounded-lg bg-white p-4">
            <ScrollView>
              <Text className="mb-4 text-xl font-bold">Add New Task</Text>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Title"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Description"
                multiline
                numberOfLines={3}
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              />
              <Text className="mb-2">Due Date:</Text>
              <DateTimePicker
                value={newTask.due || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  setNewTask({ ...newTask, due: selectedDate || newTask.due })
                }
              />
              <Text className="mb-2 mt-4">Priority:</Text>
              <View className="mb-2 flex-row justify-around">
                {['Low', 'Medium', 'High'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    className={`rounded-full px-4 py-2 ${newTask.priority === priority ? getPriorityColor(priority) : 'bg-gray-200'}`}
                    onPress={() => setNewTask({ ...newTask, priority })}>
                    <Text
                      className={`${newTask.priority === priority ? 'text-white' : 'text-black'}`}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Duration (e.g., 2 hours)"
                value={newTask.duration}
                onChangeText={(text) => setNewTask({ ...newTask, duration: text })}
              />
              <View className="mb-2 flex-row items-center">
                <Text className="mr-2">Flexible:</Text>
                <Checkbox
                  status={newTask.flexible ? 'checked' : 'unchecked'}
                  onPress={() => setNewTask({ ...newTask, flexible: !newTask.flexible })}
                />
              </View>
              <View className="mb-4 flex-row items-center">
                <Text className="mr-2">Auto-schedule:</Text>
                <Checkbox
                  status={newTask.auto ? 'checked' : 'unchecked'}
                  onPress={() => setNewTask({ ...newTask, auto: !newTask.auto })}
                />
              </View>
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="mr-2 rounded-md bg-gray-300 px-4 py-2"
                  onPress={() => setModalVisible(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-md bg-blue-500 px-4 py-2" onPress={addTask}>
                  <Text className="text-white">Add Task</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TasksPage;
