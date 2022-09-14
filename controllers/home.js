module.exports = {
  getIndex: (req,res)=>{
    try {
      res.render('index.hbs')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  }
}