import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const router  = useRouter();
  const signIn  = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim())        e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password)            e.password = "Password is required";
    else if (password.length < 6) e.password = "Password too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Login failed";
      Alert.alert("Login Failed", msg);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      {/* Logo */}
      <View style={styles.logoWrap}>
        <Text style={styles.logoEmoji}>🏡</Text>
        <Text style={styles.logoName}>MercyHome</Text>
        <Text style={styles.logoSub}>Sign in to your account</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          placeholder="Your password"
          isPassword
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button label="Sign In" onPress={handleLogin} loading={loading} size="lg" />
      </View>

      {/* Register link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.footerLink}>Create one</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flexGrow: 1, backgroundColor: Colors.bg, padding: 24, justifyContent: "center" },
  logoWrap:    { alignItems: "center", marginBottom: 36 },
  logoEmoji:   { fontSize: 56, marginBottom: 8 },
  logoName:    { fontSize: 28, fontWeight: "800", color: Colors.text, letterSpacing: -0.5 },
  logoSub:     { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  form:        { backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  forgotWrap:  { alignSelf: "flex-end", marginBottom: 16, marginTop: -4 },
  forgotText:  { fontSize: 13, color: Colors.brand, fontWeight: "600" },
  footer:      { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText:  { fontSize: 14, color: Colors.textMuted },
  footerLink:  { fontSize: 14, color: Colors.brand, fontWeight: "700" },
});
