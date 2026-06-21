import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../lib/colors";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";

export default function CartScreen() {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const { items, removeItem, updateQty, total, clear } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add items from the shop to get started.</Text>
        <Button label="Browse Shop" onPress={() => router.push("/shop")} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart ({items.length})</Text>
        <TouchableOpacity onPress={() => Alert.alert("Clear Cart", "Remove all items?", [
          { text: "Cancel" },
          { text: "Clear", style: "destructive", onPress: clear },
        ])}>
          <Text style={styles.clearBtn}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.product._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: item.product.images?.[0] || "https://placehold.co/80x80" }}
              style={styles.img}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>₦{item.product.price.toLocaleString()}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.product._id, item.quantity - 1)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.product._id, item.quantity + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.product._id)} style={styles.removeBtn}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₦{total().toLocaleString()}</Text>
            </View>
            <Button
              label={user ? "Proceed to Checkout" : "Sign In to Checkout"}
              onPress={() => user ? router.push("/checkout") : router.push("/(auth)/login")}
              size="lg"
              style={{ marginTop: 14 }}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.bg },
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title:       { fontSize: 22, fontWeight: "800", color: Colors.text },
  clearBtn:    { fontSize: 13, color: Colors.error, fontWeight: "600" },
  list:        { paddingHorizontal: 16, paddingBottom: 24 },
  cartItem:    { flexDirection: "row", backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10, alignItems: "center" },
  img:         { width: 70, height: 70, borderRadius: 10, backgroundColor: Colors.bg },
  itemInfo:    { flex: 1, marginLeft: 12 },
  itemName:    { fontSize: 13, fontWeight: "500", color: Colors.text, marginBottom: 4 },
  itemPrice:   { fontSize: 14, fontWeight: "700", color: Colors.brand, marginBottom: 8 },
  qtyRow:      { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn:      { width: 28, height: 28, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  qtyBtnText:  { fontSize: 16, color: Colors.text, lineHeight: 20 },
  qty:         { fontSize: 14, fontWeight: "700", color: Colors.text, minWidth: 20, textAlign: "center" },
  removeBtn:   { padding: 6 },
  removeText:  { fontSize: 14, color: Colors.textLight },
  footer:      { marginTop: 12, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  totalRow:    { flexDirection: "row", justifyContent: "space-between" },
  totalLabel:  { fontSize: 15, color: Colors.textMuted, fontWeight: "500" },
  totalValue:  { fontSize: 18, fontWeight: "800", color: Colors.text },
  empty:       { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg, padding: 32 },
  emptyEmoji:  { fontSize: 64, marginBottom: 16 },
  emptyTitle:  { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  emptySub:    { fontSize: 14, color: Colors.textMuted, textAlign: "center" },
});
