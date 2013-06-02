function play() {
	var url, vid;
	vid = document.URL.split("?")[1];
	url = '/video/play/html5/' + vid;
	$.get(url); 
};
