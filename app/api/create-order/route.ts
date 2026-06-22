import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount } = await req.json();
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Rs ko paise mein badla
      currency: "INR",
      receipt: "receipt_ccu",
    });
    return NextResponse.json({ orderId: order.id });
  } catch (e) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
