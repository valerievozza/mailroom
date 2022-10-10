const cloudinary = require("../middleware/cloudinary");
const { lastChecked, checkSafety } = require('../helpers/hbs')
const { google } = require('googleapis')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const Client = require('../models/Client')
const Spreadsheet = require('../models/Spreadsheet')
const User = require('../models/User')

module.exports = {
    connectSheets: async (req, res) => {

        try{           
            const spreadsheet = new GoogleSpreadsheet(req.body.spreadsheet)

            await spreadsheet.useServiceAccountAuth({
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
            })
            console.log(`Spreadsheet ${spreadsheet} connected`)

            req.body.user = req.user.id
            await Spreadsheet.create(req.body)

            console.log(`Spreadsheet ID saved to database\n${spreadsheet}`)
            
            res.redirect('/dashboard')

        }catch(error){
            console.log(error)
            res.render('error/500')
        }
    },
    getOpenBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            // Find spreadsheet ID in database
            let spreadsheet = await Spreadsheet.findOne({
                user: req.user.id
            }).select('spreadsheet')
            

            // If spreadsheet is found, instantiate spreadsheet with ID
            if (spreadsheet) {
                spreadsheet = spreadsheet.spreadsheet
                console.log(`Spreadsheet ID is ${spreadsheet}`)
                spreadsheet = new GoogleSpreadsheet(spreadsheet)

                // auth access to spreadsheet
                await spreadsheet.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })

                // get data from spreadsheet
                await spreadsheet.loadInfo()
                
                // get open box count
                let openBoxes = spreadsheet.sheetsByTitle['Open']
                    openBoxes = await openBoxes.getRows()
                    openBoxes = openBoxes.filter(row => row.lastName).length
                console.log(`${openBoxes} open boxes`)

                // get open box count
                let closedBoxes = spreadsheet.sheetsByTitle['Closed']
                    closedBoxes = await closedBoxes.getRows()
                    closedBoxes = closedBoxes.filter(row => row.lastName).length
                console.log(`${closedBoxes} closed boxes`)

                // get total box count
                let totalBoxes = openBoxes + closedBoxes
                console.log(`${totalBoxes} total boxes`)

                // Get open boxes
                let clients = await spreadsheet.sheetsByTitle['Open'].getRows()
                
                res.render('clients/clients', {
                    clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
                })
            
                // If no spreadsheet, check DB for clients
            } else {

                // Find clients
                let clients = await Client.find({user: req.user.id, status: 'Open', deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean()

                // get open box count
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
                // get closed box count
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
                // get total box count
                const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
                })   
            }
        }catch(err){
            console.error(err)
            res.render('error/500')
        }
    },

    // ! FIX FIX FIX
    getAllBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            // Find spreadsheet ID in database
            let spreadsheet = await Spreadsheet.findOne({
                user: req.user.id
            }).select('spreadsheet')

            // If spreadsheet is found, instantiate spreadsheet with ID
            if (spreadsheet) {
                spreadsheet = spreadsheet.spreadsheet
                console.log(`Spreadsheet ID is ${spreadsheet}`)
                spreadsheet = new GoogleSpreadsheet(spreadsheet)

                // auth access to spreadsheet
                await spreadsheet.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })

                // get data from spreadsheet
                await spreadsheet.loadInfo()
                
                // get open box count
                let openBoxes = spreadsheet.sheetsByTitle['Open']
                    openBoxes = await openBoxes.getRows()
                    openBoxes = openBoxes.filter(row => row.lastName).length
                console.log(`${openBoxes} open boxes`)

                // get open box count
                let closedBoxes = spreadsheet.sheetsByTitle['Closed']
                    closedBoxes = await closedBoxes.getRows()
                    closedBoxes = closedBoxes.filter(row => row.lastName).length
                console.log(`${closedBoxes} closed boxes`)

                // get total box count
                let totalBoxes = openBoxes + closedBoxes
                console.log(`${totalBoxes} total boxes`)

                // get all clients
                let open = await spreadsheet.sheetsByTitle['Open'].getRows()
                let closed = await spreadsheet.sheetsByTitle['Closed'].getRows()
                // TODO: how to combine open and closed sheets to render all clients
                // ! THIS DOESN'T WORK
                let clients = open + closed
                
                res.render('clients/clients', {
                    clients,
                    open: openBoxes,
                    closed: closedBoxes,
                    total: totalBoxes
                })
                
            } else {
                const clients = await Client.find({user: req.user.id, deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean()
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open'}).lean()
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed'}).lean()
                const totalBoxes = await Client.countDocuments({user: req.user.id}).lean()
                res.render('clients/clients', {
                    clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
                })                
            }

        }catch(err){
            console.log(err)
        }
    },
    getClosedBoxes: async (req,res)=>{
        console.log(req.user)
        try{
            // Find spreadsheet ID in database
            let spreadsheet = await Spreadsheet.findOne({
                user: req.user.id
            }).select('spreadsheet')
            
            // If spreadsheet is found, instantiate spreadsheet with ID
            if (spreadsheet) {
                spreadsheet = spreadsheet.spreadsheet
                console.log(`Spreadsheet ID is ${spreadsheet}`)
                spreadsheet = new GoogleSpreadsheet(spreadsheet)

                // auth access to spreadsheet
                await spreadsheet.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })

                // get data from spreadsheet
                await spreadsheet.loadInfo()
                
                // get open box count
                let openBoxes = spreadsheet.sheetsByTitle['Open']
                    openBoxes = await openBoxes.getRows()
                    openBoxes = openBoxes.filter(row => row.lastName).length
                console.log(`${openBoxes} open boxes`)

                // get open box count
                let closedBoxes = spreadsheet.sheetsByTitle['Closed']
                    closedBoxes = await closedBoxes.getRows()
                    closedBoxes = closedBoxes.filter(row => row.lastName).length
                console.log(`${closedBoxes} closed boxes`)

                // get total box count
                let totalBoxes = openBoxes + closedBoxes
                console.log(`${totalBoxes} total boxes`)

                // get closed boxes
                let clients = await spreadsheet.sheetsByTitle['Closed'].getRows()
                
                res.render('clients/clients', {
                    clients,
                    open: openBoxes,
                    closed: closedBoxes,
                    total: totalBoxes
                })
                // If no spreadsheet, check DB for clients
            } else {
                // Find clients
                let clients = await Client.find({user: req.user.id, status: 'Closed', deleted: false})
                .populate('user')
                .sort({box: 'asc'})
                .lean()

                // get open box count
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
                // get closed box count
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
                // get total box count
                const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
                })   
            }
        }catch(err){
            console.log(err)
        }
    },
    // ! This doesn't work
    // getInactiveBoxes: async (req,res)=>{
    //     console.log(req.user)
    //     try{
    //         const clients = await Client.find({user: req.user.id, status: 'Open', deleted: false})
    //             .populate('user')
    //             .sort({box: 'asc'})
    //             .lean()
            
            
    //         const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
    //         const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
    //         const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
    //         const inactiveBoxes = await Client.countDocuments({
    //             user: req.user.id,
    //             status: 'Open',
    //             deleted: false,
    //             mailChecks: {
    //                 $slice: [$mailChecks, -1], $lte: {sixMonthsAgo}
    //             } 
    //         })
    //         res.render('clients/clients', {
    //             clients, open: openBoxes, closed: closedBoxes, total: totalBoxes
    //         })
    //     }catch(err){
    //         console.error(err)
    //         res.render('error/500')
    //     }
    // },

    showClient: async (req, res) => {
        try {
            // Find spreadsheet ID in database
            let spreadsheet = await Spreadsheet.findOne({
                user: req.user.id
            }).select('spreadsheet')

            // If spreadsheet is found, instantiate spreadsheet with ID
            if (spreadsheet) {
                spreadsheet = spreadsheet.spreadsheet
                console.log(`Spreadsheet ID is ${spreadsheet}`)
                spreadsheet = new GoogleSpreadsheet(spreadsheet)

                // auth access to spreadsheet
                await spreadsheet.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })

                // get data from spreadsheet
                await spreadsheet.loadInfo()
                
                const open = await spreadsheet.sheetsByTitle['Open'].getRows()
                const closed = await spreadsheet.sheetsByTitle['Closed'].getRows()

                // TODO: find client by ID
                const client = open.filter(row => row._id === req.params.id) || closed.filter(row => row._id === req.params.id)

                res.render('clients/show', {
                    client
                })
                console.log(client)

            } else {
                const client = await Client.findOne({
                    _id: req.params.id
                })
                .populate('user')
                .lean()   
    
                // ! Won't show client view with this code (needed for security) but I checked the database and the user id and the user id attached to the client matches
                // if (client.user != req.user.id) {
                //     res.redirect('/')
                // } else {
                    res.render('clients/show', {
                        client
                    })
                    console.log(client)
                // }
            }
            
            // if (!client) {
            //     res.render('error/404')
            // }

        } catch (err) {
            console.error(err)
            res.render('error/404')
        }
    },
    addPage: (req,res)=>{
        res.render('clients/add')
    },

    // TODO: Add write to spreadsheet
    createClient: async (req, res)=>{
        try{
            // Find spreadsheet ID in database
            let spreadsheet = await Spreadsheet.findOne({
                user: req.user.id
            }).select('spreadsheet')

            // If spreadsheet is found, instantiate spreadsheet with ID
            if (spreadsheet) {
                spreadsheet = spreadsheet.spreadsheet
                console.log(`Spreadsheet ID is ${spreadsheet}`)
                spreadsheet = new GoogleSpreadsheet(spreadsheet)

                // auth access to spreadsheet
                await spreadsheet.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })

                // get data from spreadsheet
                await spreadsheet.loadInfo()

                // get open sheet
                let open = spreadsheet.sheetsByTitle['Open']

                // get closed sheet
                let closed = spreadsheet.sheetsByTitle['Closed']

                // Get data from sheets
                open = await open.getRows()
                closed = await closed.getRows()

                console.log(req.body.box)

                // todo: FIX WHATEVER RACE CONDITION IS HAPPENING HERE THAT IT'S ADDING THE ROW BEFORE CHECKING THAT THE CONDITIONAL IS TRUE

                if (open.includes(req.body.box) && closed.includes(req.body.box)) {
                    console.log(`Mailbox ${req.body.box} is already in use`)
                    res.render('error/400')
                } else {
                    // create new client
                    await spreadsheet.sheetsByTitle['Open'].addRow({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        box: req.body.box,
                        user: req.user.id,
                        _id: Math.floor(Math.random() * 100000)
                    })
                    console.log(`Client ${req.body.firstName} ${req.body.lastName} saved to database`)
                    res.redirect('/clients')
                }

            } else {
                req.body.user = req.user.id
                await Client.create(req.body)

                console.log(`Client ${firstName} ${lastName} saved to database`)
                res.redirect('/clients')                
            }

        }catch(error){
            console.log(error)
            //! render error page
            if (error.name == 'ValidationError') {
                console.log(`Box number already in use`)
                res.render('error/400')
            } else {
                res.render('error/500')
            }
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
            res.redirect(`/clients/${req.params.id}`)
            }

        } catch (err) {
            console.error(err)
        }
    },
    uploadDoc: async (req, res) => {
        try {
            let client = await Client.findById(req.params.id).lean()

                // Upload image to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path)
            
                if (!client) {
                    return res.render('error/404')
                }

                if (client.user != req.user.id) {
                    res.redirect('/')
                } else {
                    client = await Client.findOneAndUpdate({ _id: req.params.id }, {
                        doc: result.secure_url,
                        cloudinaryId: result.public_id,
                    }, {
                        new: true,
                        runValidators: true 
                    })
                    res.redirect(`/clients/${req.params.id}`)
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
                clients, filter, open: openBoxes, closed: closedBoxes, total: totalBoxes
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
                client = await Client.findOneAndUpdate({ _id: req.params.id }, { $push: {mailChecks: new Date()} }, {
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
            let mailChecks = client.mailChecks

            if (!client) {
                res.render('error/404')
            }

            if (client.user != req.user.id) {
                res.redirect('/')
            } else {
                await Client.findOneAndUpdate({ _id: req.params.id }, { $pop: {mailChecks: 1} }, {
                    new: true,
                    runValidators: true
                })

                // // ! This is not working. Need to update lastChecked value based on new mailChecks array after update
                // await Client.findOneAndUpdate({ _id: req.params.id }, { $set: {lastChecked: mailChecks[mailChecks.length - 1]}}, {
                //     new: true,
                //     runValidators: true
                // })
                
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
    isInactive: async (req, res) => {
        try {
            
        } catch (err) {
            console.error(err)
            res.render('error/500')
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