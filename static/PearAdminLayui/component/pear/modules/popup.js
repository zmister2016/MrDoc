layui.define(['layer', 'jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'popup',
		$ = layui.jquery,
		layer = layui.layer,
		element = layui.element;

	var popup = new function() {

			this.success = function(msg) {
				layer.msg(msg, {
					icon: 1,
					time: 1000
				})
			},
			this.failure = function(msg) {
				layer.msg(msg, {
					icon: 2,
					time: 1000
				})
			},
			this.warming = function(msg) {
				layer.msg(msg, {
					icon: 3,
					time: 1000
				})
			},
			this.success = function(msg, callback) {
				layer.msg(msg, {
					icon: 1,
					time: 1000
				}, callback);
			},
			this.failure = function(msg, callback) {
				layer.msg(msg, {
					icon: 2,
					time: 1000
				}, callback);
			},
			this.warming = function(msg, callback) {
				layer.msg(msg, {
					icon: 3,
					time: 1000
				}, callback);
			}
	};
	exports(MOD_NAME, popup);
})
