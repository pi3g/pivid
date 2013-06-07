function main() {
	// define site specific handlers
	var handlers = {
		"www.youtube.com": function () {
			var width = $("#movie_player").width();
			var height = $("#movie_player").height();
			var iframe = $("<iframe src='http://localhost:3000/playbutton.html?" +
				encodeURIComponent(window.location) + "' width='" + width + "' height='" + height +
				"' style='border: 0;'></iframe>");
			$("#movie_player").replaceWith(iframe);
		},

		// if none of the above apply try html5 video
		"html5": function () {
			/*
			var vid = ""
			$("video").find("source").each(function() {
				var src = $(this).attr("src");
				if (/.mp4$/.test(src)) {
					vid = src;
				}
			});
			var width = $("video").width()
			var height = $("video").height()
			$("video").before("<iframe src='http://localhost:3000/playbutton.html?" +
				encodeURIComponent(vid) + "' width='" + width + "' height='" + height +
				"' style='border: 0;'></iframe>");
			*/
			var width = $("video").width();
			var height = $("video").height();
			var iframe = $("<iframe src='http://localhost:3000/playbutton.html?" +
				encodeURIComponent(window.location) + "' width='" + width + "' height='" + height +
				"' style='border: 0;'></iframe>")
			$("video").replaceWith(iframe);
			
		},
	};

	// call appropriate handler
	if (handlers[window.location.hostname]) {
		handlers[window.location.hostname]();
	} else {
		handlers["html5"]();
	}
}

// load jQuery; wait unitl document is ready; execute main
var loaderScript= document.createElement("script");
loaderScript.src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
loaderScript.addEventListener('load', function () {
	var bodyScript = document.createElement("script");
	bodyScript.textContent = "$(document).ready(" + main + ");";
	document.body.appendChild(bodyScript);
}, false);
document.body.appendChild(loaderScript);
