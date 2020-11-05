const { dialog } = require('electron').remote;
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

let targetFolder="";
document.getElementById("selectButton").addEventListener("click",
function(){
  let folderPath = dialog.showOpenDialogSync({
          properties: ["openDirectory"]
        })[0];
   targetFolder=folderPath;
   document.getElementById("folderText").innerHTML="<span>Folder:</span>"+folderPath;
});

document.getElementById("convertButton").addEventListener("click",
function() {
    let filterdFiles = [];
    let names = fs.readdirSync(targetFolder);
    for (let i = 0; i < names.length; i++) {
        if (getFileType(names[i]) == "png" || getFileType(names[i]) == "jpg") {
            filterdFiles.push(targetFolder + "/" + names[i]);
        }
    }
    filterdFiles.sort(function(a, b) {
        return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });


    const filename = path.basename(targetFolder) + ".pdf";
    const outputPath = path.join(targetFolder, filename);
    convert(filterdFiles,outputPath);

});

function getFileType(fileName) {
    let startIndex = fileName.lastIndexOf(".");
    if (startIndex != -1) return fileName.substring(startIndex + 1, fileName.length).toLowerCase();
    else return "";
}

function convert(imagesList,outputPath){
    const doc = new PDFDocument();
    const imageConfig = {
        fit: [doc.page.width, doc.page.height],
        align: "center",
        valign: "center"
    };
    doc.pipe(fs.createWriteStream(outputPath)).on("finish", function() {
         alert("success");
        });
    doc.image(imagesList[0], 0, 0, imageConfig);
    for (let i = 1; i < imagesList.length; i++) {
        doc.addPage().image(imagesList[i], 0, 0, imageConfig);
    }
    doc.end();
}