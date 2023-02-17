const express = require("express");
require("./db");
require("dotenv").config()
const userRouter = require("./routes/user");
const morgan = require("morgan")

const app = express();

//This method will convert everything coming from the front-end to JSON format
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/user', userRouter);


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