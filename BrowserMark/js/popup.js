self.title = $('#titleinp'); //popup页面的标题栏
layer = layui.layer;
form = layui.form;

//点击关闭按钮
$('#closebtn').click(function(e) {
    parent.postMessage({
        name: 'closefrommrdocpopup'
    }, '*');
    return false;
});

//点击重置按钮
$('#resetbtn').click(function(e) {
    self.editor.setValue('')
    parent.postMessage({
        name: 'resetfrommrdocpopup'
    }, '*');
});

// 点击保存按钮
$("#savebtn").click(function(e){
    layer.load(1)
    var item = {
        title : self.title.val(),//标题
        pid : $("#projects").val(), // 文集ID
        doc : self.editor.getValue() 
    }
    // console.log(item)
    if(item.pid == ''){ // 如果文集为空，消息提示
        layer.closeAll('loading');
        layer.msg("必须选择文集")
        return 
    }
    //发送请求到background
    chrome.runtime.sendMessage({
        name: 'savedocfrompopup',
        data: item
    });
});

//粘贴上传图片
$("#notecontentwrap").on('paste',function(ev){
    var data = ev.clipboardData;
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            layer.load(1);
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                var base64 = event.target.result;
                //发送请求到background
                chrome.runtime.sendMessage({
                    name: 'pasteimage',
                    data: base64
                });
            }; // data url!
            var url = reader.readAsDataURL(blob);
        }
    }
});

//鼠标选择 - 2020-03-15自定义
// $("#mouse-select").click(function(){
//     var t = $("#mouse-select").prop('checked');
//     console.log(t)
//     if(t){
//         parent.postMessage({
//             name: 'showinspectorfrommrdocpopup'
//         }, '*');
//     }else{
//         parent.postMessage({
//             name: 'hideinspectorfrommrdocpopup'
//         }, '*');
//     }
// });

// 监听鼠标选择开关
form.on('switch()', function(data){
    // console.log(data.elem); //得到checkbox原始DOM对象
    // console.log(data.elem.checked); //开关是否开启，true或者false
    if(data.elem.checked){
        parent.postMessage({
            name: 'showinspectorfrommrdocpopup'
        }, '*');
    }else{
        parent.postMessage({
            name: 'hideinspectorfrommrdocpopup'
        }, '*');
    }
    // console.log(data.value); //开关value值，也可以通过data.elem.value得到
    // console.log(data.othis); //得到美化后的DOM对象
  });  

//初始化Markdown编辑器
iniMdEditor = function(){
    var self = this;
    // codemirror 编辑器
    self.editor = CodeMirror.fromTextArea($('#editor').get(0), {
        mode: 'markdown',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        lineWrapping: true,  // 长句子折行
        // theme: "material",
        keyMap: 'sublime',
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });
};
iniMdEditor();

// 获取文集列表
getProjects = function(){
    var opt = chrome.storage.local
    // 获取mrdoc地址
    opt.get(['serverUrl'],function(r){
        self.mrdocUrl = r['serverUrl'];
        // 获取账户token
        opt.get(['accountKey'],function(r){
            self.mrdocToken = r['accountKey'];
            // 如果存在mrdoc服务地址和账户token，获取文集
            if(self.mrdocUrl != undefined && self.mrdocToken != undefined){
                layer.load(1);
                item = {'url':self.mrdocUrl,'token':self.mrdocToken}
                chrome.runtime.sendMessage({
                    name: 'selectprojects',
                    data:item
                });
            }else{
                //打开选项页
                chrome.tabs.create({url: chrome.runtime.getURL('options.html')});
            }
        })
    })
};
getProjects();

//创建注入器
createInspector = function(autoExtractContent) {
    // 发送消息到mrdocclipper.js
    parent.postMessage({
        name: 'createinspectorfrommrdocpopup',
        autoExtractContent: autoExtractContent
    }, '*');
};
createInspector(false);

// 默认关闭鼠标选择标记框
// hideInspector = function(){
//     parent.postMessage({
//         name: 'hideinspectorfrommrdocpopup'
//     }, '*');
// };
// hideInspector();

// 获取鼠标选择开关状态
getMouseSelectStatus = function(){
    var mrdocClipperOptions = chrome.storage.local;
    var form = layui.form;
    mrdocClipperOptions.get(['mouseAutoSelect'], function(r){
        console.log(r)
        if(r['mouseAutoSelect']){ //鼠标自动选择
            // 开启鼠标选择器
            parent.postMessage({
                name: 'showinspectorfrommrdocpopup'
            }, '*');
            // 更新渲染popup页面鼠标选择开关状态
            $("#mouse-select").prop('checked',true);
            form.render('checkbox');
        }else{ // 鼠标手动选择
            // 关闭鼠标选择器
            parent.postMessage({
                name: 'hideinspectorfrommrdocpopup'
            }, '*');
            // 更新渲染popup页面鼠标选择开关状态
            $("#mouse-select").prop('checked',false);
            form.render('checkbox');
        }
    });
}
getMouseSelectStatus();


// 处理background发送来的页面剪藏内容，将其添加到文本编辑器中
actionfrompopupinspecotrHandler = function(data) {
    var self = this;
    console.log("开始处理background发送来的内容")
    if (data.add) { //如果存在add属性，则添加内容
        //添加内容 到文本框
        if(data.content == ' '){ // 没有内容时，不换行
            self.editor.replaceSelection(data.content)
        }else{
            self.editor.replaceSelection(data.content+'\n\n')
        }
        parent.postMessage({
            name: 'resetfrommrdocpopup'
        }, '*');
        if (data.title) {
            //for auto extract content
            self.title.val(data.title);
        }
    } else {// 如果不存在add属性，则移除ID所属的元素内容
        //从uid移除内容
        $('#' + data.uid, self.noteContent).remove();
    }
};

// 处理background发送来的文集列表数据，将其遍历到文集下拉框
selectProjectsHandler = function(projects){
    layer.closeAll('loading');
    // 如果获取文集失败，关闭load层
    if(projects.error){
        return 
    }
    var pro = $("#projects")
    pro.empty(); //清空option
    pro.append('<option value="">请选择一个文集</option>')
    for (var i = 0, l = projects.length, project; i < l; i++) {
        project = projects[i];
        if (project.type==0) {
            pro.append('<option value="' + project.id + '">[公开]' + project.name + '</option>');
        }else if(project.type==1){
            pro.append('<option value="' + project.id + '">[私密]' + project.name + '</option>');
        }else if(project.type==2){
            pro.append('<option value="' + project.id + '">[指定用户]' + project.name + '</option>');
        }else if(project.type==3){
            pro.append('<option value="' + project.id + '">[访问码]' + project.name + '</option>');
        }
        else {
            pro.append('<option value="' + project.id + '">[受限]' + project.name + '</option>');
        }
    }
    form.render();
};

// 处理background发来来的上传图片的URL，将其添加到文本编辑器中
pasteImageHandler = function(url){
    layer.closeAll('loading');
    self.editor.replaceSelection("![](" + url + ")\n\n")
}

// popup侦听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
    switch (request.name) {
        case 'actionfrompopupinspecotr': // background将页面标记的数据发送过来
            self.actionfrompopupinspecotrHandler(request.data);
            break;
        case 'checktokenvalue':
            break;
        case 'pasteimgurl': //粘贴上传图片
            pasteImageHandler(request.data)
            break;
        case 'selectprojectsvalue':
            selectProjectsHandler(request.data);
            break;
        default:
            break;
    }
});