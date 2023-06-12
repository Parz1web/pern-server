const Router = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController");
const router = new Router();

router.post("/", authMiddleware, feedbackController.create);
router.get("/", feedbackController.getAll);

module.exports = router;
