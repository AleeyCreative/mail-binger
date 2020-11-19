const {google} = require('googleapis')
/**
 * Module that creates a google OAuth2Client object and exports it
 * @exports {object} oauth2client the oauth2client object
 */
const fs = require('fs')
const { oauth2 } = require('googleapis')

const crendentials = JSON.parse(fs.readFileSync('./credentials.json'))
const {client_secret, cliend_id, redirect_uris} = credentials
const oauth2client = google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
module.exports = oauth2client