import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { fetchTasks, createTask, updateTask, deleteTask } from '~/api/tasks';
import { Task, TaskPost } from '~/utils/types';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<TaskPost>>({
    title: '',
    description: '',
    category: '',
    frequency: 'Once',
    dueDate: new Date(),
    priority: 'Medium',
    difficulty: 'Medium',
    duration: 0,
    flexible: false,
    auto: false,
    userID: 1, // Replace with actual user ID
    calendarID: 1, // Replace with actual calendar ID
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await fetchTasks(1); // Replace with actual user ID
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    }
  };

  const handleCreateTask = async () => {
    try {
      const createdTask = await createTask(newTask as TaskPost);
      setTasks([...tasks, createdTask]);
      setModalVisible(false);
      resetNewTask();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const updatedTask = await updateTask(editingTask.id, newTask);
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      setModalVisible(false);
      setEditingTask(null);
      resetNewTask();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      category: '',
      frequency: 'Once',
      dueDate: new Date(),
      priority: 'Medium',
      difficulty: 'Medium',
      completed: false,
      duration: 0,
      flexible: false,
      auto: false,
      userID: 1, // Replace with actual user ID
      calendarID: 1, // Replace with actual calendar ID
    });
  };

  const toggleComplete = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { ...task, completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
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

  const renderItem = ({ item }: { item: Task }) => (
    <View className="flex-row items-center border-b border-gray-200 py-2">
      <View className="flex-1">
        <Text className="font-semibold">{item.title}</Text>
      </View>
      <View className="w-20 items-center">
        <Text className="text-sm text-gray-600">{format(new Date(item.dueDate), 'MMM d')}</Text>
      </View>
      <View className="w-20 items-center">
        <View className={`rounded-full px-2 py-1 ${getPriorityColor(item.priority)}`}>
          <Text className="text-xs font-medium text-white">{item.priority}</Text>
        </View>
      </View>
      <View className="w-12 items-center">
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleComplete(item)}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setEditingTask(item);
          setNewTask({ ...item, dueDate: item.dueDate });
          setModalVisible(true);
        }}>
        <Text className="mr-2 text-blue-500">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
        <Text className="text-red-500">Delete</Text>
      </TouchableOpacity>
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
        <Text className="w-24 text-center">Actions</Text>
      </View>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => String(item.id)} />
      <TouchableOpacity
        className="mt-4 items-center rounded-full bg-blue-500 px-4 py-2"
        onPress={() => {
          setEditingTask(null);
          resetNewTask();
          setModalVisible(true);
        }}>
        <Text className="font-bold text-white">Add New Task</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
          <View className="max-h-5/6 w-5/6 rounded-lg bg-white p-4">
            <ScrollView>
              <Text className="mb-4 text-xl font-bold">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </Text>

              <Text className="mb-1 font-medium">Title</Text>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Enter task title"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />

              <Text className="mb-1 font-medium">Description</Text>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Enter task description"
                multiline
                numberOfLines={3}
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              />

              <Text className="mb-1 font-medium">Category</Text>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Enter task category"
                value={newTask.category}
                onChangeText={(text) => setNewTask({ ...newTask, category: text })}
              />

              <Text className="mb-1 font-medium">Frequency</Text>
              <View className="mb-2 flex-row justify-around">
                {['Once', 'Daily', 'Weekly', 'Monthly'].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    className={`rounded-full px-4 py-2 ${newTask.frequency === freq ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => setNewTask({ ...newTask, frequency: freq })}>
                    <Text className={`${newTask.frequency === freq ? 'text-white' : 'text-black'}`}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="mb-1 font-medium">Due Date</Text>
              <DateTimePicker
                value={new Date(newTask.dueDate || new Date())}
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  setNewTask({
                    ...newTask,
                    dueDate: selectedDate || newTask.dueDate,
                  })
                }
              />

              <Text className="mb-1 mt-4 font-medium">Priority</Text>
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

              <Text className="mb-1 font-medium">Difficulty</Text>
              <View className="mb-2 flex-row justify-around">
                {['Low', 'Medium', 'High'].map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    className={`rounded-full px-4 py-2 ${newTask.difficulty === difficulty ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => setNewTask({ ...newTask, difficulty })}>
                    <Text
                      className={`${newTask.difficulty === difficulty ? 'text-white' : 'text-black'}`}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="mb-1 font-medium">Duration (in minutes)</Text>
              <TextInput
                className="mb-2 rounded-md border border-gray-300 p-2"
                placeholder="Enter task duration"
                keyboardType="numeric"
                value={newTask.duration?.toString() || ''}
                onChangeText={(num) => setNewTask({ ...newTask, duration: Number(num) })}
              />

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-medium">Flexible</Text>
                <Switch
                  value={newTask.flexible === true}
                  onValueChange={(value) => setNewTask({ ...newTask, flexible: value })}
                />
              </View>

              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-medium">Auto-schedule</Text>
                <Switch
                  value={newTask.auto}
                  onValueChange={(value) => setNewTask({ ...newTask, auto: value })}
                />
              </View>

              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="mr-2 rounded-md bg-gray-300 px-4 py-2"
                  onPress={() => setModalVisible(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md bg-blue-500 px-4 py-2"
                  onPress={editingTask ? handleUpdateTask : handleCreateTask}>
                  <Text className="text-white">{editingTask ? 'Update' : 'Add'} Task</Text>
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
