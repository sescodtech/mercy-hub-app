import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import { Colors } from "../../lib/colors";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({ label, error, rightIcon, isPassword, ...props }: Props) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error ? styles.errorBorder : styles.normalBorder]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textLight}
          secureTextEntry={isPassword && !show}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShow((v) => !v)} style={styles.eye}>
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>{show ? "HIDE" : "SHOW"}</Text>
          </TouchableOpacity>
        )}
        {rightIcon && <View style={styles.eye}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:     { marginBottom: 14 },
  label:       { fontSize: 13, fontWeight: "600", color: Colors.text, marginBottom: 6 },
  inputRow:    { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5 },
  normalBorder:{ borderColor: Colors.border },
  errorBorder: { borderColor: Colors.error },
  input:       { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.text },
  eye:         { paddingHorizontal: 12 },
  error:       { fontSize: 12, color: Colors.error, marginTop: 4 },
});
