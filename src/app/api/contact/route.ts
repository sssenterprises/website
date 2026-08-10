import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, phone, message } = body;

  try {
    await resend.emails.send({
      from: "info@sssmobile.in",
      to: "info@sssmobile.in", // Your Hostinger email
      subject: "New Contact Form Submission",
      html: `
        <h2>New Inquiry</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}