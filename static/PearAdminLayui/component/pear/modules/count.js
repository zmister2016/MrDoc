layui.define(['jquery', 'element'], function(exports) {
	"use strict";

	/**
	 * 数 字 滚 动 组 件
	 * */
	var MOD_NAME = 'count',
		$ = layui.jquery,
		element = layui.element;

	var count = new function() {

		this.up = function(targetEle, options) {

			options = options || {};

			var $this = document.getElementById(targetEle),
				time = options.time,     
				finalNum = options.num, 
				regulator = options.regulator, 
				step = finalNum / (time / regulator),
				count = 0.00, 
				initial = 0;
				
			var timer = setInterval(function() {
				count = count + step;
				if (count >= finalNum) {
					clearInterval(timer);
					count = finalNum;
				}
				var t = count.toFixed(options.bit?options.bit:0);;
				if (t == initial) return;
				initial = t;
				$this.innerHTML = initial;
			}, 30);
		}

	}
	exports(MOD_NAME, count);
});
