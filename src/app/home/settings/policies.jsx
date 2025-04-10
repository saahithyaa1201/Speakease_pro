import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PoliciesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4A6FFF", "#6A8FFF"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Legal & Policies</Text>
        <Text style={styles.headerSubtitle}>Important information about using SpeakEase</Text>
      </LinearGradient>

      <View style={styles.cardContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleAccent}></View>
            <Text style={styles.title}>Terms of Use</Text>
          </View>
          <Text style={styles.paragraph}>
            Welcome to SpeakEase! By using our application, you agree to these Terms of Use. SpeakEase is designed to help users improve their speaking skills through various exercises and activities.
          </Text>
          <Text style={styles.paragraph}>
            SpeakEase grants you a limited, non-exclusive, non-transferable license to use the application for personal, non-commercial purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleAccent}></View>
            <Text style={styles.title}>Privacy Policy</Text>
          </View>
          <Text style={styles.paragraph}>
            At SpeakEase, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our app.
          </Text>
          <Text style={styles.subtitle}>Information We Collect:</Text>
          <Text style={styles.paragraph}>
            • Personal information (name, email address) when you create an account
            • Voice recordings for speech analysis features
            • Usage data to improve our services
            • Device information for compatibility purposes
          </Text>
          <Text style={styles.subtitle}>How We Use Your Information:</Text>
          <Text style={styles.paragraph}>
            • To personalize your experience and improve our services
            • To provide speech analysis and progress tracking
            • To communicate with you about updates and support
            • To ensure security and prevent fraudulent activities
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleAccent}></View>
            <Text style={styles.title}>Content Guidelines</Text>
          </View>
          <Text style={styles.paragraph}>
            When using SpeakEase, please follow these guidelines:
          </Text>
          <Text style={styles.paragraph}>
            • Do not upload inappropriate or offensive content
            • Respect other users' privacy and intellectual property
            • Use the app for its intended purpose of improving speaking skills
            • Do not attempt to misuse or exploit the app's features
          </Text>
          <Text style={styles.subtitle}>Consequences of Violations:</Text>
          <Text style={styles.paragraph}>
            • Violation of these guidelines may result in content removal or account suspension
            • Repeated violations could lead to permanent banning from SpeakEase
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleAccent}></View>
            <Text style={styles.title}>Subscription Terms</Text>
          </View>
          <Text style={styles.paragraph}>
            Some features of SpeakEase require a subscription. By subscribing:
          </Text>
          <Text style={styles.paragraph}>
            • You agree to pay the fees associated with your chosen plan
            • Subscriptions automatically renew unless canceled 24 hours before the renewal date
            • Refunds are processed according to the platform's refund policy (App Store/Google Play)
            • You can manage your subscription through your account settings
          </Text>
          <Text style={styles.subtitle}>Cancellation & Refund Policy:</Text>
          <Text style={styles.paragraph}>
            • You can cancel your subscription at any time through your account settings
            • Refunds are only available under certain conditions as per App Store/Google Play policies
            • Partial refunds are not provided for unused portions of the subscription period
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 SpeakEase. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },
  header: {
    padding: 30,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  cardContainer: {
    marginTop: -20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  titleAccent: {
    width: 4,
    height: 20,
    backgroundColor: "#4A6FFF",
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A6FFF",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  }
});

export default PoliciesScreen;