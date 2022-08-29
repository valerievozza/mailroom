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
    // markComplete: async (req, res)=>{
    //     try{
    //         await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: true
    //         })
    //         console.log('Marked Complete')
    //         res.json('Marked Complete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    // markIncomplete: async (req, res)=>{
    //     try{
    //         await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: false
    //         })
    //         console.log('Marked Incomplete')
    //         res.json('Marked Incomplete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    deleteClient: async (req, res)=>{
        console.log(req.body.clientIdFromJSFile)
        try{
            await Client.findOneAndDelete({_id:req.body.clientIdFromJSFile})
            console.log('Client deleted from database')
            res.json('Deleted client')
        }catch(err){
            console.log(err)
        }
    }
}    