var version = "0.0.3"

process.argv.forEach(function(val, index, array) {
	if (val == "-v" | val == "--version" ) {
		console.log(version);
		process.exit(0);
	}
});

var http = require('http');
var url = require('url');
var $ = require('jquery');
var express = require('express');
var exec = require('child_process').exec;

process.title = 'pivid'
process.on('SIGINT', function() {
	process.exit(0);
});
var app = express();

app.configure(function() {
	app.use(express.favicon());
	app.use(express['static'](__dirname )); 
});

// route for direct video location
app.get('/video/play/direct/:vid', function(req, res) {
	console.log("direct");
	var parsed = url.parse(req.params.vid);
	var vid = req.params.vid;

	if (/^https?:\/\/v\d\d\.veehd\.com/.test(req.params.vid)) {
		vid = "http://localhost:3000/veehdproxy/" + encodeURIComponent(parsed['host']) + "/" + encodeURIComponent(req.params.vid);
	}

	play(vid);
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

// get veehd video location (only works for videos that work without login and
// direct veehd links)
app.get('/video/play/veehd/:vid', function(req, res){
	console.log("veehd");
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
			var framesrc = "";
			framesrc = $.grep(html.split('\n'), function(elem, index) {
				return /("#playeriframe")/.test(elem);
			})[1];
			framesrc = /\/vpi[^"]*/.exec(framesrc)[0];


			options['path'] = framesrc;
			var framehtml = '';
			http.get(options, function(remres) {
				remres.on('data', function(data) {
					framehtml += data;
				}).on('end', function() {
					var vid = $(framehtml).find("a").get(0).href;
					play("http://localhost:3000/veehdproxy/" + encodeURIComponent(parsed['host'] + framesrc) + "/" + encodeURIComponent(vid));
					res.send(200);
				});
			}).on('error', function() {
				res.send("can't find video location");
			});
		});
	}).on('error', function() {
		res.send("can't find video location");
	});
}); 

// proxy route for veehd
// veehd links need to be proxied to fake the referer
app.get('/veehdproxy/:ref/:vid', function(req, res){
	parsed = url.parse(req.params.vid);
	var options = {
		host: parsed['host'],
		port: 80,
		path: parsed['path'],
		headers: {'Referer': req.params.ref},
	};
	http.get(options, function(reqres) {
		reqres.pipe(res)
	}).on('error', function(e) {
		res.send(404);
	});
});

// default route
app.get('*', function(req, res){
	res.send('Unrecognised API call', 404);
});

// play video with known location
function play(vid) {
	console.log("play (url length): " + vid.length);
	//wrap in lxterminal for control
	exec("./playcommand.sh '" + vid + "'", function(error, stdout, stderr) {
		console.log("subprocess output:");
		console.log(stdout + stderr + "subprocess done");
	});
}

app.listen(3000);
console.log('PiVid listening on port 3000');
