    const { to, TE, formatDate, incrementNo } = require("../services/util.service");
    const Models = require("../models/model");
    const Sequelize = require("sequelize");
    const dbConnection = require("../data/database/db");
    const Op = Sequelize.Op;
    const _ = require("lodash");
    const CommonService = require("../services/common.service");


    const create = async (companyInfo) => {
      let lastCustomerId = await Models[process.env.BC_DB_NAME + '$No_ Series Line'].findOne({ where: { 'Series Code': 'CUSTOMER' } })
      let tempvar = lastCustomerId.dataValues["Last No_ Used"].toString().substring(1, 8);
      let noSeries = parseInt(lastCustomerId.dataValues["Last No_ Used"].toString().substring(1, 8));

      let incrementedId = noSeries + 1;

      var res = tempvar.slice(-(incrementedId.toString().length));

      let c = tempvar.replace(res, incrementedId)

      let incrementId = 'C' + c;

      /*
        Above code will fetch the last inserted No_ of customer table
        We will increment into it manually and add to customer query
      */

      const contact = companyInfo["Contact"] ? companyInfo["Contact"] : ' ';

      if(companyInfo['Customer Type'] == 1) { // if customer is location
        const [error, parent_company] = await to(
          Models[process.env.BC_DB_NAME + "$Customer"].findOne({
            where: { 'Customer Group' : companyInfo['Customer Group'], 'Customer Type' : 0 },
            attributes: ['COMPANY LOGO','COMPANY Banner Image','Website Payment Type','Home Page','Minimum Order Fee','Primary Color','Secondary Color'],
            raw:true 
          })
        );
  
        if(error) TE(error.message)
  
        companyInfo = { ...companyInfo,...parent_company}
      }

      companyInfo = { ...companyInfo,type:0}

      const addQuery = "INSERT INTO [dbo].[" + process.env.BC_DB_NAME + "$Customer]" +
        "([No_],[Name],[Search Name],[Name 2],[Address],[Address 2]" +
        ",[City],[Contact],[Phone No_],[Telex No_],[Document Sending Profile]" +
        ",[Ship-to Code],[Our Account No_],[Territory Code],[Global Dimension 1 Code],[Global Dimension 2 Code]" +
        ",[Chain Name],[Budgeted Amount],[Credit Limit (LCY)],[Customer Posting Group],[Currency Code]" +
        ",[Customer Price Group],[Language Code],[Statistics Group],[Payment Terms Code],[Fin_ Charge Terms Code]" +
        ",[Salesperson Code],[Shipment Method Code],[Shipping Agent Code],[Place of Export],[Invoice Disc_ Code]" +
        ",[Customer Disc_ Group],[Country_Region Code],[Collection Method],[Amount],[Blocked]" +
        ",[Invoice Copies],[Last Statement No_],[Print Statements],[Bill-to Customer No_],[Priority]" +
        ",[Payment Method Code],[Last Modified Date Time],[Last Date Modified],[Application Method],[Prices Including VAT]" +
        ",[Location Code],[Fax No_],[Telex Answer Back],[VAT Registration No_],[Combine Shipments]" +
        ",[Gen_ Bus_ Posting Group],[Picture],[GLN],[Post Code],[County]" +
        ",[E-Mail],[Home Page],[Reminder Terms Code],[No_ Series],[Tax Area Code]" +
        ",[Tax Liable],[VAT Bus_ Posting Group],[Reserve],[Block Payment Tolerance],[IC Partner Code]" +
        ",[Prepayment _],[Partner Type],[Image],[Privacy Blocked],[Disable Search by Name]" +
        ",[Preferred Bank Account Code],[Cash Flow Payment Terms Code],[Primary Contact No_],[Contact Type],[Responsibility Center]" +
        ",[Shipping Advice],[Shipping Time],[Shipping Agent Service Code],[Service Zone Code],[Allow Line Disc_]" +
        ",[Base Calendar Code],[Copy Sell-to Addr_ to Qte From],[Validate EU Vat Reg_ No_],[Id],[Currency Id]" +
        ",[Payment Terms Id],[Shipment Method Id],[Payment Method Id],[Tax Area ID],[Contact ID]" +
        ",[Contact Graph Id],[ABN],[Registered],[ABN Division Part No_],[IRD No_]" +
        ",[S_T Type],[S_T Expiry Date],[WHT Business Posting Group],[Tax Document Type],[Customer Group]" +
        ",[Note],[Customer Group Code],[Customer Type],[Primary Color],[Secondary Color]" +
        ",[Company Banner Image],[Company Logo],[Website Payment Type],[Minimum Order Fee])" +
        "VALUES('" + incrementId + "','" + companyInfo["Name"] + "',' ',' ','" + companyInfo["Address"] + "','" + companyInfo["Address 2"] + "'"
        + ",'" + companyInfo["City"] + "','" + contact + "','" + companyInfo["Phone No_"] + "',' ',' '"
        + ",' ',' ',' ',' ',' '"
        + ",' ',0.0,0.0,' ','" + companyInfo["Currency Code"] + "'"
        + ",' ',' ',0,' ',' '"
        + ",' ',' ',' ',' ',' '"
        + ",' ','" + companyInfo["Country_Region Code"] + "',' ',0.0,0"
        + ",0,0,0,' ',0"
        + ",0,'" + formatDate(new Date()) + " 00:00:00','" + formatDate(new Date()) + " 00:00:00',0,0"
        + ",' ',' ',' ',' ',0"
        + ",'DOMESTIC',null,' ','" + companyInfo["Post Code"] + "','" + companyInfo["County"] + "'"
        + ",'" + companyInfo["E-Mail"] + "','" + companyInfo["Home Page"] + "',' ',' ',' '"
        + ",0,'DOMESTIC',0,0,' '"
        + ",0.0,0,'00000000-0000-0000-0000-000000000000',0,0"
        + ",' ',' ',' ',0,' '"
        + ",0,' ',' ',' ',1"
        + ",' ',0,0,'CF2F80A3-6304-4A0A-B6E9-E58BDD126CE3','00000000-0000-0000-0000-000000000000'"
        + ",'B4F649D6-D3A9-4F95-B37C-64726A8B21D3','00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','19E84079-F580-4C7E-BDBB-7C6DD9BA971C','00000000-0000-0000-0000-000000000000'"
        + ",' ','" + companyInfo["ABN"] + "',0,' ',' '"
        + ",0,'1753-01-01 00:00:00.000',' ',0,'" + companyInfo["Customer Group"] + "'"
        + ",' ','" + companyInfo["Customer Group Code"] + "','" + companyInfo["Customer Type"] + "','" + companyInfo["Primary Color"] + "','" + companyInfo["Secondary Color"] + "'"
        + ",'" + companyInfo["Company Banner Image"] + "','" + companyInfo["Company Logo"] + "','" + companyInfo["Website Payment Type"] + "','" + companyInfo["Minimum Order Fee"] + "')"


   //   let findCompany = await dbConnection.query("SELECT Name FROM "+process.env.BC_DB_NAME+"$Customer WHERE [Name] = '"+companyInfo["Name"] +"'");
      let findCompany = await Models[process.env.BC_DB_NAME + "$Customer"].findOne({ where: { Name: companyInfo.Name }, raw: true });
      // console.log(findCompany);
      if (_.isEmpty(findCompany)) {
        await dbConnection.query(
          addQuery
        );
        await createContact(companyInfo)

        return await Models[process.env.BC_DB_NAME + '$No_ Series Line'].update({ 'Last No_ Used': incrementId }, {
          where: {
            'Series Code': 'CUSTOMER'
          }
        });
      } else {
        TE("Company Already Exists");
      }
    }

const createContact =  async(companyInfo) => {

  let lastId = await Models[process.env.BC_DB_NAME + '$No_ Series Line'].findOne({ where: { 'Series Code': 'CONTACT' } })
  let tempvar = lastId.dataValues["Last No_ Used"].toString().substring(2, 12);

  console.log(lastId.dataValues["Last No_ Used"]);
  
  let noSeries = parseInt(lastId.dataValues["Last No_ Used"].toString().substring(2, 12));

  let incrementedId = noSeries + 1;


  var res = tempvar.slice(-(incrementedId.toString().length));


  let c = tempvar.replace(res, incrementedId)


  let incrementId = 'CT' + c;

  console.log('incrementId',incrementId);

  
  const query = "INSERT INTO [dbo].[" + process.env.BC_DB_NAME + "$Contact]"+
            "([No_],[Name],[Search Name],[Name 2],[Address]"+
            ",[Address 2],[City],[Phone No_],[Telex No_],[Territory Code]"+
            ",[Currency Code],[Language Code],[Salesperson Code],[Country_Region Code],[Last Date Modified]"+
            ",[Fax No_],[Telex Answer Back],[VAT Registration No_],[Picture],[Post Code]"+
            ",[County],[E-Mail],[Home Page],[No_ Series],[Image],"+
            "[Privacy Blocked],[Minor],[Parental Consent Received],[Type],[Company No_]"+
            ",[Company Name],[Lookup Contact No_],[First Name],[Middle Name],[Surname]"+
            ",[Job Title],[Initials],[Extension No_],[Mobile Phone No_],[Pager]"+
            ",[Organizational Level Code],[Exclude from Segment],[External ID],[Correspondence Type],[Salutation Code]"+
            ",[Search E-Mail],[Last Time Modified],[E-Mail 2],[Xrm Id],[ABN]"+
            ",[Registered],[ABN Division Part No_],[IRD No_],[Hubspot No_],[Associated Company No_])"+
      "VALUES"+
            "('" + incrementId + "','" + companyInfo["Name"] + "',' ',' ','" + companyInfo["Address"] + "'"+
            ",'" + companyInfo["Address 2"] + "','" + companyInfo["City"] + "','" + companyInfo["Phone No_"] + "',' ', ' ' "+
            ",' ',' ','DANNY KORDAHI','" + companyInfo["Country_Region Code"] + "','" + formatDate(new Date()) + " 00:00:00'"+
            ",' ',' ',' ',' ','" + companyInfo["Post Code"] + "'"+
            ",'" + companyInfo["county"] + "','" + companyInfo["E-Mail"] + "','" + companyInfo["Home Page"] + "','CONTACT','00000000-0000-0000-0000-000000000000'"+
            ",0, 0,0," + companyInfo["type"] + ",'" + incrementId + "',"+
            "'" + companyInfo["Name"] + "',' ','" + companyInfo["Name"] + "',' ',' '"+
            ",' ',' ',' ',' ',' '"+
            ",' ',0,' ',0,'  '"+
            ",'" + companyInfo["E-Mail"] + "','1754-01-01 10:29:51.837',' ','00000000-0000-0000-0000-000000000000','" + companyInfo["ABN"] + "'"+
            ",0,' ',' ',' ',' ')"

    let result = await dbConnection.query(query);


    return await Models[process.env.BC_DB_NAME + '$No_ Series Line'].update({ 'Last No_ Used': incrementId }, {
      where: {
        'Series Code': 'CONTACT'
      }
    });
            
}
    const update = async (companyInfo) => {
      console.log(companyInfo);
      return await Models[process.env.BC_DB_NAME + "$Customer"].update(companyInfo, { where: { Name: companyInfo.Name } });
    };

    const deleteCompany = async (companyInfo) => {
      return await Models.DKM$Customer.destroy({ where: { Name: companyInfo.Name } });
    };


    const getCompanies = async (param) => {
      let limit = 10;
      companyQuery = {
        where: {},
      };

      companyQuery.limit = limit;
      if (_.isEmpty(param)) TE("Params are not set");
      let page = param.pageNumber != 0 ? param.pageNumber : 1;
      companyQuery.offset = (page - 1) * limit;

      companyQuery.where["Customer Type"] = 0;


      let rawQuery = 'SELECT c.No_ ,c.Name ,c.[Customer Type],c.[Company Logo],' +
        ' ( SELECT count(*) FROM [' + process.env.BC_DB_NAME + '$Customer] AS c2  WHERE c2.[Customer Type] = 1 AND c.[CUSTOMER GROUP] = c2.[CUSTOMER GROUP] ) as locations ' +
        ' FROM [' + process.env.BC_DB_NAME + '$Customer] AS c' +
        ' WHERE c.[Customer Type] = 0';

      //Sort  by
      let orderValue = param.sortByOrder == 1 ? "ASC" : "DESC"
      let orderType = param.sortByColumn == 1 ? "Name" : "No_"

      if (param.keyword)
        console.log("helllo param");
      rawQuery += " AND c.Name LIKE '%" + param.keyword + "%'";
      rawQuery += " ORDER BY c." + orderType + " " + orderValue;
      rawQuery += " OFFSET " + (page - 1) * limit + " ROWS FETCH NEXT " + limit + " ROWS ONLY";


      let [error, TotalCompanies] = await to(
        Models[process.env.BC_DB_NAME + "$Customer"].count(companyQuery)
      );

      if (error) TE(error.message);

      const companies = await dbConnection.query(rawQuery);

      let customers = companies[0].map(company => company.No_)

      let [err, users] = await to(Models.users.findAndCountAll(
        {
          where: { customer_no: customers },
          raw: true
        }));

      if (err) TE(err.message);

      const companyList = [];

      companies[0].map(async (company, index) => {

        // this will filter the customer and get the active count user for compnay
        let filteredUser = await users.rows.map(user => {
          if (user.customer_no == company.No_) {
            return process.env.APP_URL + "/resources/uploads/users/" + user.profileimage
          }

        })

        console.log('filteredUser', filteredUser);
        let finalFilter = _.compact(filteredUser);
        companyList.push({
          ...company,
          active_user: finalFilter.length,
          profile_image: finalFilter.length > 0 ? finalFilter.slice(0, 3) : [],
          logo: process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo']
        })

      })

      paginationOutPut = await CommonService.paginationOutPut(
        companyList,
        page,
        limit,
        TotalCompanies
      );

      return paginationOutPut;

    };

    const getCompany = async (query) => {
      let [err, company] = await to(
        Models[process.env.BC_DB_NAME + "$Customer"].findByPk(query.customer_no)
      );

      company['COMPANY LOGO'] = process.env.APP_URL + "/resources/uploads/company/" + company['COMPANY LOGO'];
      company['COMPANY Banner Image'] = process.env.APP_URL + "/resources/uploads/company/" + company['COMPANY Banner Image'];

      if (err) TE(err.message);
      return company;
    }



    const getLocations = async (locationList) => {
      let limit = 10;

      //sorting
      if (locationList.sortByOrder && locationList.sortByColumn) {
        let orderValue = locationList.sortByOrder == 1 ? "ASC" : "DESC";
        let orderType = locationList.sortByColumn == 1 ? "Name" : "No_";

        locationQuery = {
          where: {},
          order: [[orderType, orderValue]],
          attributes: ["No_", "Name"],
          raw: true,
        };
      } else {
        locationQuery = {
          where: {},
          order: [["No_", "DESC"]],
          attributes: ["No_", "Name"],
          raw: true,
        };
      }

      locationQuery.limit = limit;
      if (_.isEmpty(locationList)) TE("Params are not set");
      let page = locationList.pageNumber != 0 ? locationList.pageNumber : 1;
      locationQuery.offset = (page - 1) * limit;
      locationQuery.raw = true;
      locationQuery.where.Name = {
        [Op.like]: `%${locationList.keyword}%`,
      };
      locationQuery.where["Customer Type"] = 1;
      locationQuery.where["Customer GROUP"] = locationList.customer_group;

      let [err, location] = await to(
        Models[process.env.BC_DB_NAME + "$Customer"].findAndCountAll(locationQuery)
      );
      if (err) TE(err.message);
      paginationOutPut = await CommonService.paginationOutPut(location.rows, page, limit, location.count);
      return paginationOutPut;
    };



    module.exports = { create, update, deleteCompany, getCompanies, getLocations, getCompany,createContact }
