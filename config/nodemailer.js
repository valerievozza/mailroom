const nodemailer = require("nodemailer");
const mongoose = require('mongoose')
const session = require('express-session')
const { google } = require("googleapis");
const Client = require("../models/Client");
const User = require("../models/User");
const OAuth2 = google.auth.OAuth2;
const { isInactive } = require("../helpers/hbs");

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (reminder) => {
  reminder = {
    subject: "Your mailbox is inactive",
    text: `Hello ${client.firstName}\n\nThis is a reminder that you must check your mail every two months, otherwise your mailbox will be closed.\n\nTo keep your mailbox open, please respond to this message. You may also check your mail by phone or in person.\n\nThank you`,
    to: "valerievozza@gmail.com",
    from: process.env.EMAIL
  }
  try {
    
    const user = await User.findById(req.user.id).populate('org').lean()
    const org = req.user.org
    const clients = await Client.find({
      org: org,
      status: 'Open',
      deleted: false
    })
      .populate('user org')
      .sort({'box.letter': 'asc', 'box.number': 'asc'})
      .lean()
    
    for (client of clients) {
      
      if (isInactive(mailChecks)) {
        
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(reminder);
        
      }
    }
    
    
  } catch (error) {
    console.log(error)
  }
  
};

module.exports = sendEmail
