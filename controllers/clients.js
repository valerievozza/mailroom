const { lastChecked } = require('../helpers/hbs')
const Client = require('../models/Client')

module.exports = {
    getClient: async (req,res)=>{
        console.log(req.user)
        try{
            const clients = await Client.find({user: req.user.id})
                .sort({box: 'asc'})
                .lean() //! Change this to org ID
            const openBoxes = await Client.countDocuments({user: req.user.id, status: 'open'}).lean()
            res.render('clients/clients', {
                clients
            })
        }catch(err){
            console.log(err)
        }
    },
    showClient: async (req, res) => {
        try {
            const client = await Client.findOne({
                _id: req.params.id
            }).lean()

            if (!client) {
                res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                res.render('clients/show', {
                    client
                })
                console.log(client)
            }

            res.render('clients/show')
        } catch (err) {
            console.error(err)
        }
    },
    addPage: (req,res)=>{
        res.render('clients/add')
    },
    createClient: async (req, res)=>{
        try{
            req.body.user = req.user.id
            await Client.create(req.body)
            console.log('Client saved to database')
            res.redirect('/clients')
        }catch(err){
            console.log(err)
            //! render error page
        }
    },
    editClient: async (req, res) => {
        try {
            const client = await Client.findOne({
                _id: req.params.id
            }).lean()

            if (!client) {
                return res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                res.render('clients/edit', {
                    client
                })
                console.log(client)
            }

        } catch (err) {
            console.error(err)
        }
    },
    updateClient: async (req, res) => {
        try {
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                return res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({_id: req.params.id}, req.body, {
                    new: true,
                    runValidators: true
                })
            res.redirect('/clients')
            }

        } catch (err) {
            console.error(err)
        }
    },
    markChecked: async (req, res)=>{
        try{
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({ _id: req.params.id }, { lastChecked: new Date(), $push: {mailChecks: new Date()} }, {
                    new: true,
                    runValidators: true
                })
                res.redirect('/clients')
            }
        
            console.log('Mailbox Checked!')
        } catch(err){
            console.log(err)
        }
    },
    markUnchecked: async (req, res)=>{
        try{
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({ _id: req.params.id }, { $pop: {mailChecks: 1} }, {
                    new: true,
                    runValidators: true
                })
                res.redirect('/clients')
            }

            console.log('Last mailbox check deleted!')
        } catch(err){
            console.log(err)
        }
    },
    closeMailbox: async (req, res)=>{
        try{
            await Client.findOneAndUpdate({_id:req.body.clientIdFromJSFile},{
                completed: true
            })
            console.log('Mailbox Closed')
            res.json('Mailbox Closed')
        }catch(err){
            console.log(err)
        }
    },
    openMailbox: async (req, res)=>{
        try{
            await Client.findOneAndUpdate({_id:req.body.clientIdFromJSFile},{
                completed: false
            })
            console.log('Mailbox Open')
            res.json('Mailbox Open')
        }catch(err){
            console.log(err)
        }
    },
    deleteClient: async (req, res)=>{
        try{
            await Client.remove({ _id: req.params.id })
            console.log('Client deleted from database')
            res.redirect('/clients')

        }catch(err){
            console.log(err)
        }
    }
}    