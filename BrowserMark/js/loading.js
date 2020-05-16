(function() {
	var mrdocPopup = {
		init: function() {
			var self = this;
			self.addEvents();
		},
		// popup页面事件
		addEvents: function() {
			var self = this;
			// 点击选项按钮，创建选项标签
			$('#optionbtn').click(function(e) {
				chrome.extension.sendRequest({
					name: 'createoptionstab'
				});
				return false;
			});
			// 点击关闭按钮，关闭popup页面
			$('#closebtn').click(function(e) {
				console.log('close12');
				parent.postMessage({
					name: 'closefrommaikupopup'
				}, '*');
				return false;
			});
		}
	}
	$(function() {
		// 初始化popup页面
		mrdocPopup.init();
		parent.postMessage({
            name: 'pageCompleted'
        }, '*');
	});
})();