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
            html = "<li>" +
              '<a href="edit-note.html?name=' + entries[i].name.slice(0,-4) + '" class="ui-btn ui-btn-b" data-ajax="false">' +
                '<h2>' + entries[i].name.slice(0,-4).replace(/_/g," ") +'</h2>' +
              '</a>' +
              '<p class="ui-li-aside">' +
                '<a class="delete-btn" href="#popupDialog"' +
                    'data-rel="popup" data-position-to="window" data-transition="pop" data-name="' + entries[i].name.slice(0,-4) + '" > ' +
                  '<button class="ui-tag ui-link" style="background-color: red;" >' +
                    '<strong>Eliminar</strong>' +
                  '</button>' +
                '</a>' +
              '</p>' +
            '</li>';  
        		$("#notes").append(html);
        	}
        }
        $('.delete-btn').on('touchend', function (e) {
          var name = $(this).data('name') + ".txt";
          $('#delete').attr('data-name', name);
        });
        $('#delete').on('touchend', function (e) {
          e.preventDefault();
          var name = $(this).data('name');
          console.log("eventoooo");
          window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
            console.log("eventoooo dir");
            console.log(name);
            dir.getFile(name, {create:false }, function(file) {
              file.remove(function() {
                console.log('File removed.' + name);
                document.location.href = "index.html";
              }, fail);
            });
          });
        });
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