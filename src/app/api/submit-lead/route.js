import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Send lead notification to admin
    await sendAdminNotification({ name, email, phone });

    // Send welcome email to user
    await sendWelcomeEmail({ name, email });

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit lead" },
      { status: 500 }
    );
  }
}

async function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // App password (not regular password)
    },
  });
}

async function sendAdminNotification({ name, email, phone }) {
  const adminEmail = "ujwal.raina.ur@gmail.com";

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Alert - Titans Trading</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px 0;
        }
        .subtitle {
          color: #94a3b8;
          font-size: 16px;
          margin: 0;
        }
        .lead-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }
        .lead-info {
          display: grid;
          gap: 20px;
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .info-label {
          font-weight: 600;
          color: #06b6d4;
          min-width: 80px;
        }
        .info-value {
          color: #e2e8f0;
          font-size: 16px;
        }
        .timestamp {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background: rgba(6, 182, 212, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .footer-text {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">🚀 New Lead Alert</h1>
          <p class="subtitle">Titans Trading Bot - AI-Powered Trading</p>
        </div>
        
        <div class="lead-card">
          <div class="lead-info">
            <div class="info-row">
              <span class="info-label">👤 Name:</span>
              <span class="info-value">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📧 Email:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📱 Phone:</span>
              <span class="info-value">${phone}</span>
            </div>
          </div>
          
          <div class="timestamp">
            ⏰ Received on: ${new Date().toLocaleString()}
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">🤖 Powered by Titans Trading Bot</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: adminEmail,
      subject: "🚀 New Lead - Titans Trading Bot",
      html: emailContent,
    });

    console.log("✅ Admin notification email sent successfully");
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
  }
}

async function sendWelcomeEmail({ name, email }) {
  const welcomeContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Titans Trading Bot</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 30px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
          border: 1px solid rgba(6, 182, 212, 0.4);
          border-radius: 24px;
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(6, 182, 212, 0.1) 50%, transparent 70%);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 15px 0;
          position: relative;
          z-index: 1;
        }
        .subtitle {
          color: #94a3b8;
          font-size: 18px;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .welcome-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 50px 40px;
          margin-bottom: 30px;
          backdrop-filter: blur(20px);
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .welcome-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4);
          border-radius: 24px;
          z-index: -1;
          opacity: 0.4;
          background-size: 400% 400%;
          animation: gradientShift 6s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .greeting {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 30px;
          text-align: center;
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }
        .message {
          color: #e2e8f0;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 400;
        }
        .highlight {
          background: rgba(6, 182, 212, 0.08);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 20px;
          border: 1px solid rgba(6, 182, 212, 0.2);
          margin: 30px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .highlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          animation: slideRight 3s infinite;
        }
        @keyframes slideRight {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .highlight-text {
          color: #06b6d4;
          font-weight: 700;
          font-size: 20px;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 30px;
          background: rgba(6, 182, 212, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(6, 182, 212, 0.15);
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent, rgba(6, 182, 212, 0.03), transparent);
          z-index: -1;
        }
        .footer-text {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        }
        .team-signature {
          color: #06b6d4;
          font-weight: 700;
          font-size: 16px;
          margin-top: 15px;
          text-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">🎉 Welcome to Titans Trading</h1>
          <p class="subtitle">Your AI-Powered Trading Journey Begins</p>
        </div>
        
        <div class="welcome-card">
          <div class="greeting">Hi ${name}! 👋</div>
          
          <div class="message">
            Welcome to the future of trading! You've just joined our exclusive waitlist for the most advanced AI trading bot in the market.
          </div>
          
          <div class="highlight">
            <p class="highlight-text">🚀 Early Access Coming Soon</p>
          </div>
          
          <div class="message">
            We'll be in touch very soon with your early access details. Get ready to experience trading like never before!
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">🤖 Powered by Titans Trading Bot</p>
          <p class="team-signature">— The Titans Trading Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject:
        "🎉 Welcome to Titans Trading Bot - Your AI Trading Journey Begins",
      html: welcomeContent,
    });

    console.log("✅ Welcome email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
}
