const multer = require('multer');
//for storage we creating storage 
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    //to check if the mimetype is image file or not. we will accept only image file. we will make it false
    //otherwise move to next callback
    if(!file.mimetype.startsWith('image')){
        cb('Supported only image files', false)
    }
    //inside callback we will have 2 argument one is error and true or false
    cb(null, true)
}

//now we are configuring and exporting it to routes/actor.js as middlewear
exports.uploadImage = multer({ storage, fileFilter })