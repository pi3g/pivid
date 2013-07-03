var vid = document.URL.split("?")[1];

if (vid) {
	var form = document.getElementById("novidform");
	form.style.display = "none";
}

function isDirect(vid) {
	return /\.(mp4|avi)[&$]?/.test($.trim(decodeURIComponent(vid)));
}

function isYoutube(vid) {
	return /^https?:\/\/www\.youtube\.com/.test($.trim(decodeURIComponent(vid)));
}

function isVeehd(vid) {
	return /^https?:\/\/veehd\.com/.test($.trim(decodeURIComponent(vid)));
}

function play() {
	if (!vid) {
		vid = encodeURIComponent(document.getElementById("vidurl").value);
	}
	console.log("find API call for url:");
	console.log(vid);

	var url;
	if (isDirect(vid)) {
		console.log("direct");
		url = '/video/play/direct/' + vid;
	}
	else if (isYoutube(vid)) {
		console.log("youtube");
		url = '/video/play/youtube/' + vid;
	}
	else if (isVeehd(vid)) {
		console.log("veehd");
		url = '/video/play/veehd/' + vid;
	}
	else {
		// if all else fails try html5
		console.log("html5");
		url = '/video/play/html5/' + vid;
	}
	$.get(url, function(data, text){
		console.log(data);
		console.log(text);
		if (data == 'OK') {
			var pause = $('<a href="#" onclick="pause();" class="control-button"><img src="img/pause.jpg" alt="pause" /></a>');
			$('.control-button').replaceWith(pause);
		}
	}); 
};

function pause() {
};
