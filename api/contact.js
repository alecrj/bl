import { Resend } from 'resend';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, sobriety, dreams } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !sobriety || !dreams) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Initialize Resend with API key from environment variable
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email notification
    await resend.emails.send({
      from: 'New Bridge Living <noreply@newbridgeliving.com>', // You'll need to verify this domain
      to: [process.env.CLIENT_EMAIL || 'your-client@example.com'], // Client's email
      subject: '🏠 New Application - New Bridge Living',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Application Received</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Sobriety Length:</strong> ${sobriety}</p>
            <p><strong>Dreams for Future:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              ${dreams}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This application was submitted through the New Bridge Living website.
          </p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to submit application',
      details: error.message
    });
  }
}