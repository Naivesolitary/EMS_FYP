const multer = require('multer')
const path = require('path')
const fs = require('fs')


// Create a dynamic storage middleware

const getStorage = (subfolder) => {
    return multer.diskStorage({
        destination : (req,res, cb) => {
            const folderPath = path.join(__dirname,`../uploads/${subfolder}`);
            fs.mkdirSync(folderPath,{recursive:true});
            // const folderPath: path.,
            cb(null,folderPath)

        },
        filename:(req,file,cb) => {
            const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext)
        }
    })
}



const getUploader = (subfolder) => multer({storage:getStorage(subfolder)});
module.exports = getUploader;

// const storage = multer.diskStorage({
//     destination: (req,file,cb) =>{
//         cb(null,'src/uploads/');
//     },
//     filename : (req,file,cb) =>{
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *  1E9)
//         const ext = path.extname(file.originalname);
//         cb(null,file.fieldname+ '-'+ uniqueSuffix+ext)

//     }


// })

// const upload = multer ({storage});
