const companyService = require("../../services/company.service");
const { to, ReE, TE, ReS } = require('../../services/util.service');


//type 0 for create, type 1 for update, type 2 for delete
const addEditCompany = async (req, res) => {

  let err, companyDetails, msg;
  let start = new Date();
  console.log("req.body", req.body);
  let companyInfo  = req.body;

  if (companyInfo.type == 0) {
    if (companyInfo['Customer Type'] == 0) {
      if (req.files.bannerImage && req.files.logoImage) {
        companyInfo['Company Banner Image'] = req.files.bannerImage[0].filename;
        companyInfo['Company Logo'] = req.files.logoImage[0].filename;
      } else {
        return ReE(res, "Company Logo and Banner Image is required", 200);
      }
    }
  
    [err, companyDetails] = await to(companyService.create(companyInfo));
    if (err) return ReE(res, err, 200);
    msg = "Company Added Successfully";
  } else if (companyInfo.type == 1) {
    [err, companyDetails] = await to(companyService.update(companyInfo));
    if (err) return ReE(res, err, 200);
    msg = "Company Details Updated successfully";
  } else if (companyInfo.type == 2) {
    [err, companyDetails] = await to(companyService.deleteCompany(companyInfo));
    if (err) return ReE(res, err, 200);
    msg = "Company Deleted successfully";
  } else {
    TE("Somthing wrent wrong");
  }
  return ReS(res, {
    message: msg,
  }, 200, start);
};


const getCompanies = async function (req, res) {

  let err;
  let start = new Date();
  const companyList = req.query;
  [err, company] = await to(companyService.getCompanies(companyList));
  if (err) return ReE(res, err, 200);

  return ReS(res, company, 200, start);
};

const getCompany = async function (req, res) {

  let err;
  let start = new Date();

  [err, company] = await to(companyService.getCompany(req.query));
  if (err) return ReE(res, err, 200);

  return ReS(res, company, 200, start);
};


const getLocations = async function (req, res) {

  let err, location;
  let start = new Date();
  const locationList = req.query;

  [err, location] = await to(companyService.getLocations(locationList));
  if (err) return ReE(res, err, 200);

  return ReS(res, location, 200, start);
};


//type 0 for create, type 1 for update, type 2 for delete
const addEditLocation = async (req, res) => {

  let err, userDetails, msg;
  let start = new Date();
  const locationInfo = req.body;
  if (locationInfo.type == 0) {
    [err, userDetails] = await to(companyService.create(locationInfo));
    if (err) return ReE(res, err, 200);
    msg = "Location Added successfully";
  } else if (locationInfo.type == 1) {
    [err, userDetails] = await to(companyService.update(locationInfo));
    if (err) return ReE(res, err, 200);
    msg = "Location Details Updated successfully";
  } else if (locationInfo.type == 2) {
    [err, userDetails] = await to(companyService.deleteCompany(locationInfo));
    if (err) return ReE(res, err, 200);
    msg = "Location Deleted successfully";
  } else {
    TE("Somthing wrent wrong");
  }
  return ReS(res, {
    message: msg,
  }, 200, start);
};


module.exports = { getCompanies, getCompany, addEditCompany, addEditLocation, getLocations };
