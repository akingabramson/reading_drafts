var querystring = require("querystring");
var fs = require("fs");
//querystring.parse will parse the utf-8 text


function start(response, postData) {
	var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" '+ 
		'content="text/html; charset=UTF-8" />'+ '</head>'+ '<body>'+ 
		'<form action="/upload" enctype="multipart/form-data" '+ 'method="post">'+ 
		'<input type="file" name="upload">'+ 
		'<input type="submit" value="Upload file" />'+ '</form>'+ '</body>'+ '</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, postData) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(querystring.parse(postData).text); 
	response.end();
}

function show(response) {
	fs.readFile("tmp/test.jpg", "binary", function(error, file){
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"}); 
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	})
}

exports.start = start;
exports.upload = upload;
exports.show = show;