const express = require("express");
require('express-async-errors')
const morgan = require("morgan");
const { errorHandler } = require("./middlewear/error");
const cors = require('cors')


require("dotenv").config()
require("./db");


const userRouter = require("./routes/user");
const { handleNotFound } = require("./utils/helper");

const app = express();
app.use(cors())
//This method will convert everything coming from the front-end to JSON format
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/user', userRouter);


app.use('/*', handleNotFound)

// coming from middlewear .. install a package express-async-errors for handleing instead of try and catch block
app.use(errorHandler)


app.post('/about', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.json({
        error: 'email/password missing!'
    })
    next()
},   
    (req, res) => {
        res.send('<h1>Developer world</h1>')
    })

app.listen(8000, () => {
    console.log('This port is running in 8000')
})