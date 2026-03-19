import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { branchName, auditorName, date, score, actionItems, email, reportText, pdfBase64 } = await request.json();

    // Validate required fields
    if (!branchName || !auditorName || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: branchName, auditorName, date' },
        { status: 400 }
      );
    }

    const defaultRecipient = process.env.DEFAULT_RECIPIENT || 'walid.sobhy@mmgunited.com';
    const recipients = email ? [email, defaultRecipient] : [defaultRecipient];

    // Check if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailData: any = {
      from: 'Green Cafe Audit <onboarding@resend.dev>',
      to: recipients,
      subject: `☕ Green Cafe Audit - ${branchName} - Score: ${score}%`,
      text: reportText || `Green Cafe Audit Report

Branch: ${branchName}
Auditor: ${auditorName}
Date: ${date}
Score: ${score}%

Action Items:
${actionItems || 'None'}
`,
    };

    // Attach PDF if available
    if (pdfBase64) {
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');
      emailData.attachments = [
        {
          filename: `Green_Audit_${branchName.replace(/\s+/g, '_')}_${date}.pdf`,
          content: pdfBuffer,
        },
      ];
    }

    const data = await resend.emails.send(emailData);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Email error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}