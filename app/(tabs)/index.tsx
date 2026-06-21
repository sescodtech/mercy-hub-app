import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Colors } from "../../lib/colors";
import { ProductCard } from "../../components/shop/ProductCard";
import { useAuthStore } from "../../store/authStore";
import type { Product } from "../../types";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { name: "Bedding",     slug: "bedding",      emoji: "🛏️" },
  { name: "Kitchen",     slug: "kitchenware",   emoji: "🍳" },
  { name: "Decor",       slug: "home-decor",    emoji: "🖼️" },
  { name: "Bath",        slug: "bath-body",     emoji: "🛁" },
  { name: "Lighting",    slug: "lighting",      emoji: "💡" },
];

const SERVICES = [
  { label: "Data",    emoji: "📶", href: "/digital",  color: "#d98c2a", bg: "rgba(217,140,42,0.12)" },
  { label: "Airtime", emoji: "📞", href: "/digital",  color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { label: "Cable",   emoji: "📺", href: "/digital",  color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { label: "Exam",    emoji: "🎓", href: "/digital",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { label: "Deals",   emoji: "🔥", href: "/digital",  color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

export default function HomeScreen() {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await api.get("/api/products?featured=true&limit=12");
      return data.success ? data.data : [];
    },
  });

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user ? `Hello, ${user.name.split(" ")[0]} 👋` : "Welcome back 👋"}
          </Text>
          <Text style={styles.subGreeting}>What are you shopping for today?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Image
            source={{ uri: user?.avatar || "https://ui-avatars.com/api/?name=M&background=d98c2a&color=fff" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* ── Hero banner ── */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>New Arrivals 🎉</Text>
          <Text style={styles.heroTitle}>Premium Home{"\n"}Essentials</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/shop")}>
            <Text style={styles.heroBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 80 }}>🏡</Text>
      </View>

      {/* ── Digital Services ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Digital Services</Text>
          <TouchableOpacity onPress={() => router.push("/digital")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceRow}>
          {SERVICES.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={styles.serviceItem}
              onPress={() => router.push("/digital")}
            >
              <View style={[styles.serviceIcon, { backgroundColor: s.bg }]}>
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Shop by Category ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.slug}
              style={styles.catItem}
              onPress={() => router.push(`/shop?category=${c.slug}`)}
            >
              <View style={styles.catCircle}>
                <Text style={{ fontSize: 26 }}>{c.emoji}</Text>
              </View>
              <Text style={styles.catLabel}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Featured Products ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color={Colors.brand} style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.productGrid}>
            {(products || []).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  greeting:     { fontSize: 18, fontWeight: "700", color: Colors.text },
  subGreeting:  { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  avatar:       { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.brand },
  hero:         { marginHorizontal: 16, borderRadius: 20, backgroundColor: "#fff8ec", padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  heroContent:  { flex: 1 },
  heroEyebrow:  { fontSize: 11, fontWeight: "600", color: Colors.brand, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  heroTitle:    { fontSize: 22, fontWeight: "800", color: Colors.text, lineHeight: 28, marginBottom: 14 },
  heroBtn:      { alignSelf: "flex-start", backgroundColor: Colors.brand, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10 },
  heroBtnText:  { color: "#fff", fontSize: 13, fontWeight: "700" },
  section:      { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  seeAll:       { fontSize: 12, color: Colors.brand, fontWeight: "600" },
  serviceRow:   { flexDirection: "row" },
  serviceItem:  { alignItems: "center", marginRight: 18 },
  serviceIcon:  { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  serviceLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: "500" },
  catItem:      { alignItems: "center", marginRight: 18 },
  catCircle:    { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  catLabel:     { fontSize: 10, color: Colors.textMuted, fontWeight: "500" },
  productGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
