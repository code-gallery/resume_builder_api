const {to} = require('await-to-js');
const pe = require('parse-error');
const {loggers,clearLogs} = require('../loggers/loggers');
const fs = require('fs');


module.exports.to = async (promise) => {

    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];

    return [null, res];
};

module.exports.ReE = function (res, err, code) { //Error Web Response
    if(typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
        loggers.error('Utill Service ReE :' + err);
    }
    if (typeof code !== 'undefined') {
        res.statusCode = 200;
    } else {
        res.statusCode = 400;
    }
    return res.json({success: false, error: err});
}

module.exports.ReS = function (res, data, code, start) {
    let send_data = {};

    send_data.success = true;
    send_data.time = new Date().getTime() - start;
    if (typeof data == 'object') {
        send_data.result = data; //merge the objects
    }
    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data);
}

module.exports.TE = TE = function (err_message, log) { // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
        loggers.error('Util Service TE :' +err_message);
    }
    loggers.error('Util Service TE :'+ err_message);
    throw new Error(err_message);
}

module.exports.formatDate = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports.incrementNo = function (No) {

    let res = parseInt(No.replace(/\D/g, ""));

    return res+1;

}


module.exports.totalIncGST = function (totalExGST,currency= 'AUD') {

    const total  = currency == 'NZ' ? totalExGST / 15 : totalExGST / 10;

    return total.toFixed(2)
}

module.exports.readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        throw err;
      }
      else {
        return callback(null, html);
      }
    });
  };