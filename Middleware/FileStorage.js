
    const multer = require('multer')
    const fs = require('fs');
    const path = require('path');


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, Date.now() + "-" + file.originalname)
        }
    })

    const upload = multer({ storage: storage })

    const siteStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            const id = req.params.id || 'unknown';
            const dir = path.join('uploadsStore', id);

            // Create the folder if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },

        filename: function (req, file, cb) {
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            cb(null, `${timestamp}${extension}`);
        }
    });

    const siteupload = multer({ storage: siteStorage });


    module.exports = { upload, siteupload }