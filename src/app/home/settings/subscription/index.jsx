import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
/* SubscriptionScreen component - displays available subscriptionj plans and allows users upgrade
  - manages the current subscription state and navigates to the coupon screen
  when a user selects a new plan */
const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // initialize with free plan as the default subscription
  const [currentSubscription, setCurrentSubscription] = useState({id: 1, code: 'Free'});
  
  /*effect hook to update the current subscription when returning from coupon screen
  
  */
  useEffect(() => {
    if (route.params?.updatedSubscription) {
      setCurrentSubscription(route.params.updatedSubscription);
    }
  }, [route.params]);

  // subscription plan data array
  
  const subscriptionPlans = [
    {
      id: 1,
      code: 'Free',
      price: '$0',
      periodLabel: '',
      color: '#d3f1ff',
      borderColor: '#93bdd8',
      description: 'Basic features for casual users',
      features: [
        'Basic conversation practice',
        'Limited vocabulary',
        'Daily usage limit',
      ],
      notIncluded: [
        'Badge tracking',
        'Progress graphs',
        'Daily goals',
        'Notification reminders'
      ]
    },
    {
      id: 2,
      code: 'Student',
      price: 'LKR 375',
      periodLabel: '/month',
      color: '#b1d9f0',
      borderColor: '#5891b1',
      description: 'Unlock badges to track your achievements and view detailed progress graphs.',
      features: [
        'Unlimited conversations',
        'Full vocabulary access',
        'No usage limits',
        'Badge tracking',
        'Progress graphs',
      ],
      notIncluded: [
        'Daily goals',
        'Notification reminders'
      ]
    },
    {
      id: 3,
      code: 'Language Master',
      price: 'LKR 700',
      periodLabel: '/month',
      color: '#70a3c1',
      borderColor: '#3b7d9f',
      description: 'Complete language learning experience with all features unlocked.',
      features: [
        'Unlimited conversations',
        'Full vocabulary access',
        'No usage limits',
        'Badge tracking',
        'Progress graphs',
        'Daily goals',
        'Notification reminders'
      ],
      notIncluded: []
    }
  ];

  //navigates to the coupon screen with selected plan and current plan data
  const handleSubscriptionUpgrade = (plan) => {
    navigation.navigate('coupon', {
      selectedPlan: plan,
      currentPlan: currentSubscription
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/*header section*/}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Choose Your Plan</Text>
          <Text style={styles.subHeader}>
            Unlock premium features to accelerate your language learning journey
          </Text>
        </View>
        
        {/* subscription plans section */}
        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => {

            //checks if this is the currently active subscription plan
            const isCurrentPlan = currentSubscription.id === plan.id;
            
            return (
              <View 
                key={plan.id}
                style={[
                  styles.planCard,
                  { borderColor: isCurrentPlan ? plan.borderColor : 'transparent' },
                  isCurrentPlan && styles.selectedPlanCard
                ]}
              >
                {/* Plan Header - Title and price*/}
                <View style={styles.planHeaderContainer}>
                  <Text style={styles.planTitle}>{plan.code}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.periodLabel}>{plan.periodLabel}</Text>
                  </View>
                </View>
                
                {/* Plan Description */}
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                {/* Current Plan Tag or Upgrade Button */}
                {isCurrentPlan ? (
                  //current plan badge
                  <View style={styles.currentPlanTag}>
                    <Text style={styles.currentPlanText}>Current</Text>
                  </View>
                ) : (
                  //upgrade/ select button for other plans
                  <TouchableOpacity
                    style={[styles.subscribeButton, { backgroundColor: '#2c6e8d' }]}
                    onPress={() => handleSubscriptionUpgrade(plan)}
                  >
                    <Text style={styles.subscribeButtonText}>
                      {plan.id === 1 ? 'Select' : 'Upgrade'}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {/* Features List */}
                <View style={styles.featuresSection}>
                  <Text style={styles.featuresSectionTitle}>
                    {plan.features.length > 0 ? 'What is included:' : ''}
                  </Text>
                  {plan.features.map((feature, index) => (
                    <Text key={index} style={styles.featureText}>• {feature}</Text>
                  ))}
                  
                  {/* Not Included Features */}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <Text style={[styles.featuresSectionTitle, styles.notIncludedTitle]}>
                        Not included:
                      </Text>
                      {plan.notIncluded.map((feature, index) => (
                        <Text key={index} style={styles.disabledFeatureText}>• {feature}</Text>
                      ))}
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        
        <Text style={styles.footerNote}>
          All subscriptions automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period.
          Can cancel anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  //container styles
  container: { 
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },

  //header styles
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

  //plan card container and card styles
  plansContainer: {
    marginBottom: 30,
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
  selectedPlanCard: {
    borderWidth: 2,
    transform: [{scale: 1.02}],
  },

  //plan header and title styles
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

  //plan description and action button styles
  planDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#0b4660',
  },
  subscribeButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  currentPlanTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2c6e8d',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  currentPlanText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  //features section sty;es
  featuresSection: {
    marginTop: 8,
  },
  featuresSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003247',
    marginBottom: 16,
  },
  notIncludedTitle: {
    marginTop: 20,
    color: '#5891b1',
  },
  featureText: {
    fontSize: 16,
    color: '#003247',
    marginBottom: 12,
    paddingLeft: 6,
  },
  disabledFeatureText: {
    fontSize: 16,
    color: '#5891b1',
    marginBottom: 12,
    paddingLeft: 6,
  },
  footerNote: {
    fontSize: 12,
    color: '#5891b1',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
});

export default SubscriptionScreen;