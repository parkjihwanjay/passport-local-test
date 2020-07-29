const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const User = require('./db/User')

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findByUsername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


const express = require("express");
const path = require("path");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret : 'cats'}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login',
  passport.authenticate('local'),
  function(req, res){
      console.log(req.user, req.session);
	  if(!req.user) return res.send('로그인을 다시 해주세요')
	  return res.send('welcome')
  }
);

app.get('/',
  function(req, res){
      console.log(req.user, req.session);
	  if(!req.user) return res.send('로그인을 다시 해주세요')
	  return res.send('welcome')
  }
);

app.listen(4000, () => {
    console.log("running in http://localhost:4000");
  });