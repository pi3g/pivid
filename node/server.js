var http = require('http');
var url = require('url');
var $ = require('jquery');
var express = require('express');
var exec = require('child_process').exec;

var app = express();

app.configure(function() {
	app.use(express.favicon());
	app.use(express['static'](__dirname )); 
});

// route for direct video location
app.get('/video/play/direct/:vid', function(req, res) {
	console.log("direct");
	play(req.params.vid);
	res.send(200);
});

// try to find a html5 video element
app.get('/video/play/html5/:vid', function(req, res){
	console.log("html5");
	var html = '';
	http.get(req.params.vid, function(remres) {
		remres.on('data', function(data) {
			html += data;
		}).on('end', function() {
			var vid = ""
			$(html).find("video").find("source").each(function() {
				var src = $(this).attr("src");
				if (/.mp4$/.test(src)) {
					vid = src;
				}
			});
			play(vid);
			res.send(200);
		});
	}).on('error', function() {
		res.send("can't find video location");
	});
}); 

// use youtube-dl to find video location
app.get('/video/play/youtube/:vid', function(req, res){
	console.log("youtube");
	var vid
	exec('youtube-dl -g --max-quality mp4 ' + req.params.vid, function(error, stdout, stderr) {
		if (!error) {
			vid = stdout;
			play(vid.replace(/\n/, ''));
			res.send(200);
		}
		else {
			console.log('youtube-dl error: ' + stderr);
			res.send("couldn't get video address");
		}
	});
}); 

// get veehd video location
app.get('/video/play/veehd/:vid', function(req, res){
	console.log("veehd");
	// add proper logic here
	play(req.params.vid);
	res.send(200);
}); 

// default route
app.get('*', function(req, res){
	res.send('Unrecognised API call', 404);
});

// play video with known location
function play(vid) {
	//for development this is more useful
	console.log("play: " + vid);
	exec("omxplayer '" + vid + "'");
}

app.listen(3000);
console.log('App Server running at port 3000');
