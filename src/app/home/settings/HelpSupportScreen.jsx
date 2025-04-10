import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

const HelpSupportScreen = () => {
  const [expandedSection, setExpandedSection] = useState('getting-started');
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const renderAccordion = (title, content, sectionId) => {
    const isExpanded = expandedSection === sectionId;
    
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity 
          style={styles.accordionHeader} 
          onPress={() => toggleSection(sectionId)}
        >
          <Text style={styles.accordionTitle}>{title}</Text>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="#4A6FFF" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.accordionContent}>
            {content}
          </View>
        )}
      </View>
    );
  };
  
  const openEmail = () => {
    Linking.openURL('mailto:speakeaseeng@gmail.com');
  };
  
  const openPhone = () => {
    Linking.openURL('+94 76 220 6823');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you speak with ease</Text>
      </View>
      
      {/* Getting Started Section */}
      {renderAccordion('Getting Started', (
        <View>
          <Text style={styles.paragraph}>
            Welcome to SpeakEase, where communication becomes effortless. Our intuitive platform is designed to enhance your verbal expression with minimal learning curve.
          </Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="person-add-outline" size={20} color="#4A6FFF" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Account Setup:</Text> Complete your profile in minutes with our streamlined onboarding process
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="mic-outline" size={20} color="#4A6FFF" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Voice Calibration:</Text> Allow SpeakEase to learn your unique speech patterns for optimal performance
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="headset-outline" size={20} color="#4A6FFF" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Connect Devices:</Text> Seamlessly integrate with your preferred headsets and speakers
            </Text>
          </View>
        </View>
      ), 'getting-started')}
      
      {/* FAQ Section */}
      {renderAccordion('Frequently Asked Questions', (
        <View>
          <Text style={styles.subheading}>General Questions</Text>
          
          <Text style={styles.question}>
            How does SpeakEase differ from other communication apps?
          </Text>
          <Text style={styles.answer}>
            SpeakEase combines advanced voice recognition with intelligent language processing to not only capture what you say but enhance how you say it. Our proprietary algorithms adapt to your speech patterns for truly personalised communication.
          </Text>
          
          <Text style={styles.question}>
            Is my data secure with SpeakEase?
          </Text>
          <Text style={styles.answer}>
            Absolutely. We employ end-to-end encryption and never store sensitive voice data on our servers. Your privacy remains paramount to our service philosophy.
          </Text>
          
          <Text style={styles.question}>
            What devices are compatible with SpeakEase?
          </Text>
          <Text style={styles.answer}>
            SpeakEase is accessible with iOS and Android smartphones. Updated operating systems on smartphones are recommended for best performance.
          </Text>
          
          <Text style={styles.subheading}>Troubleshooting</Text>
          
          <Text style={styles.miniHeader}>Voice Recognition Issues</Text>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Ensure you're in a quiet environment</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Check your microphone settings and permissions</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Try recalibrating your voice profile in Settings</Text>
          </View>
          
          <Text style={styles.miniHeader}>Connection Problems</Text>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Verify your internet connection is stable</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Make sure your app is updated to the latest version</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Ionicons name="ellipse" size={8} color="#4A6FFF" />
            <Text style={styles.bulletText}>Restart the application if experiencing persistent issues</Text>
          </View>
        </View>
      ), 'faq')}
      
      {/* Contact Us Section */}
      {renderAccordion('Contact Us', (
        <View>
          <Text style={styles.paragraph}>
            Our dedicated support team is available to assist you:
          </Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <Ionicons name="mail-outline" size={24} color="#4A6FFF" />
            <Text style={styles.contactText}>speakeaseeng@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
            <Ionicons name="call-outline" size={24} color="#4A6FFF" />
            <Text style={styles.contactText}>+94 76 220 6823</Text>
          </TouchableOpacity>
        </View>
      ), 'contact')}
      
      <Text style={styles.tagline}>
        Elevate your communication experience with SpeakEase — where every word matters.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    padding: 24,
    backgroundColor: '#4A6FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 25
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  accordionContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FD',
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 4,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  bold: {
    fontWeight: '600',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 16,
  },
  miniHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
    paddingHorizontal: 32,
  },
});

export default HelpSupportScreen;