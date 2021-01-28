layui.define(['table', 'jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'menu',
		$ = layui.jquery,
		element = layui.element;

	var pearMenu = function(opt) {
		this.option = opt;
	};

	pearMenu.prototype.render = function(opt) {

		var option = {
			elem: opt.elem,
			async: opt.async,
			parseData: opt.parseData,
			url: opt.url,
			defaultOpen: opt.defaultOpen,
			defaultSelect: opt.defaultSelect,
			control: opt.control,
			defaultMenu: opt.defaultMenu,
			accordion: opt.accordion,
			height: opt.height,
			theme: opt.theme,
			data: opt.data ? opt.data : [],
			change: opt.change ? opt.change : function() {},
			done: opt.done ? opt.done : function() {}
		}
		if (option.async) {
			getData(option.url).then(function(data) {
				option.data = data;
				renderMenu(option);
			});
		} else {
			//renderMenu中需要调用done事件，done事件中需要menu对象，但是此时还未返回menu对象，做个延时提前返回对象
			window.setTimeout(function() {
				renderMenu(option);
			}, 500);
		}
		return new pearMenu(opt);
	}

	pearMenu.prototype.click = function(clickEvent) {
		var _this = this;
		$("body").on("click", "#" + _this.option.elem + " .site-demo-active", function() {
			var dom = $(this);
			var data = {
				menuId: dom.attr("menu-id"),
				menuTitle: dom.attr("menu-title"),
				menuPath: dom.attr("menu-title"),
				menuIcon: dom.attr("menu-icon"),
				menuUrl: dom.attr("menu-url")
			};
			var doms = hash(dom);
			if (doms.text() != '') {
				data['menuPath'] = doms.find("span").text() + " / " + data['menuPath'];
			}
			var domss = hash(doms);
			if (domss.text() != '') {
				data['menuPath'] = domss.find("span").text() + " / " + data['menuPath'];
			}
			var domsss = hash(domss);
			if (domsss.text() != '') {
				data['menuPath'] = domsss.find("span").text() + " / " + data['menuPath'];
			}
			if ($("#" + _this.option.elem).is(".pear-nav-mini")) {
					if(_this.option.accordion){
						activeMenus = $(this).parent().parent().parent().children("a");
					}else{
						activeMenus.push($(this).parent().parent().parent().children("a"));
					}
			}
			clickEvent(dom, data);
		})
	}

	function hash(dom) {
		return dom.parent().parent().prev();
	}

	pearMenu.prototype.skin = function(skin) {
		var menu = $(".pear-nav-tree[lay-filter='" + this.option.elem + "']").parent();
		menu.removeClass("dark-theme");
		menu.removeClass("light-theme");
		menu.addClass(skin);
	}

	pearMenu.prototype.selectItem = function(pearId) {
		if (this.option.control != false) {
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents(".layui-side-scroll ").find("ul").css({
				display: "none"
			});
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents(".layui-side-scroll ").find(".layui-this").removeClass(
				"layui-this");
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents("ul").css({
				display: "block"
			});
			var controlId = $("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents("ul").attr("pear-id");

			$("#" + this.option.control).find(".layui-this").removeClass("layui-this");
			$("#" + this.option.control).find("[pear-id='" + controlId + "']").addClass("layui-this");
		}
		if (this.option.accordion == true) {
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents(".pear-nav-tree").find(".layui-nav-itemed").removeClass(
				"layui-nav-itemed");
		}
		$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents(".pear-nav-tree").find(".layui-this").removeClass(
			"layui-this");
		if (!$("#" + this.option.elem).is(".pear-nav-mini")) {
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents(".layui-nav-item").addClass("layui-nav-itemed");
			$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parents("dd").addClass("layui-nav-itemed");
		}
		$("#" + this.option.elem + " a[menu-id='" + pearId + "']").parent().addClass("layui-this");
	}

	var activeMenus;
	pearMenu.prototype.collaspe = function(time) {
		var elem = this.option.elem;
		var config = this.option;
		if ($("#" + this.option.elem).is(".pear-nav-mini")) {
			$.each(activeMenus, function(i, item) {
				$("#" + elem + " a[menu-id='" + $(this).attr("menu-id") + "']").parent().addClass("layui-nav-itemed");
			})
			$("#" + this.option.elem).removeClass("pear-nav-mini");
			$("#" + this.option.elem).animate({
				width: "220px"
			}, 150);
			isHoverMenu(false, config);
		} else {
			activeMenus = $("#" + this.option.elem).find(".layui-nav-itemed>a");
			$("#" + this.option.elem).find(".layui-nav-itemed").removeClass("layui-nav-itemed");
			$("#" + this.option.elem).addClass("pear-nav-mini");
			$("#" + this.option.elem).animate({
				width: "60px"
			}, 400);
			isHoverMenu(true, config);
		}
	}

	function getData(url) {
		var defer = $.Deferred();
		$.get(url + "?fresh=" + Math.random(), function(result) {
			defer.resolve(result)
		});
		return defer.promise();
	}

	function renderMenu(option) {
		if (option.parseData != false) {
			option.parseData(option.data);
		}
		if (option.data.length > 0) {
			if (option.control != false) {
				createMenuAndControl(option);
			} else {
				createMenu(option);
			}
		}
		element.init();
		downShow(option);
		option.done();
	}

	function createMenu(option) {
		var menuHtml = '<ul lay-filter="' + option.elem +
			'" class="layui-nav arrow   pear-menu layui-nav-tree pear-nav-tree">'
		$.each(option.data, function(i, item) {
			var content = '<li class="layui-nav-item" >';
			if (i == option.defaultOpen) {
				content = '<li class="layui-nav-item layui-nav-itemed" >';
			}
			var href = "javascript:;";
			var target = "";
			var className = "site-demo-active"
			if (item.openType == "_blank" && item.type == 1) {
				href = item.href;
				target = "target='_blank'";
				className = "";
			}
			if (item.type == 0) {
				// 创 建 目 录 结 构
				content += '<a  href="javascript:;" menu-type="' + item.type + '" menu-id="' + item.id + '" href="' + href +
					'" ' + target + '><i class="' + item.icon + '"></i><span>' + item.title +
					'</span></a>';
			} else if (item.type == 1) {
				content += '<a class="' + className + '" menu-type="' + item.type + '" menu-url="' + item.href + '" menu-id="' +
					item.id +
					'" menu-title="' + item.title + '"  href="' + href + '"  ' + target + '><i class="' + item.icon +
					'"></i><span>' + item.title + '</span></a>';
			}
			// 调 用 递 归 方 法 加 载 无 限 层 级 的 子 菜 单 
			content += loadchild(item);
			// 结 束 一 个 根 菜 单 项
			content += '</li>';
			menuHtml += content;
		});
		// 结 束 菜 单 结 构 的 初 始 化
		menuHtml += "</ul>";
		// 将 菜 单 拼 接 到 初 始 化 容 器 中
		$("#" + option.elem).html(menuHtml);
	}

	function createMenuAndControl(option) {
		var control = '<ul class="layui-nav  pear-nav-control pc layui-hide-xs">';
		var controlPe = '<ul class="layui-nav pear-nav-control layui-hide-sm">';
		// 声 明 头 部
		var menu = '<div class="layui-side-scroll ' + option.theme + '">'
		// 开 启 同 步 操 作
		var index = 0;
		var controlItemPe = '<dl class="layui-nav-child">';
		$.each(option.data, function(i, item) {
			var menuItem = '';
			var controlItem = '';
			if (index === option.defaultMenu) {
				controlItem = '<li pear-href="' + item.href + '" pear-title="' + item.title + '" pear-id="' + item.id +
					'" class="layui-this layui-nav-item"><a href="#">' + item.title + '</a></li>';
				menuItem = '<ul  pear-id="' + item.id + '" lay-filter="' + option.elem +
					'" class="layui-nav arrow layui-nav-tree pear-nav-tree">';
				// 兼容移动端
				controlPe += '<li class="layui-nav-item"><a class="pe-title" href="javascript:;" >' + item.title + '</a>';
				controlItemPe += '<dd  pear-href="' + item.href + '" pear-title="' + item.title + '" pear-id="' + item.id +
					'"><a href="javascript:void(0);">' + item.title + '</a></dd>';
			} else {
				controlItem = '<li  pear-href="' + item.href + '" pear-title="' + item.title + '" pear-id="' + item.id +
					'" class="layui-nav-item"><a href="#">' + item.title + '</a></li>';
				menuItem = '<ul style="display:none" pear-id="' + item.id + '" lay-filter="' + option.elem +
					'" class="layui-nav arrow layui-nav-tree pear-nav-tree">';

				controlItemPe += '<dd pear-href="' + item.href + '" pear-title="' + item.title + '" pear-id="' + item.id +
					'"><a href="javascript:void(0);">' + item.title + '</a></dd>';

			}
			index++;
			$.each(item.children, function(i, note) {
				// 创 建 每 一 个 菜 单 项
				var content = '<li class="layui-nav-item" >';
				var href = "javascript:;";
				var target = "";
				var className = "site-demo-active";
				if (note.openType == "_blank" && note.type == 1) {
					href = note.href;
					target = "target='_blank'";
					className = "";
				}
				// 判 断 菜 单 类 型 0 是 不可跳转的目录 1 是 可 点 击 跳 转 的 菜 单
				if (note.type == 0) {
					// 创 建 目 录 结 构
					content += '<a  href="' + href + '" ' + target + ' menu-type="' + note.type + '" menu-id="' + note.id +
						'" ><i class="' + note.icon + '"></i><span>' + note.title +
						'</span></a>';
				} else if (note.type == 1) {
					// 创 建 菜 单 结 构
					content += '<a ' + target + ' class="' + className + '" menu-type="' + note.type + '" menu-url="' + note.href +
						'" menu-id="' + note.id +
						'" menu-title="' + note.title + '" href="' + href + '"><i class="' + note.icon +
						'"></i><span>' + note.title + '</span></a>';
				}
				content += loadchild(note);
				content += '</li>';
				menuItem += content;
			})
			menu += menuItem + '</ul>';
			control += controlItem;
		})
		controlItemPe += "</li></dl></ul>"
		controlPe += controlItemPe;
		$("#" + option.control).html(control);
		$("#" + option.control).append(controlPe);
		$("#" + option.elem).html(menu);
		$("#" + option.control + " .pear-nav-control").on("click", "[pear-id]", function() {
			$("#" + option.elem).find(".pear-nav-tree").css({
				display: 'none'
			});
			$("#" + option.elem).find(".pear-nav-tree[pear-id='" + $(this).attr("pear-id") + "']").css({
				display: 'block'
			});
			$("#" + option.control).find(".pe-title").html($(this).attr("pear-title"));
			$("#" + option.control).find("")
			option.change($(this).attr("pear-id"), $(this).attr("pear-title"), $(this).attr("pear-href"))
		})
	}

	/** 加载子菜单 (递归)*/
	function loadchild(obj) {
		// 判 单 是 否 是 菜 单， 如 果 是 菜 单 直 接 返 回
		if (obj.type == 1) {
			return "";
		}
		// 创 建 子 菜 单 结 构
		var content = '<dl class="layui-nav-child">';
		// 如 果 嵌 套 不 等 于 空 
		if (obj.children != null && obj.children.length > 0) {
			// 遍 历 子 项 目
			$.each(obj.children, function(i, note) {
				// 创 建 子 项 结 构
				content += '<dd>';
				var href = "javascript:;";
				var target = "";
				var className = "site-demo-active";
				if (note.openType == "_blank" && note.type == 1) {
					href = note.href;
					target = "target='_blank'";
					className = "";
				}
				// 判 断 子 项 类 型
				if (note.type == 0) {
					// 创 建 目 录 结 构
					content += '<a ' + target + '  href="' + href + '" menu-type="' + note.type + '" menu-id="' + note.id +
						'"><i class="' + note.icon + '"></i><span>' + note.title + '</span></a>';
				} else if (note.type == 1) {
					// 创 建 菜 单 结 构
					content += '<a ' + target + ' class="' + className + '" menu-type="' + note.type + '" menu-url="' + note.href +
						'" menu-id="' + note.id + '" menu-title="' + note.title + '" menu-icon="' + note.icon + '" href="' + href +
						'" ><i class="' + note.icon + '"></i><span>' + note.title + '</span></a>';
				}
				// 加 载 子 项 目 录
				content += loadchild(note);
				// 结 束 当 前 子 菜 单
				content += '</dd>';
			});
			// 封 装
		} else {
			content += '<div class="toast"> 无 内 容 </div>';
		}
		content += '</dl>';
		return content;
	}

	function downShow(option) {
		$("body #" + option.elem).on("click", "a[menu-type='0']", function() {
			if (!$("#" + option.elem).is(".pear-nav-mini")) {
				var superEle = $(this).parent();
				var ele = $(this).next('.layui-nav-child');
				var heights = ele.children("dd").length * 48;

				if ($(this).parent().is(".layui-nav-itemed")) {
					if (option.accordion) {
						$(this).parent().parent().find(".layui-nav-itemed").removeClass("layui-nav-itemed");
						$(this).parent().addClass("layui-nav-itemed");
					}
					ele.height(0);
					ele.animate({
						height: heights + "px"
					}, 200, function() {
						ele.css({
							height: "auto"
						});
					});
				} else {
					$(this).parent().addClass("layui-nav-itemed");
					ele.animate({
						height: "0px"
					}, 200, function() {
						ele.css({
							height: "auto"
						});
						$(this).parent().removeClass("layui-nav-itemed");
					});
				}
			}
		})
	}

	/** 二 级 悬 浮 菜 单*/
	function isHoverMenu(b, option) {
		if (b) {
			$("#" + option.elem + ".pear-nav-mini .layui-nav-item,#" + option.elem + ".pear-nav-mini dd").hover(function(e) {
				e.stopPropagation();
				var _this = $(this);
				_this.siblings().find(".layui-nav-child")
					.removeClass("layui-nav-hover").css({
						left: 0,
						top: 0
					});
				_this.children(".layui-nav-child").addClass("layui-nav-hover");
				_this.closest('.layui-nav-item').data('time') && clearTimeout(_this.closest('.layui-nav-item').data('time'));
				var height = $(window).height();
				var topLength = _this.offset().top;
				var thisHeight = _this.children(".layui-nav-child").height();
				if ((thisHeight + topLength) > height) {
					topLength = height - thisHeight - 10;
				}
				var left = _this.offset().left + 60;
				if (!_this.hasClass("layui-nav-item")) {
					left = _this.offset().left + _this.width();
				}
				_this.children(".layui-nav-child").offset({
					top: topLength,
					left: left + 3
				});
			}, function(e) {
				e.stopPropagation();
				var _this = $(this);
				_this.closest('.layui-nav-item').data('time', setTimeout(function() {
					_this.closest('.layui-nav-item')
						.find(".layui-nav-child")
						.removeClass("layui-nav-hover")
						.css({
							left: 0,
							top: 0
						});
				}, 50));
			})
		} else {
			$("#" + option.elem + " .layui-nav-item").off('mouseenter').unbind('mouseleave');
			$("#" + option.elem + " dd").off('mouseenter').unbind('mouseleave');
		}
	}
	exports(MOD_NAME, new pearMenu());
})
