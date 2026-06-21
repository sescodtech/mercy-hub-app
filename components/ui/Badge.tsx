import { View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  color?: string;
  bg?: string;
}

export function Badge({ label, color = "#fff", bg = "#d98c2a" }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  text:  { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
});
