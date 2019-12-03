const router = require('express').Router();

const verify = require('./verifyToken')

const User = require('../model/UserAccount');

const jwt =  require('jsonwebtoken');

const moment = require('moment')

const JSON = require('json-parser');

const bcrypt = require('bcryptjs');

router.post('/create', verify, async (req,res)=>{
    var _id = getId(req.headers['auth-token']);
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(req.body.password, salt);

  const UserAccount = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashPassword,
        user_id : _id
    })
    try{
        await UserAccount.save()
        res.send("Success")

    }catch(err){
        res.status(400).send(err);
    }
})

router.get('/user',verify, async (req,res)=>{
    var _id = getId( req.headers['auth-token']);
  const userdata  = await User.find({"user_id":_id})
    res.send(userdata)

})

router.get('/', async (req, res)=>{

    const allUser= await User.find()

    res.send(allUser)
    
})

router.patch('/:userId',verify, async (req,res)=>{

    const updateId = req.params.userId

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(req.body.password, salt);
   await  User.findByIdAndUpdate(req.params.userId, {
        name : req.body.name,
        email : req.body.email,
        password : hashPassword,
       
    }, {new: true})
   .then(product => {
    if(!product) {
        return res.status(404).send({
            message: "User not found with id " + req.params.postId
        });
    }
    res.send(product);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with id " + req.params.postId
        });                
    }
    return res.status(500).send({
        message: "Something wrong updating note with id " + req.params.productId
    });
});
     
})

router.put('/',verify, async (req,res)=>{


   await  User.update({}, {
    name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }, {
        multi: true
    })
   .then(product => {
    if(!product) {
        return res.status(404).send({
            message: "Product not found with id " + req.params.postId
        });
    }
    res.send(product);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Product not found with id " + req.params.postId
        });                
    }
    return res.status(500).send({
        message: "Something wrong updating note with id " + req.params.productId
    });
});
     
})

router.delete('/:userId',verify, async (req,res)=>{

  await  User.findByIdAndRemove(req.params.userId)
    .then(post => {
        if(!post) {
            return res.status(404).send({
                message: "User not found with id " + req.params.postId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.postId
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.postId
        });
    });
})

function getId( token){
    var decoded = jwt.decode(token);
    return decoded._id;
}

module.exports = router