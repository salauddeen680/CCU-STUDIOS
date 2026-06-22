import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹19 -> 1900 paise
      currency: "INR",
      receipt: "receipt_ccu_001",
    });
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
