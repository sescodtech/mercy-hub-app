import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

interface State { hasError: boolean; error: string; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state = { hasError: false, error: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message + "\n\n" + error.stack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={s.container}>
          <Text style={s.title}>App Error</Text>
          <Text style={s.sub}>Copy this and send to developer:</Text>
          <ScrollView style={s.box}>
            <Text style={s.error} selectable>{this.state.error}</Text>
          </ScrollView>
          <TouchableOpacity style={s.btn} onPress={() => this.setState({ hasError: false, error: "" })}>
            <Text style={s.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  title:     { fontSize: 20, fontWeight: "800", color: "#ef4444", marginBottom: 8 },
  sub:       { fontSize: 13, color: "#666", marginBottom: 12 },
  box:       { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 12, maxHeight: 400 },
  error:     { fontSize: 11, color: "#333", fontFamily: "monospace" },
  btn:       { marginTop: 20, backgroundColor: "#d98c2a", borderRadius: 12, padding: 14, alignItems: "center" },
  btnText:   { color: "#fff", fontWeight: "700", fontSize: 15 },
});
