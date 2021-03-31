layui.define(['table', 'jquery', 'element', 'yaml','form', 'tab', 'menu', 'frame', 'theme'],
	function(exports) {
		"use strict";

		const $ = layui.jquery,
			form = layui.form,
			element = layui.element,
			yaml = layui.yaml,
			pearTab = layui.tab,
			pearMenu = layui.menu,
			pearFrame = layui.frame,
			pearTheme = layui.theme;

		let bodyFrame;
		let sideMenu;
		let bodyTab;
		let config;
		const body = $('body');

		const pearAdmin = new function() {

			// 默认配置
			let configType = 'yml';
			let configPath = 'pear.config.yml';

			this.setConfigPath = function(path) {
				configPath = path;
			}
			
			this.setConfigType = function(type) {
				configType = type;
			}

			this.render = function(initConfig) {
				if (initConfig !== undefined) {
					applyConfig(initConfig);
				} else {
					applyConfig(pearAdmin.readConfig());
				}
			}

			this.readConfig = function() {
				if(configType === "yml"){
					return yaml.load(configPath);
				}
				else
				{
					let data;
					$.ajax({
						url:configPath,
						type:'get',
						dataType:'json',
						async: false,
						success:function(result){
							data = result;
						}
					})
					return data;
				}
			}

			this.logoRender = function(param) {
				$(".layui-logo .logo").attr("src", param.logo.image);
				$(".layui-logo .title").html(param.logo.title);
			}

			this.menuRender = function(param) {
				sideMenu = pearMenu.render({
					elem: 'sideMenu',
					async: param.menu.async !== undefined ? param.menu.async : true,
					theme: "dark-theme",
					height: '100%',
					control: param.menu.control ? 'control' : false, // control
					defaultMenu: 0,
					accordion: param.menu.accordion,
					url: param.menu.data,
					data: param.menu.data, //async为false时，传入菜单数组
					parseData: false,
					change: function() {
						compatible();
					},
					done: function() {
						sideMenu.selectItem(param.menu.select);
					}
				});
			}

			this.bodyRender = function(param) {
				body.on("click", ".refresh", function() {
					const refreshA = $(".refresh a");
					refreshA.removeClass("layui-icon-refresh-1");
					refreshA.addClass("layui-anim");
					refreshA.addClass("layui-anim-rotate");
					refreshA.addClass("layui-anim-loop");
					refreshA.addClass("layui-icon-loading");
					bodyTab.refresh(400);
					setTimeout(function() {
						refreshA.addClass("layui-icon-refresh-1");
						refreshA.removeClass("layui-anim");
						refreshA.removeClass("layui-anim-rotate");
						refreshA.removeClass("layui-anim-loop");
						refreshA.removeClass("layui-icon-loading");
					}, 600)
				})
				if (param.tab.muiltTab) {
					bodyTab = pearTab.render({
						elem: 'content',
						roll: true,
						tool: true,
						width: '100%',
						height: '100%',
						session: param.tab.session,
						index: 0,
						tabMax: param.tab.tabMax,
						closeEvent: function(id) {
							sideMenu.selectItem(id);
						},
						data: [{
							id: param.tab.index.id,
							url: param.tab.index.href,
							title: param.tab.index.title,
							close: false
						}],
						success: function(id){
							if(param.tab.session){
								setTimeout(function(){
									sideMenu.selectItem(id);
									bodyTab.positionTab();
								},500)
							}
						}
					});
					bodyTab.click(function(id) {
						if (!param.tab.keepState) {
							bodyTab.refresh(false);
						}
						bodyTab.positionTab();
						sideMenu.selectItem(id);
					})

					sideMenu.click(function(dom, data) {
						
						bodyTab.addTabOnly({
							id: data.menuId,
							title: data.menuTitle,
							url: data.menuUrl,
							icon: data.menuIcon,
							close: true
						}, 300);
						compatible();
						
					})
				} else {
					bodyFrame = pearFrame.render({
						elem: 'content',
						title: '首页',
						url: param.tab.index.href,
						width: '100%',
						height: '100%'
					});

					sideMenu.click(function(dom, data) {
						bodyFrame.changePage(data.menuUrl, data.menuPath, true);
						compatible()
					})
				}
			}

			this.keepLoad = function(param) {
				compatible()
				setTimeout(function() {
					$(".loader-main").fadeOut(200);
				}, param.other.keepLoad)
			}

			this.themeRender = function(option) {
				if (option.theme.allowCustom === false) {
					$(".setting").remove();
				}
				const colorId = localStorage.getItem("theme-color");
				const currentColor = getColorById(colorId);
				localStorage.setItem("theme-color", currentColor.id);
				localStorage.setItem("theme-color-context", currentColor.color);
				pearTheme.changeTheme(window, option.other.autoHead);
				let menu = localStorage.getItem("theme-menu");
				if (menu === "null") {
					menu = option.theme.defaultMenu;
				} else {
					if (option.theme.allowCustom === false) {
						menu = option.theme.defaultMenu;
					}
				}
				localStorage.setItem("theme-menu", menu);
				this.menuSkin(menu);
			}

			this.menuSkin = function(theme) {
				const pearAdmin = $(".pear-admin");
				pearAdmin.removeClass("light-theme");
				pearAdmin.removeClass("dark-theme");
				pearAdmin.addClass(theme);
			}
		};

		function collaspe() {
			sideMenu.collaspe();
			const admin = $(".pear-admin");
			const left = $(".layui-icon-spread-left")
			const right = $(".layui-icon-shrink-right")
			if (admin.is(".pear-mini")) {
				left.addClass("layui-icon-shrink-right")
				left.removeClass("layui-icon-spread-left")
				admin.removeClass("pear-mini");
			} else {
				right.addClass("layui-icon-spread-left")
				right.removeClass("layui-icon-shrink-right")
				admin.addClass("pear-mini");
			}
		}

		body.on("click", ".collaspe,.pear-cover", function() {
			collaspe()
		});

		body.on("click", ".fullScreen", function() {
			if ($(this).hasClass("layui-icon-screen-restore")) {
				screenFun(2).then(function() {
					$(".fullScreen").eq(0).removeClass("layui-icon-screen-restore");
				});
			} else {
				screenFun(1).then(function() {
					$(".fullScreen").eq(0).addClass("layui-icon-screen-restore");
				});
			}
		});

		body.on("click", '[user-menu-id]', function() {
			if (config.tab.muiltTab) {
				bodyTab.addTabOnly({
					id: $(this).attr("user-menu-id"),
					title: $(this).attr("user-menu-title"),
					url: $(this).attr("user-menu-url"),
					icon: "",
					close: true
				}, 300);
			} else {
				bodyFrame.changePage($(this).attr("user-menu-url"), "", true);
			}
		});

		body.on("click", ".setting", function() {
			
			let bgColorHtml =
				'<li class="layui-this" data-select-bgcolor="dark-theme" >' +
				'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
				'<div><span style="display:block; width: 20%; float: left; height: 12px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
				'<div><span style="display:block; width: 20%; float: left; height: 40px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
				'</a>' +
				'</li>';

			bgColorHtml +=
				'<li  data-select-bgcolor="light-theme" >' +
				'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
				'<div><span style="display:block; width: 20%; float: left; height: 12px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
				'<div><span style="display:block; width: 20%; float: left; height: 40px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
				'</a>' +
				'</li>';

			const html =
				'<div class="pearone-color">\n' +
				'<div class="color-title">整体风格</div>\n' +
				'<div class="color-content">\n' +
				'<ul>\n' + bgColorHtml + '</ul>\n' +
				'</div>\n' +
				'</div>';

			layer.open({
				type: 1,
				offset: 'r',
				area: ['340px', '100%'],
				title: false,
				shade: 0.1,
				closeBtn: 0,
				shadeClose: false,
				anim: -1,
				skin: 'layer-anim-right',
				move: false,
				content: html + buildColorHtml() + buildLinkHtml() + bottomTool(),
				success: function(layero, index) {
					form.render();

					const color = localStorage.getItem("theme-color");
					const menu = localStorage.getItem("theme-menu");

					if (color !== "null") {
						$(".select-color-item").removeClass("layui-icon")
							.removeClass("layui-icon-ok");
						$("*[color-id='" + color + "']").addClass("layui-icon")
							.addClass("layui-icon-ok");
					}
					if (menu !== "null") {
						$("*[data-select-bgcolor]").removeClass("layui-this");
						$("[data-select-bgcolor='" + menu + "']").addClass("layui-this");
					}
					$('#layui-layer-shade' + index).click(function() {
						const $layero = $('#layui-layer' + index);
						$layero.animate({
							left: $layero.offset().left + $layero.width()
						}, 200, function() {
							layer.close(index);
						});
					})
					
					$('#closeTheme').click(function() {
						const $layero = $('#layui-layer' + index);
						$layero.animate({
							left: $layero.offset().left + $layero.width()
						}, 200, function() {
							layer.close(index);
						});
					})
				}
			});
		});

		function bottomTool(){
			return "<button id='closeTheme' style='position: absolute;bottom: 20px;left: 20px;' class='pear-btn'>关闭</button>"
		}

		body.on('click', '[data-select-bgcolor]', function() {
			const theme = $(this).attr('data-select-bgcolor');
			$('[data-select-bgcolor]').removeClass("layui-this");
			$(this).addClass("layui-this");
			localStorage.setItem("theme-menu", theme);
			pearAdmin.menuSkin(theme);
		});

		body.on('click', '.select-color-item', function() {
			$(".select-color-item").removeClass("layui-icon").removeClass("layui-icon-ok");
			$(this).addClass("layui-icon").addClass("layui-icon-ok");
			const colorId = $(".select-color-item.layui-icon-ok").attr("color-id");
			const currentColor = getColorById(colorId);
			localStorage.setItem("theme-color", currentColor.id);
			localStorage.setItem("theme-color-context", currentColor.color);
			pearTheme.changeTheme(window, config.other.autoHead);
		});

		function applyConfig(param) {
			config = param;
			pearAdmin.logoRender(param);
			pearAdmin.menuRender(param);
			pearAdmin.bodyRender(param);
			pearAdmin.themeRender(param);
			pearAdmin.keepLoad(param);
		}

		function getColorById(id) {
			let color;
			let flag = false;
			$.each(config.colors, function(i, value) {
				if (value.id === id) {
					color = value;
					flag = true;
				}
			})
			if (flag === false || config.theme.allowCustom === false) {
				$.each(config.colors, function(i, value) {
					if (value.id === config.theme.defaultColor) {
						color = value;
					}
				})
			}
			return color;
		}

		function buildLinkHtml() {
			let links = "";
			$.each(config.links, function(i, value) {
				links += '<a class="more-menu-item" href="' + value.href + '" target="_blank">' +
					'<i class="' + value.icon + '" style="font-size: 19px;"></i> ' + value.title +
					'</a>'
			})
			return '<div class="more-menu-list">' + links + '</div>';
		}

		function buildColorHtml() {
			let colors = "";
			$.each(config.colors, function(i, value) {
				colors += "<span class='select-color-item' color-id='" + value.id + "' style='background-color:" + value.color +
					";'></span>";
			})
			return "<div class='select-color'><div class='select-color-title'>主题色</div><div class='select-color-content'>" +
				colors + "</div></div>"
		}

		function compatible() {
			if ($(window).width() <= 768) {
				collaspe()
			}
		}

		function screenFun(num) {
			num = num || 1;
			num = num * 1;
			const docElm = document.documentElement;
			switch (num) {
				case 1:
					if (docElm.requestFullscreen) {
						docElm.requestFullscreen();
					} else if (docElm.mozRequestFullScreen) {
						docElm.mozRequestFullScreen();
					} else if (docElm.webkitRequestFullScreen) {
						docElm.webkitRequestFullScreen();
					} else if (docElm.msRequestFullscreen) {
						docElm.msRequestFullscreen();
					}
					break;
				case 2:
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					}
					break;
			}
			return new Promise(function(res, rej) {
				res("返回值");
			});
		}

		exports('admin', pearAdmin);
	})
