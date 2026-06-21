import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import * as SecureStore from "expo-secure-store";

export default function RegisterScreen() {
  const router   = useRouter();
  const setUser  = useAuthStore((s) => s.setUser);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name     = "Name is required";
    if (!email.trim())   e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password)       e.password = "Password is required";
    else if (password.length < 8) e.password = "Min. 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (!data.success) throw new Error(data.error || "Registration failed");
      // Auto login after register
      const loginRes = await api.post("/api/auth/mobile/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      if (loginRes.data.success) {
        await SecureStore.setItemAsync("session_token", loginRes.data.token);
        await SecureStore.setItemAsync("user", JSON.stringify(loginRes.data.user));
        setUser(loginRes.data.user);
        router.replace("/(tabs)");
      } else {
        router.push("/(auth)/login");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error || err.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.logoWrap}>
        <Text style={styles.logoEmoji}>🏡</Text>
        <Text style={styles.logoName}>Create Account</Text>
        <Text style={styles.logoSub}>Join MercyHome today</Text>
      </View>

      <View style={styles.form}>
        <Input label="Full Name"       placeholder="John Doe"          value={name}     onChangeText={setName}     error={errors.name} />
        <Input label="Email Address"   placeholder="you@example.com"   value={email}    onChangeText={setEmail}    error={errors.email}    keyboardType="email-address" />
        <Input label="Password"        placeholder="Min. 8 characters" value={password} onChangeText={setPassword} error={errors.password} isPassword />
        <Button label="Create Account" onPress={handleRegister} loading={loading} size="lg" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.bg, padding: 24, justifyContent: "center" },
  logoWrap:  { alignItems: "center", marginBottom: 36 },
  logoEmoji: { fontSize: 56, marginBottom: 8 },
  logoName:  { fontSize: 28, fontWeight: "800", color: Colors.text, letterSpacing: -0.5 },
  logoSub:   { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  form:      { backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  footer:    { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText:{ fontSize: 14, color: Colors.textMuted },
  footerLink:{ fontSize: 14, color: Colors.brand, fontWeight: "700" },
});
