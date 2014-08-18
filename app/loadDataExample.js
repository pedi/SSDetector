var readFile = require("./readDataSetFromCSVFile");
readFile("test.csv", function(data) {
    // do something with the data, for example training
    console.log(data);
});
