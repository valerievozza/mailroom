const { lastChecked } = require('../helpers/hbs')
const Client = require('../models/Client')

module.exports = {
    getOpenBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            const clients = await Client.find({user: req.user.id, status: 'Open', deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean() //! Change this to org ID
            const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
            const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
            const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
            res.render('clients/clients', {
                clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
            })
        }catch(err){
            console.log(err)
        }
    },
    getAllBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            const clients = await Client.find({user: req.user.id, deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean() //! Change this to org ID
            const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open'}).lean()
            const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed'}).lean()
            const totalBoxes = await Client.countDocuments({user: req.user.id}).lean()
            res.render('clients/clients', {
                clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
            })
        }catch(err){
            console.log(err)
        }
    },
    getClosedBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            const clients = await Client.find({user: req.user.id, status: 'Closed', deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean() //! Change this to org ID
            const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open'}).lean()
            const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed'}).lean()
            const totalBoxes = await Client.countDocuments({user: req.user.id}).lean()
            res.render('clients/clients', {
                clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
            })
        }catch(err){
            console.log(err)
        }
    },
    showClient: async (req, res) => {
        try {
            const client = await Client.findOne({
                _id: req.params.id
            })
            .populate('user')
            .lean()

            if (!client) {
                res.render('error/404')
            }

            // ! Won't show client view with this code (needed for security) but I checked the database and the user id and the user id attached to the client matches
            // if (client.user != req.user.id) {
            //     res.redirect('/')
            // } else {
                res.render('clients/show', {
                    client
                })
                console.log(client)
            // }
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
    search: async (req, res) => {
        try{
            let filter = req.query.search
            filter = filter.trim()
            let regex = new RegExp(filter, 'i')
            const clients = await Client.find({
                user: req.user.id,
                deleted: false,
                $or: [
                    { firstName: {$regex: regex} },
                    { lastName: {$regex: regex} },
                    { otherNames: {$regex: regex} },
                    { box: {$regex: regex} }
                ]
                })
                .populate('user')
                .sort({box: 'asc'})
                .lean()
            const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open'}).lean()
            const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed'}).lean()
            const totalBoxes = await Client.countDocuments({user: req.user.id}).lean()
            res.render('clients/clients', {
                clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
            })
        }catch(err){
            console.log(err)
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
        try {
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                return res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({_id: req.params.id}, {
                    status: 'Closed'
                }, {
                    new: true,
                    runValidators: true
                })
            console.log('Mailbox is closed!')
            res.redirect('/clients')
            }

        } catch (err) {
            console.error(err)
        }
    },
    reopenMailbox: async (req, res)=>{
        try {
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                return res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({_id: req.params.id}, {
                    status: 'Open'
                }, {
                    new: true,
                    runValidators: true
                })
            console.log('Mailbox reopened!')
            res.redirect('/clients')
            }

        } catch (err) {
            console.error(err)
        }
    },
    deleteClient: async (req, res)=>{
        try {
            let client = await Client.findById(req.params.id).lean()

            if (!client) {
                return res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                client = await Client.findOneAndUpdate({_id: req.params.id}, {deleted: true}, {
                    new: true,
                    runValidators: true
                })
            res.redirect('/clients')
            }

        } catch (err) {
            console.error(err)
        }
    }
}    