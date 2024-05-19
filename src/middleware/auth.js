 jwt = require('jsonwebtoken');

const env = process.env.NODE_ENV || "development";

const config = require(`${__dirname}/../config/config.js`)[env];

module.exports = function (req, res, next) {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization fails' });
    }

    try {
        const payload = jwt.verify(token, config.jwtSecretToken);

        req.user = payload.user

        next();
    } catch {
        res.status(401).json({ msg: 'Token Error' });
    }
};

const generatePassword = async () => {

        charset1 = "abcdefghijklmnopqrstuvwxyz",
        charset2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        charset3 = '0123456789',
        charset4 = '!@#$%^&*'
    return await Promise.all([genrateCharSet(charset1), genrateCharSet(charset2), genrateCharSet(charset3), genrateCharSet(charset4)]).then(async (result) => {
        let password = "";
        for (let i = 0; i < result.length; i++) {
            password += result[i];
        }
        return password
    })
}

module.exports.generatePassword = generatePassword

const genrateCharSet = async (data) => {
    let retVal = '';
    for (var i = 0, n = data.length; i < 2; ++i) {
        retVal += data.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

/**************Create Token******************* */
exports.createToken = (userTokenData, callBack) => {
    jwt.sign(userTokenData, config.JWT.JWT_SECRET, {
      expiresIn: "30000"
    }, callBack);
  }