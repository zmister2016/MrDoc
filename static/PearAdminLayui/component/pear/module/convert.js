layui.define(['jquery', 'element'], function(exports) {
	"use strict";

	/**
	 * 类 型 转 换 工 具 类
	 * */
	var MOD_NAME = 'convert',
		$ = layui.jquery,
		element = layui.element;

	var convert = new function() {

		// image 转 base64
		this.imageToBase64 = function(img) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
			var dataURL = canvas.toDataURL("image/"+ext);
			return dataURL;
		}

	}
	exports(MOD_NAME, convert);
});
