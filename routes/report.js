const router = require('express').Router();

const verify = require('./verifyToken')

const Report = require('../model/Report');

const jwt = require('jsonwebtoken');


router.post('/create', verify, async (req, res) => {
    var _id = getId(req.headers['auth-token']);
    const report = new Report({
        name: req.body.name,
        user_id: _id
    })
    await report.save()
    res.status(200).send("success")

})

router.get('/', verify, async (req, res) => {
    var _id = getId(req.headers['auth-token']);
    const userReport = await Report.find({
        "user_id": _id
    })
    res.status(200).send(userReport)
})


router.patch('/:id', async (req, res) => {
    const updateId = req.params.id
    await Report.findByIdAndUpdate({
        "_id": updateId
    }, {
        status: req.body.status
    }, {
        new: true
    }).then(report => {
        res.status(200).send("updated")
    }).catch(err => {
        res.status(401).send(err)
    })


})

function getId(token) {
    var decoded = jwt.decode(token);
    return decoded._id;
}

module.exports = router