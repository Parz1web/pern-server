const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, name, role) => {
  return jwt.sign({ id, email, name, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest("Некорректный email или пароль"));
      }

      const candidate = await User.findOne({ where: { email } });

      if (candidate) {
        return next(
          ApiError.badRequest("Пользователь с такой эл. почтой уже существует.")
        );
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        email,
        password: hashPassword,
        name,
        role,
      });

      const basket = await Basket.create({ userId: user.id });
      const token = generateJwt(user.id, user.email, user.name, user.role);
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return next(ApiError.internal("Пользователь с таким именем не найден"));
      }

      let comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return next(ApiError.internal("Указан неверный пароль"));
      }

      const token = generateJwt(user.id, user.email, user.name, user.role);
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.name,
      req.user.role
    );
    return res.json({ token });
  }
}

module.exports = new UserController();
