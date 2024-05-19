const { to, TE, ReE, ReS, readHTMLFile } = require('./util.service');
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require("lodash");
const CommonService = require("./common.service");
const sgMail = require('@sendgrid/mail');
var handlebars = require('handlebars');
const bcrypt = require('bcryptjs');

const sendEmail = async (contactInfo) => {

    // let [error, company] = await to(

    //     Models[process.env.BC_DB_NAME + "$Customer"].findByPk(userInfo.customer_no, {
    //         attributes: ['Company Logo'],
    //         raw: true
    //     })
    // );

    // const logo = process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo'];

    var currentPath = process.cwd();
    readHTMLFile(currentPath + '/resources/views/emails/contactUs.html', function (err, html) {
        let template = handlebars.compile(html);
        var htmlToSend = template({ firstname: contactInfo.firstname, lastname: contactInfo.lastname, email: contactInfo.email, mobile: contactInfo.mobile, message: contactInfo.message });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: contactInfo.email, // Change to your recipient
            from: process.env.EMAIL_FROM, // Change to your verified sender
            subject: 'Contact Us Mail',
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

const contactUsMail = async (contactInfo) => {

    return await sendEmail(contactInfo);

};


module.exports = { sendEmail, contactUsMail }