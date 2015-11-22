/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);

var logOb;

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function onDeviceReady() {
	window.requestFileSystem = window.requestFileSystem ||
                             window.webkitRequestFileSystem;

	document.querySelector("#save-new").addEventListener("touchend", function(e) {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			console.log("got main dir",dir);
			var name = $("#new-note-name").val().replace(/ /g,"_");
			console.log(name + ".txt");
			dir.getFile(name + ".txt", {create:true}, function(file) {
				logOb = file;
				console.log($("#new-note-content").val());
				writeLog($("#new-note-content").val());			
			});
		});
	}, false);

}

function writeLog(str) {
	if(!logOb) return;
	var log = str;
	console.log("going to log "+log);
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(0);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		console.log(log);
		setTimeout(function() {
			document.location.href = "index.html";
    }, 5000);
	}, fail);
}