var http = require('http');
var express = require('express');
var exec = require('child_process').exec;

var app = express();

app.configure(function() {
	app.use(express.favicon());
	app.use(express['static'](__dirname )); 
});

app.get('/video/play/html5/:vid', function(req, res){
	exec("vlc " + req.params.vid);
	console.log(req.params.vid);
	res.send(200);
}); 

// default route
app.get('*', function(req, res){
	res.send('Unrecognised API call', 404);
});

app.listen(3000);
console.log('App Server running at port 3000');
