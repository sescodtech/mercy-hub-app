import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";
import { Colors } from "../../lib/colors";
import { PlanCard } from "../../components/digital/PlanCard";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import type { Plan } from "../../types";

const NETWORKS = ["MTN", "Airtel", "Glo", "9mobile"];
const SERVICES = [
  { id: "data",      label: "Data",    emoji: "📶" },
  { id: "airtime",   label: "Airtime", emoji: "📞" },
  { id: "cable",     label: "Cable",   emoji: "📺" },
  { id: "education", label: "Exam",    emoji: "🎓" },
];

export default function DigitalScreen() {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);

  const [service, setService] = useState("data");
  const [network, setNetwork] = useState("MTN");
  const [plan,    setPlan]    = useState<Plan | null>(null);
  const [phone,   setPhone]   = useState("");
  const [buying,  setBuying]  = useState(false);

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["plans", service, network],
    queryFn: async () => {
      const q = service === "data"
        ? `/api/digital/plans?category=data&network=${network}`
        : `/api/digital/plans?category=${service}`;
      const { data } = await api.get(q);
      return data.success ? data.data : [];
    },
    staleTime: 60000,
  });

  async function handleBuy() {
    if (!user) { router.push("/(auth)/login"); return; }
    if (!plan)  { Alert.alert("Select a plan first"); return; }
    if ((service === "data" || service === "airtime") && phone.length < 10) {
      Alert.alert("Enter a valid phone number"); return;
    }

    setBuying(true);
    try {
      const body: Record<string, unknown> = {
        category:      service,
        paymentMethod: "wallet",
      };
      if (service === "data") {
        body.network       = network;
        body.phone         = phone;
        body.providerPlanId = plan.providerPlanId || plan.id;
        body.planName      = plan.name;
      } else if (service === "airtime") {
        body.network = network;
        body.phone   = phone;
        body.amount  = plan.price;
      }

      const { data } = await api.post("/api/digital/purchase", body);
      if (data.success) {
        Alert.alert("✅ Success", data.message || "Purchase successful!");
        setPlan(null);
        setPhone("");
      } else {
        Alert.alert("Failed", data.error || "Purchase failed. Try again.");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || "Network error. Try again.");
    }
    setBuying(false);
  }

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Digital Services</Text>
        {user && (
          <View style={styles.walletBadge}>
            <Text style={styles.walletText}>₦{(user.walletBalance || 0).toLocaleString()}</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Service tabs */}
        <View style={styles.serviceTabs}>
          {SERVICES.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => { setService(s.id); setPlan(null); }}
              style={[styles.serviceTab, service === s.id && styles.serviceTabActive]}
            >
              <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
              <Text style={[styles.serviceTabText, service === s.id && { color: Colors.brand, fontWeight: "700" }]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Network picker — data & airtime only */}
        {(service === "data" || service === "airtime") && (
          <View style={styles.networkRow}>
            {NETWORKS.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => { setNetwork(n); setPlan(null); }}
                style={[styles.netPill, network === n && styles.netPillActive]}
              >
                <Text style={[styles.netText, network === n && { color: "#fff" }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Phone input */}
        {(service === "data" || service === "airtime") && (
          <View style={styles.phoneWrap}>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number (e.g. 08136317465)"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        )}

        {/* Plans grid */}
        <View style={styles.planSection}>
          <Text style={styles.planTitle}>Select Plan</Text>
          {isLoading ? (
            <ActivityIndicator color={Colors.brand} style={{ marginTop: 24 }} />
          ) : (
            <View style={styles.planGrid}>
              {(plans || []).map((p) => (
                <View key={p.id || p.providerPlanId} style={styles.planCell}>
                  <PlanCard
                    plan={p}
                    selected={plan?.id === p.id}
                    onPress={() => setPlan(p)}
                  />
                </View>
              ))}
              {(plans || []).length === 0 && !isLoading && (
                <Text style={styles.empty}>No plans available.</Text>
              )}
            </View>
          )}
        </View>

        {/* Order summary + Buy */}
        {plan && (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan</Text>
              <Text style={styles.summaryValue}>{plan.name}</Text>
            </View>
            {plan.validity && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Validity</Text>
                <Text style={styles.summaryValue}>{plan.validity}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 4 }]}>
              <Text style={[styles.summaryLabel, { fontWeight: "700" }]}>Total</Text>
              <Text style={[styles.summaryValue, { color: Colors.brand, fontWeight: "700", fontSize: 16 }]}>
                ₦{plan.price.toLocaleString()}
              </Text>
            </View>

            <Button
              label={user ? `Pay ₦${plan.price.toLocaleString()} from Wallet` : "Sign in to Purchase"}
              onPress={user ? handleBuy : () => router.push("/(auth)/login")}
              loading={buying}
              style={{ marginTop: 14 }}
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: Colors.bg },
  header:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title:           { fontSize: 22, fontWeight: "800", color: Colors.text },
  walletBadge:     { backgroundColor: "rgba(217,140,42,0.12)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  walletText:      { fontSize: 13, fontWeight: "700", color: Colors.brand },
  serviceTabs:     { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  serviceTab:      { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: Colors.border, gap: 3 },
  serviceTabActive:{ borderColor: Colors.brand, backgroundColor: "rgba(217,140,42,0.08)" },
  serviceTabText:  { fontSize: 10, color: Colors.textMuted, fontWeight: "500" },
  networkRow:      { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  netPill:         { flex: 1, alignItems: "center", paddingVertical: 7, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: Colors.border },
  netPillActive:   { backgroundColor: Colors.brand, borderColor: Colors.brand },
  netText:         { fontSize: 12, fontWeight: "600", color: Colors.textMuted },
  phoneWrap:       { paddingHorizontal: 16, marginBottom: 14 },
  phoneInput:      { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text },
  planSection:     { paddingHorizontal: 16 },
  planTitle:       { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 10 },
  planGrid:        { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  planCell:        { width: "30.5%" },
  empty:           { color: Colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 24 },
  summary:         { margin: 16, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 16, marginTop: 20 },
  summaryRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  summaryLabel:    { fontSize: 13, color: Colors.textMuted },
  summaryValue:    { fontSize: 13, color: Colors.text, fontWeight: "600" },
});
