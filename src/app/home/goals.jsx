import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

//configure notifications handler to show alert, play sound
//but not set badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Goals = () => {

  //state for the goal the user is currently editing
  const [dailyGoal, setDailyGoal] = useState('1');
  //state for the goal that's been saved to storage
  const [savedGoal, setSavedGoal] = useState('1');
  //track how many lessons were completed tday 
  const [completedLessons, setCompletedLessons] = useState(0);
  //tracks if daily reminder is enabled
  const [reminderEnabled, setReminderEnabled] = useState(false);
  //format today's date for display
  const [todayFormatted, setTodayFormatted] = useState('');
  //track if daily goal has beed achieved
  const [goalAchieved, setGoalAchieved] = useState(false);
  
  // states for custom reminder time configuration
  const [reminderHour, setReminderHour] = useState(18); // Default to 6 PM
  const [reminderMinute, setReminderMinute] = useState(0);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  
  //function to get current day name 
  const getCurrentDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  //Set up current day on component mount
  useEffect(() => {
    const today = getCurrentDayName();
    setTodayFormatted(`Today (${today})`);
  }, []);
  
  //load saved data on component mount
  useEffect(() => {
    loadGoal();
    loadCompletedLessons();
    loadReminderSettings();
    requestNotificationPermissions();
  }, []);
  
  //check if goal is achieved whenever completedLessons or savedGoal changes
  useEffect(() => {
    const goal = parseInt(savedGoal || '1');
    setGoalAchieved(completedLessons >= goal);
  }, [completedLessons, savedGoal]);
  
  // Request notification permissions
  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.requestPermissionsAsync();
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow notifications to receive daily reminders.');
      }
    }
  };
  
  //save goal to AsyncStorage and update the savedGoal state
  const saveGoal = async () => {
    try {
      await AsyncStorage.setItem('dailyGoal', dailyGoal);
      //update savedGoal state to match the UI state
      setSavedGoal(dailyGoal);
      console.log('Goal saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving goal:', error);
      return false;
    }
  };
  
  //load saved goal from AsyncStorage
  const loadGoal = async () => {
    try {
      const savedGoalValue = await AsyncStorage.getItem('dailyGoal');
      if (savedGoalValue !== null) {
        // Update both UI state and saved state
        setDailyGoal(savedGoalValue);
        setSavedGoal(savedGoalValue);
      }
    } catch (error) {
      console.error('Error loading goal:', error);
    }
  };
  
  //load completed lessons from AsyncStorage
  const loadCompletedLessons = async () => {
    try {
      const savedCompletedLessons = await AsyncStorage.getItem('completedLessons');
      if (savedCompletedLessons !== null) {
        // Make sure we're parsing a valid number
        const parsedValue = parseInt(savedCompletedLessons);
        //check if parsedValue is a valid number, if not, default to 0
        setCompletedLessons(isNaN(parsedValue) ? 0 : parsedValue);
      } else {
        setCompletedLessons(0);
      }
    } catch (error) {
      console.error('Error loading completed lessons:', error);
      // Default to 0 if there's an error
      setCompletedLessons(0);
    }
  };
  
  //load reminder settings (enabled/disabled and time) from AsyncStorage
  const loadReminderSettings = async () => {
    try {
      const savedReminderEnabled = await AsyncStorage.getItem('reminderEnabled');
      if (savedReminderEnabled !== null) {
        setReminderEnabled(JSON.parse(savedReminderEnabled));
      }
      
      //load reminder time
      const savedReminderHour = await AsyncStorage.getItem('reminderHour');
      const savedReminderMinute = await AsyncStorage.getItem('reminderMinute');
      
      if (savedReminderHour !== null) {
        setReminderHour(parseInt(savedReminderHour));
      }
      
      if (savedReminderMinute !== null) {
        setReminderMinute(parseInt(savedReminderMinute));
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };
  
  // Increment goal value with upper limit of 99 (only affects UI state)
  const incrementGoal = () => {
    const currentGoal = parseInt(dailyGoal || '1');
    const newGoal = Math.min(currentGoal + 1, 99); 
    setDailyGoal(newGoal.toString());
  };

  // Decrement goal value with lower limit of 1(only affects UI state)
  const decrementGoal = () => {
    const currentGoal = parseInt(dailyGoal || '1');
    const newGoal = Math.max(1, currentGoal - 1); 
    setDailyGoal(newGoal.toString());
  };
  
  //save the goal and show success/failure alert- this is when the savedGoal gets updated
  const handleSaveGoal = async () => {
    const success = await saveGoal();
    if (success) {
      Alert.alert('Success', 'Goal saved successfully!');
    } else {
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };
  
  //toggle reminder on/off and update storage and notifications
  const toggleReminder = async () => {
    const newStatus = !reminderEnabled;
    setReminderEnabled(newStatus);
    
    try {
      await AsyncStorage.setItem('reminderEnabled', JSON.stringify(newStatus));
      
      //cancel all notifications if turning off
      if (!newStatus) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } else {
        //schedule notification if turning on
        await scheduleReminder();
      }
    } catch (error) {
      console.error('Error saving reminder setting:', error);
    }
  };
  
  //schedule reminder notification at user's selected time
  const scheduleReminder = async () => {
    try {
      //cancel existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      //set up a daily notification at user's selected time
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Learning Reminder',
          body: 'Don\'t forget to complete your lessons for today!',
          sound: true,
        },
        trigger: {
          hour: reminderHour,
          minute: reminderMinute,
          repeats: true,
        },
      });
      
      Alert.alert('Reminder Set', `Daily reminder scheduled for ${formatTime(reminderHour, reminderMinute)}`);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  };
  
  //save reminder time to AsynccStorage and update notifications if enabled
  const saveReminderTime = async (hour, minute) => {
    try {
      await AsyncStorage.setItem('reminderHour', hour.toString());
      await AsyncStorage.setItem('reminderMinute', minute.toString());
      
      // Update notification if reminder is enabled
      if (reminderEnabled) {
        await scheduleReminder();
      }
    } catch (error) {
      console.error('Error saving reminder time:', error);
    }
  };
  
  //format time for display in 12-hr format
  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };
  
  //update time state and save the new time
  const updateTime = (hour, minute) => {
    setReminderHour(hour);
    setReminderMinute(minute);
    saveReminderTime(hour, minute);
    setTimePickerVisible(false);
  };
  
  // Time picker increment/decrement controls
  const incrementHour = () => {
    setReminderHour((prev) => (prev + 1) % 24);
  };
  
  const decrementHour = () => {
    setReminderHour((prev) => (prev - 1 + 24) % 24);
  };
  
  //minutes (in 5minutes increments)
  const incrementMinute = () => {
    setReminderMinute((prev) => (prev + 5) % 60);
  };
  
  const decrementMinute = () => {
    setReminderMinute((prev) => (prev - 5 + 60) % 60);
  };
  
  // Prepare data for pie chart - Using savedGoal instead of dailyGoal
  const getPieChartData = () => {
    const goal = parseInt(savedGoal || '1');
    
    // If completed is greater than or equal to goal, show 100% complete
    if (completedLessons >= goal) {
      return [
        {
          name: 'Completed',
          lessons: 1,
          color: '#3b7d9f',
          legendFontColor: '#0b4660',
          legendFontSize: 15
        }
      ];
    }
    
    // Otherwise show actual percentage
    const remaining = Math.max(0, goal - completedLessons);
    const completed = Math.max(0, completedLessons);
    
    // Handle edge case when both values are 0
    if (completed === 0 && remaining === 0) {
      return [
        {
          name: 'Remaining',
          lessons: 1,
          color: '#e4edf2',
          legendFontColor: '#165b75',
          legendFontSize: 15
        }
      ];
    }
    
    return [
      {
        name: 'Completed',
        lessons: completed,
        color: '#3b7d9f',
        legendFontColor: '#0b4660',
        legendFontSize: 15
      },
      {
        name: 'Remaining',
        lessons: remaining,
        color: '#e4edf2',
        legendFontColor: '#165b75',
        legendFontSize: 15
      }
    ];
  };
  
  //calculate completion percentage - Using savedGoal instead of dailyGoal
  const getCompletionPercentage = () => {
    const goal = parseInt(savedGoal || '1');
    
    // Prevent division by zero
    if (goal === 0) return 0;
    
    if (completedLessons >= goal) {
      return 100;
    }
    
    // Make sure we have valid numbers
    const completed = isNaN(completedLessons) ? 0 : completedLessons;
    return Math.round((completed / goal) * 100);
  };
  
  //get current screen width for responsive chart sizing
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Daily Learning Goals</Text>
        
        {/* Goal setting section */}
        <View style={styles.statusCard}>
          <Text style={styles.dateHeading}>{todayFormatted}</Text>
          
          <View style={styles.goalInputContainer}>
            <Text style={styles.label}>Number of lessons:</Text>
            
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={decrementGoal}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              
              <Text style={styles.counterValue}>{dailyGoal}</Text>
              
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={incrementGoal}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show message if unsaved changes exist */}
          {dailyGoal !== savedGoal && (
            <Text style={styles.unsavedChanges}>
              Click "Save Goal" to apply changes
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveGoal}
        >
          <Text style={styles.saveButtonText}>Save Goal</Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        {/* Progress section with a pie chart visualization */}
        <Text style={styles.subtitle}>Your Progress</Text>
        
        <View style={styles.chartContainer}>
          <PieChart
            data={getPieChartData()}
            width={screenWidth - 40}
            height={180}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="lessons"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {isNaN(completedLessons) ? 0 : completedLessons} / {savedGoal} lessons completed
            </Text>
            
            <Text style={styles.progressPercentage}>
              {getCompletionPercentage()}% Complete
            </Text>
            
            {/*Celebration banner that appears when goal is reached*/}
            {goalAchieved && (
              <View style={styles.achievementBanner}>
                <Text style={styles.achievementText}>🎉 Goal achieved! 🎉</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Reminder toggle */}
        <View style={styles.reminderSection}>
          <Text style={styles.reminderTitle}>Daily Reminder</Text>
          
          <View style={styles.reminderToggleContainer}>
            <Text style={styles.reminderLabel}>Enable daily reminder:</Text>
            <TouchableOpacity 
              style={[styles.toggleButton, reminderEnabled ? styles.toggleActive : styles.toggleInactive]} 
              onPress={toggleReminder}
            >
              <View style={[
                styles.toggleIndicator, 
                reminderEnabled ? styles.toggleIndicatorRight : styles.toggleIndicatorLeft
              ]} />
            </TouchableOpacity>
          </View>
          
          {/* Time picker section - ONLY SHOWN WHEN REMINDER IS ENABLED */}
          {reminderEnabled && (
            <View style={styles.reminderTimeContainer}>
              <Text style={styles.reminderTimeLabel}>Reminder time:</Text>
              <TouchableOpacity 
                style={styles.timePickerButton}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.timePickerButtonText}>
                  {formatTime(reminderHour, reminderMinute)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Time picker modal for setting reminder time*/}
        <Modal
          visible={timePickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setTimePickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Reminder Time</Text>
              
              <View style={styles.timePickerContainer}>
                {/* Hour picker with increment/decrement controls*/}
                <View style={styles.timePickerColumn}>
                  <TouchableOpacity 
                    style={styles.timeArrowButton} 
                    onPress={incrementHour}
                  >
                    <Text style={styles.timeArrowButtonText}>▲</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.timeValue}>
                    {reminderHour.toString().padStart(2, '0')}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.timeArrowButton} 
                    onPress={decrementHour}
                  >
                    <Text style={styles.timeArrowButtonText}>▼</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.timeLabel}>Hour</Text>
                </View>
                
                <Text style={styles.timeSeparator}>:</Text>
                
                {/* Minute picker with increment/decrement controls*/}
                <View style={styles.timePickerColumn}>
                  <TouchableOpacity 
                    style={styles.timeArrowButton} 
                    onPress={incrementMinute}
                  >
                    <Text style={styles.timeArrowButtonText}>▲</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.timeValue}>
                    {reminderMinute.toString().padStart(2, '0')}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.timeArrowButton} 
                    onPress={decrementMinute}
                  >
                    <Text style={styles.timeArrowButtonText}>▼</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.timeLabel}>Minute</Text>
                </View>
                
                {/* AM/PM indicator that automatically get updated based on hour*/}
                <View style={styles.amPmContainer}>
                  <Text style={styles.amPmText}>
                    {reminderHour >= 12 ? 'PM' : 'AM'}
                  </Text>
                </View>
              </View>
              
              {/*modal buttons for confirming or canceling time selection*/}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setTimePickerVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={() => updateTime(reminderHour, reminderMinute)}
                >
                  <Text style={styles.modalSaveButtonText}>Set Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

//styles object defines all the styling for the component
const styles = StyleSheet.create({
  //all styles remain unchanged
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding:'5%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003247',
    textAlign: 'Left',
    padding: '2%'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
    color: '#165b75',
  },
  dateHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003247',
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: '#f5f9fb',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#165b75',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b7d9f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: '#165b75',
    minWidth: 30,
    textAlign: 'center',
  },
  unsavedChanges: {
    fontSize: 14,
    color: '#e67e22',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2c6e8d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#93bdd8',
    marginVertical: 15,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressTextContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#165b75',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b4660',
  },
  reminderSection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f5f9fb',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#165b75',
    marginBottom: 12,
  },
  reminderToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reminderLabel: {
    fontSize: 15,
    color: '#0b4660',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#3b7d9f',
  },
  toggleInactive: {
    backgroundColor: '#ccc',
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleIndicatorLeft: {
    alignSelf: 'flex-start',
  },
  toggleIndicatorRight: {
    alignSelf: 'flex-end',
  },
  achievementBanner: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  
  //styles for timepicker
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  reminderTimeLabel: {
    fontSize: 15,
    color: '#0b4660',
  },
  timePickerButton: {
    backgroundColor: '#e4edf2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93bdd8',
  },
  timePickerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#165b75',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003247',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  timePickerColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeArrowButton: {
    padding: 5,
  },
  timeArrowButtonText: {
    fontSize: 20,
    color: '#3b7d9f',
    fontWeight: 'bold',
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#165b75',
    marginVertical: 10,
    width: 60,
    textAlign: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#165b75',
    marginTop: 5,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#165b75',
    marginTop: 10,
  },
  amPmContainer: {
    marginLeft: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e4edf2',
    alignSelf: 'center',
    minWidth: 50,
    alignItems: 'center',
  },
  amPmText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b4660',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#e4edf2',
  },
  modalCancelButtonText: {
    color: '#165b75',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: '#3b7d9f',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Goals;