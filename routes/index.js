const express=require('express');

const router=express.Router();

const HomeController=require('../controllers/home_controllers');

router.get('/',HomeController.uploadHome);

router.post('/upload',HomeController.uploadfile );


 
router.get('/delete/:file',HomeController.fileDelete);
// SHOW THE CSV FILE
router.get("/show", HomeController.showFile);

module.exports=router;