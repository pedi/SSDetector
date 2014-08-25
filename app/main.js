var nodesvm = require("node-svm");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var recognize = require("./recognize");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Content-Type");
    next();
});
app.post("/predict", function(req, res) {
    var rawData = req.body;
    //console.log (req.body);
    // call SVM prediction function using rawData
    // for test,now echo back data
    var result = recognize(rawData);
    console.log (result);
    res.send(result);
    //    res.send(rawData);
});
app.get("/index.html", function(req, res) {
    res.send("Hello World");
});

var server = app.listen(3001, function() {
    console.log("listening on port %d", server.address().port);
});

