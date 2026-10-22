
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddLoanForm({ onSubmit, loading }) {
    const [friendName, setFriendName] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit() {
        const name = friendName.trim();
        const numericAmount = Number(amount);

        if (!name) {
            setError("Please enter your friend's name.");
            return;
        }

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError("Enter an amount greater than zero.");
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            setError("Enter the due date in YYYY-MM-DD format.");
            return;
        }

        const [year, month, day] = dueDate.split("-").map(Number);

        const parsedDate = new Date(year, month - 1, day);

        if (
            parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() !== month - 1 ||
            parsedDate.getDate() !== day
        ) {
            setError("Please enter a valid calendar date.");
            return;
        }

        setError("");

        try {
            await onSubmit({
                friendName: name,
                amount: numericAmount,
                dueDate,
            });

            setFriendName("");
            setAmount("");
            setDueDate("");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to add loan."
            );
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add a Loan</Text>

            <Text style={styles.label}>Friend's Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter friend's name"
                placeholderTextColor="#94A3B8"
                value={friendName}
                onChangeText={setFriendName}
                editable={!loading}
            />

            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 1500"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!loading}
            />

            <Text style={styles.label}>Due Date</Text>
            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={dueDate}
                onChangeText={setDueDate}
                editable={!loading}
                maxLength={10}
            />

            <Text style={styles.helper}>
                Enter the date as year-month-day, for example 2026-12-31.
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Adding..." : "Add Loan"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        padding: 20,
        marginTop: 24,
    },
    title: {
        color: "#0F172A",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        color: "#334155",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 15,
        color: "#0F172A",
        marginBottom: 16,
    },
    helper: {
        color: "#64748B",
        fontSize: 12,
        marginTop: -8,
        marginBottom: 16,
    },
    error: {
        color: "#DC2626",
        fontSize: 13,
        marginBottom: 12,
    },
    button: {
        height: 48,
        backgroundColor: "#2563EB",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
});
