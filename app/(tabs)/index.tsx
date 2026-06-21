import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Colors } from "../../lib/colors";
import { useAuthStore } from "../../store/authStore";
import type { Product } from "../../types";

const { width } = Dimensions.get("window");
const CARD_W = (width - 40) / 3 - 4;

const SERVICES = [
  { label: "Data",    emoji: "📶", color: "#d98c2a", bg: "#fff8ec" },
  { label: "Airtime", emoji: "📱", color: "#10b981", bg: "#f0fdf8" },
  { label: "Cable",   emoji: "📺", color: "#6366f1", bg: "#f5f3ff" },
  { label: "Exam",    emoji: "🎓", color: "#f59e0b", bg: "#fffbeb" },
  { label: "Deals",   emoji: "🔥", color: "#ef4444", bg: "#fff5f5" },
];

const CATS = [
  { name: "Bedding",  emoji: "🛏️" },
  { name: "Kitchen",  emoji: "🍳" },
  { name: "Decor",    emoji: "🖼️" },
  { name: "Bath",     emoji: "🛁" },
  { name: "Lights",   emoji: "💡" },
];

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const hasDiscount = !!product.comparePrice && product.comparePrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.comparePrice!) * 100) : 0;

  return (
    <TouchableOpacity style={[s.pCard, { width: CARD_W }]} onPress={() => router.push("/shop")} activeOpacity={0.9}>
      <View style={s.pImgWrap}>
        <Image
          source={{ uri: product.images?.[0] || "https://placehold.co/200x250/fdf8f0/d98c2a?text=MH" }}
          style={s.pImg}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={s.discTag}>
            <Text style={s.discText}>-{discount}%</Text>
          </View>
        )}
      </View>
      <View style={s.pBody}>
        <Text style={s.pName} numberOfLines={2}>{product.name}</Text>
        <Text style={s.pPrice}>₦{(product.price || 0).toLocaleString()}</Text>
        {hasDiscount && (
          <Text style={s.pOld}>₦{product.comparePrice!.toLocaleString()}</Text>
        )}
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
      if (!data?.success) return [];
      return Array.isArray(data.data) ? data.data : [];
    },
    retry: 1,
    staleTime: 60000,
  });

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.hello}>{user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Welcome 👋"}</Text>
          <Text style={s.hellSub}>What can we help you with?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Image
            source={{ uri: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "M")}&background=d98c2a&color=fff&bold=true&size=80` }}
            style={s.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <TouchableOpacity style={s.hero} onPress={() => router.push("/shop")} activeOpacity={0.95}>
        <View style={s.heroLeft}>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeText}>NEW ARRIVALS</Text>
          </View>
          <Text style={s.heroTitle}>Premium{"\n"}Home Essentials</Text>
          <View style={s.heroBtn}>
            <Text style={s.heroBtnText}>Shop Now  →</Text>
          </View>
        </View>
        <View style={s.heroRight}>
          <Text style={{ fontSize: 72 }}>🏡</Text>
        </View>
      </TouchableOpacity>

      {/* Digital Services */}
      <View style={s.section}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Digital Services</Text>
          <TouchableOpacity onPress={() => router.push("/digital")}>
            <Text style={s.secLink}>See all →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
          {SERVICES.map((sv) => (
            <TouchableOpacity key={sv.label} style={s.svcItem} onPress={() => router.push("/digital")} activeOpacity={0.85}>
              <View style={[s.svcIcon, { backgroundColor: sv.bg, borderColor: sv.color + "30" }]}>
                <Text style={{ fontSize: 24 }}>{sv.emoji}</Text>
              </View>
              <Text style={[s.svcLabel, { color: sv.color }]}>{sv.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={s.section}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={s.secLink}>See all →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
          {CATS.map((c) => (
            <TouchableOpacity key={c.name} style={s.catItem} onPress={() => router.push("/shop")} activeOpacity={0.85}>
              <View style={s.catCircle}>
                <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
              </View>
              <Text style={s.catLabel}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={s.section}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push("/shop")}>
            <Text style={s.secLink}>See all →</Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator color={Colors.brand} size="large" style={{ marginTop: 32 }} />}

        {isError && (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>Could not load products.</Text>
            <Text style={s.emptySubText}>Check your connection and try again.</Text>
          </View>
        )}

        {!isLoading && !isError && products && products.length === 0 && (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>No featured products yet.</Text>
          </View>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <View style={s.grid}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },
  hello:        { fontSize: 20, fontWeight: "800", color: Colors.text, letterSpacing: -0.3 },
  hellSub:      { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  avatar:       { width: 42, height: 42, borderRadius: 21, borderWidth: 2.5, borderColor: Colors.brand },
  hero:         { marginHorizontal: 16, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#f0e8dc", padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4, shadowColor: Colors.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  heroLeft:     { flex: 1 },
  heroBadge:    { alignSelf: "flex-start", backgroundColor: "rgba(217,140,42,0.12)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  heroBadgeText:{ fontSize: 9, fontWeight: "800", color: Colors.brand, letterSpacing: 1 },
  heroTitle:    { fontSize: 20, fontWeight: "800", color: Colors.text, lineHeight: 26, marginBottom: 14 },
  heroBtn:      { alignSelf: "flex-start", backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  heroBtnText:  { color: "#fff", fontSize: 13, fontWeight: "700" },
  heroRight:    { paddingLeft: 8 },
  section:      { paddingHorizontal: 16, paddingTop: 20 },
  secHead:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  secTitle:     { fontSize: 15, fontWeight: "700", color: Colors.text },
  secLink:      { fontSize: 12, color: Colors.brand, fontWeight: "600" },
  svcItem:      { alignItems: "center", gap: 6 },
  svcIcon:      { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  svcLabel:     { fontSize: 10, fontWeight: "700", letterSpacing: 0.2 },
  catItem:      { alignItems: "center", gap: 5 },
  catCircle:    { width: 58, height: 58, borderRadius: 29, backgroundColor: "#fff", borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  catLabel:     { fontSize: 10, color: Colors.textMuted, fontWeight: "600" },
  grid:         { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pCard:        { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  pImgWrap:     { position: "relative" },
  pImg:         { width: "100%", aspectRatio: 3/4, backgroundColor: "#f8f3ec" },
  discTag:      { position: "absolute", top: 6, left: 6, backgroundColor: Colors.error, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  discText:     { color: "#fff", fontSize: 8, fontWeight: "800" },
  pBody:        { padding: 7 },
  pName:        { fontSize: 10, fontWeight: "600", color: Colors.text, lineHeight: 14, marginBottom: 3 },
  pPrice:       { fontSize: 12, fontWeight: "800", color: Colors.brand },
  pOld:         { fontSize: 9, color: Colors.textLight, textDecorationLine: "line-through", marginTop: 1 },
  emptyBox:     { alignItems: "center", paddingVertical: 32 },
  emptyText:    { fontSize: 14, fontWeight: "600", color: Colors.textMuted },
  emptySubText: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
});
