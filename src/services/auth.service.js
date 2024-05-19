const { to, TE, ReE, ReS, readHTMLFile } = require('../services/util.service');
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require("lodash");
const CommonService = require("../services/common.service");
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const middleware = require('../middleware/auth');



const sendEmail = async (sentMailInfo) => {

    // let [error, company] = await to(

    //     Models[process.env.BC_DB_NAME + "$Customer"].findByPk(userInfo.customer_no, {
    //         attributes: ['Company Logo'],
    //         raw: true
    //     })
    // );

    // const logo = process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo'];

    var currentPath = process.cwd();
    readHTMLFile(currentPath + '/resources/views/emails/passwordReset.html', function (err, html) {
        let template = handlebars.compile(html);
        if (sentMailInfo.role == 0) {
            resetPassworlUrl = 'https://dkmblue.superadmin.adcreatorsdemo.com.au/reset-password?access_token=' + sentMailInfo.access_token
        } else {
            resetPassworlUrl = 'https://company.dkmblue.adcreatorsdemo.com.au/reset-password?access_token=' + sentMailInfo.access_token
        }
        var htmlToSend = template({ access_token: sentMailInfo.access_token, resetPassworlUrl: resetPassworlUrl, username: sentMailInfo.user_name, APP_URL: process.env.APP_URL });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: sentMailInfo.email, // Change to your recipient
            from: process.env.EMAIL_FROM, // Change to your verified sender
            subject: 'Password Reset Mail',
            text: 'and easy to do anywhere, even with Node.js',
            html: htmlToSend,
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    })
    // return await Models.exchange_refund_requests.create(data);
}

const resetPasswordMail = async (userInfo) => {

    var sentMailInfo = {};
    let findUser = await Models.users.findOne({
        where: { email: userInfo.email },
        raw: true
    });

    if (findUser) {
        sentMailInfo.user_name = findUser.user_name;
        sentMailInfo.role = findUser.role;
        sentMailInfo.email = findUser.email;
    }

    if (_.isEmpty(findUser)) TE("User Not Found");

    var createToken = (userTokenData, callBack) => {
        jwt.sign(userTokenData, config.JWT.JWT_SECRET, {
            expiresIn: "300000"
        }, callBack);
    }
    createToken(findUser, (err, token) => {
        sentMailInfo.access_token = token;
    });
    console.log(sentMailInfo.access_token);


    await Models.users.update(userInfo, { where: { email: userInfo.email } });
    return await sendEmail(sentMailInfo);

};

const setPassword = async (userInfo) => {
    const checkUserToken = async (req, res, next) => {
        let access_token = userInfo.access_token;
        if (access_token) {
            let decodeData = await jwt.verify(access_token, config.JWT.JWT_SECRET);
            if (!_.isEmpty(decodeData)) {
                userInfo.email = decodeData.email;
            } else {
                res.status(403).send({
                    success: false,
                    message: "Token is not valid",
                    loggedOut: true
                });
            }
        }
    }
    await checkUserToken();
    let findUser = await Models.users.findOne({
        where: { email: userInfo.email },
        raw: true
    });

    if (_.isEmpty(findUser)) TE("User Not Found");

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userInfo.password, salt);
    userInfo.password = password;
    return await Models.users.update(userInfo, { where: { email: userInfo.email } });

};

module.exports = { sendEmail, resetPasswordMail, setPassword }