import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

/**This screen allows users to enter a coupon code when upgrading their subscription plan
 * validates the coupon code, simulates an API call, and navigates back to the subscription screen with 
 updated plan information
  */
const CouponScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  //Extract the selected and current plans from route parameters
  const { selectedPlan, currentPlan } = route.params || {};

  //
  const [couponCode, setCouponCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate coupon code - must be 6 digits
  useEffect(() => {
    const digitRegex = /^\d{6}$/;
    setIsValid(digitRegex.test(couponCode));
  }, [couponCode]);

  const handleCouponChange = (text) => {
    // Only allow digits
    const filtered = text.replace(/[^0-9]/g, '');
    // Limit to 6 characters
    setCouponCode(filtered.slice(0, 6));
  };

  //handler for submitting the coupon code
  const handleSubmit = () => {
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success message
      Alert.alert(
        "Success!",
        `Upgraded to ${selectedPlan.code} plan.`,
        [
          { 
            text: "OK", 
            onPress: () => {
              // Navigate back to subscription page with updated plan
              navigation.navigate('subscription', {
                updatedSubscription: selectedPlan
              });
            } 
          }
        ]
      );
    }, 1000);
  };

  //handler for cancelling the coupon entry
  //returns to the previous screen
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*adjusts layout when keyboard appears */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Enter Coupon Code</Text>
            <Text style={styles.subHeader}>
              Enter your 6-digit coupon code to upgrade to {selectedPlan?.code} plan
            </Text>
          </View>
          
          <View style={[
            styles.planCard, 
            { borderColor: selectedPlan?.borderColor || '#3b7d9f' }
          ]}>
            <View style={styles.planHeaderContainer}>
              <Text style={styles.planTitle}>{selectedPlan?.code}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.planPrice}>{selectedPlan?.price}</Text>
                <Text style={styles.periodLabel}>{selectedPlan?.periodLabel}</Text>
              </View>
            </View>
            
            <Text style={styles.planDescription}>{selectedPlan?.description}</Text>
          </View>
          
          {/*coupon input section */}
          <View style={styles.couponContainer}>
            <Text style={styles.couponLabel}>6-digit Coupon Code:</Text>
            <TextInput
              style={styles.couponInput}
              value={couponCode}
              onChangeText={handleCouponChange}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
            />
            
            <View style={styles.helpText}>
              <Text style={styles.helpTextContent}>
                Please enter the 6-digit code you received
              </Text>
            </View>
          </View>
          
          {/*action button */}
          <View style={styles.buttonContainer}>
            {/*cancel button */}
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            {/*submit/ upgrade button */}
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton, 
                !isValid && styles.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={!isValid || isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Processing...' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff'
  },
  keyboardAvoidingView: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#003247',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#5891b1',
    textAlign: 'center',
    lineHeight: 24,
  },
  planCard: { 
    backgroundColor: '#fff',
    borderRadius: 16, 
    marginBottom: 24,
    borderWidth: 2,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeaderContainer: {
    marginBottom: 16,
  },
  planTitle: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#003247',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0b4660',
  },
  periodLabel: {
    fontSize: 16,
    color: '#5891b1',
    marginLeft: 2,
  },
  planDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0b4660',
  },
  couponContainer: {
    marginBottom: 30,
  },
  couponLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003247',
    marginBottom: 10,
  },
  couponInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    letterSpacing: 2,
    textAlign: 'center',
  },
  helpText: {
    marginTop: 10,
  },
  helpTextContent: {
    fontSize: 14,
    color: '#5891b1',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  cancelButtonText: {
    color: '#5891b1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2c6e8d',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    opacity: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: '#2c6e8d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 250,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default CouponScreen;