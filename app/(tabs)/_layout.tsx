import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../lib/colors";
import { useCartStore } from "../../store/cartStore";

type IconName = "home" | "shop" | "digital" | "cart" | "account";

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const icons: Record<IconName, { active: string; inactive: string }> = {
    home:    { active: "⬜", inactive: "⬜" },
    shop:    { active: "⬜", inactive: "⬜" },
    digital: { active: "⬜", inactive: "⬜" },
    cart:    { active: "⬜", inactive: "⬜" },
    account: { active: "⬜", inactive: "⬜" },
  };

  const labels: Record<IconName, string> = {
    home: "Home", shop: "Shop", digital: "Digital", cart: "Cart", account: "Account",
  };

  const svgs: Record<IconName, string> = {
    home:    "🏠",
    shop:    "🛍️",
    digital: "⚡",
    cart:    "🛒",
    account: "👤",
  };

  return (
    <View style={tabStyles.wrap}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{svgs[name]}</Text>
      <Text style={[tabStyles.label, { color: focused ? Colors.brand : Colors.textLight }]}>
        {labels[name]}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const count = useCartStore((s) => s.count());

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: tabStyles.bar, tabBarShowLabel: false }}>
      <Tabs.Screen name="index"   options={{ tabBarIcon: ({ focused }) => <TabIcon name="home"    focused={focused} /> }} />
      <Tabs.Screen name="shop"    options={{ tabBarIcon: ({ focused }) => <TabIcon name="shop"    focused={focused} /> }} />
      <Tabs.Screen name="digital" options={{ tabBarIcon: ({ focused }) => <TabIcon name="digital" focused={focused} /> }} />
      <Tabs.Screen name="cart"    options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <TabIcon name="cart" focused={focused} />
            {count > 0 && (
              <View style={tabStyles.badge}>
                <Text style={tabStyles.badgeText}>{count > 9 ? "9+" : count}</Text>
              </View>
            )}
          </View>
        ),
      }} />
      <Tabs.Screen name="account" options={{ tabBarIcon: ({ focused }) => <TabIcon name="account" focused={focused} /> }} />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  bar:       { backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f0e8dc", height: 64, paddingBottom: 8, paddingTop: 6, elevation: 12, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  wrap:      { alignItems: "center", gap: 2 },
  icon:      { fontSize: 20, opacity: 0.5 },
  iconActive:{ opacity: 1 },
  label:     { fontSize: 9, fontWeight: "600", letterSpacing: 0.3 },
  badge:     { position: "absolute", top: -2, right: -8, backgroundColor: Colors.error, borderRadius: 8, minWidth: 15, height: 15, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 8, fontWeight: "700" },
});
