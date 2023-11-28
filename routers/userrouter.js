const express = require('express')
const router = express.Router()
require('dotenv').config()
const {connect} = require('mongoose')
const {Schema, model} = require('mongoose')

const userSchema = new Schema ({
    "rollnumber": {type:String, require:true, unique:true},
    "fullname": {type:String, require: true},
    "cgpa": {type:String, require:true},
    "department": {type:String, require:true},
})
const uSchema = model('User', userSchema);


router.get ('/all-users', async (req, res) => {
  

    try {
        await connect(process.env.MONGO_URI)
        const allUsers = await uSchema.find()
        res.json({users: allUsers})
    }
    catch (error) {
        res.json({message:"error.message"})
    }
})

router.post ('/create-user', async (req, res) => {
  

    const {rollnumber, fullname, cgpa, department} = req.body;
    if (rollnumber && fullname && cgpa && department) {
        try {
            await connect(process.env.MONGO_URI)
            const checkUser = await uSchema.exists({ rollnumber })
            if (!checkUser) {
                await uSchema.create({rollnumber, fullname, cgpa, department})
                res.json({message:"user created successfully"})
            }
            else {
                res.json({message:"user already exists"})
            }
        }
        catch (error) {
            res.json({message:error.message})
        }
    }
    else {
        res.json({message:"require field missing"})
    }
})

router.put ('/update-user', async (req, res) => {
   

    const {rollnumber, fullname, cgpa, department} = req.body
    try{
        const filter = {rollnumber}
        const update = {fullname, cgpa, department}
        await connect(process.env.MONGO_URI)
        const doc = await uSchema.findOneAndUpdate(filter, update, {new:true})
        const updatedUser = await uSchema.findOne({rollnumber})
        res.json({message:"user updated successfully", updated_user:updatedUser})
    }
    catch (error) {
        res.json({message:error.message})
    }
})

router.delete ('/delete-user', async (req, res) => {


    const {rollnumber} = req.body
    await connect(process.env.MONGO_URI)
    const checkUser = await uSchema.findOne({rollnumber})
    
    if (checkUser) {
        const deleteUser = await uSchema.findOneAndDelete({rollnumber:req.body.rollnumber})
        res.json({message:"user deleted successfully"})
    }
    else {
        res.json({message:"incorrect roll-number"})
    }

})



module.exports = router 