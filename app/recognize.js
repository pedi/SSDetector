/*
Project: SilverSense.
Function: recognize the pattern.(sit,stand,sit2stand,stand2sit,walk)
Input: an array of 200X10.
Output: a string telling the pattern.("sit","stand","sit2stand","stand2sit","walk") 
Written by: Wu Zhengxun.
*/

///////////////////////////////////////////////////////////////////////
//Data Processing: feature calculation & scale
///////////////////////////////////////////////////////////////////////

/*
Function name: featureCalculation.
Description: transfer raw data of 200X10 to features of 1X20.
Input: an array of 200X10.
Output: an array of 1X20;
*/
function featureCalculation(data){
    var feature = new Array();
    for (var colomn=0; colomn<10; colomn++)
    {
        var sum = 0;
        var sum2 = 0;
        for (row in data)
        {
            sum += data[row][colomn];
            sum2 += data[row][colomn]*data[row][colomn];
        }   
        average = sum/200;
        feature[colomn] = average;
        feature[colomn+10] = java.lang.Math.sqrt(sum2/200 - average*average);
    }

    return feature;
}

/*
Function name: scale.
Description: rescale the features to [-1,1].
Input: an array of 1X20;
Output: an array of 1X20.
*/


/*
Description: return the max and min of the given array.
*/
function maxAndMin(feature)
{
    var max = feature[0];
    var min = feature[0];
    var range = new Array();
    for (var i=1; i<feature.length; i++)
    {
        if(feature[i]>max)
        {
            max = feature[i];
        }else
        {
            min = feature[i];
        }
    }

    range[0] = max;
    range[1] = min;
    return range;
}

function scale(feature){
    var featureScaled = new Array();
    var range = maxAndMin(feature);
    for(each in feature)
    {
        featureScaled[each] = ((feature[each]-range[1])/(range[0]-range[1]))*(2)-1;
    }
    return featureScaled;
}

//////////////////////////////////////////////////////////////////////
//Classification
//////////////////////////////////////////////////////////////////////

var nodesvm = require("node-svm");
var readFile = require("./readDataSetFromCSVFile");

//Option1:a new svm model
var svm = new nodesvm.CSVC({
    kernelType: nodesvm.KernelTypes.RBF,
    gamma: 0.5,
    C: 1,
    normalize: false,
    reduce: false
});
//model training
readFile("train.csv", function(trainingData){
    svm.train(trainingData);
});

//Option2:load a svm model
//var svm = new nodesvm.CSVC({model: loadModelFromFile(address)});

/*
Function name: recognize.
Description: return the result of prediction.
Input: an array of 200X10(raw data).
Output: an string of result.
*/


exports.recognize = function(data){
    var feature = featureCalculation(data);
    var featureScaled = scale(feature);   
    var patternNum = svm.predict(featureScaled);
    switch(patternNum)
case:1
     return "sitting";
case:2
     return "sit2stand";
case:3
     return "standing";
case:4
     return "stand2sit";
case:5
     return "walking";
default:
     return "no result";
};
