
// Middlewear for error handling for try and catch (error) block and import it in app.js
exports.errorHandler= (err, req, res, next) => {
    console.log("err", err)
    res.status(500).json({error: err.message || err })
}