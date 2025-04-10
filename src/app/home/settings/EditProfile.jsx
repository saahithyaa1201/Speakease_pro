import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EditProfile = () => {
  const [name, setName] = useState('User_01');
  const [dateOfBirth, setDateOfBirth] = useState('01/01/2024');
  const [profileImage, setProfileImage] = useState(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setDateOfBirth(data.dateOfBirth);
          setProfileImage(data.profileImage);
          setAddress(data.address);
          setPhoneNumber(data.phoneNumber);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // Format date of birth input
  const formatDateOfBirth = (text) => {
    // Remove any non-numeric characters
    let input = text.replace(/[^0-9]/g, '');
    
    // Validate day, month and year
    if (input.length >= 4) {
      const day = parseInt(input.substring(0, 2));
      const month = parseInt(input.substring(2, 4));
      
      // Basic date validation
      if (day > 31 || month > 12) {
        return dateOfBirth; // Return previous valid date
      }
    }

    // Format as DD/MM/YYYY
    if (input.length <= 2) {
      return input;
    } else if (input.length <= 4) {
      return `${input.substring(0, 2)}/${input.substring(2)}`;
    } else if (input.length <= 8) {
      return `${input.substring(0, 2)}/${input.substring(2, 4)}/${input.substring(4)}`;
    }
    return input.substring(0, 8); // Limit to 8 digits
  };

  const handleDateOfBirthChange = (text) => {
    try {
      const formatted = formatDateOfBirth(text);
      if (formatted !== dateOfBirth) { // Only update if value has changed
        setDateOfBirth(formatted);
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      // Keep the previous valid value
    }
  };

  // Image picker functionality
  const handleSelectImage = async () => {
    Alert.alert(
      'Update Profile Photo',
      'Please select an option',
      [
        { 
          text: 'Take Photo', 
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Camera access is needed to take a new profile photo.');
              return;
            }
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          } 
        },
        { 
          text: 'Choose from Library', 
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Photo library access is needed to select a profile photo.');
              return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          } 
        },
        { text: 'Remove Photo', onPress: () => setProfileImage(null) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    if (user) {
      // Validate date format
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
      if (!dateRegex.test(dateOfBirth)) {
        Alert.alert(
          'Invalid Date', 
          'Please enter a valid date in DD/MM/YYYY format'
        );
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        name,
        dateOfBirth,
        profileImage,
        address,
        phoneNumber,
      });
      Alert.alert(
        'Profile Updated', 
        'Your profile information has been successfully updated.',
        [{ text: 'OK' }]
      );
      console.log({
        name,
        dateOfBirth,
        profileImage,
        address,
        phoneNumber,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A73E8" />
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.defaultProfileText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleSelectImage}
            >
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>{name}</Text>
          <Text style={styles.userSubtitle}>Personal Information</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9EA0A4"
                />
                <View style={[styles.inputIcon, {backgroundColor: '#EBF5FF'}]}>
                  <Text style={{fontSize: 16}}>👤</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={dateOfBirth}
                  onChangeText={handleDateOfBirthChange}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#9EA0A4"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <View style={[styles.inputIcon, {backgroundColor: '#EBF5FF'}]}>
                  <Text style={{fontSize: 16}}>🗓</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputMultiline}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your complete address"
                  placeholderTextColor="#9EA0A4"
                  multiline={true}
                  numberOfLines={3}
                />
                <View style={[styles.inputIcon, {backgroundColor: '#EBF5FF', marginTop: 12}]}>
                  <Text style={{fontSize: 16}}>📍</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9EA0A4"
                  keyboardType="phone-pad"
                />
                <View style={[styles.inputIcon, {backgroundColor: '#EBF5FF'}]}>
                  <Text style={{fontSize: 16}}>📱</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1A73E8',
    paddingVertical: 22,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    marginTop: 22,
    marginHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6EFFD',
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E6EFFD',
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E6EFFD',
  },
  defaultProfileText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#4285F4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  username: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#2C384A',
    letterSpacing: 0.2,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#5F6B7A',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6EFFD',
  },
  inputGroup: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C384A',
    marginBottom: 8,
    paddingLeft: 2,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DEEAFD',
    borderRadius: 10,
    padding: 14,
    paddingRight: 50,
    fontSize: 15,
    color: '#2C384A',
    backgroundColor: '#FFFFFF',
  },
  inputMultiline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DEEAFD',
    borderRadius: 10,
    padding: 14,
    paddingRight: 50,
    fontSize: 15,
    color: '#2C384A',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
    height: 36,
    width: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  bottomPadding: {
    height: 40,
  },
});

export default EditProfile;