const router = require('express').Router();

const multer = require('multer')

var xlsxtojson = require("xlsx-to-json");


var xlstojson = require("xls-to-json");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null , './uploads/')
    },
    filename : function(req, file, cb){
        cb(null,  file.originalname)
    }
})


const upload = multer({storage: storage});


router.post('/upload', upload.single('question') ,(req,res, next)=>{
   xlsxtojson({
		input: req.file.destination+req.file.filename,  // input xls 
	    output: "./uploads/output.json", // output json 
	    lowerCaseHeaders:true
	}, function(err, result) {
	    if(err) {
	      res.json(err);
	    } else {
             var newArray = trim_nulls(result).filter(value => JSON.stringify(value) !== '{}')
	      res.json(newArray );
	    }
	});
})

function trim_nulls(data) {
    var y;
    for (var x in data) {
      y = data[x];
      if (y==="null"  || y===null || y==="" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
        delete data[x];
      }
      if (y instanceof Object) y = trim_nulls(y);
    }
    return data;
  }
  
module.exports = router