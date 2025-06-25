const express=require('express');
const {handleNewGenerateShortUrl} =require('../controllers/url');
const router=express.Router();

router.post('/',handleNewGenerateShortUrl);

module.exports=router;