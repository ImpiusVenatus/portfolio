import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as { name?: string; email?: string; message?: string };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // TODO: Send email (e.g. Resend, SendGrid, Nodemailer) or forward to your backend.
    // For now we just validate and return success so the form works.
    console.info("[Contact]", { name, email, message: message.slice(0, 80) });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
