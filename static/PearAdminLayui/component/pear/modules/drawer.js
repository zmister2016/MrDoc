layui.define(['jquery', 'element'], function(exports) {
	"use strict";

	/**
	 * Drawer component
	 * */
	var MOD_NAME = 'drawer',
		$ = layui.jquery,
		element = layui.element;
	
	var drawer = new function() {
		
		/**
		 * open drawer
		 * */
		this.open = function(option) {
			var obj = new mSlider({
				dom: option.dom,
				direction: option.direction,
				distance: option.distance,
				time:option.time?option.time:0,
				maskClose:option.maskClose,
				callback:option.success
			});
			obj.open();
			return obj;
		}
		
	}
	exports(MOD_NAME,drawer);
});

/**
 * 源码
 * */
(function(b, c) {
	function a(d) {
		this.opts = {
			"direction": d.direction || "left",
			"distance": d.distance || "60%",
			"dom": this.Q(d.dom),
			"time": d.time || "",
			"maskClose": (d.maskClose + "").toString() !== "false" ? true : false,
			"callback": d.callback || ""
		};
		this.rnd = this.rnd();
		this.dom = this.opts.dom[0];
		this.wrap = "";
		this.inner = "";
		this.mask = "";
		this.init()
	}
	a.prototype = {
		Q: function(d) {
			return document.querySelectorAll(d)
		},
		isMobile: function() {
			return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false
		},
		addEvent: function(f, e, d) {
			if (f.attachEvent) {
				f.attachEvent("on" + e, d)
			} else {
				f.addEventListener(e, d, false)
			}
		},
		rnd: function() {
			return Math.random().toString(36).substr(2, 6)
		},
		init: function() {
			var g = this;
			if (!g.dom) {
				console.log("未正确绑定弹窗容器");
				return
			}
			var d = document.createElement("div");
			var e = document.createElement("div");
			var f = document.createElement("div");
			d.setAttribute("class", "mSlider-main ms-" + g.rnd);
			e.setAttribute("class", "mSlider-inner");
			f.setAttribute("class", "mSlider-mask");
			g.Q("body")[0].appendChild(d);
			g.Q(".ms-" + g.rnd)[0].appendChild(e);
			g.Q(".ms-" + g.rnd)[0].appendChild(f);
			g.wrap = g.Q(".ms-" + g.rnd)[0];
			g.inner = g.Q(".ms-" + g.rnd + " .mSlider-inner")[0];
			g.mask = g.Q(".ms-" + g.rnd + " .mSlider-mask")[0];
			g.inner.appendChild(g.dom);
			switch (g.opts.direction) {
				case "top":
					g.top = "0";
					g.left = "0";
					g.width = "100%";
					g.height = g.opts.distance;
					g.translate = "0,-100%,0";
					break;
				case "bottom":
					g.bottom = "0";
					g.left = "0";
					g.width = "100%";
					g.height = g.opts.distance;
					g.translate = "0,100%,0";
					break;
				case "right":
					g.top = "0";
					g.right = "0";
					g.width = g.opts.distance;
					g.height = document.documentElement.clientHeight + "px";
					g.translate = "100%,0,0";
					break;
				default:
					g.top = "0";
					g.left = "0";
					g.width = g.opts.distance;
					g.height = document.documentElement.clientHeight + "px";
					g.translate = "-100%,0,0"
			}
			g.wrap.style.display = "none";
			g.wrap.style.position = "fixed";
			g.wrap.style.top = "0";
			g.wrap.style.left = "0";
			g.wrap.style.width = "100%";
			g.wrap.style.height = "100%";
			g.wrap.style.zIndex = 99;
			g.inner.style.position = "absolute";
			g.inner.style.top = g.top;
			g.inner.style.bottom = g.bottom;
			g.inner.style.left = g.left;
			g.inner.style.right = g.right;
			g.inner.style.width = g.width;
			g.inner.style.height = g.height;
			g.inner.style.backgroundColor = "#fff";
			g.inner.style.transform = "translate3d(" + g.translate + ")";
			g.inner.style.webkitTransition = "all .2s ease-out";
			g.inner.style.transition = "all .2s ease-out";
			g.inner.style.zIndex = 100;
			g.mask.style.width = "100%";
			g.mask.style.height = "100%";
			g.mask.style.opacity = "0";
			g.mask.style.backgroundColor = "black";
			g.mask.style.zIndex = "98";
			g.mask.style.webkitTransition = "all .2s ease-out";
			g.mask.style.transition = "all .2s ease-out";
			g.mask.style.webkitBackfaceVisibility = "hidden";
			g.events()
		},
		open: function() {
			var d = this;
			d.wrap.style.display = "block";

			setTimeout(function() {
				d.inner.style.transform = "translate3d(0,0,0)";
				d.inner.style.webkitTransform = "translate3d(0,0,0)";
				d.mask.style.opacity = 0.5
			}, 30);
			if (d.opts.time) {
				d.timer = setTimeout(function() {
					d.close()
				}, d.opts.time)
			}
		},
		close: function() {
			var d = this;
			d.timer && clearTimeout(d.timer);
			d.inner.style.webkitTransform = "translate3d(" + d.translate + ")";
			d.inner.style.transform = "translate3d(" + d.translate + ")";
			d.mask.style.opacity = 0;
			setTimeout(function() {
				d.wrap.style.display = "none";
				d.timer = null;
				d.opts.callback && d.opts.callback()
			}, 300)
		},
		events: function() {
			var d = this;
			d.addEvent(d.mask, "touchmove", function(f) {
				f.preventDefault()
			});
			d.addEvent(d.mask, (d.isMobile() ? "touchend" : "click"), function(f) {
				if (d.opts.maskClose) {
					d.close()
				}
			})
		}
	};
	b.mSlider = a
})(window);
