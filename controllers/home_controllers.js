const CSV=require('../modals/csv');

const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const FILES_PATH = path.join("/uploads/files");



module.exports.uploadHome=async function(req,res){
    
     try {
   let csvfiles=  await CSV.find({});
return res.render('Home',{
    
        title:"CSV FILE UPLOADER HOME PAGE",
           csvfiles:csvfiles
        })

     } catch(err){
        console.log('this eror is populated when we load this website',err)
     }
    
}


module.exports.uploadfile=function(req,res){
        CSV.uploadCsvFile(req,res,function(err){
            if(err){
                console.log('multor err',err);
            } 
            console.log(req.file);
             if(req.file){
         CSV.create({
            filePath: req.file.path,
            originalName: req.file.originalname,
            file: req.file.filename
         });
         
         return res.redirect('back');
             }{
                return res.json(500,{
                    message: "Please Upload a file"
                })
             }
      
            res.redirect('back');
        })
}

 module.exports.showFile =  async function (req, res) {
   // FIND THE FILE BY ID
   let filePATH = await CSV.findById(req.query.csvfiles_id);

   const results = [];
   const header = [];

   // STREAMING THE FILE
   fs.createReadStream(filePATH.filePath)
      .pipe(csv())
      .on("headers", (headers) => {
         headers.map((head) => {
            header.push(head);
         });
         console.log("header => ", header);
      })
      .on("data", (data) => results.push(data))
      .on("end", () => {
         console.log(results.length);
         let page = req.query.page;
         console.log("page => ", req.query.page);
         let startSlice = (page - 1) * 100 + 1;
         let endSlice = page * 100;
         let sliceResults = [];
         let totalPages = Math.ceil(results.length / 100);

         if (endSlice < results.length) {
            sliceResults = results.slice(startSlice, endSlice + 1);
         } else {
            sliceResults = results.slice(startSlice);
         }

         res.render("file", {
            title: filePATH.originalName,
            head: header,
            data: sliceResults,
            length: results.length,
            page: req.query.page,
            totalPages: totalPages,
         });
      });
   }
module.exports.fileDelete=async function(req,res){
 
   try {
      const filename = req.params.file;
      let isFile = await CSV.findOne({ file: filename });

      if (isFile) {
         await  CSV.deleteOne({ file: filename });
         console.log("file is deleted ");
         return res.redirect("/");
      } else {
         console.log("file not found");
         return res.redirect("/");
      }
   } catch (error) {
      console.log(error);
      return res.statu(500).json({
         message: "Internal Server Error",
      });
   }

   
}