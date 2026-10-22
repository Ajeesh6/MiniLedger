import { StyleSheet, Text, View } from "react-native";

export default function SummaryCard({ title, amount, isOverdue = false }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{title}</Text>
      <Text
        style={[
          styles.amount,
          isOverdue && styles.overdueAmount,
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 150,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 18,
  },
  label: {
    color: "#64748B",
    fontSize: 14,
  },
  amount: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  overdueAmount: {
    color: "#DC2626",
  },
});
