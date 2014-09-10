var dataProcess = require('./dataProcessAndRecognize');
var readFile = require('./readDataSetFromCSVFile');
var fs = require('fs');

readFile('totalData.csv', function(data3D){
    var scaledData3D = dataProcess.scaleData3D(data3D,1);
    console.log(scaledData3D);
    //var file = fs.createWriteStream('scaledTotalData.csv');
    var fSit = fs.createWriteStream('scaledSit.csv');
    var fSit2Stand =fs.createWriteStream('scaledSit2Stand.csv');
    var fStand = fs.createWriteStream('scaledStand.csv');
    var fStand2Sit =fs.createWriteStream('scaledStand2Sit.csv');
    var fWalk = fs.createWriteStream('scaledWalk.csv');
    
    //file.on('error', function(error){console.log("fSit");});
    fSit.on('error', function(error){console.log("fSit");})
    fSit2Stand.on('error', function(error){console.log("fSit2Stand");});
    fStand.on('error', function(error){console.log("fStand");});
    fStand2Sit.on('error', function(error){console.log("fStand2Sit");});
    fWalk.on('error', function(error){console.log("fWalk");});
    

    var count = 1;

    scaledData3D.forEach(function(data){

        if(count<31162){
            fWalk.write(data.join(',')+'\n');
        }else if(count<35138){
            fSit2Stand.write(data.join(',')+'\n');
        }else if(count<48632){
            fStand.write(data.join(',')+'\n');
        }else if(count<51856){
            fStand2Sit.write(data.join(',')+'\n');
        }else{
            fSit.write(data.join(',')+'\n');
        }
        count++;
    });
    //file.end();
    fSit.end();
    fSit2Stand.end();
    fStand.end();
    fStand2Sit.end();
    fWalk.end();
});
