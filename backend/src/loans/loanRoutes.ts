
import { Router } from "express";
import { pool } from "../db.js";
import {
    authenticateToken,
    AuthRequest,
} from "../auth/authMiddleware.js";

const router = Router();

// Add a new loan
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    const { friendName, amount, dueDate } = req.body;

    // Validate the input
    if (
        typeof friendName !== "string" ||
        !friendName.trim() ||
        amount === undefined ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0 ||
        typeof dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        !Number.isFinite(Date.parse(`${dueDate}T00:00:00Z`)) ||
        new Date(`${dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== dueDate
    ) {
        res.status(400).json({
            success: false,
            message: "Enter a valid friend name, positive amount, and due date",
        });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO loans (user_id, friend_name, amount, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [req.userId, friendName.trim(), Number(amount), dueDate]
        );

        res.status(201).json({
            success: true,
            message: "Loan added successfully",
            loan: result.rows[0],
        });
    } catch (error) {
        console.error("Failed to add loan:", error);
        res.status(500).json({
            success: false,
            message: "Unable to add loan",
        });
    }
});

// Get all loans belonging to the logged-in user
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const result = await pool.query(
            `SELECT *
       FROM loans
       WHERE user_id = $1
       ORDER BY due_date ASC, created_at DESC`,
            [req.userId]
        );

        res.json({
            success: true,
            loans: result.rows,
        });
    } catch (error) {
        console.error("Failed to fetch loans:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch loans",
        });
    }
});


// Mark a loan as repaid
router.patch("/:id/repay", authenticateToken, async (req: AuthRequest, res) => {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
        res.status(400).json({
            success: false,
            message: "Invalid loan ID",
        });
        return;
    }

    try {
        const result = await pool.query(
            `UPDATE loans
       SET is_repaid = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [loanId, req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Loan not found",
            });
            return;
        }

        res.json({
            success: true,
            message: "Loan marked as repaid",
            loan: result.rows[0],
        });
    } catch (error) {
        console.error("Failed to update loan:", error);
        res.status(500).json({
            success: false,
            message: "Unable to mark loan as repaid",
        });
    }
});


// Get the logged-in user's loan summary
router.get("/summary", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const result = await pool.query(
            `SELECT
         COALESCE(SUM(amount), 0) AS total_lent,
         COALESCE(SUM(amount) FILTER (WHERE is_repaid = TRUE), 0) AS total_repaid,
         COALESCE(
           SUM(amount) FILTER (
             WHERE is_repaid = FALSE AND due_date < CURRENT_DATE
           ),
           0
         ) AS total_overdue
       FROM loans
       WHERE user_id = $1`,
            [req.userId]
        );

        res.json({
            success: true,
            summary: result.rows[0],
        });
    } catch (error) {
        console.error("Failed to fetch summary:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch loan summary",
        });
    }
});


export default router;