var express = require('express');
var router = express.Router();

const cassandra = require('cassandra-driver');


/* GET users listing. */
router.get('/',  function(req, res, next) {
  try{
    const client = new cassandra.Client({
      contactPoints:['192.168.1.19'],
      keyspace: 'final',
      localDataCenter: 'datacenter1',
      // authProvider: new PlainTextAuthProvider('cassandra', 'cassanda')
    });

    const query = 'SELECT salida, llegada FROM primera';

  
    client.execute(query)
    .then(result => {
      // console.log(result.rows)
      const salidas = new Set()
      const llegadas = new Set()
      
      for(let i=0; i<result.rows.length; i++){
        salidas.add(result.rows[i].salida)
        llegadas.add(result.rows[i].llegada)
      }
      res.send({salidas: Array.from(salidas), llegadas:  Array.from(llegadas)})
    });
  }catch(error){
    console.log(error);
  }
  

  // console.log(rutas)

});

module.exports = router;
