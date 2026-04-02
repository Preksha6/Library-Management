const express = require('express')
const adminHomePageInfoRouter = express.Router()

const {adminHomePageInfo} = require('../controller/adminHomeInfoController')

adminHomePageInfoRouter.route('/').get(adminHomePageInfo)

module.exports = adminHomePageInfoRouter
