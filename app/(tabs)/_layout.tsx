import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../lib/colors";
import { useCartStore } from "../../store/cartStore";

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.emoji, focused && { transform: [{ scale: 1.1 }] }]}>{emoji}</Text>
      <Text style={[styles.tabLabel, { color: focused ? Colors.brand : Colors.textLight }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const count = useCartStore((s) => s.count());
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="shop"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Shop" focused={focused} /> }}
      />
      <Tabs.Screen
        name="digital"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" label="Digital" focused={focused} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon emoji="🛒" label="Cart" focused={focused} />
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Account" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar:       { backgroundColor: "#fff", borderTopColor: Colors.border, borderTopWidth: 1, height: 70, paddingBottom: 10 },
  tabItem:   { alignItems: "center", justifyContent: "center", gap: 2 },
  emoji:     { fontSize: 22 },
  tabLabel:  { fontSize: 10, fontWeight: "500" },
  badge:     { position: "absolute", top: -2, right: -6, backgroundColor: Colors.error, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
});
