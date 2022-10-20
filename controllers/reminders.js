const cloudinary = require("../middleware/cloudinary");
const { lastChecked, isInactive, checkSafety } = require('../helpers/hbs')
const Client = require('../models/Client')
const Org = require('../models/Org')
const User = require('../models/User')
const Reminder = require('../models/Reminder')
const createTransporter = require('../config/nodemailer')

module.exports = {
  // // Show all reminders
  // router.get('/', ensureAuth, reminderController.getReminders)

  // // Show single reminder
  // router.get('/:id', ensureAuth, reminderController.getReminder)

  // Show add reminder page
  getAddReminder: async (req, res) => {
    res.render('reminders/add')
  },

  // Save reminder
  createReminder: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate('org')
        .lean()
      const org = req.user.org
      await Reminder.create({
        message: req.body.message,
        subject: req.body.subject,
        label: req.body.label,
        user: user,
        org: user.org
      })

      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
    }
  },

  getEditReminder: async (req, res) => {
    try {
      const reminder = await Reminder.findOne({
          org: req.user.org
        }).lean()

        if (!reminder) {
            return res.render('error/404')
        }

        if (reminder.org != req.user.org) {
            res.redirect('/dashboard')
        } else {
            res.render('reminders/edit', {
                reminder
            })
            console.log(reminder)
        }
        } catch (err) {
          console.error(err)
      }
  },

  // TODO: FIX not saving update
  updateReminder: async (req, res) => {
    try {
      let reminder = await Reminder.findOneAndUpdate({org: req.user.org}, req.body, {
          new: true,
          runValidators: true
      })
      res.redirect('/dashboard')
  //  }

    } catch (err) {
        console.error(err)
    }
  },

  // TODO: Check for safety concern before sending (confirmation modal?)

  // TODO: Add confirmation that reminder is sent (and maybe track date(s) sent)
  sendReminder: async (req, res) => {
    try {
      
      const user = await User.findById(req.user.id).populate('org').lean()
      let org = await Org.findById(user.org).lean()
      const client = await Client.findById(req.params.id)
        .populate('user org')
        .sort({'box.letter': 'asc', 'box.number': 'asc'})
        .lean()
      let reminder = await Reminder.findOne({
        org: org
      })
        .populate('user org')
        .lean()

       const email = {
        subject: reminder.subject,
        text: `Hello ${client.firstName},\n\n${reminder.message}\n\nSincerely,\n${user.username}\n${org.org}`,
        to: client.email,
        from: `${org.org} <${process.env.EMAIL}>`,
        replyTo: `${org.org} <${user.email}>`

      }
      //if (isInactive(mailChecks)) {
        
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(email);
        
      //}
      // for (client of clients) {
      //   reminder = {
      //     subject: "Your mailbox is inactive",
      //     text: `Hello ${client.firstName}\n\nThis is a reminder that you must check your mail every two months, otherwise your mailbox will be closed.\n\nTo keep your mailbox open, please respond to this message. You may also check your mail by phone or in person.\n\nThank you`,
      //     to: client.email,
      //     from: user.email
      //   }
      //   if (isInactive(mailChecks)) {
          
      //     let emailTransporter = await createTransporter();
      //     await emailTransporter.sendMail(reminder);
          
      //   }
      // }
      console.log(email)
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error)
    }
    
  },

  // TODO: Check for safety concern before sending (confirmation modal?)

  sendRemindersToAll: async (req, res) => {
    try {
      
      const user = await User.findById(req.user.id).populate('org').lean()
      let org = await Org.findById(user.org).lean()
      let clients = await Client.find({
        org: org
      })
        .populate('user org')
        .sort({'box.letter': 'asc', 'box.number': 'asc'})
        .lean()
      let reminder = await Reminder.findOne({
        org: org
      })
      .populate('user org')
      .lean()

      clients = clients.filter(client => isInactive(client.mailChecks) === true)
      console.log(clients)
       
      for (client of clients) {
        const email = {
          subject: reminder.subject,
          text: `Hello ${client.firstName},\n\n${reminder.message}\n\nSincerely,\n${user.username}\n${org.org}`,
          to: `${client.firstName} ${client.lastName} <${client.email}>`,
          from: `${org.org} <${process.env.EMAIL}>`,
          replyTo: `${org.org} <${user.email}>`
        }

      console.log(email)
          
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(email);
          
       
      }
      console.log(`Subject: ${reminder.subject}, Message ${reminder.message} sent to ${JSON.stringify(clients)}`)
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error)
    }
    
  },

  // // Get edit reminder page
  // router.get('/edit/:id', ensureAuth, reminderController.getEditReminder)

  // // Update reminder
  // router.put('/edit/:id', ensureAuth, reminderController.updateReminder)

  // // Delete reminder
  // router.put('/delete/:id', ensureAuth, reminderController.deleteReminder)
}