
import { Router } from "express";
import { generateOtp, verifyOtp } from "./auth.js";

const router = Router();

// Request an OTP
router.post("/request-otp", (req, res) => {
  const { phone } = req.body;

  if (typeof phone !== "string" || !/^\+?[1-9]\d{7,14}$/.test(phone)) {
    res.status(400).json({
      success: false,
      message: "Enter a valid phone number with country code",
    });
    return;
  }

  generateOtp(phone);

  res.json({
    success: true,
    message: "OTP generated. Check the server terminal.",
  });
});

// Verify an OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (typeof phone !== "string" || typeof otp !== "string") {
    res.status(400).json({
      success: false,
      message: "Phone and OTP are required",
    });
    return;
  }

  try {
    const result = await verifyOtp(phone, otp);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    res.json({
      success: true,
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("OTP verification failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
});

export default router;
