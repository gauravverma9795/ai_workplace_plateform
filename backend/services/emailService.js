const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Initialize email transporter
let transporter = null;

// Set up transporter if email config is available
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  // Verify connection
  transporter.verify()
    .then(() => logger.info('Email service is ready'))
    .catch((err) => logger.error('Email service failed to initialize:', err));
} else {
  logger.warn('Email service not configured. Emails will be logged but not sent.');
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.text] - Plain text alternative
 * @returns {Promise} - Resolves with info or rejects with error
 */
async function sendEmail(options) {
  if (!options.to || !options.subject || !options.html) {
    throw new Error('Missing required email parameters');
  }
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    ...options
  };
  
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  } else {
    // Log the email details if no transporter is available
    logger.info('Email would be sent with the following details:');
    logger.info(JSON.stringify(mailOptions, null, 2));
    return { fake: true, message: 'Email logged but not sent' };
  }
}

/**
 * Send a workspace invitation email
 * @param {Object} options - Invitation options
 * @param {string} options.email - Recipient email
 * @param {string} options.inviteId - Invitation ID
 * @param {string} options.workspaceName - Workspace name
 * @param {string} options.role - Invited role
 * @param {string} options.inviterName - Name of the person who sent the invite
 * @returns {Promise} - Resolves with info or rejects with error
 */
async function sendInvitationEmail({ email, inviteId, workspaceName, role, inviterName }) {
  const inviteUrl = `${process.env.CLIENT_URL}/invite/${inviteId}`;
  
  return sendEmail({
    to: email,
    subject: `Invitation to join ${workspaceName} workspace`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Workspace Invitation</h2>
        <p>Hello,</p>
        <p>${inviterName} has invited you to join the <strong>${workspaceName}</strong> workspace as a <strong>${role}</strong>.</p>
        <p>Click the button below to accept this invitation:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Accept Invitation
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${inviteUrl}</p>
        <p>If you don't have an account yet, you'll be prompted to create one when you accept the invitation.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.</p>
      </div>
    `,
    text: `
      Workspace Invitation
      
      Hello,
      
      ${inviterName} has invited you to join the "${workspaceName}" workspace as a ${role}.
      
      Accept the invitation by visiting this link:
      ${inviteUrl}
      
      If you don't have an account yet, you'll be prompted to create one when you accept the invitation.
      
      This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
    `
  });
}

module.exports = {
  sendEmail,
  sendInvitationEmail
};