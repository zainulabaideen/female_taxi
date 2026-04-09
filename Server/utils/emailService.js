const nodemailer = require("nodemailer");
const db = require("../config/db");

// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


// Generic sender
const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Hidden Domus" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const adminEmail = 'talhachaudhary3711@gmail.com'
// ──  ──────────────────────────────
exports.sendContactForm = async (name, email, subject, message) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #007BC1 0%, #C3251C 100%); padding:35px 30px; text-align:center;">
        <div style="margin-bottom:12px;">
          <span style="font-size:28px; font-weight:900; color:white; letter-spacing:1px;">
            <span style="color:#ffffff;">Alpha</span>
            <span style="color:#ffd700;"> Enterprises</span>
          </span>
        </div>
        <p style="margin:0; color:rgba(255,255,255,0.9); font-size:15px; font-weight:500;">
          ✅ We've received your message!
        </p>
      </div>

      <!-- Body -->
      <div style="padding:35px 30px; line-height:1.7; color:#333333; background:#ffffff;">
        <p style="font-size:16px; margin-top:0;">Hi <strong>${name}</strong>,</p>
        <p>
          Thank you for reaching out to <strong style="color:#007BC1;">Alpha Enterprises</strong>. 
          We have successfully received your message and our team will get back to you as soon as possible.
        </p>

        <!-- Message Summary Box -->
        <div style="background:#f4f8fc; border-left:4px solid #007BC1; border-radius:6px; padding:20px 24px; margin:24px 0;">
          <p style="margin:0 0 10px; font-size:13px; text-transform:uppercase; letter-spacing:0.8px; color:#007BC1; font-weight:700;">
            Your Message Summary
          </p>
          <p style="margin:6px 0;"><span style="color:#555; font-weight:600;">Subject:</span> ${subject}</p>
          <hr style="border:none; border-top:1px solid #dde8f0; margin:12px 0;">
          <p style="margin:6px 0; color:#555; font-weight:600;">Message:</p>
          <p style="margin:6px 0; color:#444; white-space:pre-line;">${message}</p>
        </div>

        <p style="color:#555;">
          Our team typically responds within <strong style="color:#C3251C;">2 business hours</strong>. 
          For urgent matters, feel free to call us directly at 
          <a href="tel:+923455185310" style="color:#007BC1; text-decoration:none; font-weight:600;">+92-345-5185310</a>.
        </p>

        <p style="margin-top:28px; margin-bottom:4px;">Warm regards,</p>
        <p style="margin:0;">
          <strong style="color:#007BC1;">Alpha Enterprises Team</strong><br>
          <span style="font-size:13px; color:#888;">Security Solutions &amp; Technology</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f7f9fb; border-top:1px solid #e8e8e8; text-align:center; padding:18px 20px;">
        <p style="margin:0 0 6px; font-size:13px; color:#666;">
          <strong style="color:#007BC1;">Alpha Enterprises (Pvt) Ltd</strong>
        </p>
        <p style="margin:0; font-size:12px; color:#999;">
          FF 01, 5th Floor, 51 Business Hub, Gulberg Green, Islamabad — Pakistan
        </p>
        <p style="margin:8px 0 0; font-size:11px; color:#bbb;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>

    </div>
  `;

  return sendEmail({
    to: email,
    subject: "✅ We Received Your Message — Alpha Enterprises",
    html,
  });
};

// ──   ──────────────────────────────
exports.sendContactFormToAdmin = async (name, visitorEmail, subject, message) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width:650px; margin:auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #007BC1 100%); padding:28px 30px; text-align:center;">
        <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:white;">
          📩 New Contact Form Submission
        </p>
        <p style="margin:0; font-size:13px; color:rgba(255,255,255,0.75);">
          Alpha Enterprises Website — Admin Notification
        </p>
      </div>

      <!-- Alert Banner -->
      <div style="background:#fff8e1; border-bottom:2px solid #ffc107; padding:12px 30px; text-align:center;">
        <p style="margin:0; font-size:13px; color:#856404; font-weight:600;">
          ⚡ A visitor has submitted a contact request. Please respond promptly.
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px; color:#333333; line-height:1.7; background:#ffffff;">

        <!-- Visitor Info -->
        <div style="background:#f4f8fc; border-radius:8px; padding:20px 24px; margin-bottom:24px;">
          <p style="margin:0 0 12px; font-size:13px; text-transform:uppercase; letter-spacing:0.8px; color:#007BC1; font-weight:700;">
            Visitor Information
          </p>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr>
              <td style="padding:6px 0; color:#555; font-weight:600; width:90px;">Name</td>
              <td style="padding:6px 0; color:#222;">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#555; font-weight:600;">Email</td>
              <td style="padding:6px 0;">
                <a href="mailto:${visitorEmail}" style="color:#007BC1; text-decoration:none;">${visitorEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#555; font-weight:600;">Subject</td>
              <td style="padding:6px 0; color:#222;">${subject}</td>
            </tr>
          </table>
        </div>

        <!-- Message -->
        <div style="border:1px solid #e0e0e0; border-radius:8px; padding:20px 24px; margin-bottom:24px;">
          <p style="margin:0 0 12px; font-size:13px; text-transform:uppercase; letter-spacing:0.8px; color:#C3251C; font-weight:700;">
            Message
          </p>
          <p style="margin:0; color:#444; white-space:pre-line; font-size:14px; line-height:1.8;">${message}</p>
        </div>

        <!-- Reply CTA -->
        <div style="text-align:center; margin:28px 0 10px;">
          <a href="mailto:${visitorEmail}?subject=Re: ${subject}"
            style="display:inline-block; background:linear-gradient(135deg, #007BC1, #C3251C); color:white; text-decoration:none; padding:12px 32px; border-radius:8px; font-size:14px; font-weight:700; letter-spacing:0.5px;">
            Reply to ${name}
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f7f9fb; border-top:1px solid #e8e8e8; text-align:center; padding:18px 20px;">
        <p style="margin:0 0 4px; font-size:13px; color:#666;">
          <strong style="color:#007BC1;">Alpha Enterprises</strong> — Admin Panel Notification
        </p>
        <p style="margin:0; font-size:11px; color:#bbb;">
          This email was auto-generated. Log in to the admin dashboard to manage this submission.
        </p>
      </div>

    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📩 New Contact: ${subject} — from ${name}`,
    html,
  });
};



// ── Job Application → Candidate confirmation ──────────────────────────────
exports.sendJobApplicationToCandidate = async (data) => {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#007BC1 0%,#C3251C 100%);padding:35px 30px;text-align:center;">
        <span style="font-size:26px;font-weight:900;color:#fff;letter-spacing:1px;">
          Alpha <span style="color:#ffd700;">Enterprises</span>
        </span>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">
          ✅ Application Received!
        </p>
      </div>

      <!-- Body -->
      <div style="padding:35px 30px;line-height:1.8;color:#333;background:#fff;">
        <p style="font-size:16px;margin-top:0;">Dear <strong>${data.name}</strong>,</p>
        <p>
          Thank you for applying at <strong style="color:#007BC1;">Alpha Enterprises</strong>.
          We have received your application and our HR team will review it carefully.
          We will contact you if your profile matches our requirements.
        </p>

        <!-- Application Summary -->
        <div style="background:#f4f8fc;border-left:4px solid #007BC1;border-radius:6px;padding:20px 24px;margin:24px 0;">
          <p style="margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;color:#007BC1;font-weight:700;">
            Your Application Summary
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Full Name</td><td style="color:#222;">${data.name}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Email</td><td style="color:#222;">${data.email}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Contact</td><td style="color:#222;">${data.contact}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Gender</td><td style="color:#222;">${data.gender}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Date of Birth</td><td style="color:#222;">${data.dob}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Education</td><td style="color:#222;">${data.education}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Availability</td><td style="color:#222;">${data.availability || "Not specified"}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Address</td><td style="color:#222;">${data.address}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #dde8f0;margin:14px 0;">
          <p style="margin:0 0 6px;color:#555;font-weight:600;font-size:14px;">Experience:</p>
          <p style="margin:0;color:#444;font-size:14px;white-space:pre-line;">${data.experience}</p>
          ${data.message ? `
          <hr style="border:none;border-top:1px solid #dde8f0;margin:14px 0;">
          <p style="margin:0 0 6px;color:#555;font-weight:600;font-size:14px;">Your Message:</p>
          <p style="margin:0;color:#444;font-size:14px;">${data.message}</p>` : ""}
        </div>

        <p style="color:#555;font-size:14px;">
          If you have any questions, feel free to reach us at
          <a href="tel:+923455185310" style="color:#007BC1;text-decoration:none;font-weight:600;">+92-345-5185310</a> or
          <a href="mailto:tahir@alphaenterprises.com.pk" style="color:#007BC1;text-decoration:none;">tahir@alphaenterprises.com.pk</a>.
        </p>

        <p style="margin-top:28px;margin-bottom:4px;">Best regards,</p>
        <p style="margin:0;">
          <strong style="color:#007BC1;">HR Team — Alpha Enterprises</strong><br>
          <span style="font-size:13px;color:#888;">Security Solutions &amp; Technology</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f7f9fb;border-top:1px solid #e8e8e8;text-align:center;padding:18px 20px;">
        <p style="margin:0 0 4px;font-size:13px;color:#666;"><strong style="color:#007BC1;">Alpha Enterprises (Pvt) Ltd</strong></p>
        <p style="margin:0;font-size:12px;color:#999;">FF 01, 5th Floor, 51 Business Hub, Gulberg Green, Islamabad — Pakistan</p>
        <p style="margin:8px 0 0;font-size:11px;color:#bbb;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: "✅ Application Received — Alpha Enterprises",
    html,
  });
};
// <tr><td style="padding:5px 0;color:#555;font-weight:600;width:140px;">Position</td><td style="color:#222;">${data.position || "N/A"}</td></tr>


// ── Job Application → Admin notification ─────────────────────────────────
{/* <tr><td style="padding:5px 0;color:#555;font-weight:600;">Position</td><td><strong>${data.position || "N/A"}</strong></td></tr> */}

exports.sendJobApplicationToAdmin = async (data) => {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:650px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a1a2e 0%,#007BC1 100%);padding:28px 30px;text-align:center;">
        <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#fff;">📋 New Job Application</p>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);">Alpha Enterprises — HR Notification</p>
      </div>

      <!-- Alert Banner -->
      <div style="background:#e8f4fd;border-bottom:2px solid #007BC1;padding:12px 30px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#005a8e;font-weight:600;">
          ⚡ A candidate has submitted an application. Please review promptly.
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px;color:#333;line-height:1.7;background:#fff;">

        <!-- Candidate Info -->
        <div style="background:#f4f8fc;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
          <p style="margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;color:#007BC1;font-weight:700;">
            Candidate Information
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:5px 0;color:#555;font-weight:600;width:140px;">Full Name</td><td>${data.name}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Email</td><td><a href="mailto:${data.email}" style="color:#007BC1;text-decoration:none;">${data.email}</a></td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Contact</td><td>${data.contact}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Gender</td><td>${data.gender}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Date of Birth</td><td>${data.dob}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">CNIC</td><td>${data.cnic}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Education</td><td>${data.education}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Availability</td><td>${data.availability || "Not specified"}</td></tr>
            <tr><td style="padding:5px 0;color:#555;font-weight:600;">Address</td><td>${data.address}</td></tr>
          </table>
        </div>

        <!-- Experience -->
        <div style="border:1px solid #e0e0e0;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
          <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;color:#C3251C;font-weight:700;">Experience</p>
          <p style="margin:0;font-size:14px;color:#444;white-space:pre-line;">${data.experience}</p>
        </div>

        ${data.message ? `
        <div style="border:1px solid #e0e0e0;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
          <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;color:#555;font-weight:700;">Message from Candidate</p>
          <p style="margin:0;font-size:14px;color:#444;">${data.message}</p>
        </div>` : ""}

        <!-- Reply CTA -->
        <div style="text-align:center;margin:24px 0 8px;">
          <a href="mailto:${data.email}?subject=Re: Your Application at Alpha Enterprises"
            style="display:inline-block;background:linear-gradient(135deg,#007BC1,#C3251C);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;">
            Reply to ${data.name}
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f7f9fb;border-top:1px solid #e8e8e8;text-align:center;padding:18px 20px;">
        <p style="margin:0 0 4px;font-size:13px;color:#666;"><strong style="color:#007BC1;">Alpha Enterprises</strong> — HR Admin Notification</p>
        <p style="margin:0;font-size:11px;color:#bbb;">Log in to the admin dashboard to manage applications.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📋 New Job Application: ${data.position || "N/A"} — ${data.name}`,
    html,
  });
};