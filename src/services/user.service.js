const { to, TE, ReE, readHTMLFile } = require('../services/util.service');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash');
const Models = require('./../models/model');
const CommonService = require('../services/common.service');
const sgMail = require('@sendgrid/mail');
var handlebars = require('handlebars');
const authService = require("../middleware/auth");
const bcrypt = require('bcrypt');
const { createContact } = require('./company.service');

const sendEmail = async (userInfo) => {

  let [error, company] = await to(
    
    Models[process.env.BC_DB_NAME + "$Customer"].findByPk(userInfo.customer_no,{
      attributes: ['Company Logo'],
      raw:true 
    })
  );

  const logo = process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo'];

  console.log("sendEmail");
  var currentPath = process.cwd();
  readHTMLFile(currentPath + '/resources/views/emails/userRegistration.html', function (err, html) {
    let template = handlebars.compile(html);
    var htmlToSend = template({ logo: logo,firstname: 'DKMBLUE', lastname: '', username: userInfo.user_name, password: userInfo.generatePassword, APP_URL: process.env.APP_URL });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: userInfo.email, // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: 'Welcome to Dkm Blue',
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

const create = async (userInfo) => {
  let findUser = await Models.users.findOne({
    where: { [Op.or]: [{ email: userInfo.email }, { user_name: userInfo.user_name }] },
    raw: true
  });
  if (findUser) TE("User Already Exists");
  [err, user] = await to(authService.generatePassword());

  let generatePass = user;

  [err, salt] = await to(bcrypt.genSalt(10));

  userInfo.password = await bcrypt.hashSync(generatePass, salt);
  userInfo.generatePassword = generatePass;

  await Models.users.create(userInfo);
  
  let [error, companyInfo] = await to(
    Models[process.env.BC_DB_NAME + "$Customer"].findByPk(userInfo['customer_no'])
  );
  if (error) TE(error.message);

  companyInfo = { ...companyInfo,type:1}

  createContact(companyInfo);

  return await sendEmail(userInfo);

};

const update = async (userInfo) => {
  return await Models.users.update(userInfo, { where: { user_name: userInfo.user_name } });
};

const deleteUser = async (userInfo) => {
  return await Models.users.destroy({ where: { email: userInfo.email } });
};

const getUsers = async (userList) => {


  
  let limit = 10;
  userQuery = {
    where: { customer_no: userList.customer_no},
    order: [['userid', 'DESC']],
    attributes: {
      include: [
        [
          Sequelize.literal(`(SELECT sum(credit_used) FROM user_credit_used WHERE user_credit_used.user_id = users.userid )`),
          'credit_used'
        ],
        [
          Sequelize.fn("concat", Sequelize.col("profileimage") ? process.env.APP_URL+"/resources/uploads/users/": ' ',Sequelize.col("profileimage")),'profile_image'
        ]
      ],
      
    },
    raw: true,
  };

  userQuery.limit = limit;
  if (_.isEmpty(userList)) TE("Params are not set");
  let page = userList.pageNumber != 0 ? userList.pageNumber : 1;
  userQuery.offset = (page - 1) * limit;
  userQuery.raw = true;
  if (userList.keyword) {
    userQuery.where = {    
      [Op.or]:{
        'first_name' :{
          [Op.like]: userList.keyword+'%'
        } ,
        'last_name' :{
          [Op.like]: userList.keyword+'%'
        },    
        'customer_no' :{
          [Op.like]: userList.keyword+'%'
        } 
      }
    

     }
    }


  let [err, user] = await to(Models.users.findAndCountAll(userQuery));

  if (err) TE(err.message);
  paginationOutPut = await CommonService.paginationOutPut(user.rows, page, limit, user.count);
  return paginationOutPut;
}


const profile = async (userList) => {

  let [err, user] = await to(Models.users.findByPk(userList.id));
  if (err) TE(err.message);
  paginationOutPut = await CommonService.paginationOutPut(user, 0, 10, 1);
  return user;
}

const getUser = async (userList,params) => {

  let err;
  const query = {
    where: {},
    raw: true
  }
  
  if(typeof params.userid !== 'undefined'){
    query.where['userid'] = params.userid
   } else {
    query.where['userid'] = userList.id
   }

  [err, user] = await to(Models.users.findOne(query));

  [err, company] = await to(Models[process.env.BC_DB_NAME + "$Customer"].findOne({
    where: { No_: user.customer_no },
    include :{ model: Models[process.env.BC_DB_NAME + '$Ship-to Address']}
  }));
  user.profile_image = user.profileimage? process.env.APP_URL + "/resources/uploads/users/" + user.profileimage  :'';

  user.customerDetails = company;
  if (err) TE(err.message);
  return user;
}

const createUserCredit = async (creditInfo) => {

  let userid = creditInfo.userid;

  if(_.isEmpty(userid)) TE ('Please Select At Least One user');
  
  let userCredit = await Models.users.findOne({ where: { userid: { [Op.in]: creditInfo.userid } } });

  if((userCredit.credit_issued)!= ' ' && (userCredit.credit_issued)!= null){
    creditInfo.credit_issued = parseInt(userCredit.credit_issued) + parseInt(creditInfo.credit_issued); 
  }
  // creditInfo.credit_remaining = creditInfo.credit_issued;
  return await Models.users.update(creditInfo, { where: { userid: { [Op.in]: [creditInfo.userid] } } });
};

module.exports = { create, update, deleteUser, getUsers, profile, getUser, createUserCredit };