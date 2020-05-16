var self = this;
var chromeSchemeReg = /chrome:\/\/.*/ig; // Chrome配置项地址的正则表达式
layer = layui.layer;

// 侦听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender,sendResponse) {
    if (!sender || sender.id !== chrome.i18n.getMessage("@@extension_id")) return;
    switch (request.name) {
        case 'createoptionstab':
            chrome.tabs.create({
                url: chrome.i18n.getMessage('helperUrl')
            });
            break;
        case 'checktoken': // 检验token - 回传文集列表数据给popup
            self.checkToken(function(projects){
                chrome.tabs.sendMessage(sender.tab.id,{
                    name:'checktokenvalue',
                    data:projects
                });
            });
        case 'savedocfrompopup': // 保存文档
            self.saveDoc(request.data);
            break;
        case 'pasteimage': // 粘贴上传图片 - 回传图片URL给popup
            self.pasteImg(request.data,function(url){
                chrome.tabs.sendMessage(sender.tab.id,{
                    name:'pasteimgurl',
                    data:url
                });
            });
            break;
        case 'selectprojects':
            selectProjects(request.data,function(projects){
                chrome.tabs.sendMessage(sender.tab.id,{
                    name:'selectprojectsvalue',
                    data:projects
                });
            })
            break;
        case 'image2base64':
            getImgBase64(request.data,function(url){
                chrome.tabs.sendMessage(sender.tab.id,{
                    name:'img2base64url',
                    data:{url:url,source:request.data}
                });
            })
            break;
        default:
            break;
    }
});

//侦听长连接
chrome.runtime.onConnect.addListener(function(port) {
    switch (port.name) {
        case 'mrdocclipperisready':
            self.mrdocclipperisreadyHandlerConnect(port);
        case 'mrdocclipperisnotready':
            self.mrdocclipperisnotreadyHandlerConnect(port);
            break;
        case 'actionfrompopupinspecotr':
            self.actionfrompopupinspecotrHandler(port);
            break;
        default:
            break;
    }
});

// 侦听浏览器上扩展图标被点击
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("扩展图标被点击")
    console.log(tab)
    if (!chrome.runtime.sendMessage) {
        var msg = "抱歉，MrDoc剪藏器暂时不支持该版本的Chrome浏览器，请将浏览器升级到最新稳定版本。点击右上角工具按钮选择'关于 Google Chrome(G)'进行自动升级"
        notifyTipsFail(msg)
        return;
    }
    var match = tab.url.match(/^(.*?):/),
        scheme = match[1].toLowerCase();
    if (chromeSchemeReg.test(tab.url) || (scheme != "http" && scheme != "https")) {
        notifyTipsFail("不能在Chrome设置操作！")
        return;
    }
    self.createPopup();//创建popup窗口
});

//JQ设置步骤
jQuerySetUp = function() {
    $.ajaxSetup({
        dataType: 'json',
        cache: false,
        // dataFilter: function(data) {
        //     console.log(data)
        //     data = $.parseJSON(data.substr(9)); //remove 'while(1);'
        //     return data.success ? data.data : {
        //         error: data.error
        //     };
        // },
        beforeSend: function(xhr) {
            xhr.setRequestHeader('UserClient', 'inote_web_chromeext/3.1.0');
        }
    });
};
jQuerySetUp();

//从文本中获取标题
getTitleByText = function(txt) {
    //todo
    var self = this,
        finalTitle = '';
    if (txt.length <= 100) return txt;
    if (txt.length > 0) {
        var t = txt.substr(0, 100),
            l = t.length,
            i = l - 1,
            hasSpecialChar = false;
        while (i >= 0) {
            if (/^(9|10|44|65292|46|12290|59|65307)$/.test(t.charCodeAt(i))) {
                hasSpecialChar = true;
                break;
            } else {
                i--;
            }
        }
        hasSpecialChar ? (t = t.substr(0, i)) : '';
        i = 0;
        l = t.length;
        while (i < l) {
            if (/^(9|10)$/.test(t.charCodeAt(i))) {
                break;
            } else {
                finalTitle += t.charAt(i);
                i++;
            }
        }
    }
    finalTitle = finalTitle.trim();
    return finalTitle.length > 0 ? finalTitle : '[未命名笔记]';
};


//创建popup
createPopup = function() {
    chrome.tabs.executeScript(null, {
        code: "try{mrdocClipper.createPopup();}catch(e){console.log(e);var port = chrome.runtime.connect({name: 'mrdocclipperisnotready'});port.postMessage();}"
    });
};
//关闭popup
closePopup = function() {
    chrome.tabs.executeScript(null, {
        code: "mrdocClipper.closePopup();"
    });
};

// 检查用户Token状态
checkToken =  function(callback){
    var self = this;
    var opt = chrome.storage.local;
    // 获取mrdoc地址
    opt.get(['serverUrl'],function(r){
        self.mrdocUrl = r['serverUrl'];
        // 获取账户token
        opt.get(['accountKey'],function(r){
            self.mrdocToken = r['accountKey'];
            // 如果存在mrdoc服务地址和账户token，获取文集
            if(self.mrdocUrl != undefined && self.mrdocToken != undefined){
                $.get(self.mrdocUrl + '/api/get_projects/?token='+self.mrdocToken,function(r){
                    console.log(r)
                    if(r.status){ // 如果获取文集成功，表示token验证成功，已登录
                        // console.log(r.data)
                        var userProjects = r.data;
                        var item = {
                            "projects":userProjects,
                            "isLogin":true,
                            "token":self.mrdocToken,
                            "url":self.mrdocUrl
                        }
                        callback(item)
                    }else{// 获取文集失败，表示token验证失败，未登录
                        console.log('token验证失败')
                        callback({'isLogin':false})
                        //return {"isLogin":false}
                    }
                })
            }
        })
    })
};

// 保存文档
saveDoc = function(data){
    var self = this;
    // console.log(data);
    $.post(self.url+'/api/create_doc/?token='+self.token,data,function(r){
        // var layer = layui.layer;
        layer.closeAll('loading')
        if(r.status){
            //消息提示
            notifyTipsSucce('文档已保存成功，你可以前往mrdoc站点查看和修改！')
            //关闭popup  
            self.closePopup()                       
        }else{
            //消息提示
            notifyTipsFail("文档保存失败！")
        }
    });
};

// 粘贴上传图片
pasteImg = function(data,callback){
    //console.log(data)
    $.post(self.url+'/api/upload_img/?token='+self.token,{data:data}, function (ret) {
        if (ret.success === 1) {
            //新一行的图片显示
            console.log("上传图片成功")
            //console.log(ret.url)
            callback(ret.url)
            notifyTipsSucce("图片上传成功")
        }else{
            console.log("上传图片失败")
            notifyTipsFail("图片上传失败！")
        }
    });
};

// 获取文集
selectProjects = function(data,callback){
    var self = this;
    // console.log(data)
    self.url = data.url,self.token = data.token;
    $.ajax({
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        type: 'GET',
        url: url+'/api/get_projects/?token='+token,
        success: function(r) {
            // console.log(r)
            if(r.status){
                callback(r.data)
            }else{
                callback({error:true})
                notifyTipsFail("文集获取请求失败，请确认你的账户token是否正确！")
            }
        },
        error: function(r) {
            callback({error:true})
            // console.log(r)
            notifyTipsFail("文集获取请求失败，请确认你的MrDoc站点可访问！")
        }
    });
};

// 获取外链图片base64编码
getImgBase64 = function(data,callback){
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
    xhr.open("get", data, true);
    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function(){
        if(this.status == 200){
            //得到一个blob对象
            var blob = this.response;
            console.log("blob", blob)
            // 至关重要
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
                // 此处拿到的已经是 base64的图片了
                let base64 = e.target.result;
                //console.log("图片base64", base64)
                self.pasteImg(base64,callback)
            };
        oFileReader.readAsDataURL(blob);
    }
  }
  xhr.send();
}

// ////////////消息提示框////////////////

//成功的消息提示框
notifyTipsSucce = function(data){
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/128x128.png',
        title: 'MrDoc剪藏：操作成功！',
        message: data
        },function(id){
            setTimeout(() => {
                chrome.notifications.clear(id)
            }, 3000);
    });
};

//失败的消息提示框
notifyTipsFail = function(data){
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/128x128.png',
        title: 'MrDoc剪藏：操作失败！',
        message: data
        },function(id){
            setTimeout(() => {
                chrome.notifications.clear(id)
            }, 3000);
    });
};


mrdocclipperisreadyHandlerConnect =  function(port) {
    var self = this;
    port.onMessage.addListener(function(msg) {
        ReadyErrorNotify.close();
    });
};
mrdocclipperisnotreadyHandlerConnect = function(port) {
    var self = this;
    port.onMessage.addListener(function(data) {
        data = data || {};
        // ReadyErrorNotify.show(data.key);
        notifyTipsFail(data.key)
    });
};
//来自popup注入器的处理操作
actionfrompopupinspecotrHandler = function(port) {
    var self = this;
    port.onMessage.addListener(function(data) {
        console.log("页面剪藏数据")
        console.log(data)
        //发送到popup
        chrome.tabs.sendMessage(port.sender.tab.id, {
            name: 'actionfrompopupinspecotr',
            data: data
        });
    });
};