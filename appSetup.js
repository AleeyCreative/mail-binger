const router = require('./router')
const ejs = require('ejs')
module.exports = async (app) => {
    app.set('view engine', 'ejs')
    app.use('/', router)

}