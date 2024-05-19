    // Authenticating API
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const { validationResult } = require('express-validator');
    const Models = require('../models/model')
    const { to, ReE,ReS, TE } = require('../services/util.service');
    const env = process.env.NODE_ENV || "development";
    const config = require(`${__dirname}/../config/config.js`)[env];
    const { Op } = require("sequelize");
    const authService = require('../services/auth.service');


    // login
    const authenticate = async function (req, res) {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.mapped() });
      }

      const { email, password, type } = req.body;

      try {
        let [error, user] = await to(Models.users.findOne({
          where: {
            [Op.or]: [{ email: email }, { user_name: email }],
            [Op.and]: [{ role: type }]

          }
        }))

        if (error) ReE(res, error, 200);

        if (!user) {
          return res.status(200).json({ errors: { msg: 'Invalid Credentials', success: false } })
        }

        const isMatch = await bcrypt.compare(password, user.dataValues.password);

        if (!isMatch) {
          return res.status(200).json({ errors: { msg: 'Invalid Credentials', success: false } })
        }
        const payload = {
          user: {
            id: user.userid
          }
        }

        jwt.sign(payload, config.jwtSecretToken,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ success: true, token })
          });
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }

    };

    const signup = async function (req, res) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        TE(errors.mapped);
      }

      let param = req.query;

      [err, user] = await to(Models.users.findOne({ where: { 'email': param.email } }))

      if (err) TE(err.message);

      if (user) {
        return res.status(400).json({ errors: { "email": { msg: 'User already exist' } } })
      }

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(param.password, salt);
      param.password = password;

      let [error, newUser] = await to(Models.users.create(param));
      if (error) TE(error.message);

      const payload = {
        user: {
          id: newUser.userid
        }
      }

      jwt.sign(payload, config.jwtSecretToken,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token })
        });

    }

    const forgotPassword = async (req, res) => {
      let err, userDetails;
      let start = new Date();
      const userInfo = req.body;
      [err, userDetails] = await to(authService.resetPasswordMail(userInfo));
      if (err) return ReE(res, err, 200);
      return ReS(res, {
        message: "Password Reset Mail Sent Successfully"
      }, 200, start);
    }

    const newPassword = async (req, res) => {
      let err, userDetails;
      let start = new Date();
      const userInfo = req.body;
      [err, userDetails] = await to(authService.setPassword(userInfo));
      if (err) return ReE(res, err, 200);
      return ReS(res, {
        message: "Password Changed Successfully"
      }, 200, start);
    }

    module.exports = { authenticate, signup, forgotPassword , newPassword};