import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../lib/colors";
import type { Plan } from "../../types";

interface Props {
  plan: Plan;
  selected: boolean;
  onPress: () => void;
}

export function PlanCard({ plan, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, selected && styles.selected]}
    >
      <Text style={[styles.size, selected && { color: Colors.brand }]} numberOfLines={1}>
        {plan.name || plan.size}
      </Text>
      {plan.validity && <Text style={styles.validity}>{plan.validity}</Text>}
      <Text style={[styles.price, selected && { color: Colors.brand }]}>
        ₦{plan.price.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:     { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, padding: 8, alignItems: "center", backgroundColor: Colors.card },
  selected: { borderColor: Colors.brand, backgroundColor: "rgba(217,140,42,0.08)" },
  size:     { fontSize: 11, fontWeight: "700", color: Colors.text, textAlign: "center" },
  validity: { fontSize: 9,  color: Colors.textMuted, marginTop: 1, textAlign: "center" },
  price:    { fontSize: 11, fontWeight: "600", color: Colors.textMuted, marginTop: 3, textAlign: "center" },
});
