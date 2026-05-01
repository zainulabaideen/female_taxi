const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"SHEGO — Female Safe Rides" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const adminEmail = process.env.MAIL_USER;

// ── Brand header helper ──────────────────────────────────────────────────────
const brandHeader = (subtitle = '') => `
  <div style="background:linear-gradient(135deg,#402763 0%,#5a3585 100%);padding:32px 30px;text-align:center;">
    <span style="font-size:26px;font-weight:900;color:#ffcd60;letter-spacing:1px;">SHEGO</span>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${subtitle}</p>
  </div>
`;

const brandFooter = () => `
  <div style="background:#f7f9fb;border-top:1px solid #e8e8e8;text-align:center;padding:16px 20px;">
    <p style="margin:0;font-size:12px;color:#999;">SHEGO — Safe Female Rides | Pakistan</p>
    <p style="margin:4px 0 0;font-size:11px;color:#bbb;">This is an automated email. Please do not reply.</p>
  </div>
`;

// ── Driver Registration → Admin Notification ──────────────────────────────────
exports.sendDriverRegistrationToAdmin = async ({ full_name, email, phone, car_model, license_plate }) => {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      ${brandHeader('🚗 New Driver Registration Request')}
      <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
        <p style="background:#fff8e1;border-left:4px solid #ffcd60;padding:12px 16px;border-radius:4px;font-size:13px;font-weight:600;margin-bottom:20px;">
          ⚡ A new driver has applied. Please review and approve or reject from the admin dashboard.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#555;font-weight:600;width:140px;">Full Name</td><td>${full_name}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-weight:600;">Email</td><td><a href="mailto:${email}" style="color:#402763;">${email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#555;font-weight:600;">Phone</td><td>${phone}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-weight:600;">Car Model</td><td>${car_model}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-weight:600;">License Plate</td><td>${license_plate}</td></tr>
        </table>
        <div style="text-align:center;margin:24px 0;">
          <a href="${process.env.ADMIN_DASHBOARD_URL || '#'}" style="display:inline-block;background:#402763;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Review in Admin Dashboard</a>
        </div>
      </div>
      ${brandFooter()}
    </div>
  `;
  return sendEmail({ to: adminEmail, subject: `🚗 New Driver Application: ${full_name}`, html });
};

// ── Driver Approval Notification ──────────────────────────────────────────────
exports.sendDriverApprovalEmail = async (email, name, action, note = null) => {
  const approved = action === 'approve';
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      ${brandHeader(approved ? '✅ Your Account is Approved!' : '❌ Application Update')}
      <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
        <p>Dear <strong>${name}</strong>,</p>
        ${approved
          ? `<p>Congratulations! Your SHEGO driver account has been <strong style="color:#22c55e;">approved</strong>. You can now log in and start accepting rides.</p>
             <div style="text-align:center;margin:20px 0;">
               <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background:#402763;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Login to SHEGO</a>
             </div>`
          : `<p>We're sorry, your driver application was <strong style="color:#ef4444;">not approved</strong> at this time.</p>
             ${note ? `<p><strong>Reason:</strong> ${note}</p>` : ''}
             <p>You may re-apply with the correct documents or contact support.</p>`
        }
      </div>
      ${brandFooter()}
    </div>
  `;
  return sendEmail({
    to: email,
    subject: approved ? '✅ SHEGO Driver Account Approved!' : '❌ SHEGO Driver Application Update',
    html
  });
};

// ── Booking Confirmation ───────────────────────────────────────────────────────
exports.sendBookingConfirmation = async (passenger_id, driver_id, slot_id, booking_id) => {
  // We skip DB lookup here to keep it simple — just send a generic confirmation
  // In production, pass full data objects instead of IDs
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      ${brandHeader('🎉 Booking Confirmed!')}
      <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
        <p>Your SHEGO ride booking <strong>#${booking_id}</strong> has been confirmed. Your driver will be ready at the scheduled time.</p>
        <p style="color:#555;font-size:13px;">If you feel unsafe during the ride, use the <strong style="color:#ef4444;">SOS Emergency Button</strong> in your passenger dashboard.</p>
      </div>
      ${brandFooter()}
    </div>
  `;
  return sendEmail({ to: process.env.MAIL_USER, subject: `✅ Booking #${booking_id} Confirmed — SHEGO`, html });
};

// ── SOS Alert ─────────────────────────────────────────────────────────────────
exports.sendSOSAlert = async ({ passenger_id, booking_id, latitude, longitude, address }) => {
  const mapsLink = latitude && longitude
    ? `https://maps.google.com/?q=${latitude},${longitude}`
    : null;

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #fca5a5;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:28px;text-align:center;">
        <p style="margin:0;font-size:22px;font-weight:900;color:#fff;">🚨 EMERGENCY SOS ALERT</p>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">A SHEGO passenger has triggered an emergency alert!</p>
      </div>
      <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
        <p><strong>Passenger ID:</strong> ${passenger_id}</p>
        ${booking_id ? `<p><strong>Booking ID:</strong> #${booking_id}</p>` : ''}
        ${address ? `<p><strong>Last Known Address:</strong> ${address}</p>` : ''}
        ${mapsLink ? `<div style="text-align:center;margin:20px 0;"><a href="${mapsLink}" style="background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">📍 View Live Location</a></div>` : '<p style="color:#888;">Location data unavailable.</p>'}
        <p style="font-size:13px;color:#555;">Please check on this passenger immediately and contact emergency services if needed.</p>
      </div>
      ${brandFooter()}
    </div>
  `;
  return sendEmail({
    to: adminEmail,
    subject: `🚨 SHEGO SOS Alert — Passenger #${passenger_id}`,
    html
  });
};

// ── Contact Form ───────────────────────────────────────────────────────────────
exports.sendContactForm = async (name, email, subject, message) => {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      ${brandHeader('📬 New Contact Form Submission')}
      <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
        <p>Hi <strong>${name}</strong>, we've received your message and will reply shortly.</p>
        <div style="background:#f4f0f8;border-left:4px solid #402763;padding:16px 20px;border-radius:4px;margin:16px 0;">
          <p style="margin:0 0 8px;font-weight:600;color:#402763;">Subject: ${subject}</p>
          <p style="margin:0;color:#555;white-space:pre-line;">${message}</p>
        </div>
      </div>
      ${brandFooter()}
    </div>
  `;
  return sendEmail({ to: email, subject: `✅ Message Received — SHEGO`, html });
};