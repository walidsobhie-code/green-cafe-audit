import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, branchName, auditorName, date, score, actionItems, pdfBase64 } = await request.json();

    // Create transporter (using Gmail SMTP - user needs to provide credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Green Cafe Audit - ${branchName} - ${score}`,
      text: `Green Cafe Audit Report\n\nBranch: ${branchName}\nAuditor: ${auditorName}\nDate: ${date}\nScore: ${score}\n\nAction Items:\n${actionItems}\n\nFull report attached.`,
      attachments: [
        {
          filename: `Green_Audit_${branchName}_${date}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
