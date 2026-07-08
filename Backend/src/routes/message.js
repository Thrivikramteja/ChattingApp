const { Router } = require("express");
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.use(authMiddleware);

router.get("/:roomId", messageController.getMessages);
router.post("/:roomId/read", messageController.markRead);

module.exports = router;
