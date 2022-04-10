import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split("Bearer")[1].trim(),
      process.env.ACCESS_TOKEN_SECRET,
      (err, decodedToken) => {
        if (err) return res.status(401).json({ error: "Něco se pokazilo!" });
        req.user = decodedToken;
        next();
      }
    );
  } else {
    return res.status(401).json({ error: "Nejsi přihlášený/ná!" });
  }
};

// route for handling PDF request
router.get("/downloadPDF/:invoiceId", requireSignin, (req, res) => {
  if (req.params.invoiceId) {
    return res.download(`invoices/${req.params.invoiceId}.pdf`);
  }
  return res.status(400).json({ error: "Neplatné číslo faktury!" });
});

export { router };
