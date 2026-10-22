import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { requestOtp, verifyOtp } from "../services/api";

export default function LoginScreen({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestOtp() {
    const cleanPhone = phone.trim();

    if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) {
      setError("Enter a valid phone number with country code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await requestOtp(cleanPhone);
      setOtpRequested(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await verifyOtp(phone.trim(), otp.trim());
      onLogin(data.token);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>MiniLedger</Text>
        <Text style={styles.subtitle}>
          Keep track of money you lend to friends.
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            {otpRequested ? "Verify your number" : "Welcome back"}
          </Text>

          <Text style={styles.description}>
            {otpRequested
              ? "Enter the OTP from your server terminal."
              : "Enter your phone number to get started."}
          </Text>

          <Text style={styles.label}>Phone number</Text>

          <TextInput
            style={styles.input}
            placeholder="+919876543210"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!otpRequested && !loading}
            autoCapitalize="none"
          />

          {otpRequested && (
            <>
              <Text style={styles.label}>One-time password (OTP)</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                editable={!loading}
              />
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={otpRequested ? handleVerifyOtp : handleRequestOtp}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Please wait..."
                : otpRequested
                  ? "Verify OTP"
                  : "Get OTP"}
            </Text>
          </TouchableOpacity>

          {otpRequested && (
            <TouchableOpacity
              style={styles.backButton}
              disabled={loading}
              onPress={() => {
                setOtpRequested(false);
                setOtp("");
                setError("");
              }}
            >
              <Text style={styles.backButtonText}>
                Change phone number
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.footer}>Simple. Secure. Organized.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 24,
  paddingTop: 12,
  paddingBottom: 12,
  width: "100%",
  maxWidth: 520,
  alignSelf: "center",
},
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 12,
  },
  backButton: {
    alignItems: "center",
    paddingTop: 18,
  },
  backButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 28,
  },
});
