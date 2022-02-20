var express = require('express');
var router = express.Router();

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints:['192.168.1.19'],
    keyspace: 'final',
    localDataCenter: 'datacenter1',
    // authProvider: new PlainTextAuthProvider('cassandra', 'cassanda')
  });

/* GET users listing. */
router.get('/',  function(req, res, next) {
  try{
    const query = 'SELECT carrier FROM segunda';

    client.execute(query)
    .then(result => {
      
      const carriers = new Set()
      
      for(let i=0; i<result.rows.length; i++){
        carriers.add(result.rows[i].carrier)
      }
      console.log(carriers)
      res.send({carriers: Array.from(carriers)})
    });
  }catch(error){
    console.log(error);
  }
  

  // console.log(rutas)

});

module.exports = router;
