const Actor = require('../models/actor')
//instal cloudinary and import it(refer documentation)
const cloudinary = require('cloudinary').v2

//copy it from cloudinary documentation to config (we have imported api key, name and secret key in .env refer to it)
cloudinary.config({
    cloud_name: 'process.env.CLOUD_NAME',
    api_key: 'process.env.CLOUD_API_KEY',
    api_secret: 'process.env.CLOUD_API_SECRET',
    secure: true
    //we are using secure true coz when ever we store our file in cloudinary it stores as url as https
    // none gone be secure then https so we are using secure true
});

exports.createActor = async (req, res) => {
    const { name, about, gender } = req.body;
    //for file we destructuring seperately
    const { file } = req

    const newActor = new Actor({ name, about, gender });
    // cloudinary.upload coming from cloudinary docummentation tp upload our image to cloudinary
  const uploadRes =  await cloudinary.uploader.upload(file.path);
  console.log(uploadRes)
  res.send("ok")
}