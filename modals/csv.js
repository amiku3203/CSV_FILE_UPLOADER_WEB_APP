const multer=require('multer');
const path=require('path');
const mongoose=require('mongoose');
const FILE_PATH=path.join('/uploads/files');
const csvSchema   =  new mongoose.Schema(
  {
     filePath: {
        type: String,
     },
     originalName: {
        type: String,
     },
     file: {
        type: String,
     },
  },
  {
     timestamps: true,
  }
);



 let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'..',FILE_PATH))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

csvSchema.statics.uploadCsvFile=multer({storage: storage}).single('csvFile');
csvSchema.statics.filePath=FILE_PATH;
 


const CSV=mongoose.model("CSV", csvSchema);
module.exports=CSV;