const { Router } = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
