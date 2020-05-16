(function($) {
	$(function() {
		var backgroundPage = chrome.extension.getBackgroundPage(),
			notificationData = backgroundPage.ReadyErrorNotify.notificationData;
		$('#content').html(notificationData.content);
	});
})(jQuery);