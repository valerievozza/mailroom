const cloudinary = require("../middleware/cloudinary");
const { lastChecked, checkSafety } = require('../helpers/hbs')
const Client = require('../models/Client')
const Org = require('../models/Org')
const User = require('../models/User')


            // TODO: FIX FILTER BY ORG LOGIC IN CASE USER ORG AND CLIENT ORG ARE BOTH NULL FOR ALL CONTROLLERS


module.exports = {
    getOpenBoxes: async (req,res)=>{
        console.log(req.user)
        try{

            // Get user and org
            const user = await User.findById(req.user.id).populate('org').lean()
            if (user.org != null) {
                const org = await Org.findById(user.org)
            
                const clients = await Client.find({
                    org: org,
                    status: 'Open',
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({org: org, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({org: org, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({org: org, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, org, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            } else {
                const clients = await Client.find({
                    user: req.user.id,
                    status: 'Open',
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            }
            
            
        }catch(err){
            console.error(err)
            res.render('error/500')
        }
    },
    getAllBoxes: async (req,res)=>{
        console.log(req.user)
        try{

            // Get user and org
            const user = await User.findById(req.user.id).populate('org').lean()
            if (user.org != null) {
                const org = await Org.findById(user.org)
            
                const clients = await Client.find({
                    org: org,
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({org: org, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({org: org, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({org: org, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, org, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            } else {
                const clients = await Client.find({
                    user: req.user.id,
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            }
            
            
        }catch(err){
            console.error(err)
            res.render('error/500')
        }
    },
    getClosedBoxes: async (req,res)=>{
        console.log(req.user)
        try{

            // Get user and org
            const user = await User.findById(req.user.id).populate('org').lean()
            if (user.org != null) {
                const org = await Org.findById(user.org)
            
                const clients = await Client.find({
                    org: org,
                    status: 'Closed',
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({org: org, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({org: org, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({org: org, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, org, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            } else {
                const clients = await Client.find({
                    user: req.user.id,
                    status: 'Closed',
                    deleted: false
                })
                    .populate('user org')
                    .sort({'box.letter': 'asc', 'box.number': 'asc'})
                    .lean()
                

                
                const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
                const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
                const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
                res.render('clients/clients', {
                    clients, user, open: openBoxes, closed: closedBoxes, total: totalBoxes,
                })
            }
            
            
        }catch(err){
            console.error(err)
            res.render('error/500')
        }
    },
    // ! This doesn't work
    // getInactiveBoxes: async (req,res)=>{
    //     console.log(req.user)
    //     try{
    //         const clients = await Client.find({user: req.user.id, status: 'Open', deleted: false})
    //             .populate('user')
    //             .sort({box: 'asc'})
    //             .lean() //! Change this to org ID
            
            
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
            const user = await User.findById(req.user.id).populate('org').lean()
            let org = await Org.findById(user.org)
            console.log(user)
            const client = await Client.findOne({
                _id: req.params.id
            })
            .populate('user org')
            .lean()


            if (!client) {
                res.render('error/404')
            }

            // ! Won't show client view with this code (needed for security) but I checked the database and the user id and the user id attached to the client matches
            // if (client.org._id != user.org._id) {
            //     res.redirect('/')
            // } else {
                res.render('clients/show', {
                    client, user
                })
                console.log(client)
            // }
        } catch (err) {
            console.error(err)
            res.render('error/404')
        }
    },
    addPage: (req,res)=>{
        res.render('clients/add')
    },
    createClient: async (req, res)=>{
        try{
            const user = await User.findById(req.user.id).populate('org').lean()
            // find last box number
            let alphaClients = await Client.find({
                org: user.org,
                deleted: false,
                'box.letter': req.body.lastName[0]
            }).sort({'box.number': 'asc'})

            if (alphaClients.length !== 0) {
                let lastClient = alphaClients[alphaClients.length - 1]
                let lastNumber = lastClient.box.number  
                
                // assign box letter
                req.body.letter = req.body.lastName[0].toUpperCase()

                // assign box number
                req.body.number = Number(lastNumber) + 1

                // create client
                let client = await Client.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    box: {
                        letter: req.body.letter,
                        number: req.body.number,
                    },
                    user: user,
                    org: user.org

                })
                console.log(client)
                console.log(req.user.org)


                console.log(`Client ${client.firstName} ${client.lastName} saved to database`)
                res.redirect(`/clients/${client.id}`)
            } else {
                lastNumber = 0

                // assign box letter
                req.body.letter = req.body.lastName[0].toUpperCase()

                // assign box number
                req.body.number = Number(lastNumber) + 1

                // assign user
                req.body.user = req.user.id

                // create client
                let client = await Client.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    box: {
                        letter: req.body.letter,
                        number: req.body.number,
                    },
                    user: req.user.id,
                    org: req.user.org

                })
                console.log(client)


                console.log(`Client ${client.firstName} ${client.lastName} saved to database`)
                res.redirect(`/clients/${client.id}`)
            }
            
            
        }catch(error){
            console.log(error)
            //! render error page
            if (error.name == 'ValidationError') {
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

            if (client.org != req.user.org) {
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

            const user = await User.findById(req.user.id).populate('org').lean()
            const org = req.user.org
            let client = await Client.findById(req.params.id).populate('user org').lean()
            
            if (!client) {
                return res.render('error/404')
            }
            


            // if (client.org != org) {
            //     res.redirect('/')
            // } else {
                // Check if box number exists
                let boxMatches = await Client.find({
                    org: org,
                    deleted: false,
                    'box.letter': req.body.letter.toUpperCase(),
                    'box.number': req.body.number,
                    _id: { $not: {$eq: req.params.id} }
                })
                .sort({'box.number': 'asc'})
                .populate('user org')
                .lean()

                console.log(`BOX MATCHES: ${boxMatches}`)
                
                if (boxMatches.length > 0) {
                   console.log(`Box number ${client.box.letter}-${client.box.number} is already in use`) 
                   res.render('error/400')
                } else {
                    client = await Client.findOneAndUpdate({_id: req.params.id}, {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        otherNames: req.body.otherNames,
                        safetyConcern: req.body.safetyConcern,
                        phone: req.body.phone,
                        email: req.body.email,
                        notes: req.body.notes,
                        box: {
                            letter: req.body.letter,
                            number: req.body.number
                        }
                    }, {
                        new: true,
                        runValidators: true
                    })
                    res.redirect(`/clients/${req.params.id}`)
                }

          //  }

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
            // TODO: fix this logic
            let number = filter.split('-')
            number = number[number.length - 1]
            let regex = new RegExp(filter, 'i')
            const clients = await Client.find({
                org: req.user.org,
                deleted: false,
                $or: [
                    { firstName: {$regex: regex} },
                    { lastName: {$regex: regex} },
                    { otherNames: {$regex: regex} },
                    // TODO: fix search by box
                    { box: {
                        letter: {$regex: filter[0]},
                        number: {$regex: number}
                    } }
                ]
                })
                .populate('user')
                .sort({'box.letter': 'asc', 'box.number': 'asc'})
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

            // if (client.user != req.user.id) {
            //     res.redirect('/')
            // } else {
                client = await Client.findOneAndUpdate({ _id: req.params.id }, { $push: {mailChecks: new Date()} }, {
                    new: true,
                    runValidators: true
                })
                res.redirect('/clients')
            // }
        
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

            // if (client.user != req.user.id) {
            //     res.redirect('/')
            // } else {
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
            // }

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

            if (client.org != req.user.org) {
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