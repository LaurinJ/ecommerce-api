const express = require("express");
const router = express.Router();
const { list, create } = require("../controllers/category");

// const {
//   requireSignin,
//   adminMiddleware,
//   authMiddleware,
//   canUpdateDeleteBlog,
// } = require("../controllers/auth");

// router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/category", list);
router.post("/category", create);

module.exports = router;
