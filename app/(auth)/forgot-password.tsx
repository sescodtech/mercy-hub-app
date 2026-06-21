import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function handleSubmit() {
    if (!email.trim()) { Alert.alert("Enter your email address"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/forgot-password", { email: email.trim().toLowerCase() });
      if (data.success) setSent(true);
      else Alert.alert("Error", data.error || "Something went wrong");
    } catch {
      Alert.alert("Error", "Network error. Please try again.");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <View style={styles.successWrap}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>📧</Text>
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successSub}>
          We sent a password reset link to {"\n"}<Text style={{ color: Colors.brand, fontWeight: "600" }}>{email}</Text>
        </Text>
        <Button label="Back to Sign In" onPress={() => router.push("/(auth)/login")} style={{ marginTop: 28 }} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.logoWrap}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🔒</Text>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.sub}>Enter your email and we'll send a reset link.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Button label="Send Reset Link" onPress={handleSubmit} loading={loading} size="lg" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, backgroundColor: Colors.bg, padding: 24 },
  backBtn:      { marginTop: 16, marginBottom: 32 },
  backText:     { fontSize: 15, color: Colors.brand, fontWeight: "600" },
  logoWrap:     { alignItems: "center", marginBottom: 32 },
  title:        { fontSize: 24, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  sub:          { fontSize: 14, color: Colors.textMuted, textAlign: "center" },
  form:         { backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  successWrap:  { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg, padding: 32 },
  successTitle: { fontSize: 22, fontWeight: "800", color: Colors.text, marginBottom: 10 },
  successSub:   { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 22 },
});
