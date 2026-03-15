import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  // In development without email config, log to console instead
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Your Midzoe verification code: ${code}`,
    text: `Your verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not create a Midzoe account, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e;">Verify your Midzoe account</h2>
        <p style="color: #555;">Enter the code below to complete your registration:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; padding: 24px; background: #f5f5f5; text-align: center; border-radius: 8px; color: #1a1a2e; margin: 24px 0;">
          ${code}
        </div>
        <p style="color: #555;">This code expires in <strong>15 minutes</strong>.</p>
        <p style="color: #999; font-size: 13px;">If you did not create a Midzoe account, you can safely ignore this email.</p>
      </div>
    `,
  });
}
