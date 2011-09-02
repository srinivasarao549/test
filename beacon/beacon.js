/**
 * 统一埋点脚本
 *
 * @author: jizha.wyj@taobao.com
 *
 */

(function (global) {

	// http://www.atpanel.com/1.gif?
	// cache=593580&pre=&scr=1680x1050&category=&userid=&tid=04af1429123307f430c02f184c67f005&channel=109&ad_id=

	var _k = "_tb_beacon_loaded";
	if (global[_k]) return; // 防止本段脚本重复执行
	global[_k] = 1;

	var doc = document,

		// 打点图片地址
		beacon_url = ("https:" == document.location.protocol ? "https://timg" : "http://t") + ".atpanel.com/1.gif",

		// 额外参数
		ex_params = getExParams(),

		rnd_num = Math.random(),

		// 当前路径
		pathname = location.pathname,

		// 当前页面的来源
		referrer = doc.referrer,

		// 当前路径中如果包含这些值，则进行打点
		count_paths = [
//			"/list_forum", // 老论坛，已经下线，可以去掉
			"/theme/info/info",
			"/promo/co_header.php",
			"fast_buy.htm", // 还在使用 2011-07-14
			"/add_collection.htm", // 还在使用 2011-07-14
			"/taobao_digital_iframe"
		];

	function containPath() {
		for (var i = 0, l = count_paths.length; i < l; i ++) {
			if (pathname.indexOf(count_paths[i] != -1))
				return true;
		}
		return false;
	}

	// 取得额外的引用当前 js 时在 src 后面添加的参数
	function getExParams() {
		var current_node = doc.getElementById("tb-beacon");
		return current_node.getAttribute("exparams") || "";
	}


	var engine = {
		init: function () {
			if (parent === self || containPath()) {
				engine.send();
			}
		},

		send: function () {
			var img = new Image(),
				rnd_id = "_ta_rndid_" + Math.random();

			global[rnd_id] = img;

			img.onload = img.onerror = function () {
				global[rnd_id] = null;
			};

			img.src = beacon_url + "?cache="
				+ Math.floor(rnd_num * 9999999 + 1) + "&pre=" + escape(referrer) + "&scr=" + screen.width + "x" + screen.height
//				+ "&category=&userid=&tid=04af1429123307f430c02f184c67f005&channel=109&ad_id="
				+ "&" + ex_params;

			img = null;
		}
	}

	engine.init();

})(window);

//(function() {
//	function atrand(num) {
//		return Math.floor(Math.random() * num) + 1
//	}
//
//	var P = location.pathname;
//	if ((parent === self)
//		|| P.indexOf('/list_forum') != -1
//		|| P.indexOf('/theme/info/info') != -1
//		|| P.indexOf('/promo/co_header.php') != -1
//		|| P.indexOf('fast_buy.htm') != -1
//		|| P.indexOf('/add_collection.htm') != -1
//		|| P.indexOf('/taobao_digital_iframe') != -1
//		|| window.tbdw_frame_count == true) {
//
//		var R = escape(document.referrer);
//		document.write('<img src="http://www.atpanel.com/1.gif?cache='
//			+ atrand(9999999) + '&pre=' + R + '&scr=' + screen.width + 'x' + screen.height
//			+ '&category=&userid=&tid=04af1429123307f430c02f184c67f005&channel=109&ad_id=" width="0" height="0" style="display:none;" />')
//	}
//})();