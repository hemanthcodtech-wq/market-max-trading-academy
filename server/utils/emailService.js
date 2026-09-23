const nodemailer = require('nodemailer');

const getClientBaseUrl = (customUrl) => {
  if (customUrl && typeof customUrl === 'string' && customUrl.trim() !== '') {
    return customUrl.replace(/\/$/, '');
  }
  const url = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
  return url.replace(/\/$/, '');
};

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: 'ethereal.user@ethereal.email', pass: 'ethereal_pass' }
  });
};

const getSenderAddress = (fallbackName) => {
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER || fallbackName;
  return sender.includes('<') ? sender : `"MarketMax Trading Academy" <${sender}>`;
};

const sendCourseEnrollmentEmail = async ({ to, studentName, course, invoiceNumber, amountPaid, invoicePdfBuffer }) => {
  try {
    const from = getSenderAddress('support@marketmaxtrading.com');
    const transporter = createTransporter();
    const dashboardUrl = `${getClientBaseUrl()}/dashboard/learning`;

    const mailOptions = {
      from, to, subject: `🎉 Enrollment Confirmed: ${course.title} - MarketMax Trading Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">MarketMax</h1>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0 0 0;">Premium Trading Academy</p>
          </div>
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Welcome ${studentName || 'Learner'},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">
              Your enrollment in <strong style="color: #D4AF37;">${course.title}</strong> is confirmed. Prepare to master the markets.
            </p>
            <div style="background-color: rgba(212, 175, 55, 0.05); border-left: 4px solid #D4AF37; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 8px 0; color: #D4AF37; font-size: 15px;">Program Details:</h3>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Course:</strong> ${course.title}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Language:</strong> ${course.language || 'English'}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Validity:</strong> ${course.accessValidity || '2 Months'}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Invoice ID:</strong> ${invoiceNumber}</p>
            </div>
            ${course.whatsappGroupLink ? `
            <div style="text-align: center; margin: 20px 0;">
              <a href="${course.whatsappGroupLink}" style="background-color: #229ED9; color: #ffffff; padding: 10px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 13px; display: inline-block;">Join Batch Community →</a>
            </div>
            ` : ''}
            <div style="text-align: center; margin: 25px 0;">
              <a href="${dashboardUrl}" style="background-color: #D4AF37; color: #0B0F19; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block;">Access Dashboard</a>
            </div>
          </div>
        </div>
      `,
    };

    if (invoicePdfBuffer) {
      mailOptions.attachments = [{ filename: `Invoice_${invoiceNumber}.pdf`, content: invoicePdfBuffer, contentType: 'application/pdf' }];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendCourseCompletionEmail = async ({ to, studentName, course, certId, certificatePdfBuffer }) => {
  try {
    const from = getSenderAddress('support@marketmaxtrading.com');
    const transporter = createTransporter();
    
    const mailOptions = {
      from, to, subject: `🎓 Certification Granted: ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">MarketMax</h1>
          </div>
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Congratulations ${studentName}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">You have successfully completed <strong>${course.title}</strong>.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">Your official verified certificate is attached to this email (ID: ${certId}).</p>
          </div>
        </div>
      `,
      attachments: [{ filename: `Certificate_${certId}.pdf`, content: certificatePdfBuffer, contentType: 'application/pdf' }]
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const sendCourseAccessGrantedEmail = async ({ to, studentName, course, accessValidity }) => {
  try {
    const from = getSenderAddress('support@marketmaxtrading.com');
    const transporter = createTransporter();
    const dashboardUrl = `${getClientBaseUrl()}/dashboard/learning`;

    const mailOptions = {
      from,
      to,
      subject: `✅ Course Access Granted: ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">MarketMax</h1>
          </div>
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Hello ${studentName || 'Learner'},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">
              Your access to <strong style="color: #D4AF37;">${course.title}</strong> has been granted by the admin.
            </p>
            <div style="background-color: rgba(212, 175, 55, 0.05); border-left: 4px solid #D4AF37; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 13px;"><strong>Course:</strong> ${course.title}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Access Validity:</strong> ${accessValidity || '2 Months'}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Status:</strong> Active</p>
            </div>
            ${course.whatsappGroupLink ? `
              <div style="text-align: center; margin: 18px 0;">
                <a href="${course.whatsappGroupLink}" style="background-color: #25D366; color: #ffffff; padding: 10px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 13px; display: inline-block;">Join WhatsApp Community →</a>
              </div>
            ` : ''}
            <div style="text-align: center; margin: 25px 0;">
              <a href="${dashboardUrl}" style="background-color: #D4AF37; color: #0B0F19; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block;">Open Learning Dashboard</a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log(`Course access email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Course access email error:', error);
    return { success: false, error: error.message };
  }
};

const sendForgotPasswordOtpEmail = async ({ to, name, otp, resetLink }) => {
  try {
    const from = `"MarketMax Security" <${process.env.SMTP_USER || 'security@marketmaxtrading.com'}>`;
    const transporter = createTransporter();
    
    const mailOptions = {
      from, to, subject: `Password Reset Request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">MarketMax</h1>
          </div>
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Hello ${name || 'User'},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">We received a request to reset your password. Use the OTP below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; padding: 15px 30px; background-color: #1e293b; border-radius: 8px; border: 1px dashed #D4AF37;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This OTP expires in 10 minutes. Do not share it.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const sendRegistrationOtpEmail = async ({ to, name, otp }) => {
  try {
    const from = `"MarketMax Security" <${process.env.SMTP_USER || 'security@marketmaxtrading.com'}>`;
    const transporter = createTransporter();
    
    const mailOptions = {
      from, to, subject: `Verify Your Email`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">MarketMax</h1>
          </div>
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Welcome ${name || 'Trader'}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">Please verify your email address using the OTP below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; padding: 15px 30px; background-color: #1e293b; border-radius: 8px; border: 1px dashed #D4AF37;">${otp}</span>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const sendContactInquiryEmail = async ({ name, email, phone, queryType, message }) => {
  try {
    const from = `"MarketMax Notifications" <${process.env.SMTP_USER || 'notifications@marketmaxtrading.com'}>`;
    const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@marketmaxtrading.com';
    const transporter = createTransporter();
    
    const mailOptions = {
      from, to, subject: `New Inquiry: ${queryType} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F19; padding: 25px; border-radius: 16px; color: #e5e7eb;">
          <div style="background-color: #141b2d; padding: 25px; border-radius: 12px; border: 1px solid #1f2937;">
            <h2 style="color: #D4AF37; font-size: 18px; margin-top: 0; border-bottom: 1px solid #374151; padding-bottom: 10px;">New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Type:</strong> ${queryType}</p>
            <div style="background-color: #1e293b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCourseEnrollmentEmail,
  sendCourseCompletionEmail,
  sendCourseAccessGrantedEmail,
  sendForgotPasswordOtpEmail,
  sendRegistrationOtpEmail,
  sendContactInquiryEmail
};
