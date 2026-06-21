import { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Colors } from "../../lib/colors";
import { ProductCard } from "../../components/shop/ProductCard";
import type { Product } from "../../types";

const CATS = ["All", "Bedding", "Kitchenware", "Home Decor", "Bath & Body", "Lighting"];

export default function ShopScreen() {
  const [cat,    setCat]    = useState("All");
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", cat, search],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "40" });
      if (cat !== "All")  params.set("category", cat.toLowerCase().replace(/ /g, "-"));
      if (search.trim()) params.set("search", search.trim());
      const { data } = await api.get(`/api/products?${params}`);
      return data.success ? data.data : [];
    },
    staleTime: 30000,
  });

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <TextInput
          style={styles.search}
          placeholder="Search products..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* Category pills */}
      <FlatList
        horizontal
        data={CATS}
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCat(item)}
            style={[styles.pill, cat === item && styles.pillActive]}
          >
            <Text style={[styles.pillText, cat === item && styles.pillTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Grid */}
      {isLoading ? (
        <ActivityIndicator color={Colors.brand} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={products || []}
          keyExtractor={(p) => p._id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found.</Text>
          }
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: Colors.bg },
  header:       { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title:        { fontSize: 22, fontWeight: "800", color: Colors.text, marginBottom: 10 },
  search:       { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: Colors.text },
  pillRow:      { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: Colors.border },
  pillActive:   { backgroundColor: Colors.brand, borderColor: Colors.brand },
  pillText:     { fontSize: 12, color: Colors.textMuted, fontWeight: "500" },
  pillTextActive:{ color: "#fff", fontWeight: "600" },
  grid:         { paddingHorizontal: 16, paddingBottom: 24 },
  row:          { gap: 8, marginBottom: 0 },
  empty:        { textAlign: "center", color: Colors.textMuted, marginTop: 48, fontSize: 14 },
});
