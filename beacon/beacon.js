/**
 * 统一埋点脚本
 *
 * @author: jizha.wyj@taobao.com
 *
 */

(function (global) {
	var rnd_id = global["_tb_beacon_id"] || 1;
	global["_tb_beacon_id"] = rnd_id + 1;
	function log(msg) {
		var el = document.getElementById("inform-ul"),
			dt = new Date(),
			s, li,
			el0;

		s = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " "
			+ "beacon.js#" + rnd_id + " "
			+ msg;
		li = document.createElement("li");
		li.appendChild(document.createTextNode(s));

		if (!el) {
			el0 = document.createElement("div");
			el0.id = "inform";
			el = document.createElement("ul");
			el.id = "inform-ul";
			el0.appendChild(el);
			document.getElementsByTagName("body")[0].appendChild(el0);
		}

		el.appendChild(li);
	}
	log("开始加载！")


	var _k = "_tb_beacon_loaded";
	if (global[_k]) {
		log("beacon.js 已经加载，本脚本停止执行！")
		return;
	} // 防止本段脚本重复执行
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
			log("准备发送打点信息...");
			var img = new Image(),
				rnd_id = "_ta_rndid_" + Math.random();

			global[rnd_id] = img;

			img.onload = img.onerror = function () {
				global[rnd_id] = null;
				log("打点信息发送完成。");
			};

			img.src = beacon_url + "?cache="
				+ Math.floor(rnd_num * 9999999 + 1) + "&pre=" + escape(referrer) + "&scr=" + screen.width + "x" + screen.height
//				+ "&category=&userid=&tid=04af1429123307f430c02f184c67f005&channel=109&ad_id="
				+ "&" + ex_params;

			img = null;
			log("打点信息已发送。");
		}
	}

	log("加载完成，即将初始化...")
	engine.init();
	log("初始化完成。")

})(window);

