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
app.get('/video/play/generic/:vid'), function(req, res) {
	play(req.params.vid);
	res.send(200);
}

// try to find a html5 video element
app.get('/video/play/html5/:vid', function(req, res){
	parsed = url.parse(req.params.vid)
	var options = {
		host: parsed['host'],
		port: 80,
		path: parsed['path'],
	};

	var html = '';
	http.get(options, function(remres) {
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
app.get('/video/play/html5/:vid', function(req, res){
	console.log(req.params.vid);
}); 

// default route
app.get('*', function(req, res){
	res.send('Unrecognised API call', 404);
});

// play video with known location
function play(vid) {
	console.log(vid);
	//exec("vlc " + vid);
}

app.listen(3000);
console.log('App Server running at port 3000');
