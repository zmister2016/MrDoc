(function($){
    'use strict';
    window.mrdocClipperSettings = {
        init: function(){
            var self = this,
            //从chrome.storage.local里面读取值
            mrdocClipperOptions = chrome.storage.local
            //mrdoc地址
            mrdocClipperOptions.get(['serverUrl'],function(r){
                console.log(r)
                $("input[name='mrdoc_server_url']").val(r['serverUrl']);
            });
            //账户密钥
            mrdocClipperOptions.get(['accountKey'],function(r){
                $("input[name='mrdoc_account_key']").val(r['accountKey']);
            });
            //转存图片
            // mrdocClipperOptions.get(['retrieveImg'],function(r){
            //     if(r['retrieveImg'] == true){
            //         $("#retrieveimage").prop('checked',true);
            //     }
            // });
        }
    }
	$(function(){
		mrdocClipperSettings.init();
	});
})(jQuery);


//点击保存按钮
$('#save-btn').click(function () {
    saveSettingOptions();
});

//保存设置选项
saveSettingOptions = function(){
    mrdocClipperOptions = chrome.storage.local
    mrdocClipperOptions.set({'serverUrl':$("input[name='mrdoc_server_url']").val()})
    mrdocClipperOptions.set({'accountKey':$("input[name='mrdoc_account_key']").val()})
    // mrdocClipperOptions.set({'retrieveImg':$("#retrieveimage").prop('checked')})
    layer.msg("保存成功")
};

//点击验证按钮
$("#checkKey").click(function(){
    var host = $('#mrdoc_url').val()
    var token = $('#mrdoc_token').val()
    checkAccountKey(host,token);
})

//验证账户密钥
checkAccountKey = function(server_url,account_key){
    layer.load(1);
    $('button.layui-btn').attr("disabled",true);
    $('button.layui-btn').addClass('layui-btn-disabled');
    $.get(server_url+'/api/get_projects/?token='+account_key,function(r){
        if(r.status){
            layer.msg("验证成功")
        }else{
            layer.msg("验证失败")
        }
    }).fail(function(){
        layer.msg('连接MrDoc出错')
    })
    layer.closeAll('loading');
    $('button.layui-btn').attr("disabled",false);
    $('button.layui-btn').removeClass('layui-btn-disabled');
}