/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);

var logOb;
var filename;

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function onDeviceReady() {
	window.requestFileSystem = window.requestFileSystem ||
                             window.webkitRequestFileSystem;
                             
	filename = getUrlVars()["name"];
	var title = filename.replace(/_/g," ");
	$("#new-note-name").val(title);
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		console.log("got main dir",dir);
		console.log(filename + ".txt");
		dir.getFile(filename + ".txt", {create:false}, function(file) {
			logOb = file;
			console.log(logOb);
			readFileContent();
		});
	});

	document.querySelector("#update-note").addEventListener("touchend", function(e) {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			console.log("got main dir",dir);
			var name = $("#new-note-name").val().replace(/ /g,"_");
			console.log(filename);
			console.log(name);
			if (filename == name) {
				dir.getFile(name + ".txt", {create:false}, function(file) {
					logOb = file;
					console.log($("#new-note-content").val());
					writeLog($("#new-note-content").val());			
				});
			} else {
				// Eliminate old file
				dir.getFile(filename + ".txt", {create:false }, function(file) {
          file.remove(function() {
            console.log('File removed.' + name);
          }, fail);
        });
				// Create new one
				dir.getFile(name + ".txt", {create:true}, function(file) {
					logOb = file;
					console.log($("#new-note-content").val());
					writeLog($("#new-note-content").val());			
				});
			}
		});

	}, false);

}

function writeLog(str) {
	if(!logOb) return;
	var log = str;
	console.log("going to log "+log);
	logOb.createWriter(function(fileWriter) {
		
		// fileWriter.seek(fileWriter.length);
		fileWriter.seek(0);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		console.log("ok, in theory i worked");
		setTimeout(function() {
			document.location.href = "index.html";
    }, 5000);
	}, fail);
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function readFileContent() {
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log("Contenido es" + this.result);
			$("#new-note-content").val(this.result);
		};
		reader.readAsText(file);
	}, fail);

}