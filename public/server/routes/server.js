const { Router } = require('express');

const router = Router();

router.get('/', function(req, res, next) {
    res.json('servidor operativo');
  });
  
  router.get('/close',function(req, res, next){
    res.status(200).json("cerrando servidor")
    process.exit();
  })
  router.get('/version',function(req, res, next){
    res.status(200).json({msg:'servidor operativo', version:'0.0.7'})
  })

module.exports = router;
