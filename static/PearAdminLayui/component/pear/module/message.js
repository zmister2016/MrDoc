layui.define(['table', 'jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'message',
		$ = layui.jquery,
		element = layui.element;

	var message = function(opt) {
		this.option = opt;
	};

	message.prototype.render = function(opt) {
		//默认配置值
		var option = {
			elem: opt.elem,
			url: opt.url ? opt.url : false,
			height: opt.height,
			data: opt.data
		}
		if (option.url != false) {
			option.data = getData(option.url);
			var notice = createHtml(option);
			$(option.elem).html(notice);
		}
		setTimeout(function(){
			element.init();
		},300);
		return new message(option);
	}
	
	message.prototype.click = function(callback){
		$("*[notice-id]").click(function(event) {
			event.preventDefault();
			var id = $(this).attr("notice-id");
			var title = $(this).attr("notice-title");
			var context = $(this).attr("notice-context");
			var form = $(this).attr("notice-form");
			callback(id, title, context, form);
		})
	}
	
	/** 同 步 请 求 获 取 数 据 */
	function getData(url) {
		$.ajaxSettings.async = false;
		var data = null;
		$.get(url, function(result) {
			data = result;
		});
		$.ajaxSettings.async = true;
		return data;
	}

	function createHtml(option) {

        var notice = '<li class="layui-nav-item" lay-unselect="">' +
			'<a href="#" class="notice layui-icon layui-icon-notice"><span class="layui-badge-dot"></span></a>' +
			'<div class="layui-nav-child layui-tab pear-notice" style="margin-top: 0px;;left: -200px;">';

		var noticeTitle = '<ul class="layui-tab-title">';
		var noticeContent = '<div class="layui-tab-content" style="height:' + option.height + ';overflow-x: hidden;">';

		// 根据 data 便利数据
		$.each(option.data, function(i, item) {

			if (i === 0) {
				noticeTitle += '<li class="layui-this">' + item.title + '</li>';
				noticeContent += '<div class="layui-tab-item layui-show">';
			} else {
				noticeTitle += '<li>' + item.title + '</li>';
				noticeContent += '<div class="layui-tab-item">';
			}

			$.each(item.children, function(i, note) {
				noticeContent += '<div class="pear-notice-item" notice-form="' + note.form + '" notice-context="' + note.context +
					'" notice-title="' + note.title + '" notice-id="' + note.id + '">' +
					'<img src="' + note.avatar + '">' +
					'<span>' + note.title + '</span>' +
					'<span>' + note.time + '</span>' +
					'</div>';

			})
			noticeContent += '</div>';
		})

		noticeTitle += '</ul>';
		noticeContent += '</div>';
		notice += noticeTitle;
		notice += noticeContent;
		notice += '</div></li>';
		return notice;
	}

	exports(MOD_NAME, new message());
})
