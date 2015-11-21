/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);

var logOb;

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}


function onDeviceReady() {

	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		console.log("got main dir",dir);
		dir.getFile("log.txt", {create:true}, function(file) {
			console.log("got the file", file);
			logOb = file;
			writeLog("App started");			
		});
		reader = dir.createReader();
    reader.readEntries(
      function (entries) {
        console.log(entries);
        for (i=0; i < entries.length; i++) {
        	if (entries[i].isFile) {
        		$("#notes").append('<li><a href="text.html" class="ui-btn"><i class="fa fa-align-center fa-sticky-note"></i>'+ 
        			entries[i].name.slice(0,-4) + 
        			"</a></li>");
        	}
        }
      },
      function (err) {
        console.log(err);
      }
    );
	});
}

function writeLog(str) {
	if(!logOb) return;
	var log = str;
	console.log("going to log "+log);
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		console.log("ok, in theory i worked");
	}, fail);
}

function justForTesting() {
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
			document.querySelector("#content").innerHTML= this.result;
		};
		reader.readAsText(file);
	}, fail);

}