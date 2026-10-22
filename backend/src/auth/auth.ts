
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from the .env file");
}

// Generate and store an OTP
export function generateOtp(phone: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  console.log(`Mock OTP for ${phone}: ${otp}`);

  return otp;
}

// Verify OTP, then find or create the user
export async function verifyOtp(phone: string, otp: string) {
  const savedOtp = otpStore.get(phone);

  if (!savedOtp || savedOtp.otp !== otp || Date.now() > savedOtp.expiresAt) {
    return null;
  }

  // OTP can only be used once
  otpStore.delete(phone);

  const result = await pool.query(
    `INSERT INTO users (phone)
     VALUES ($1)
     ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
     RETURNING id, phone`,
    [phone]
  );

  const user = result.rows[0] as { id: number; phone: string };

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
}
