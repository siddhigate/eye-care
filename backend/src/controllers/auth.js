const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const crypto = require('crypto');
const client = require("../db/db_config");

exports.signup= async(req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = await client.query(`SELECT * FROM user.userinfo WHERE email="${req.body.email}"`);
    
    if(user.data.length !== 0 ){
        return res.status(422).json({
            error: "mail already exists"
        });   
    }

    req.encry_pass = await hashPassword(req.body.password);
    
        try {
            
            const newUser = await client.insert({
                table: 'userinfo',
                records: [
                    {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.encry_pass,
                        score: req.body.score
                    }
                ]
            });

            res.send({ newUser });
        } catch (error) {
            res.send({ error });
        }
}

exports.signin = async (req, res) => {
    console.log("sigin called");

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user_data = await client.query(`SELECT * FROM user.userinfo WHERE email="${req.body.email}"`);

    const user = user_data.data[0];
    
    if(user_data.data.length === 0 ){
        return res.status(422).json({
            error: "mail doesn't exist"
        });   
    }

    const is_valid = await comparePassword(user.password, req.body.password);
    
    if(!is_valid){
        console.log(user.password);
        console.log(req.body.password);
        return res.status(401).json({
            error: "Email and password do not match" 
        });
    }

    console.log(user.password);
        console.log(req.body.password);

    // create token
    const token = jwt.sign({id: user.id}, process.env.SECRET);

    // put token in cookie
    res.cookie("token", token, {expire: new Date() + 8888});

    // send response to frontend
    const {id, name, email, score} = user;

    
    return res.json({ token, user : { id, name, email, score}});
    // console.log("signin");
}

exports.signout = (req, res) =>{
    
    console.log("signout");
}

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
})


// custom middlewares
exports.isAuthenticated = (req, res, next) => {

    let checker = req.user && req.auth && req.user.id == req.auth.id;

    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}


async function hashPassword (password) {

    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // returns hash
                console.log(hash);
                if (err) reject(err)
                resolve(hash)    
            });
        // bcrypt.hash(password, saltRounds, function(err, hash) {
        // if (err) reject(err)
        // resolve(hash)
      });
    })
  
    return hashedPassword
  }

  async function comparePassword (password, password2) {

    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      
        bcrypt.hash(password, saltRounds, function(err, hash) { // Salt + Hash
            bcrypt.compare(password2, password, function(err, result) {  // Compare
              // if passwords match
              if (result) {
                    console.log("It matches!");
                    resolve(true);
              }
              // if passwords do not match
              else {
                    console.log("Invalid password!");
                    console.log(hash);
                    resolve(false);
              }
            });
          });

      });

  
    return hashedPassword;
  }
