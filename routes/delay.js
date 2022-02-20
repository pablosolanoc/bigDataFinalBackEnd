var express = require('express');
var router = express.Router();

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints:['192.168.1.19'],
    keyspace: 'final',
    localDataCenter: 'datacenter1',
    // authProvider: new PlainTextAuthProvider('cassandra', 'cassanda')
  });

/* GET pregunta UNO, DOS */
router.get('/salidallegada',  function(req, res, next) {
  try{
    let query = '';
    //parametros
    let salida = req.query.salida;
    let llegada = req.query.llegada;
    let carrier = req.query.carrier;
    if(req.query.pregunta == 'uno' && salida && llegada){
        query = `select retrasollegada, retrasosalida from primera where salida = '${salida}' and llegada = '${llegada}' ALLOW FILTERING`;
    }else if(req.query.pregunta == 'dos' && carrier){
        query = `select retrasollegada, retrasosalida from segunda where carrier = '${carrier}' ALLOW FILTERING`;
    }else{
        return res.send('Especifique la pregunta: pregunta "uno" recibe "salida" y "llegada". Pregunta "dos" recibe "carrier"')
    }
  
    client.execute(query)
    .then(result => {
      // console.log(result.rows)
    //   console.log(result);
      let restrasoLlegadas = 0;
      let restrasoSalidas = 0;
      for(let i=0; i<result.rows.length; i++){
        restrasoLlegadas = restrasoLlegadas + result.rows[i].retrasollegada;
        restrasoSalidas = restrasoSalidas + result.rows[i].retrasosalida;
      }
      console.log({restrasoSalidas: restrasoSalidas, restrasoLlegadas: restrasoLlegadas})
      return res.send({restrasoSalidas: restrasoSalidas, restrasoLlegadas: restrasoLlegadas})
    });
  }catch(error){
    console.log(error);
  }
});

/* GET pregunta TRES */
router.get('/carrierweather',  function(req, res, next) {
    try{
      let query = '';
      //parametros
      let salida = req.query.salida;
      let llegada = req.query.llegada;
      query = `select retrasocarrier, retrasoweather from tercera where salida = '${salida}' and llegada = '${llegada}' ALLOW FILTERING`;
    
      client.execute(query)
      .then(result => {
        // console.log(result.rows)
      //   console.log(result);
        let retrasoCarrier = 0;
        let retrasoWeather = 0;
        for(let i=0; i<result.rows.length; i++){
            retrasoCarrier = retrasoCarrier + result.rows[i].retrasocarrier;
            retrasoWeather = retrasoWeather + result.rows[i].retrasoweather;
        }
        console.log({retrasoCarrier: retrasoCarrier, retrasoWeather: retrasoWeather})
        return res.send({retrasoCarrier: retrasoCarrier, retrasoWeather: retrasoWeather})
      });
    }catch(error){
      console.log(error);
    }
  });

module.exports = router;
