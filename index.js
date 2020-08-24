const express =require('express');

const settingsApp = express();

settingsApp.get('/', function(req, res){
  res.send('Settings Bill App')
});

const PORT = process.env.PORT || 3011;

settingsApp.listen(PORT, function(){
  console.log('App started')
});