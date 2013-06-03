var vid = document.URL.split("?")[1];

if (vid) {
	var form = document.getElementById("novidform");
	form.style.display = "none";
}

function isGeneric(vid) {
	return /.mp4$/.test(vid)
}

function play() {
	console.log("play");
	if (!vid) {
		vid = encodeURIComponent(document.getElementById("vidurl").value);
		console.log(vid)
	}

	var url;
	if (isGeneric(vid)) {
		url = '/video/play/generic/' + vid;
	}
	else {
		// if all else fails try html5
		url = '/video/play/html5/' + vid;
	}
	$.get(url); 
};
