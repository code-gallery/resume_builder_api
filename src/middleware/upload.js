// const util = require("util");
// const multer = require("multer");
// const maxSize = 3 * 1024 * 1024;

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       console.log(req, file);
//     cb(null, __basedir + "../../resources/static/assests/uploads/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");

// // let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFile;



const multer = require('multer');
const path = require('path');
const IMAGE_TYPES = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg',"multipart/form-data"];
const VIDEO_TYPES = ["video/webm", "video/mp4", "video/mov","multipart/form-data","webm"];

const FILE_TYPES = {
  image: 'image',
  video: 'video'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       if(req.body.folderType == 0){
        cb(null, 'resources/uploads/users');
       }else{
        cb(null, 'resources/uploads/company');
       }
    },
    filename: function (req, file, cb) {
        if(path.extname(file.originalname).toLowerCase()==".webm"){
        file.originalname = path.basename(file.originalname, '.webm')+'.mp4'
        cb(null, 'DKMBLUE' + '-' + Date.now() + ".mp4");
        }else{
            if(req.body.folderType == 0){
                cb(null, 'DKM_USER' + '-' + Date.now() + path.extname(file.originalname));
            }else{
                cb(null, 'DKM_COMPANY' + '-' + Date.now() + path.extname(file.originalname));
            }
        
      }
    },
});

const fileFilter = function (req, file, cb) {
  
    if (!VIDEO_TYPES.includes(file.mimetype) && !IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new Error(file.mimetype+'Image or photo format is not supported'));
    }
    // let ext = file.originalname.split(".")[1];
    // if (!VIDEO_TYPES.includes(ext) && !IMAGE_TYPES.includes(ext)) {
    // return cb(new Error(file.mimetype+ 'Image or photo format is not supported'));
    // }  

    file.fileType = FILE_TYPES.image;

    if (VIDEO_TYPES.includes(file.mimetype)) {
        if (file.mimetype == 'video/webm' || file.mimetype == 'webm') {
            file.fileType = 'video/mp4';
            file.mimetype = 'video/mp4';
        } else {
            file.fileType = FILE_TYPES.video;
        }
    }
    cb(null, true);
};
// limits: {fileSize: 1024 * 1024 * 5000000} // XX megabytes limit for upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 1000} // XX megabytes limit for upload
});

module.exports = upload;

