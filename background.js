
const API = 'http://wedata.net/databases/Redirector/items.json';
const EXPIRES = 7;

if (this.safari) {
	safari.application.addEventListener('message', function(e) {
		var handler = function(data) {
			e.target.page.dispatchMessage('response', data);
		};
		var stash = load();
		if (stash && stash.expires >= +new Date)
			handler(stash.data);
		else
			update(stash, handler);
	}, false);
}
else if (this.chrome)
	chrome.extension.onRequest.addListener(function(request, sender, callback) {
		var stash = load();
		if ((!request || request && !request.force_update) && stash && stash.expires >= +new Date)
			callback(stash.data);
		else
			update(stash, callback);
	});


function update(stash, handler) {
	var xhr, timer;
	xhr = new XMLHttpRequest;
	xhr.open('GET', API, true);
	xhr.onload = function() {
		console.log('loaded', xhr);
		clearTimeout(timer);
		var data = JSON.parse(xhr.responseText);
		save(data);
		handler(data);
	};
	xhr.onerror = function() {
		console.log('request error', xhr);
	};
	xhr.send();

	if (stash)
		timer = setTimeout(function() {
			console.log('timeout');
			xhr.abort();
			handler(save(stash.data));
		}, 1000 * 30);
}

function load() {
	return localStorage.stash && JSON.parse(localStorage.stash);
}

function save(data) {
	if (data)
		localStorage.stash = JSON.stringify({
			data   : data,
			expires: +new Date + 1000 * 60 * 60 * 24 * EXPIRES
		});
	else
		delete localStorage.stash;

	return data;
}
