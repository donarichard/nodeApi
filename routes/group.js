const router = require('express').Router();

const Group = require('../model/Group')

const verify = require('./verifyToken')


router.post('/',verify, async (req,res)=>{

    const group = new Group({
        name : req.body.name,
        user_id : req.body.user_id
    });
   await group.save()

    res.send(req.body.user_id)

})

router.patch('/:groupId',(req,res)=>{
    const updateId = req.params.groupId

    Group.findOneAndUpdate(updateId,{
        name : req.body.name,
        user_id : req.body.user_id
    }).then(updatedGroup=>{
        if(!updatedGroup){
            return res.status(404).send({
                message: "Group not found with id " + updateId
            });
        }
        res.send(updateId)
    }) 
})

router.get('/:groupId',(req, res)=>{
    const updateId = req.params.groupId

    Group.findById(updateId)
    .then(groupUser=>{
        if(!groupUser){
            return res.status(404).send({
                message: "Group not found with id" + updateId
            })
        }
        res.send(groupUser)
    })
})

router.get('/',verify,async (req,res)=>{

    const group = await Group.find()
    res.status(200).send(group)   

})





module.exports = router