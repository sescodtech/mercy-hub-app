import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { useAuthStore } from "../../store/authStore";

const MENU = [
  { label: "My Orders",    emoji: "📦", href: "/orders" },
  { label: "Wishlist",     emoji: "❤️",  href: "/wishlist" },
  { label: "Wallet",       emoji: "💰", href: "/wallet" },
  { label: "Edit Profile", emoji: "✏️",  href: "/profile" },
  { label: "Security",     emoji: "🔒", href: "/security" },
  { label: "Support",      emoji: "💬", href: "/support" },
];

export default function AccountScreen() {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  if (!user) {
    return (
      <View style={styles.guestWrap}>
        <Text style={styles.guestEmoji}>👤</Text>
        <Text style={styles.guestTitle}>Sign in to your account</Text>
        <Text style={styles.guestSub}>Access orders, wishlist, wallet and more.</Text>
        <TouchableOpacity style={styles.signInBtn} onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")} style={{ marginTop: 12 }}>
          <Text style={styles.registerText}>Don't have an account? <Text style={{ color: Colors.brand }}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>

      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d98c2a&color=fff&size=128` }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>
      </View>

      {/* Wallet card */}
      <TouchableOpacity style={styles.walletCard} onPress={() => router.push("/wallet")} activeOpacity={0.85}>
        <View>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletBalance}>₦{(user.walletBalance || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.topupBtn}>
          <Text style={styles.topupText}>Top Up →</Text>
        </View>
      </TouchableOpacity>

      {/* Menu items */}
      <View style={styles.menuList}>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => router.push(item.href as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={() => Alert.alert("Sign Out", "Are you sure?", [
          { text: "Cancel" },
          { text: "Sign Out", style: "destructive", onPress: signOut },
        ])}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: Colors.bg },
  profileHeader:  { flexDirection: "row", alignItems: "center", gap: 14, padding: 20, paddingTop: 56, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar:         { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.brand },
  profileInfo:    { flex: 1 },
  name:           { fontSize: 17, fontWeight: "700", color: Colors.text },
  email:          { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  verifiedBadge:  { marginTop: 5, alignSelf: "flex-start", backgroundColor: "rgba(16,185,129,0.12)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  verifiedText:   { fontSize: 10, color: "#10b981", fontWeight: "600" },
  walletCard:     { margin: 16, backgroundColor: Colors.brand, borderRadius: 16, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  walletLabel:    { fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  walletBalance:  { fontSize: 24, fontWeight: "800", color: "#fff" },
  topupBtn:       { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  topupText:      { color: "#fff", fontWeight: "700", fontSize: 13 },
  menuList:       { marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  menuItem:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuEmoji:      { fontSize: 18, marginRight: 12 },
  menuLabel:      { flex: 1, fontSize: 14, fontWeight: "500", color: Colors.text },
  menuArrow:      { fontSize: 20, color: Colors.textLight },
  signOutBtn:     { margin: 16, marginTop: 12, padding: 14, backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#fecaca", alignItems: "center" },
  signOutText:    { color: Colors.error, fontWeight: "600", fontSize: 14 },
  guestWrap:      { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg, padding: 32 },
  guestEmoji:     { fontSize: 64, marginBottom: 16 },
  guestTitle:     { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  guestSub:       { fontSize: 14, color: Colors.textMuted, textAlign: "center", marginBottom: 24 },
  signInBtn:      { backgroundColor: Colors.brand, paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14 },
  signInText:     { color: "#fff", fontWeight: "700", fontSize: 15 },
  registerText:   { fontSize: 13, color: Colors.textMuted },
});
