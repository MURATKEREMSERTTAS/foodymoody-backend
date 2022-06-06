var express = require('express');
var router = express.Router();
const {userRegister,userLogin,userCheckExist,addOrderToUser} = require("../services/authentication.service")


router.post('/register', async (req, res, next) => {
    let body = req.body;
    let response = await userRegister(body)
    res.json(response);
});
router.post('/login', async (req, res, next) => {
    let body = req.body;
    let response = await userLogin(body)
    res.json(response);
});
router.get('/check-exist', async (req, res, next) => {
    let params = req.query;
    let response = await userCheckExist(params)
    res.json(response);
});
router.post('/order', async (req, res, next) => {
    let params = req.body;
    let response = await addOrderToUser(params)
    res.json(response);
});

module.exports = router;