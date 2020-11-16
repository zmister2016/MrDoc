/**
 * 全局路径引用容错处理
 * */
window.rootPath = (function(src) {
	src = document.scripts[document.scripts.length - 1].src;
	return src.substring(0, src.lastIndexOf("/") + 1);
})();

/**
 * 扩展包集成
 * */
layui.config({
	base: rootPath + "modules/",
	version: true
}).extend({
	admin: "admin", 	// 框架布局组件
	menu: "menu",		// 数据菜单组件
	frame: "frame", 	// 内容页面组件
	tab: "tab",			// 多选项卡组件
	echarts: "echarts", // 数据图表组件
	echartsTheme: "echartsTheme", // 数据图表主题
	hash: "hash",		// 数据加密组件
	select: "select",	// 下拉多选组件
	drawer: "drawer",	// 抽屉弹层组件
	notice: "notice",	// 消息提示组件
	step:"step",		// 分布表单组件
	tag:"tag",
	popup:"popup",
	iconPicker:"iconPicker",
	treetable:"treetable",
	dtree:"dtree",
	tinymce:"tinymce/tinymce",
	area:"area",
	count:"count",
	topBar: "topBar",
	button: "button",
	design: "design",
	dropdown: "dropdown",
	card: "card",
	loading: "loading"
});
