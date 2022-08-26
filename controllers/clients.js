const Client = require('../models/Client')

module.exports = {
    getClient: async (req,res)=>{
        console.log(req.user)
        try{
            const clients = await Client.find({userId:req.user.id})
            const openBoxes = await Client.countDocuments({userId:req.user.id,status: 'open'})
            res.render('clients.ejs')
        }catch(err){
            console.log(err)
        }
    },
    createClient: async (req, res)=>{
        try{
            req.body.user = req.userId
            await Client.create(req.body)
            console.log('Client saved to database')
            res.redirect('/clients')
        }catch(err){
            console.log(err)
            //! render error page
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