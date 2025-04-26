const express = require('express')
const router = express.Router();
const getUploader = require('../middlewares/uploadMiddleware');
const errorHandler = require('../middlewares/errorHandler');

const allowedFolders = ['admin','events','profile'];

router.post('/:folder',(req,res,next) => {
    const folder = req.params.folder;


    if(!allowedFolders.includes(folder)){
        return res.status(400).json({error:'Invalid upload folder. '});

    }


    let upload;

    if(folder === 'profile'){
        upload = getUploader(folder).single('image');
    }else{
         upload = getUploader(folder).array('images',10)
    }


    upload(req,res,(err) => {
        if(err){
            return res.status(400).json({error:'No file uploaded. '})
        }

        if (folder === 'profile'){
            if(!req.file){
                return res.status(400).json({error:'No files uploaded'})
            }
            return res.json({
                message: 'File uploaded sucessfully.',
                filePath: `/uploads/${folder}/${req.file.filename}`
            })
        }else {
            if(!req.files || req.files.length === 0){
                return res.status(400).json({error:'No files uploaded.'})
            }
            return res.json({
                message:'Files upload successfully.',
                filePaths: req.files.map(file => `/uploads/${folder}/${file.filename}`)
            })
        }
    })
})

module.exports = router