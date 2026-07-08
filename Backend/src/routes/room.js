const { Router } = require("express");
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.use(authMiddleware);

router.get("/", roomController.listRooms);
router.post("/", roomController.createRoom);
router.get("/:roomId", roomController.getRoom);
router.post("/:roomId/join", roomController.joinRoom);

module.exports = router;
