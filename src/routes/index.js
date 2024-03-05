const express = require("express")
const router = express.Router()
const authrouter = require("../app/auth/auth.router")
const bannerRouter = require("../app/banner/banner.router")

// http://localhost:3000/
router.use('/auth', authrouter);
router.use("/banner", bannerRouter)
// brand 
    // e.g
        // get => /brand, brand/list-home, /brand/:id, /brand/:slug/detail
        // post => /brand 
        // put/patch => /brand/:id
        // delete => /brand/:id 
// category 
        //// get => /category, category/list-home, /category/:id, /category/:slug/detail
        // post => /category 
        // put/patch => /category/:id
        // delete => /category/:id 
// user 
        // get => /user, /user/:id, 
        // post => /user 
        // put/patch => /user/:id
        // delete => /user/:id 
// product 
        // get => /product, product/list-home, /product/:id, /product/:slug/detail
        // post => /product 
        // put/patch => /product/:id
        // delete => /product/:id 
// cart 
    // get => /order
    // post => /create-order, /get-detail
    // 
// name branch code push 
module.exports = router;