import { StyleSheet, Text, View } from "react-native";

export default function SummaryCard({
  totalLent,
  totalRepaid,
  totalOverdue,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Total Lent</Text>
        <Text style={styles.amount}>{totalLent}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Total Repaid</Text>
        <Text style={styles.amount}>{totalRepaid}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Overdue</Text>
        <Text style={[styles.amount, styles.overdueAmount]}>
          {totalOverdue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  label: {
    color: "#64748B",
    fontSize: 14,
  },
  amount: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "right",
  },
  overdueAmount: {
    color: "#DC2626",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
});
