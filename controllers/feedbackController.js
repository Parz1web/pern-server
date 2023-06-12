const uuid = require("uuid");
const path = require("path");
const { FeedBack } = require("../models/models");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");

class feedbackController {
  async create(req, res, next) {
    try {
      const { description } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Не авторизован" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const feedback = await FeedBack.create({
        description,
        img: fileName,
        userId: decoded.id,
      });

      return res.json(feedback);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    const feedbacks = await FeedBack.findAll();
    return res.json(feedbacks);
  }
}

module.exports = new feedbackController();
