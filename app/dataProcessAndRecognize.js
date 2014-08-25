/*
Project: SilverSense.
Function: Pre-process the raw data and recognize the pattern.(sit,stand,sit2stand,stand2sit,walk,fall)
Feature Used: mean and standard deviation.
Input: A raw data array of instanceNum X sensorNum.
Output: A string telling the pattern.("sit","stand","sit2stand","stand2sit","walk","fall") 
Written by: Wu Zhengxun.
Time: 2014.08.21
*/

var nodesvm = require("node-svm");
var readFile = require("./readDataSetFromCSVFile");
var async = require("async");
///////////////////////////////////////////////////////////////////////
//Data Processing: feature calculation & scale
///////////////////////////////////////////////////////////////////////

/*
Function name: featureCalculation.
Description: transfer raw data of instanceNum X sensorNum to features of 1 X featureNum(2*sensorNum).
3D is for labeled data = training data
2D is for unlabeled data = raw data
Input: an array of instanceNum X sensorNum, WindowSize and if with label 1:with 0:without.
Output: an array of 1 X featureNum(2*sensorNum) X label;
*/
function featureCalculation3D(scaledData,windowSize){
    var instanceNum = scaledData.length;
    var featureNum = Math.ceil(instanceNum/windowSize)-1;
    var sensorNum = scaledData[0][0].length;

    var feature = scaledData;
    var result = new Array();
    for(var index=0; index<featureNum; index++){
        for(var colomn=0; colomn<sensorNum; colomn++){
            var sum = 0;
            var sum2 = 0;
            for(var row=0; row<windowSize; row++){
                //calculate the features
                sum += scaledData[row+windowSize*index][0][colomn];
                sum2 += Math.pow(scaledData[row+windowSize*index][0][colomn],2);
            }
            average = sum/windowSize;
            feature[index][0][colomn] = average;
            feature[index][0][colomn+sensorNum] = Math.sqrt(sum2/windowSize - Math.pow(average, 2));
        }
    }
    
        for(var i=0; i<featureNum; i++){
            result[i] = feature[i];
        }

    return result;
}

function featureCalculation2D(scaledData){
    var instanceNum = scaledData.length;
    var sensorNum = scaledData[0].length;
    var feature = new Array();

    //var feature = new Array();
        for(var colomn=0; colomn<sensorNum; colomn++){
            var sum = 0;
            var sum2 = 0;
            for(var row=0; row<instanceNum; row++){
                sum += scaledData[row][colomn];
                sum2 += Math.pow(scaledData[row][colomn],2);
            }
            average = sum/instanceNum;
            feature[colomn] = average;
            feature[colomn+sensorNum] = Math.sqrt(sum2/instanceNum - Math.pow(average,2));
        }
        console.log("feature done");
        return feature;
}

/*
Function name: scale.
Description: rescale the features to [-1,1].
3D is for labeled data = training data
2D is for unlabeled data = data to be predicted
Input: a 2 dimention raw data array of instanceNum X sensorNum and if with Lable 1:with 0:without;
Output: a scaled data array of instanceNUm X sensorNum.
*/

function scaleData3D(data)
{
    var dataInstance = new Array();
        for(var i=0; i<data.length; i++){
        dataInstance[i] = data[i][0];
        }
    //find the range of the instances
    for (var colomn=0; colomn<dataInstance[0].length; colomn++){
        var max = dataInstance[0][colomn]+0.1;
        var min = dataInstance[0][colomn];
        for (var row=0; row<dataInstance.length; row++){
            if(dataInstance[row][colomn]>=max){
                max = dataInstance[row][colomn];
            }else if(dataInstance[row][colomn]<=min){
                min = dataInstance[row][colomn];
            }
        }
        console.log("max is:" + max + '\t' + "min is:" + min +'\n');
        for (row=0; row<dataInstance.length; row++){
            dataInstance[row][colomn] = (dataInstance[row][colomn] - min)/(max - min)*2-1;
        }
    }
    
    for(i=0; i<data.length; i++){
        data[i][0] = dataInstance[i];
    }
    return data;
}

function scaleData2D(data)
{
    var range = [
        [20,20,20,5,7, 4,8,17,13,25],
        [-20,-20,-20,-4,-6, -3,-5,-20,-11,-21]
    ];

    for(var colomn=0; colomn<data[0].length; colomn++){
        var max = range[0][colomn];
        var min = range[1][colomn];
        for(var row=0; row<data.length; row++){
            data[row][colomn] = (data[row][colomn] - min)/(max - min)*2-1;
        }
    }
    console.log("scale done");
    return data;
}

//////////////////////////////////////////////////////////////////////
//Train model & predict new instance
//////////////////////////////////////////////////////////////////////

/*
Function name: trianSVM.
Description: train SVM by given address of training data which is a three dimention array.
Input: a string training data address and a double value of gamma value.
Output: none. change the svm variable.
*/
/*
function trainAndSaveModel(address,destination){
    var svm = new nodesvm.CSVC({
        kernelType: nodesvm.KernelTypes.RBF,
        gamma: 1,
        C: 1,
        normalize: false,
        reduce: false
    });
readFile(address,function(trainingData){
    var scaledTrainingData = scale3D(trainingData);
    var feature = featureCalculation3D(scaledTrainingData);
    svm.once('trained', function(){
        svm.saveToFile(destination);
    });
    svm.train(feature);
});
}
*/
//if there is processed training data already, this function can train a model to use in the code.
/*function trainAndReturnModel(address){
    var svm = new nodesvm.CSVC({
        kernelType: nodesvm.KernelTypes.RBF,
        gamma: 1,
        C: 1,
        normalize: false,
        reduce: false
    });
readFile(address,function(trainingData){
    console.log("trainingData successfully loaded");
    svm.once('trained', function(){
        console.log("successfully training");
        return svm;
    });
    svm.train(trainingData);
});
    
}
*/
/*
Function name = testSVM.
Description: test SVM by given address of testing data.
Input: a string of testing data address.
Output: test report.
*/

//////////////////////////////////////////////////////////////////////
//Classification
//////////////////////////////////////////////////////////////////////

//Option1:a new svm model
/*var svm = new nodesvm.CSVC({
    kernelType: nodesvm.KernelTypes.RBF,
    gamma: 1,
    C: 1,
    normalize: false,
    reduce: false
});*/
//model training
//readFile("train.csv", function(trainingData){
//    svm.train(trainingData);
//});

//Option2:load a svm model
//var svm = new nodesvm.CSVC({model: loadModelFromFile(address)});

/*
Function name: recognize.
Description: return the result of prediction given a new group of raw data.
Input: an array of instanceNum X sensorNum.
Output: an string of result.
*/

function trainModel(data)
{
    var svm = new nodesvm.CSVC({
        kernelType: nodesvm.KernelTypes.RBF,
        gamma: 1,
        C: 1,
        normalize: false,
        reduce: false
    });
    console.log("svm is successfully built");
    
readFile("trainNew.csv",function(trainingData){
        svm.train(trainingData);
        return svm;
}

function recognize(svm,data,callback){
    //var oldSvm = trainAndReturnModel(address);
    var patternNum;
    var result;
    var dataScaled = scaleData2D(data);
    var feature = featureCalculation3D(dataScaled);
       
        patternNum = svm.predict(feature);
        console.log("prediction done");
        //return patternNum;
       switch(patternNum) {

        case 1:
        result = "sitting";
        break;
        case 2:
        result = "sit2stand";
        break;
        case 3:
        result = "standing";
        break;
        case 4:
        result = "stand2sit";
        break;
        case 5:
        result = "walking";
        break;
        default:
        result = "no result";
        }
        callback(result);
    });

exports.recognize = recognize;
exports.trainModel = trainModel;
//exports.trainAndSaveModel = trainAndSaveModel;
//exports.featureCalculation3D = featureCalculation3D;
