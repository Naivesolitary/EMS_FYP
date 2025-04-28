const express = require('express')
const router = express.Router();
const getUploader = require('../middlewares/uploadMiddleware');
const errorHandler = require('../middlewares/errorHandler');

const allowedFolders = ['admin','events','profile','verification'];

router.post('/:folder',(req,res,next) => {
    const folder = req.params.folder;


    if(!allowedFolders.includes(folder)){
        return res.status(400).json({error:'Invalid upload folder. '});

    }


    let upload;
   if(folder === 'verification'){
     upload = getUploader(folder).single('pdf')
   }
    else if(folder === 'profile'){
        upload = getUploader(folder).single('image');
    }else {
         upload = getUploader(folder).array('images',10)
    }


    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // For the 'profile' folder
        if (folder === 'profile') {
            if (!req.file) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }
            return res.json({
                message: 'File uploaded successfully.',
                filePath: `/uploads/${folder}/${req.file.filename}`
            });
        }

        // For the 'verification' folder (PDF upload)
        else if (folder === 'verification') {
            if (!req.file) {
                return res.status(400).json({ error: 'No PDF file uploaded.' });
            }
            return res.json({
                message: 'PDF uploaded successfully.',
                filePath: `/uploads/${folder}/${req.file.filename}`
            });
        }

        // For other folders (e.g., 'admin', 'events') for image uploads
        else {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }
            return res.json({
                message: 'Files uploaded successfully.',
                filePaths: req.files.map(file => `/uploads/${folder}/${file.filename}`)
            });
        }
    });
})

module.exports = router