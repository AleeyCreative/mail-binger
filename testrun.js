const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const buffer = require('buffer')
const simpleParser = require('mailparser').simpleParser

// If modifying these scopes, delete token.json.
const SCOPES = [
'https://mail.google.com',
'https://www.googleapis.com/auth/gmail.readonly',
'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
'https://www.googleapis.com/auth/gmail.addons.current.message.action',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    let gmailObj = google.gmail({version:'v1', auth: oAuth2Client})
    callback(gmailObj);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES,
  });
  console.log('url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('CDD: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      let gmailObj = google.gmail({version:'v1', auth: oAuth2Client})
      callback(gmailObj);
    });
  });
}


 async function listMessages(gmailObj) {   
   try {
     let q = "in:inbox is:unread after:2020/11/2  before:2020/11/18"
     let res = await gmailObj.users.messages.list({
      userId: 'me',
      q
      })
      console.log('res.data',res.data)
      let messages = await loadMessages(gmailObj, res.data.messages)
      console.log(messages)
   } catch(e) {
     console.log(e)
   } 
 }


 async function loadMessages(gmailObj, messages = [ { id: '175bde7246e7d9e0', threadId: '175bde7246e7d9e0' }]) {
   let messagesContent = []
   fs.writeFileSync("mail.txt", "ALL MAILS READ")
   for(let msg of messages) {
     let res = await gmailObj.users.messages.get({
       userId:'me',
       id: msg.id,
     })
     
     let messageText = Buffer.from(res.data.payload.parts[0].body.data, 'base64').toString('utf-8')
    //  let messageText = await simpleParser(res.data.payload.parts[0].body)
     console.log(messageText)

     let barrier = "*".repeat(10)
     fs.appendFileSync("mail.txt", barrier)
     fs.appendFileSync("mail.txt",messageText)
     messagesContent.push(messageText)
   }
   
   console.log(messagesContent)
   return messagesContent
 }




 