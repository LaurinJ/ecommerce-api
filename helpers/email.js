import nodemailer from "nodemailer";
import { generateToken } from "./token.js";

// Setup Nodemailer transport
const transporter = nodemailer.createTransport(
  {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  {
    // Default options for the message. Used if specific values are not set
    from: process.env.EMAIL_USER,
  }
);

export const sendEmail = async (email) => {
  const token = generateToken(email);
  let info = await transporter.sendMail({
    // from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Změna hesla", // Subject line
    text: "Pro změnu hesla klikni na nasledujcí tlačítko", // plain text body
    html: `<p>Pro změnu hesla klikni na nasledujcí tlačítko</p><a style='color: white; text-decoration:none; font-weight: 700; padding: 5px; background-color: blue;' href='http://localhost:3000/account/resetpassword?token=${token}'>Změnit heslo</a>`, // html body
  });
  console.log(info);
};
