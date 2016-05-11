var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/saveConfig', function (req, res) {
    
    var data = req.body;
    console.log('posting config', data);
    
    fs.writeFile("./json/" + data.configName + '.json', JSON.stringify(data), function(err) {
        if (err) {
           console.log(err);
        }
        else
           console.log("Successfully wrote " + data.configName + '.json');
    });
        
    
});

app.listen(8888);