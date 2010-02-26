
var $ = document.querySelector.bind(document);

show_item_list();
show_license();


function update() {
	var status = $('#update-status');
	var button = $('#update-button');
	button.disabled = true;
	status.innerHTML = '<img src="images/loading.gif" alt="" width="16" height="16"/>';

	chrome.extension.sendRequest({ force_update: true }, function(data) {
		status.innerText = 'Updated';
		button.disabled = false;
	});
}

function show_item_list() {
	chrome.extension.sendRequest(null, function(data) {
		var list = [],
			length = data.length;

		var new_length = 0;
		for (var i = 0; i < length; i++) {
			var item = data[i];
			var name = item.name, site_url = item.data.site_url, fixme = item.data.fixme;
			list.push(
				fixme    ? '<li class="fixme">'+name+'</li>' :
				site_url ? '<li><a href="'+site_url+'">'+name+'</a></li>' :
				           '<li>'+name+'</li>'
			);
			if (!fixme) new_length++;
		}
		$('#total-item').innerText = new_length;
		$('#supported ul').innerHTML = list.join('');
	});
}

function show_license() {
	xhr = new XMLHttpRequest;
	xhr.open('GET', 'License', true);
	xhr.onload = function() {
		$('#license pre').innerText = xhr.responseText;
	};
	xhr.send();
}
