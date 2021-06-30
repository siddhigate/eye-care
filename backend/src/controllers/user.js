const client = require("../db/db_config");
const { check, validationResult } = require('express-validator');

exports.getUserById = async (req, res, next, id) =>{
    const user = await client.query(`SELECT * FROM user.userinfo WHERE id="${id}"`);
    
    if(user.data.length === 0){
        return res.status(422).json({
            error: "record doesn't exist"
        });   
    }

    req.user = user.data[0];
    
    next();
}

exports.getUser =  (req, res) =>{
    res.json(req.user);
} 

exports.updateUser = async (req,res) => {
    
    console.log("update user");

    const updates = Object.keys(req.body);
    // const allowedUpdates = ['score','name','email','id'];
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    // if (!isValidOperation) {
    //     res.status(400).send({ error: 'Not a valid operation! '});

    //     return;
    // }

    const total_score = parseInt(req.user.score) + 5;

    try {
        console.log(req.user);
        const updatedCourse = await client.update({
            table: 'userinfo',
            records: [
                {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    password: req.user.password,
                    score: total_score,
                    hash: req.user.id
                }
            ]
        });

        res.send({ updatedCourse });
    } catch (error) {
        res.send({ error });
    }
}
