var form = layui.form;
(function($){
    'use strict';
    var form = layui.form;
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
            // 鼠标自动选择
            mrdocClipperOptions.get(['mouseAutoSelect'], function(r){
                console.log(r)
                if(r['mouseAutoSelect']){
                    // 设置启用
                    // console.log('鼠标自动选择')
                    $('input[name="mouse-auto-select"]').prop('checked',true)
                    form.render('checkbox');                         
                }else{
                    // 设置关闭
                    // console.log('鼠标手动选择')
                    $('input[name="mouse-auto-select"]').prop('checked',false)
                    form.render('checkbox');
                }
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

// 监听鼠标自动选择开关
form.on('switch(mouseAutoSelect)', function(data){
    // console.log(data.elem.checked); //开关是否开启，true或者false
    // console.log(data.value); //开关value值，也可以通过data.elem.value得到
    mrdocClipperOptions = chrome.storage.local
    mrdocClipperOptions.set({'mouseAutoSelect':data.elem.checked})
  }); 


//显示微信公众号二维码图片
$("#wx_qrcode").click(function(r){
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['auto'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#wx_qrcode_img')
      });
})

// 显示打赏图片
$("#dashang").click(function(r){
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['400px','400px'],
        shadeClose: true,
        content: $('#dashang_img')
      });
})