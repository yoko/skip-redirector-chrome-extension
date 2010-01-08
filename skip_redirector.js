'use strict';

chrome.extension.sendRequest(null, function(data) {
	var i = data.length;
	while (i--) {
		var item = data[i].data;
		var url = item.url;
		var link = item.link;
		var replace_url = item.replace_url;
		if (new RegExp(url).test(location.href)) {
			if (replace_url) {
				var reditrect_url = decodeURIComponent(location.href.replace(new RegExp(url), replace_url));
				if (/^https?:\/\//.test(reditrect_url))
					location.href = reditrect_url;
			}
			else if (link) {
				var a = $X(link)[0];
				if (a) {
					var e = document.createEvent('MouseEvent');
					e.initEvent('click', false, true);
					a.dispatchEvent(e);
				}
			}
			return;
		}
	}
});


// http://gist.github.com/3242
function $X (exp, context) {
	context || (context = document);
	var expr = (context.ownerDocument || context).createExpression(exp, function (prefix) {
		return document.createNSResolver(context.documentElement || context).lookupNamespaceURI(prefix) ||
			context.namespaceURI || document.documentElement.namespaceURI || "";
	});

	var result = expr.evaluate(context, XPathResult.ANY_TYPE, null);
		switch (result.resultType) {
			case XPathResult.STRING_TYPE : return result.stringValue;
			case XPathResult.NUMBER_TYPE : return result.numberValue;
			case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
			case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
				// not ensure the order.
				var ret = [], i = null;
				while (i = result.iterateNext()) ret.push(i);
				return ret;
		}
	return null;
}
