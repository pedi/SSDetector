var readFile = require('./readDataSetFromCSVFile');
var dataProcess = require('./dataProcessAndRecognize');
var fs = require('fs');
var feature;
var windowSize = 100;


readFile("scaledSit.csv", function(data){
    feature = dataProcess.featureCalculation3D(data,windowSize);
    var file1 = fs.createWriteStream('feature_1_sit.csv');
    file1.on('error', function(error){console.log("sit");});

    feature.forEach(function(sitData){
        file1.write(sitData.join(',')+'\n');
    });
    file1.end();

    readFile("scaledSit2Stand.csv", function(data){
        feature = dataProcess.featureCalculation3D(data,windowSize);
        var file2 = fs.createWriteStream('feature_2_sit2stand.csv');
        file2.on('error', function(error){console.log("sit2Stand");});

        feature.forEach(function(sit2StandData){
            file2.write(sit2StandData.join(',')+'\n');
        });
        file2.end();

        readFile("scaledStand.csv", function(data){
            feature = dataProcess.featureCalculation3D(data,windowSize);
            var file3 = fs.createWriteStream('feature_3_stand.csv');
            file3.on('error', function(error){console.log("stand");});

            feature.forEach(function(standData){
            file3.write(standData.join(',')+'\n');
        });
            file3.end();

            readFile("scaledStand2Sit.csv", function(data){
                feature = dataProcess.featureCalculation3D(data,windowSize);
                var file4 = fs.createWriteStream('feature_4_stand2sit.csv');
                file4.on('error', function(error){console.log("stand2Sit");});

                feature.forEach(function(stand2SitData){
                file4.write(stand2SitData.join(',')+'\n');
            });
                file4.end();

                readFile("scaledWalk.csv", function(data){
                    feature = dataProcess.featureCalculation3D(data,windowSize);
                    var file5 = fs.createWriteStream('feature_5_walk.csv');
                    file5.on('error', function(error){console.log("walk");});

                    feature.forEach(function(walkData){
                    file5.write(walkData.join(',')+'\n');
                    });
                        file5.end();
                });

            });            

        });

    });   

});





