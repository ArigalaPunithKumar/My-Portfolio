import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MeetingNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  meetingDate: string;
  meetingTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message, meetingDate, meetingTime }: MeetingNotificationRequest = await req.json();

    console.log("Sending meeting notification for:", { name, email, meetingDate, meetingTime });

    // Send email to you (Punith) about the new meeting
    const adminEmailResponse = await resend.emails.send({
      from: "Portfolio Meetings <onboarding@resend.dev>",
      to: ["arigalapunith0081@gmail.com"],
      subject: `New Meeting Request from ${name}`,
      html: `
        <h1>New Meeting Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Meeting Date:</strong> ${meetingDate}</p>
        <p><strong>Meeting Time:</strong> ${meetingTime}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <hr>
        <p><em>This meeting request was submitted through your portfolio website.</em></p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to the person who booked
    const confirmationEmailResponse = await resend.emails.send({
      from: "Punith Kumar <onboarding@resend.dev>",
      to: [email],
      subject: "Meeting Request Received - Punith Kumar",
      html: `
        <h1>Thank you for scheduling a meeting, ${name}!</h1>
        <p>I have received your meeting request for:</p>
        <p><strong>Date:</strong> ${meetingDate}</p>
        <p><strong>Time:</strong> ${meetingTime}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p>I will get back to you shortly to confirm the meeting.</p>
        <p>Best regards,<br>Punith Kumar</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          If you need to make changes or cancel, please reply to this email.
        </p>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmail: adminEmailResponse,
        confirmationEmail: confirmationEmailResponse 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
