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
///////////////////////////////////////////////////////////////////////
//Feature calculation 
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
    var feature = new Array();
    var columnIndex = 0;
    var sensorNum = 0;
    for (var eachColumn in scaledData[0]) {
        if (scaledData[0].hasOwnProperty(eachColumn)) {
            sensorNum++;
        }
    }

    //var feature = new Array();
        for(var colomn in scaledData[0]){
            if (scaledData[0].hasOwnProperty(colomn)) {
                var sum = 0;
                var sum2 = 0;
                for(var row=0; row<instanceNum; row++){
                    sum += scaledData[row][colomn];
                    sum2 += Math.pow(scaledData[row][colomn],2);
                }
                average = sum/instanceNum;
                feature[columnIndex] = average;
                feature[columnIndex+sensorNum] = Math.sqrt(sum2/instanceNum - Math.pow(average,2));
                columnIndex++;
            }
            
        }
        console.log("feature done");
        return feature;
}

///////////////////////////////////////////////////////////////////////
//Raw data scaling
///////////////////////////////////////////////////////////////////////

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
    var colomnIndex = 0;
    for(var colomn in data[0]){
        if (data[0].hasOwnProperty(colomn)) {
            var max = range[0][colomnIndex];
            var min = range[1][colomnIndex];
            for(var row=0; row<data.length; row++){
                data[row][colomn] = (data[row][colomn] - min)/(max - min)*2-1;
            }
            colomnIndex++;
        }
    }
    console.log("scale done");
    return data;
}

//////////////////////////////////////////////////////////////////////
//Train model & predict new instance
//////////////////////////////////////////////////////////////////////

/*
Function name: trainModel.
Description: train a SVM model with the scaled feature data.
Input: an address of training data.
Output: a trained model.
*/
var svm;
function trainModel(trainingDataAddress,callback)
{
    svm = new nodesvm.CSVC({
        kernelType: nodesvm.KernelTypes.RBF,
        gamma: 1,
        C: 1,
        normalize: false,
        reduce: false
    });
    console.log("svm is successfully built");
    
    readFile(__dirname + trainingDataAddress,function(trainingData){
        svm.train(trainingData);
        svm.once("trained", callback);
    });
}

//////////////////////////////////////////////////////////////////////
//Classification
//////////////////////////////////////////////////////////////////////

/*
Function name: recognize.
Description: return the result of prediction given a new group of raw data.
Input: an array of instanceNum X sensorNum.
Output: an string of result.
*/
function recognize(data){
    //var oldSvm = trainAndReturnModel(address);
    var patternNum;
    var result;
    var dataScaled = scaleData2D(data);
    var feature = featureCalculation2D(dataScaled);
    patternNum = svm.predict(feature);
    console.log("prediction done");
        //return patternNum;
    switch(patternNum) {
        case 1:
            result = "sitting";
            break;
        case 2:
            result = "no result";
            break;
        case 3:
            result = "standing";
            break;
        case 4:
            result = "transition";
            break;
        case 5:
            result = "walking";
            break;
        default:
            result = "no result";
    }
    return result;
};

exports.recognize = recognize;
exports.trainModel = trainModel;
exports.featureCalculation3D = featureCalculation3D;
exports.scaleData3D = scaleData3D;
