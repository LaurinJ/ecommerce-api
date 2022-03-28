import express from "express";

const router = express.Router();

// route for handling PDF request
router.get("/downloadPDF", (req, res) => {
  res.download("invoices/1646169703862.pdf");
});

export { router };
