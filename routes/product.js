const express = require("express");
const router = express.Router();
const { list, create } = require("../controllers/product");

// const {
//   requireSignin,
//   adminMiddleware,
//   authMiddleware,
//   canUpdateDeleteBlog,
// } = require("../controllers/auth");

// router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/products", list);
router.post("/products", create);

module.exports = router;
