import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure a reusable transporter using Gmail.
// IMPORTANT: do NOT hardcode your password here.
// Set these in .env.local:
// - CONTACT_EMAIL_FROM=yourgmailaddress@gmail.com
// - CONTACT_EMAIL_TO=where_you_want_to_receive_messages@gmail.com
// - CONTACT_EMAIL_APP_PASSWORD=your-gmail-app-password
const transporter =
  process.env.CONTACT_EMAIL_FROM && process.env.CONTACT_EMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.CONTACT_EMAIL_FROM,
          pass: process.env.CONTACT_EMAIL_APP_PASSWORD,
        },
      })
    : null;

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

    if (!transporter) {
      console.warn("[Contact] Email transporter not configured. Check CONTACT_EMAIL_* env vars.");
      return NextResponse.json({ ok: true });
    }

    const to = process.env.CONTACT_EMAIL_TO || process.env.CONTACT_EMAIL_FROM!;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.CONTACT_EMAIL_FROM}>`,
      to,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact] Failed to send email", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
