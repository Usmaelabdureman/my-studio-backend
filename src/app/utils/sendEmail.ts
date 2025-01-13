import nodemailer from "nodemailer";
import config from "../config";
const sendEmail = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.wolfstudios_email,
      pass: config.email_app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Wolfstudios" <${config.wolfstudios_email}>`,
    to: receiverEmail,
    subject: "WOLFSTUDIOS - Password Reset OTP",
    html,
  });

  return info;
};

export default sendEmail;
