import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOTP = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"Jakarta Official" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h2>🔐 OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  });
};
