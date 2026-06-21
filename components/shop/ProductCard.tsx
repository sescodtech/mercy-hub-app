import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 3; // 3-col grid with padding

interface Props { product: Product; }

export function ProductCard({ product }: Props) {
  const router   = useRouter();
  const addItem  = useCartStore((s) => s.addItem);
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => router.push(`/product/${product.slug}`)}
      activeOpacity={0.85}
    >
      {/* Image */}
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: product.images?.[0] || "https://placehold.co/200x200/fdf8f0/d98c2a?text=MH" }}
          style={styles.img}
          resizeMode="cover"
        />
        {discount && (
          <View style={styles.discBadge}>
            <Text style={styles.discText}>-{discount}%</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
        {product.comparePrice && (
          <Text style={styles.compare}>₦{product.comparePrice.toLocaleString()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: Colors.card, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", marginBottom: 8 },
  imgWrap:   { aspectRatio: 4/5, backgroundColor: "#f5f0e8", position: "relative" },
  img:       { width: "100%", height: "100%" },
  discBadge: { position: "absolute", top: 5, left: 5, backgroundColor: Colors.error, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  discText:  { color: "#fff", fontSize: 9, fontWeight: "700" },
  info:      { padding: 7 },
  name:      { fontSize: 10, fontWeight: "500", color: Colors.text, lineHeight: 14, marginBottom: 3 },
  price:     { fontSize: 11, fontWeight: "700", color: Colors.brand },
  compare:   { fontSize: 9, color: Colors.textLight, textDecorationLine: "line-through" },
});
