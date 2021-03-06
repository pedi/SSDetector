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
        var index = 0;
        for (var colomn in data[0])
        {
            var sum = 0;
            var sum2 = 0;
            for (var row=0; row<data.length; row++)
            {
                sum += data[row][colomn];
                sum2 += data[row][colomn]*data[row][colomn];
            }   
            average = sum/data.length;
            feature[index] = average;
            //feature[index+10] = Math.sqrt(sum2/data.length - average*average);
            feature[index+10] = Math.sqrt(sum2 - average*average);
            index++;
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
    var max = feature[0]+0.001;
    var min = feature[0];
    var range = new Array();
    for (var i=1; i<feature.length; i++)
    {
        if(feature[i]>=max)
        {
            max = feature[i];
        }else if(feature[i]<=min)
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
    console.log ("min : " + range[1] + " max : " + range[0]);
    for(var each=0; each<feature.length; each++)
    {
        featureScaled[each] = ((feature[each]-range[1])/(range[0]-range[1]))*2-1;
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
module.exports = function(data){
    var feature = featureCalculation(data);
    var featureScaled = scale(feature);   
    console.log (featureScaled);
    var patternNum = svm.predict(featureScaled);
    switch(patternNum) {

    case 1:
     return "sitting";
     break;
    case 2:
     return "sit2stand";
     break;
    case 3:
     return "standing";
     break;
    case 4:
     return "stand2sit";
     break;
    case 5:
     return "walking";
     break;
    default:
     return "no result";
    }
};
