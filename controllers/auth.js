const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const Org = require('../models/Org')
const Client = require('../models/Client')

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/clients");
  }
  res.render("login", { msg: req.flash('errors') });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/clients");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) { return next(err) }
  })
  res.redirect('/')
}

//! This doesn't work
// exports.logout = (req, res) => {
//   req.logout(() => {
//     console.log('User has logged out.')
//   })
//   req.session.destroy((err) => {
//     if (err)
//       console.log("Error : Failed to destroy the session during logout.", err);
//     req.user = null;
//     res.redirect("/");
//   });
// };

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/clients");
  }
  res.render("signup", { msg: req.flash('errors') })
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    console.log(validationErrors)
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = await new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  console.log(user)



  User.findOne(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/clients");
        });
      });
    }
  );
};

// // Join org
// router.get('/joinOrg', authController.getJoinOrg)
// router.post('/joinOrg', authController.postJoinOrg)

exports.getJoinOrg = (req, res) => {
  if (req.user) {
    res.render("org/join", { msg: req.flash('errors') });
  }
}

exports.putJoinOrg = async (req, res) => {
  try {
    const org = await Org.findOne({org: req.body.org}).lean()

    if (req.body.codeword === org.codeword) {
      await User.findOneAndUpdate({_id: req.user.id}, {org: org._id})
    }

    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
}

// // Add org
// router.get('/addOrg', authController.getAddOrg)
// router.post('/addOrg', authController.postAddOrg)

exports.getNewOrg = (req, res) => {
  if (req.user) {
    res.render("org/new", { msg: req.flash('errors'), user: req.user.id });
  }
}

exports.postNewOrg = async (req, res) => {
  try{
    // TODO: Need to first verify that org doesn't already exist
    // create org (needs name and codeword)
    const org = await Org.create(req.body)
    console.log(org)

    res.redirect('/join')
    }catch(err){
        console.error(err)
        // //! render error page
        // if (error.name == 'ValidationError') {
        //     res.render('error/400')
        // } else {
        //     res.render('error/500')
        // }
    }
}

//   // Get Google login
//   exports.getGoogleLogin = passport.authenticate('google', { scope: ['profile', 'email'] })

//   // Google auth callback
//   exports.googleCallback = passport.authenticate("google", {
//     failureRedirect: "/login",
//     successRedirect: "/clients",
//     failureFlash: true,
//     successFlash: "Successfully logged in!",
//   })

  exports.getDashboard = async (req, res) => {
    try{
      const user = await User.findById(req.user.id).lean()
      const clients = await Client.find({user: req.user.id})
        .populate('user')
        .lean()
      const openBoxes = await Client.countDocuments({user: req.user.id, status: 'Open', deleted: false}).lean()
      const closedBoxes = await Client.countDocuments({user: req.user.id, status: 'Closed', deleted: false}).lean()
      const totalBoxes = await Client.countDocuments({user: req.user.id, deleted: false}).lean()
      res.render('dashboard', {
          user,
          clients,
          open: openBoxes,
          closed: closedBoxes,
          total: totalBoxes
      })
    } catch(err) {
      console.error(err)
      res.render('error/500')
  }
}