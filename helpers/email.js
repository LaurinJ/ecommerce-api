import nodemailer from "nodemailer";
import { generateToken } from "./token.js";

// Setup Nodemailer transport
const transporter = nodemailer.createTransport(
  {
    service: "gmail",
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

export const passwordResetEmail = async (email) => {
  const token = generateToken(email);
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Změna hesla", // Subject line
    text: "Pro změnu hesla klikni na nasledujcí tlačítko", // plain text body
    html: `<p>Pro změnu hesla klikni na nasledujcí tlačítko</p><a style='color: white; text-decoration:none; font-weight: 700; padding: 5px; background-color: blue;' href='http://localhost:3000/account/resetpassword?token=${token}'>Změnit heslo</a>`, // html body
  });
};

export const confirmOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla přijata.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla přijata.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla přijata.</p>`, // html body
  });
};

export const paidOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla zaplacená.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla zaplacená.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla zaplacená.</p>`, // html body
    attachments: [
      {
        filename: `${orderNumber}.pdf`,
        path: `invoices/${orderNumber}.pdf`,
        contentType: "application/pdf",
      },
    ],
  });
};

export const deliveredOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla expedována.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla expedována.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla expedována.</p>`, // html body
  });
};

export const completedOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla dokončená.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla dokončená.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla dokončená.</p>`, // html body
  });
};

export const canceledOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla zrušená.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla zrušená.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla zrušená.</p>`, // html body
  });
};

export const suspendOrderEmail = async (email, orderNumber) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Objednávka byla pozastavená.", // Subject line
    text: `Vaše objednávka č. ${orderNumber} byla pozastavená.`, // plain text body
    html: `<p>Vaše objednávka č. ${orderNumber} byla pozastavená.</p>`, // html body
  });
};

export const contactMessageEmail = async (email, message) => {
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Odpověd na váš dotaz.", // Subject line
    text: message, // plain text body
    html: message, // html body
  });
};
