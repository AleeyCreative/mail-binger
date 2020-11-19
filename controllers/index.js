const authClient = require('../authClient')
const fs = require('fs')

async function home(req,res) {
    res.render('pages/index.ejs')
}

async function callbackHandler(req,res) {
    try {
        let token = await authClient.getToken(req.query.code)
        let savedCredentials = await authClient.setCredentials(token)
        let saved = fs.writeFileSync('../token.json', JSON.stringify(token))
        res.headers['x-access-token'] = token
        res.redirect('/dashboard')
    } catch(e){
        console.log(e.message)
    }
}




async function saveToken(auth, code) {
    return new Promise((resolve, reject) => {
        const tokenPath = "./token.js"
        auth.getToken(code, (err, token) => {
        if(err) return reject(err)
        auth.setCredentials(token)
        fs.writeFileSync(tokenPath, JSON.stringify(token))
        return resolve(auth)
        })
    })
}










module.exports = {
    home, 
    callbackHandler,
    // user,
    // edit,
    // aggregate
}