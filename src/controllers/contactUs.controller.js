const { to, ReE, ReS, TE } = require('../services/util.service');
const env = process.env.NODE_ENV || "development";
const contactService = require('../services/contactUs.service');



const contactUs = async (req, res) => {
    let err, contact;
    let start = new Date();
    const contactInfo = req.body;
    [err, contact] = await to(contactService.contactUsMail(contactInfo));
    if (err) return ReE(res, err, 200);
    return ReS(res, {
        message: "We Have Received Your Mail, Will Get Back To You."
    }, 200, start);
}


module.exports = { contactUs };