

const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, message }) => {
    if (!to) throw new Error("Recipient (to) email is required");
  
    try {
      const mailer = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
        html: message,
      };
  
      await mailer.sendMail(mailOptions);
      console.log("Email sent successfully");
      return "Email sent successfully";
    } catch (error) {
      console.error("Error sending email:", error.message);
      throw new Error(error.message);
    }
  };
  