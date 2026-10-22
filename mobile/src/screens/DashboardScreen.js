
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import SummaryCard from "../components/SummaryCard";
import AddLoanForm from "../components/AddLoanForm";

import {
  getLoanSummary,
  getLoans,
  createLoan,
  markLoanRepaid,
} from "../services/api";


export default function DashboardScreen({ token }) {
  const [summary, setSummary] = useState({
    total_lent: "0.00",
    total_repaid: "0.00",
    total_overdue: "0.00",
  });

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingLoan, setSavingLoan] = useState(false);


  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryData, loansData] = await Promise.all([
        getLoanSummary(token),
        getLoans(token),
      ]);

      setSummary(summaryData.summary);

      setLoans(
        Array.isArray(loansData)
          ? loansData
          : loansData.loans ?? []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  async function handleAddLoan(loan) {
    setSavingLoan(true);

    try {
      await createLoan(token, loan);
      await loadDashboard();
    } finally {
      setSavingLoan(false);
    }
  }


  async function handleMarkRepaid(loanId) {
    try {
      setError("");
      await markLoanRepaid(token, loanId);
      await loadDashboard();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to mark loan as repaid."
      );
    }
  }


  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function isOverdue(loan) {
    if (loan.is_repaid) {
      return false;
    }

    // Get today's date in local time as YYYY-MM-DD
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    // Compare date-only strings to avoid timezone issues
    const dueDateString = String(loan.due_date).slice(0, 10);

    return dueDateString < todayString;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>MiniLedger</Text>

        <Text style={styles.subtitle}>
          Keep track of money you lend to friends.
        </Text>

        <SummaryCard
          totalLent={formatAmount(summary.total_lent)}
          totalRepaid={formatAmount(summary.total_repaid)}
          totalOverdue={formatAmount(summary.total_overdue)}
        />



        <View style={styles.loanSection}>

          <Text style={styles.sectionTitle}>Your Loans</Text>

          {loading ? (
            <Text style={styles.message}>Loading your loans...</Text>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : loans.length === 0 ? (
            <Text style={styles.message}>
              No loans yet. Add your first loan to get started.
            </Text>
          ) : (
            loans.map((loan) => (

              <View
                key={loan.id}
                style={[
                  styles.loanCard,
                  isOverdue(loan) && styles.overdueLoanCard,
                ]}
              >
                <Text style={styles.friendName}>
                  {loan.friend_name}
                </Text>

                <View style={styles.loanMiddleRow}>
                  <Text
                    style={[
                      styles.loanAmount,
                      isOverdue(loan) && styles.overdueText,
                    ]}
                  >
                    {formatAmount(loan.amount)}
                  </Text>

                  {loan.is_repaid ? (
                    <Text style={styles.repaidText}>✓ Repaid</Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.repayButton}
                      onPress={() => handleMarkRepaid(loan.id)}
                    >
                      <Text style={styles.repayButtonText}>
                        Mark as Repaid
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text
                  style={[
                    styles.dueDate,
                    isOverdue(loan) && styles.overdueText,
                  ]}
                >
                  Due: {String(loan.due_date).slice(0, 10)}
                  {isOverdue(loan) ? " · Overdue" : ""}
                </Text>
              </View>

            ))
          )}
        </View>
                <AddLoanForm
          onSubmit={handleAddLoan}
          loading={savingLoan}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: "100%",
    maxWidth: 948,
    alignSelf: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 28,
  },
  loanSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    marginTop: 28,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 16,
    lineHeight: 21,
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 16,
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  friendName: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },
  loanAmount: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  dueDate: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 10,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  overdueText: {
    color: "#DC2626",
  },
  repaidText: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "600",
  },
  pendingText: {
    color: "#B45309",
  },
  repayButton: {
    backgroundColor: "#15803D",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    flexShrink: 0,
  },
  repayButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  repayButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  loanCard: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 12,
    marginTop: 12,
    borderRadius: 10,
  },
  loanMiddleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  overdueLoanCard: {
    backgroundColor: "#FEF2F2",
  },

});
