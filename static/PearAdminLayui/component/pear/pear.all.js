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
	tag:"tag",			// 标签主键
	popup:"popup",		// 通用弹层
	iconPicker:"iconPicker", // 图标选择组件
	treetable:"treetable",	// 树形表格组件
	dtree:"dtree",			// 树型组件
	tinymce:"tinymce/tinymce", // 文本编辑器
	area:"area",	// 区域选择
	count:"count",	// 数字滚动
	topBar: "topBar",	// 返回顶部组件
	button: "button",	// 按钮组件
	design: "design",	// 布局设计器
	dropdown: "dropdown",	// 通用下拉组件
	card: "card",	// 卡片组件
	loading: "loading" // 加载组件
});
