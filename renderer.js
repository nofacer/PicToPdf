const { dialog } = require('electron').remote;
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

let targetFolders = [];
document.getElementById("selectButton").addEventListener("click",
    function () {
        targetFolders = dialog.showOpenDialogSync({
            properties: ["openDirectory", "multiSelections"]
        });
    });

document.getElementById("convertButton").addEventListener("click",
    function () {
        dealWithSingleFolder();
    });

function getFileType(fileName) {
    let startIndex = fileName.lastIndexOf(".");
    if (startIndex != -1) return fileName.substring(startIndex + 1, fileName.length).toLowerCase();
    else return "";
}

function convert(imagesList, outputPath) {
    if (imagesList.length == 0) {
        dealWithSingleFolder();
    }
    const doc = new PDFDocument();
    const imageConfig = {
        fit: [doc.page.width, doc.page.height],
        align: "center",
        valign: "center"
    };
    doc.pipe(fs.createWriteStream(outputPath)).on("finish", function () {
        console.log(outputPath + "-success");
        dealWithSingleFolder();
    });
    doc.image(imagesList[0], 0, 0, imageConfig);
    for (let i = 1; i < imagesList.length; i++) {
        doc.addPage().image(imagesList[i], 0, 0, imageConfig);
    }
    doc.end();
}

function dealWithSingleFolder() {
    if (targetFolders.length == 0) {
        alert('finish');
        return;
    }
    const currentFolder = targetFolders.pop();
    let filterdFiles = [];
    let names = fs.readdirSync(currentFolder);
    for (let i = 0; i < names.length; i++) {
        if (getFileType(names[i]) == "png" || getFileType(names[i]) == "jpg") {
            filterdFiles.push(currentFolder + "/" + names[i]);
        }
    }
    filterdFiles.sort(function (a, b) {
        return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });

    const filename = path.basename(currentFolder) + ".pdf";
    const outputPath = path.join(path.resolve(currentFolder, '..'), filename);
    convert(filterdFiles, outputPath);
}