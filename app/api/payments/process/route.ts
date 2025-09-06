import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      amountCents,
      method = "card",
      test, // optional string: 'fail' to simulate a decline
    }: { amountCents: number; method?: "card" | "upi" | "cash"; test?: "fail" | "ok" } = body

    if (typeof amountCents !== "number" || amountCents <= 0) {
      return NextResponse.json({ ok: false, status: "failed", message: "Invalid amount" }, { status: 400 })
    }
    if (method !== "card" && method !== "upi") {
      // only online methods are processed via this endpoint
      return NextResponse.json(
        { ok: false, status: "failed", message: "Unsupported method for online payment" },
        { status: 400 },
      )
    }

    if (test === "fail") {
      return NextResponse.json(
        { ok: false, status: "failed", message: "Payment was declined. Please try again." },
        { status: 402 },
      )
    }

    const paymentId = `${method}_` + Math.random().toString(36).slice(2)
    return NextResponse.json({ ok: true, status: "succeeded", id: paymentId })
  } catch {
    return NextResponse.json({ ok: false, status: "failed", message: "Payment error" }, { status: 500 })
  }
}
