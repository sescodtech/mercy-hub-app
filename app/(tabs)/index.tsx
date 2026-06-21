"use client";
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Colors } from "../../lib/colors";
import { useAuthStore } from "../../store/authStore";
import type { Product } from "../../types";

const { width } = Dimensions.get("window");
const CARD_W = (width - 48) / 3;

const SERVICES = [
  { label: "Data",    emoji: "📶", color: "#d98c2a", bg: "rgba(217,140,42,0.12)" },
  { label: "Airtime", emoji: "📞", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { label: "Cable",   emoji: "📺", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { label: "Exam",    emoji: "🎓", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { label: "Deals",   emoji: "🔥", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const CATS = [
  { name: "Bedding",  emoji: "🛏️", slug: "bedding" },
  { name: "Kitchen",  emoji: "🍳", slug: "kitchenware" },
  { name: "Decor",    emoji: "🖼️", slug: "home-decor" },
  { name: "Bath",     emoji: "🛁", slug: "bath-body" },
  { name: "Lighting", emoji: "💡", slug: "lighting" },
];

function MiniProductCard({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.productCard, { width: CARD_W }]}
      onPress={() => router.push("/shop")}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: product.images?.[0] || "https://placehold.co/200x200/fdf8f0/d98c2a?text=MH" }}
        style={styles.productImg}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>₦{(product.price || 0).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);

  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await api.get("/api/products?featured=true&limit=9");
      if (!data.success) return [];
      return Array.isArray(data.data) ? data.data : [];
    },
    retry: 1,
    staleTime: 60000,
  });

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Welcome 👋"}
          </Text>
          <Text style={styles.sub}>What are you shopping for?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Image
            source={{ uri: user?.avatar || "https://ui-avatars.com/api/?name=M&background=d98c2a&color=fff&size=80" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroEye}>NEW ARRIVALS 🎉</Text>
          <Text style={styles.heroTitle}>Premium Home{"\n"}Essentials</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/shop")}>
            <Text style={styles.heroBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 70 }}>🏡</Text>
      </View>

      {/* Digital Services */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Digital Services</Text>
          <TouchableOpacity onPress={() => router.push("/digital")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SERVICES.map((s) => (
            <TouchableOpacity key={s.label} style={styles.serviceItem} onPress={() => router.push("/digital")}>
              <View style={[styles.serviceIcon, { backgroundColor: s.bg }]}>
                <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATS.map((c) => (
            <TouchableOpacity key={c.slug} style={styles.catItem} onPress={() => router.push("/shop")}>
              <View style={styles.catCircle}>
                <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
              </View>
              <Text style={styles.catLabel}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator color={Colors.brand} style={{ marginTop: 20 }} />}

        {isError && (
          <Text style={styles.errorText}>Could not load products. Check your connection.</Text>
        )}

        {!isLoading && !isError && (!products || products.length === 0) && (
          <Text style={styles.errorText}>No featured products yet.</Text>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <View style={styles.grid}>
            {products.map((p) => (
              <MiniProductCard key={p._id} product={p} />
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
  greeting:     { fontSize: 18, fontWeight: "700", color: Colors.text },
  sub:          { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  avatar:       { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.brand },
  hero:         { marginHorizontal: 16, borderRadius: 18, backgroundColor: "#fff8ec", padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  heroEye:      { fontSize: 10, fontWeight: "700", color: Colors.brand, letterSpacing: 0.5, marginBottom: 4 },
  heroTitle:    { fontSize: 20, fontWeight: "800", color: Colors.text, lineHeight: 26, marginBottom: 12 },
  heroBtn:      { alignSelf: "flex-start", backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  heroBtnText:  { color: "#fff", fontSize: 13, fontWeight: "700" },
  section:      { paddingHorizontal: 16, paddingTop: 18 },
  row:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  seeAll:       { fontSize: 12, color: Colors.brand, fontWeight: "600" },
  serviceItem:  { alignItems: "center", marginRight: 16 },
  serviceIcon:  { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  serviceLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: "500" },
  catItem:      { alignItems: "center", marginRight: 16 },
  catCircle:    { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fff", borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  catLabel:     { fontSize: 10, color: Colors.textMuted, fontWeight: "500" },
  grid:         { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  productCard:  { backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", marginBottom: 4 },
  productImg:   { width: "100%", aspectRatio: 4/5, backgroundColor: "#f5f0e8" },
  productInfo:  { padding: 6 },
  productName:  { fontSize: 10, fontWeight: "500", color: Colors.text, lineHeight: 13, marginBottom: 2 },
  productPrice: { fontSize: 11, fontWeight: "700", color: Colors.brand },
  errorText:    { fontSize: 13, color: Colors.textMuted, textAlign: "center", marginTop: 20, marginBottom: 10 },
});
