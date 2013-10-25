function route(handleMatcher, pathname, response) {
	console.log("About to route a request for " + pathname);

	if (typeof handleMatcher[pathname] === 'function') {
		return handleMatcher[pathname](response);
	} else {
		console.log("404 not found");
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("Content not found");
		response.end();
	}
}

exports.route = route