// default 
const multer = require('multer')
const fs = require('fs');

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = "./public/uploads/"
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true});
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        // filename.ext => a.b.c.d.jpg
        // 1241231231.jpg
        let ext = (file.originalname.split(".")).pop() // [a,b,c,d,jpg]
        let name = Date.now()+"."+ext;
        cb(null, name)
    }
})

const imageFilter = (req, file, cb) => {
    let allowed = ['jpg','jpeg','png', 'gif', 'bmp','webp','svg']    
    let ext = (file.originalname.split(".")).pop()
    if(allowed.includes(ext.toLowerCase())){
        cb(null, true)
    } else {
        cb({code: 400, msg: "File format not supported"}, null)
    }
}

const uploader = multer({
    storage: myStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 3000000
    }
})

module.exports = uploader;