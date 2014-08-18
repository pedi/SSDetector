var fs = require('fs');

function readLines(filename, callback) {
    var input = fs.createReadStream(filename);
    convertedData = [];
    var remaining = '';
    input.on("data", function(data) {
        remaining += data;
        var index = remaining.indexOf("\n");
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            convertLineToDataArray(line);
            index = remaining.indexOf("\n", last);
        }

        remaining = remaining.substring(last);
    });

    input.on("end", function() {
        if (remaining.length > 0) {
            convertLineToDataArray(remaining);
        }
        callback(convertedData);
    });
}
function convertLineToDataArray (data) {
    var line = data.split(",");
    var category = +line[line.length-1];
    var features = line.slice(0, line.length-1);
    for (var i=0; i<features.length; i++) {
        features[i] = +features[i];
    }
    var oneRow = [features, category];
    convertedData.push(oneRow);
}

var convertedData = [];
module.exports = readLines;
