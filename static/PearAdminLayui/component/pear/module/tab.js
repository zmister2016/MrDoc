layui.define(['jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'tab',
		$ = layui.jquery,
		element = layui.element;

	var pearTab = function(opt) {
		this.option = opt;
	};

	var tabData = new Array();
	var tabDataCurrent = 0;

	pearTab.prototype.render = function(opt) {
		//默认配置值
		var option = {
			elem: opt.elem,
			data: opt.data,
			tool: opt.tool,
			roll: opt.roll,
			index: opt.index,
			width: opt.width,
			height: opt.height,
			tabMax: opt.tabMax,
			session: opt.session ? opt.session : false,
			closeEvent: opt.closeEvent,
			success: opt.success ? opt.success : function(id) {}
		}

		// 初始化，检索 session 是否开启
		if (option.session) {
			// 替换 opt.data 数据
			if (sessionStorage.getItem(option.elem + "-pear-tab-data") != null) {
				tabData = JSON.parse(sessionStorage.getItem(option.elem + "-pear-tab-data"));
				option.data = JSON.parse(sessionStorage.getItem(option.elem + "-pear-tab-data"));
				tabDataCurrent = sessionStorage.getItem(option.elem + "-pear-tab-data-current");
				tabData.forEach(function(item, index) {
					if (item.id == tabDataCurrent) {
						option.index = index;
					}
				})
			} else {
				tabData = opt.data;
			}
		}


			var lastIndex;
		var tab = createTab(option);
		$("#" + option.elem).html(tab);
		$(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-prev").click(function() {
			rollPage("left", option);
		})
		$(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-next").click(function() {
			rollPage("right", option);
		})
		element.init();
		toolEvent(option);
		$("#" + option.elem).width(opt.width);
		$("#" + option.elem).height(opt.height);
		$("#" + option.elem).css({
			position: "relative"
		});
		closeEvent(option);

		option.success(sessionStorage.getItem(option.elem + "-pear-tab-data-current"));

		$("body .layui-tab[lay-filter='" + option.elem + "']").on("contextmenu", "li", function(e) {

			// 获取当前元素位置
			var top = e.clientY;
			var left = e.clientX;

			var currentId = $(this).attr("lay-id");

			var menu = "<ul><li class='item' id='" + option.elem + "closeThis'>关闭当前</li><li class='item' id='" + option.elem +
				"closeOther'>关闭其他</li><li class='item' id='" + option.elem + "closeAll'>关闭所有</li></ul>";

			// 初始化
			layer.open({
				type: 1,
				title: false,
				shade: false,
				skin: 'pear-tab-menu',
				closeBtn: false,
				area: ['100px', '108px'],
				fixed: true,
				offset: [top, left],
				content: menu, //iframe的url,
				success: function(layero, index) {
					layer.close(lastIndex);
					lastIndex = index;
					menuEvent(option,index);
					var timer;
					$(layero).on('mouseout', function() {
						timer = setTimeout(function() {
							layer.close(index);
						}, 30)
					});

					$(layero).on('mouseover', function() {
						clearTimeout(timer);
					});
					
					// 清除 item 右击
					$(layero).on('contextmenu',function(){
						return false;
					})
					
				}
			});
			return false;
		})

		return new pearTab(option);
	}

	pearTab.prototype.click = function(callback) {
		var elem = this.option.elem;
		var option = this.option;
		element.on('tab(' + this.option.elem + ')', function(data) {
			var id = $("#" + elem + " .layui-tab-title .layui-this").attr("lay-id");
			sessionStorage.setItem(option.elem + "-pear-tab-data-current", id);
			callback(id);
		});
	}

	pearTab.prototype.positionTab = function() {
		var $tabTitle = $('.layui-tab[lay-filter=' + this.option.elem + ']  .layui-tab-title');
		var autoLeft = 0;
		$tabTitle.children("li").each(function() {
			if ($(this).hasClass('layui-this')) {
				return false;
			} else {
				autoLeft += $(this).outerWidth();
			}
		});
		$tabTitle.animate({
			scrollLeft: autoLeft - $tabTitle.width() / 3
		}, 200);
	}

	pearTab.prototype.clear = function() {
		sessionStorage.removeItem(this.option.elem + "-pear-tab-data");
		sessionStorage.removeItem(this.option.elem + "-pear-tab-data-current");
	}

	pearTab.prototype.addTab = function(opt) {
		var title = '';
		if (opt.close) {
			title += '<span class="pear-tab-active"></span><span class="able-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>';
		} else {
			title += '<span class="pear-tab-active"></span><span class="disable-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>';
		}
		element.tabAdd(this.option.elem, {
			title: title,
			content: '<iframe id="' + opt.id + '" data-frameid="' + opt.id + '" scrolling="auto" frameborder="0" src="' +
				opt.url + '" style="width:100%;height:100%;"></iframe>',
			id: opt.id
		});
		tabData.push(opt);
		sessionStorage.setItem(this.option.elem + "-pear-tab-data", JSON.stringify(tabData));
		sessionStorage.setItem(this.option.elem + "-pear-tab-data-current", opt.id);
		element.tabChange(this.option.elem, opt.id);
	}

	var index = 0;

	// 根据过滤 filter 标识, 删除执行选项卡
	pearTab.prototype.delTabByElem = function(elem, id, callback) {
		var currentTab = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title [lay-id='" + id + "']");
		if (currentTab.find("span").is(".able-close")) {
			tabDelete(elem, id, callback);
		}
	}

	// 根据过滤 filter 标识, 删除当前选项卡
	pearTab.prototype.delCurrentTabByElem = function(elem, callback) {
		var currentTab = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title .layui-this");
		if (currentTab.find("span").is(".able-close")) {
			var currentId = currentTab.attr("lay-id");
			tabDelete(elem, currentId, callback);
		}
	}

	// 通过过滤 filter 标识, 新增标签页
	pearTab.prototype.addTabOnlyByElem = function(elem, opt, time) {
		var title = '';
		if (opt.close) {
			title += '<span class="pear-tab-active"></span><span class="able-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>'
		} else {
			title += '<span class="pear-tab-active"></span><span class="disable-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>'
		}
		if ($(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title li[lay-id]").length <= 0) {

			if (time != false && time != 0) {

				var load = '<div id="pear-tab-loading' + index + '" class="pear-tab-loading">' +
					'<div class="ball-loader">' +
					'<span></span><span></span><span></span><span></span>' +
					'</div>' +
					'</div>'
				$("#" + elem).find(".pear-tab").append(load);
				var pearLoad = $("#" + elem).find("#pear-tab-loading" + index);
				pearLoad.css({
					display: "block"
				});
				setTimeout(function() {
					pearLoad.fadeOut(500);
				}, time);
				index++;
			}
			element.tabAdd(elem, {
				title: title,
				content: '<iframe id="' + opt.id + '" data-frameid="' + opt.id + '" scrolling="auto" frameborder="0" src="' +
					opt.url + '" style="width:100%;height:100%;"></iframe>',
				id: opt.id
			});
			tabData.push(opt);
			sessionStorage.setItem(elem + "-pear-tab-data", JSON.stringify(tabData));
		} else {
			var isData = false;
			$.each($(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title li[lay-id]"), function() {
				if ($(this).attr("lay-id") == opt.id) {
					isData = true;
				}
			})

			if (isData == false) {
				if (time != false && time != 0) {
					var load = '<div id="pear-tab-loading' + index + '" class="pear-tab-loading">' +
						'<div class="ball-loader">' +
						'<span></span><span></span><span></span><span></span>' +
						'</div>' +
						'</div>'

					$("#" + elem).find(".pear-tab").append(load);
					var pearLoad = $("#" + elem).find("#pear-tab-loading" + index);
					pearLoad.css({
						display: "block"
					});
					setTimeout(function() {
						pearLoad.fadeOut(500);
					}, time);
					index++;
				}
				element.tabAdd(elem, {
					title: title,
					content: '<iframe id="' + opt.id + '" data-frameid="' + opt.id + '" scrolling="auto" frameborder="0" src="' +
						opt.url + '" style="width:100%;height:100%;"></iframe>',
					id: opt.id
				});
				tabData.push(opt);
				sessionStorage.setItem(elem + "-pear-tab-data", JSON.stringify(tabData));

			}
		}
		sessionStorage.setItem(elem + "-pear-tab-data-current", opt.id);
		element.tabChange(elem, opt.id);
	}

	/** 添 加 唯 一 选 项 卡 */
	pearTab.prototype.addTabOnly = function(opt, time) {
		var title = '';
		if (opt.close) {
			title += '<span class="pear-tab-active"></span><span class="able-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>';
		} else {
			title += '<span class="pear-tab-active"></span><span class="disable-close">' + opt.title +
				'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>';
		}
		if ($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]").length <= 0) {
			if (time != false && time != 0) {
				var load = '<div id="pear-tab-loading' + index + '" class="pear-tab-loading">' +
					'<div class="ball-loader">' +
					'<span></span><span></span><span></span><span></span>' +
					'</div>' +
					'</div>';
				$("#" + this.option.elem).find(".pear-tab").append(load);
				var pearLoad = $("#" + this.option.elem).find("#pear-tab-loading" + index);
				pearLoad.css({
					display: "block"
				});
				setTimeout(function() {
					pearLoad.fadeOut(500);
				}, time);
				index++;
			}
			element.tabAdd(this.option.elem, {
				title: title,
				content: '<iframe id="' + opt.id + '" data-frameid="' + opt.id + '" scrolling="auto" frameborder="0" src="' +
					opt.url + '" style="width:100%;height:100%;"></iframe>',
				id: opt.id
			});
			tabData.push(opt);
			sessionStorage.setItem(this.option.elem + "-pear-tab-data", JSON.stringify(tabData));
			sessionStorage.setItem(this.option.elem + "-pear-tab-data-current", opt.id);
		} else {
			var isData = false;
			//查询当前选项卡数量
			if ($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]").length >= this.option.tabMax) {
				layer.msg("最多打开" + this.option.tabMax + "个标签页", {
					icon: 2,
					time: 1000,
					shift: 6 //抖动效果
				});
				return false;
			}
			$.each($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]"), function() {
				if ($(this).attr("lay-id") == opt.id) {
					isData = true;
				}
			})
			if (isData == false) {
				if (time != false && time != 0) {
					var load = '<div id="pear-tab-loading' + index + '" class="pear-tab-loading">' +
						'<div class="ball-loader">' +
						'<span></span><span></span><span></span><span></span>' +
						'</div>' +
						'</div>'

					$("#" + this.option.elem).find(".pear-tab").append(load);
					var pearLoad = $("#" + this.option.elem).find("#pear-tab-loading" + index);
					pearLoad.css({
						display: "block"
					});
					setTimeout(function() {
						pearLoad.fadeOut(500);
					}, time);
					index++;
				}
				element.tabAdd(this.option.elem, {
					title: title,
					content: '<iframe id="' + opt.id + '" data-frameid="' + opt.id + '" scrolling="auto" frameborder="0" src="' +
						opt.url + '" style="width:100%;height:100%;"></iframe>',
					id: opt.id
				});
				tabData.push(opt);
				sessionStorage.setItem(this.option.elem + "-pear-tab-data", JSON.stringify(tabData));
				sessionStorage.setItem(this.option.elem + "-pear-tab-data-current", opt.id);
			}
		}
		element.tabChange(this.option.elem, opt.id);
		sessionStorage.setItem(this.option.elem + "-pear-tab-data-current", opt.id);
	}

	// 刷 新 指 定 的 选 项 卡
	pearTab.prototype.refresh = function(time) {
		// 刷 新 指 定 的 选 项 卡
		if (time != false && time != 0) {
			var load = '<div id="pear-tab-loading' + index + '" class="pear-tab-loading">' +
				'<div class="ball-loader">' +
				'<span></span><span></span><span></span><span></span>' +
				'</div>' +
				'</div>'

			var elem = this.option.elem;
			$("#" + this.option.elem).find(".pear-tab").append(load);
			var pearLoad = $("#" + this.option.elem).find("#pear-tab-loading" + index);
			pearLoad.css({
				display: "block"
			});
			index++;
			setTimeout(function() {
				pearLoad.fadeOut(500, function() {
					pearLoad.remove();
				});
			}, time);
			$(".layui-tab[lay-filter='" + elem + "'] .layui-tab-content .layui-show").find("iframe")[0].contentWindow
				.location.reload(true);
		} else {
			$(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-content .layui-show").find("iframe")[0].contentWindow
				.location.reload(true);
		}
	}


	function tabDelete(elem, id, callback, option) {

		//根据 elem id 来删除指定的 layui title li
		var tabTitle = $(".layui-tab[lay-filter='" + elem + "']").find(".layui-tab-title");

		// 删除指定 id 的 title
		var removeTab = tabTitle.find("li[lay-id='" + id + "']");
		var nextNode = removeTab.next("li");
		if (!removeTab.hasClass("layui-this")) {
			removeTab.remove();
			var tabContent = $(".layui-tab[lay-filter='" + elem + "']").find("iframe[id='" + id + "']").parent();
			tabContent.remove();

			tabData = JSON.parse(sessionStorage.getItem(elem + "-pear-tab-data"));
			tabDataCurrent = sessionStorage.getItem(elem + "-pear-tab-data-current");
			tabData = tabData.filter(function(item) {
				return item.id != id;
			})
			sessionStorage.setItem(elem + "-pear-tab-data", JSON.stringify(tabData));
			return false;
		}

		var currId;
		if (nextNode.length) {
			nextNode.addClass("layui-this");
			currId = nextNode.attr("lay-id");
			$("#" + elem + " [id='" + currId + "']").parent().addClass("layui-show");
		} else {
			var prevNode = removeTab.prev("li");
			prevNode.addClass("layui-this");
			currId = prevNode.attr("lay-id");
			$("#" + elem + " [id='" + currId + "']").parent().addClass("layui-show");
		}
		callback(currId);
		tabData = JSON.parse(sessionStorage.getItem(elem + "-pear-tab-data"));
		tabDataCurrent = sessionStorage.getItem(elem + "-pear-tab-data-current");
		tabData = tabData.filter(function(item) {
			return item.id != id;
		})
		sessionStorage.setItem(elem + "-pear-tab-data", JSON.stringify(tabData));
		sessionStorage.setItem(elem + "-pear-tab-data-current", currId);

		removeTab.remove();
		// 删除 content
		var tabContent = $(".layui-tab[lay-filter='" + elem + "']").find("iframe[id='" + id + "']").parent();
		// 删除
		tabContent.remove();
	}

	function createTab(option) {

		var type = "";
		var types = option.type + " ";
		if (option.roll == true) {
			type = "layui-tab-roll";
		}
		if (option.tool != false) {
			type = "layui-tab-tool";
		}
		if (option.roll == true && option.tool != false) {
			type = "layui-tab-rollTool";
		}
		var tab = '<div class="pear-tab ' + types + type + ' layui-tab" lay-filter="' + option.elem +
			'" lay-allowClose="true">';
		var title = '<ul class="layui-tab-title">';
		var content = '<div class="layui-tab-content">';
		var control =
			'<div class="layui-tab-control"><li class="layui-tab-prev layui-icon layui-icon-left"></li><li class="layui-tab-next layui-icon layui-icon-right"></li><li class="layui-tab-tool layui-icon layui-icon-down"><ul class="layui-nav" lay-filter=""><li class="layui-nav-item"><a href="javascript:;"></a><dl class="layui-nav-child">';

		// 处 理 选 项 卡 头 部
		var index = 0;
		$.each(option.data, function(i, item) {
			var TitleItem = '';
			if (option.index == index) {
				TitleItem += '<li lay-id="' + item.id + '" class="layui-this"><span class="pear-tab-active"></span>';
			} else {
				TitleItem += '<li lay-id="' + item.id + '" ><span class="pear-tab-active"></span>';
			}

			if (item.close) {
				// 当 前 选 项 卡 可 以 关 闭
				TitleItem += '<span class="able-close">' + item.title + '</span>';
			} else {
				// 当 前 选 项 卡 不 允 许 关 闭
				TitleItem += '<span class="disable-close">' + item.title + '</span>';
			}
			TitleItem += '<i class="layui-icon layui-unselect layui-tab-close">ဆ</i></li>';
			title += TitleItem;
			if (option.index == index) {

				// 处 理 显 示 内 容
				content += '<div class="layui-show layui-tab-item"><iframe id="' + item.id + '" data-frameid="' + item.id +
					'"  src="' + item.url +
					'" frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 100%;height: 100%;"></iframe></div>'
			} else {
				// 处 理 显 示 内 容
				content += '<div class="layui-tab-item"><iframe id="' + item.id + '" data-frameid="' + item.id + '"  src="' +
					item.url +
					'" frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 100%;height: 100%;"></iframe></div>'
			}
			index++;
		});

		title += '</ul>';
		content += '</div>';
		control += '<dd id="closeThis"><a href="#">关 闭 当 前</a></dd>'
		control += '<dd id="closeOther"><a href="#">关 闭 其 他</a></dd>'
		control += '<dd id="closeAll"><a href="#">关 闭 全 部</a></dd>'
		control += '</dl></li></ul></li></div>';

		tab += title;
		tab += control;
		tab += content;
		tab += '</div>';
		tab += ''
		return tab;
	}

	function rollPage(d, option) {
		var $tabTitle = $('#' + option.elem + '  .layui-tab-title');
		var left = $tabTitle.scrollLeft();
		if ('left' === d) {
			$tabTitle.animate({
				scrollLeft: left - 450
			}, 200);
		} else {
			$tabTitle.animate({
				scrollLeft: left + 450
			}, 200);
		}
	}

	function closeEvent(option) {
		$(".layui-tab[lay-filter='" + option.elem + "']").on("click", ".layui-tab-close", function() {
			var layid = $(this).parent().attr("lay-id");
			tabDelete(option.elem, layid, option.closeEvent, option);
		})
	}

	function menuEvent(option,index) {

		$("#" + option.elem + "closeThis").click(function() {
			var currentTab = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this");
		
			if (currentTab.find("span").is(".able-close")) {
				var currentId = currentTab.attr("lay-id");
				tabDelete(option.elem, currentId, option.closeEvent, option);
			} else {
				layer.msg("当前页面不允许关闭", {
					icon: 3,
					time: 800
				})
			}
			layer.close(index);
		})

		$("#" + option.elem + "closeOther").click(function() {
			var currentId = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this").attr("lay-id");
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function(i) {
				if ($(this).attr("lay-id") != currentId) {
					if ($(this).find("span").is(".able-close")) {
						tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
					}
				}
			})
			layer.close(index);
		})

		$("#" + option.elem + "closeAll").click(function() {
			var currentId = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this").attr("lay-id");
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function(i) {
				if ($(this).find("span").is(".able-close")) {
					tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
				}
			})
			layer.close(index);
		})
	}


	function toolEvent(option) {

		$("body .layui-tab[lay-filter='" + option.elem + "']").on("click", "#closeThis", function() {
			var currentTab = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this");
			if (currentTab.find("span").is(".able-close")) {
				var currentId = currentTab.attr("lay-id");
				tabDelete(option.elem, currentId, option.closeEvent, option);
			} else {
				layer.msg("当前页面不允许关闭", {
					icon: 3,
					time: 800
				})
			}
		})

		$("body .layui-tab[lay-filter='" + option.elem + "']").on("click", "#closeOther", function() {
			var currentId = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this").attr("lay-id");
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function(i) {
				if ($(this).attr("lay-id") != currentId) {
					if ($(this).find("span").is(".able-close")) {
						tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
					}
				}
			})
		})

		$("body .layui-tab[lay-filter='" + option.elem + "']").on("click", "#closeAll", function() {
			var currentId = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title .layui-this").attr("lay-id");
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function(i) {
				if ($(this).find("span").is(".able-close")) {
					tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
				}
			})
		})
	}

	exports(MOD_NAME, new pearTab());
})
