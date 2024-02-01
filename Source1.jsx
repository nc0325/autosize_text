#target photoshop;


// Import the CSV file and convert it to an array of strings
var file = new File('E:/shirt-intput-test.csv');
var csv;
if(file.open('r')) {
 csv = file.read().replace(/^[\s]+/gm, '');
 file.close();
} else {
   $.writeln("An error occurred: " + file.error);
}
// Write the contents of the CSV file to the console
$.writeln(typeof csv);
csv = csv.replace(/"/g, '');
// Write the contents of the split and clean CSV Data
var textArray = csv.split(/\n/);
//var textArray = csv.split('#');
for (var i= 0; i < textArray.length; i++){
      var el = textArray[i];
      el = el.split("\\r\\n");
        textArray[i] = el;
}

// Set the canvas size and margin variables
var canvasWidth = 3600;
var canvasHeight = 4800;
var leftMargin = 20;
var rightMargin = 20;
var topMargin = 20;
var lineSpacing = 80;
 var maxLettersInLine = 10;
 var textRate = 0.2;
 var maxFontSize = 1296;
// Create a new Photoshop document
//var doc = app.documents.add(canvasWidth, canvasHeight);
var doc = app.documents.add();
app.preferences.rulerUnits = Units.PIXELS;
doc.resizeCanvas (canvasWidth, canvasHeight, AnchorPosition.MIDDLECENTER );  //AnchorPosition.TOPCENTER


// Set the font and color variables
var font = "Roboto-Medium";
    var fontSize = 200;
var color = new SolidColor();
color.rgb.hexValue = "000000";

function calcFontSize(el , layer, layertextItem) {
    var layerWidth;
    var targetWidth = (canvasWidth - leftMargin - rightMargin);
       layer.textItem.contents = el;

    var leftIndex=1;
    var rightIndex = targetWidth*2;
    
    fontSize = (rightIndex - leftIndex) / 2;
    layer.textItem.size = new UnitValue(fontSize,  "px");
    layerWidth= layer.bounds[2] - layer.bounds[0];
    
    while(Math.abs(layerWidth - targetWidth) >2) {
        if(layerWidth > targetWidth) {
           rightIndex = fontSize;
        } else {
           leftIndex = fontSize;
        }    
        if(leftIndex > maxFontSize)
            return maxFontSize;
        fontSize = (rightIndex + leftIndex) / 2;
        
        layer.textItem.size = new UnitValue(fontSize,  "px");
        layerWidth= layer.bounds[2] - layer.bounds[0];
        $.writeln(targetWidth + " :" + layerWidth);
        $.writeln(leftIndex  +" , "  + fontSize  +" , " +rightIndex);
    }
    return leftIndex * 0.9;
}

// Iterate through the text array and add the text to the document
for (var i = 0; i < textArray.length; i++) {
   if(!textArray[i]){
     break;
   }
   var layer = doc.artLayers.add();
   layer.kind = LayerKind.TEXT;
   layer.textItem.font = font;
   layer.textItem.color = color;
       layer.textItem.position = new Array(0, 0 );
   fontSize = calcFontSize(textArray[i][0],layer);
   layer.textItem.contents =textArray[i][0];
   layer.textItem.size = new UnitValue(fontSize,  "px");
      layer.textItem.kind = TextType.PARAGRAPHTEXT;   
   layer.textItem.width = new UnitValue(canvasWidth - leftMargin - rightMargin ,  "px");
   layer.textItem.height = new UnitValue(canvasHeight - topMargin * 2 ,  "px");
   layer.textItem.justification = Justification.CENTER;
   layer.textItem.contents = textArray[i].join('\r');
   layer.textItem.position = new Array(leftMargin, topMargin + fontSize / 5);
    layer.name = textArray[i] + "-" + color.rgb.hexValue;

}

