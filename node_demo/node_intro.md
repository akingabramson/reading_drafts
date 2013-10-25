# Node.js

Install Node [here][node-installation].  You'll probably want 
the Mac OS X instructions.

[node-installation]: https://github.com/joyent/node/wiki/Installation

## Hello World

Let's get node up and running.  Most node apps are set up with one
main file (usually named index.js) that requires other files.

I strongly suggest that you type this code in a sample window as you go along.

Start by making a server file in your root directory called *server.js*.  

Write the following code:

```javascript
var http = require("http");

http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}).listen(8888);

console.log("Server Started");
```

Look familiar?  We did something similar with WEBrick in Rails Lite.  Our anonymous function runs code in the same way that .mount_proc runs code when a request comes in.

Run `node server.js` and go to localhost:8888 in your browser.

What's going on? Node is asynchronous, i.e., it says "make a server, and when a request comes in, we'll run this *callback*".
We can prove that node is running asynchronously because "Server Started" gets logged before any requests come in.


## The Index File

Time to start building our main file, *index.js*.

```javascript
//index.js

var server = require("./server");

server.start();
```

Try visiting localhost:8888 again--it should still work.  By using `require("./server")`, we're pulling in the server file's exports and setting them to a variable called `server`.  

Fool around by setting global variables in the the server file and accessing them in the index file.

## Routing

Remember Rails lite?  In the same way that we made a router object that takes in a path and runs the matching controller action, we're going to eventually make a function that takes in the
path and keeps track of request handlers to route a request to the appropriate "action".

First, let's write some request handlers (our "actions").

```javascript
//request_handlers.js

var exec = require("child_process").exec;

function start(response) {
	console.log("Request handler 'start' was called.");
	var content = "empty";
	

	exec("ls -lah", // this could be any "blocking operation"
									// that is, an operation that takes a while
									// to return that would ordinarily stop the // server

	 	function(err, stdout, stderr){
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(stdout);
			response.end();
		});
}

function upload(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("in upload");
	response.end();
}

exports.start = start;
exports.upload = upload;
```

What's this `exec`[exec][exec] thing we're using?  Speaking literally, it's a node function that lets you run terminal commands.  But we could easily run a different function that also takes a long time to return (e.g. running a really long sql query or reading a huge file from the hard drive).

Just like in jQuery (e.g. with `.on("click", function(){})`), we
want to pass exec a *callback* that will run once the
information that we want is returned.  Without this callback, node would wait for the information to come back before *any* other method runs.  Instead, we put the callback in the event loop and node can continue running and serving other requests.



We'll match paths to these request handler functions (start and upload) our index file.

```javascript
//index.js
//...
var requestHandlers = require("./request_handlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
```

Notice that we're not passing the entire router into the server.Just the route function and the handle object.  It may also make sense to have written the handle object directly in the route function, but it's easier to test this way.  See the [dependency-injection][dependency-injection] reading.

Now, in the server, we pass the handle hash and the response to our route function (look familiar?).

```javascript
//server.js
//...
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response);
//...
```


```javascript
//router.js

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

exports.route = route;
```

