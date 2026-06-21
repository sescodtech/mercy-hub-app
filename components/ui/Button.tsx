import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../lib/colors";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export function Button({ label, onPress, loading, disabled, variant = "primary", size = "md", style }: Props) {
  const isDisabled = disabled || loading;

  const sizeStyle = {
    sm: { paddingVertical: 8,  paddingHorizontal: 16, borderRadius: 10 },
    md: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
    lg: { paddingVertical: 15, paddingHorizontal: 24, borderRadius: 14 },
  }[size];

  const textSize = { sm: 13, md: 14, lg: 15 }[size];

  const variantStyle = {
    primary: { backgroundColor: isDisabled ? "#e5c898" : Colors.brand, borderWidth: 0 },
    outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: Colors.brand },
    ghost:   { backgroundColor: "transparent", borderWidth: 0 },
  }[variant];

  const textColor = {
    primary: "#fff",
    outline: Colors.brand,
    ghost:   Colors.brand,
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.base, sizeStyle, variantStyle, style]}
    >
      {loading
        ? <ActivityIndicator color={textColor} size="small" />
        : <Text style={[styles.text, { color: textColor, fontSize: textSize }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", flexDirection: "row" },
  text: { fontWeight: "600", letterSpacing: 0.2 },
});
