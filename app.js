const express = require("express");
require("./db");
const userRouter = require("./routes/user");

const app = express();

//This method will convert everything coming from the front-end to JSON format
app.use(express.json());

app.use('/api/user', userRouter);



app.post('/about', (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return res.json({
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