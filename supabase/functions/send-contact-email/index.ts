import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Simple rate limiting (in-memory)
const submissions = new Map<string, number[]>();
const MAX_SUBMISSIONS = 3;
const TIME_WINDOW = 3600000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];
  
  // Clean old submissions
  const recentSubmissions = userSubmissions.filter(time => now - time < TIME_WINDOW);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);
  return true;
}

// HTML sanitization helper
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.log("Rate limit exceeded for IP:", clientIp);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate input
    const rawData = await req.json();
    const validationResult = contactSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: validationResult.error.errors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    console.log("Sending contact form email from:", email);

    // Send email with sanitized content
    const emailResponse = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["mugiranezaelisee0@gmail.com"],
      replyTo: email,
      subject: `Portfolio Contact: ${escapeHtml(subject)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
