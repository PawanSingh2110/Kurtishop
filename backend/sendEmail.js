const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Our Small Family" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("📧 Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
