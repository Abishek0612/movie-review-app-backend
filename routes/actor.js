const express = require('express');
const { createActor } = require('../controllers/actor');
const { uploadImage } = require('../middlewear/multer');
const { actorInfoValidator, validate } = require('../middlewear/validator');
const router = express.Router();

//uploadImage coming from middlewear and we are using single coz we need to accept only single image
//(we are use ('avatar' )coz inside postman we are using avatar)
//actorInfoValidator and validate coming from validator.js
router.post('/create', uploadImage.single('avatar'), actorInfoValidator, validate, createActor);


module.exports = router;