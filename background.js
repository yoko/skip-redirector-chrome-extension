'use strict';

const API = 'http://wedata.net/databases/Redirector/items.json';
const EXPIRES = 7;

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	var xhr, timer;
	var stash = load();
	if ((!request || request && !request.force_update) && stash && stash.expires >= +new Date)
		callback(stash.data);
	else {
		console.log('new!')
		xhr = new XMLHttpRequest;
		xhr.open('GET', API, true);
		xhr.onload = function() {
			console.log('loaded', xhr);
			clearTimeout(timer);
			var data = JSON.parse(xhr.responseText);
			save(data);
			callback(data);
		};
		xhr.onerror = function() {
			console.log('request error', xhr);
		};
		xhr.send();

		if (stash)
			timer = setTimeout(function() {
				console.log('timeout');
				xhr.abort();
				callback(save(stash.data));
			}, 1000 * 30);
	}
});


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
