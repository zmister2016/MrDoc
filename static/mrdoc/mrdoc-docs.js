/*
    ########################################################
    ### 文集、文档等前台浏览页面通用JavaScript函数和变量定义 ###
    ########################################################
*/

// Ajax默认配置
$.ajaxSetup({
    data: {csrfmiddlewaretoken: csrf_token_str },
});

// 生成文集目录
getProjectToc = function(tree){
    var toc_str = ""
    for (var i = 0; i < tree.length; i++) {
        var item = tree[i];
        toc_str += '<li class="doctree-li">'
        if(item.children != undefined && item.children.length > 0){ // 存在下级文档
            li = '<div class="doctree-item-wrapper"><span class="doctree-item-name-wrapper has-children-icon">'
            if(item.open_children){
                toc_switch_icon = '<i class="layui-icon layui-icon-down switch-toc"></i>'
            }else{
                toc_switch_icon = '<i class="layui-icon layui-icon-right switch-toc"></i>'
            }
            li += toc_switch_icon
            if(item.editor_mode == 5){
                toc_doc_link = '<a href="' + item.pre_content +'" class="doc-link" title="'+ item.pre_content +'">' + item.name + '</a>'
            }else if(item.editor_mode == 4){
                toc_doc_link = '<a href="/doc/'+ item.id +'/" class="doc-link"'  + 'data-id="' + item.id + '" title="'+ item.name +'">' + item.name + '</a>'
            }else{
                toc_doc_link = '<a href="/doc/'+ item.id +'/" class="doc-link"'  + 'data-id="' + item.id + '" title="'+ item.name +'">' + item.name + '</a>'
            }
            toc_doc_link += '</span>'
            if(is_creater){
                addLink = `<button class="doctree-item-btn" data-id="${item.id}"><i class="layui-icon layui-icon-more"></i></button>`
                toc_doc_link += addLink
            }
            li += toc_doc_link
            if(item.open_children){
                sub_str = '</div><div class="sub-items visible"><ul class="doctree-ul">'
            }else{
                sub_str = '</div><div class="sub-items"><ul class="doctree-ul">'
            }
            li += sub_str
            toc_str += li
            toc_str += getProjectToc(item['children'])
            toc_str += '</ul></div>'
        }else{//不存在下级文档
            li = '<div class="doctree-item-wrapper"><span class="doctree-item-name-wrapper no-children-icon">'
            if(item.editor_mode == 5){
                toc_doc_link = '<a href="'+ item.pre_content +'" class="doc-link" title="'+ item.pre_content +'"><i class="layui-icon layui-icon-link"></i>&nbsp;' + item.name + '</a>'
            }else if(item.editor_mode == 4){
                toc_doc_link = '<a href="/doc/'+ item.id +'/" class="doc-link"'  + 'data-id="' + item.id + '" title="'+ item.name +'"><i class="iconfont mrdoc-icon-table"></i>&nbsp;' + item.name + '</a>'
            }else if(item.editor_mode == 6){
                toc_doc_link = '<a href="/doc/'+ item.id +'/" class="doc-link"'  + 'data-id="' + item.id + '" title="'+ item.name +'"><i class="layui-icon layui-icon-release"></i>&nbsp;' + item.name + '</a>'
            }else{
                toc_doc_link = '<a href="/doc/'+ item.id +'/" class="doc-link"'  + 'data-id="' + item.id + '" title="'+ item.name +'"><i class="iconfont mrdoc-icon-wendang"></i>&nbsp;' + item.name + '</a>'
            }
            toc_doc_link += '</span>'
            if(is_creater){
                addLink = `<button class="doctree-item-btn" data-id="${item.id}"><i class="layui-icon layui-icon-more"></i></button>`
                toc_doc_link += addLink
            }
            li += toc_doc_link
            toc_str += li
        }
        toc_str += '</li>'
    };
    return toc_str;
};

// 视频iframe域名白名单
var iframe_whitelist = '{{ iframe_whitelist }}'.split(',')

//为当前页面的目录链接添加蓝色样式
tagCurrentDoc = function(){
    $("nav li a.doc-link").each(function (i) {
        var $me = $(this);
        var lochref = $.trim(window.location.href); // 获取当前URL
        var mehref = $.trim($me.get(0).href);
        if (lochref.indexOf(mehref) != -1) {
            // console.log($me,lochref,mehref)
            $me.closest("li").addClass("active");
            // 展开当前文档的下级目录
            if($me.parent().next("ul.sub-menu").hasClass("toc-close")){
                // console.log("展开下级目录")
                $me.parent().next("ul.sub-menu").toggleClass("toc-close");
                $me.prevAll("i:first").toggleClass("layui-icon-right layui-icon-down"); // 切换当前文档的图标
            }
            // 展开当前文档的所有层级上级目录
            $me.parents("ul.sub-menu").each(function(index,elem){
               if($(elem).hasClass("toc-close")){
                    $(elem).toggleClass("toc-close")
               };
            });
            // 切换图标
            $me.parents("ul.sub-menu").prevAll("div").each(function(i){
                var $link = $(this);
                if($link.children("i").hasClass("layui-icon-right")){
                    $link.children("i").toggleClass("layui-icon-right layui-icon-down");
                }
            })
            // 目录的当前文档滚动于目录顶端
            this.scrollIntoView({ behavior: 'auto', block: "start" });
        } else {
            // console.log(lochref,mehref)
            $me.closest("li").removeClass("active");
        }
    });
};
// tagCurrentDoc();

activeCurrentDoc = function(){
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    // 使用正则表达式提取数字部分
    let match;
    if( currentPath.startsWith('/share_project/')){
        match = currentPath.match(/\/share_project\/.*?\/(\w+)(\/.*)?$/);
    }else{
        match = currentPath.match(/\/doc\/(\w+)(\/.*)?$/);
    }

    // 检查是否有匹配结果
    if (match) {
    // 获取提取的数字部分
        const docId = match[1];
        // console.log("提取到的文档ID:", docId);
        $('.doc-link').each(function() {
            const btnDataId = $(this).data('id');
            const parentLi = $(this).closest('.doctree-li');
            const parentItem = $(this).closest('.doctree-item-wrapper');
            // console.log(btnDataId)
            // 检查是否与当前文档ID匹配
            if (btnDataId == docId) {
                // 1. 为按钮所在的文档名称div添加active类名
                parentItem.addClass('active');

                // 2. 展开当前文档的下级目录
                if(!parentLi.find(".sub-items").first().hasClass("visible")){
                    // console.log("展开下级目录")
                    parentLi.find(".sub-items").first().addClass("visible");
                }
                // 3. 展开当前文档的图标
                if(!parentItem.find('.switch-toc').first().hasClass('.layui-icon-down')){
                    parentItem.find('.switch-toc').first().removeClass('layui-icon-right').addClass('layui-icon-down')
                }

                // 4. 展开所有上级
                $(this).parents("div.sub-items").each(function(index,elem){
                    if(!$(elem).hasClass("visible")){
                         $(elem).addClass("visible")
                    };
                 });

                 // 5. 展开所有上级图标
                $(this).parents("div.sub-items").prev('.doctree-item-wrapper').each(function(index,elem){
                    if(!$(elem).find('.switch-toc').first().hasClass('.layui-icon-down')){
                        $(elem).find('.switch-toc').first().removeClass('layui-icon-right').addClass('layui-icon-down');
                    }
                 });

                 // 滚动当前文档于可视范围内
                 setTimeout(function() {
                    document.querySelector(`[data-id="${docId}"]`).scrollIntoView({ behavior: 'auto', block: "start" });
                }, 50);
            }
        });
    }
};
activeCurrentDoc();

// 复制文本到剪贴板
function copyToClipboard(text) {
    // 判断是否支持 Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(function() {
          console.log('文本已成功复制到剪贴板:', text);
          layer.msg("文档链接已复制到剪贴板")
        })
        .catch(function(err) {
          console.error('无法复制文本到剪贴板:', err);
        });
    } else {
      // 如果不支持 Clipboard API，则使用 document.execCommand('copy')
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        var success = document.execCommand('copy');
        if (success) {
          console.log('文本已成功复制到剪贴板:', text);
          layer.msg("文档链接已复制到剪贴板")
        } else {
          console.error('复制失败');
        }
      } catch (err) {
        console.error('无法执行复制操作:', err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

/*
    小屏幕下的文集大纲显示处理
*/
//监听浏览器宽度的改变
var browserWidth = document.documentElement.clientWidth;
window.onresize = function(){
    // console.log("可视区域变动")
    if(browserWidth !== document.documentElement.clientWidth){
        changeSidebar();
    }
};
function changeSidebar(){
    // 获取匹配指定的媒体查询
    var screen_width = window.matchMedia('(max-width: 768px)');
    //判断匹配状态
    if(screen_width.matches){
        //如果匹配到，切换侧边栏
        console.log('小屏幕')
        $("body").addClass("big-page");
    }else{
        bgpage_status = window.localStorage.getItem('bgpage')
        if(bgpage_status === '1'){
            $("body").addClass("big-page");
        }else{
            $("body").removeClass("big-page");
        }
    }
};
// 监听文档div点击
document.getElementById('doc-container-body').addEventListener('click', function (e) {
    var screen_width = window.matchMedia('(max-width: 768px)');
    // 小屏下收起左侧文集大纲
    if(screen_width.matches){
        // console.log("点击了div")
        changeSidebar();
    }
});

/*
    切换隐藏侧边栏
*/
// 初始化左侧文集大纲状态
function init_sidebar(){
    var screen_width = window.matchMedia('(max-width: 768px)');
    if(screen_width.matches){}else{
        // 读取浏览器存储
        bgpage_status = window.localStorage.getItem('bgpage')
        console.log("左侧大纲状态：",bgpage_status)
        if(bgpage_status === null){ // 如果没有值，则默认展开
            $("body").toggleClass("big-page");
        }else if(bgpage_status === '1'){ // 如果值为1，则默认展开
            if($("body").hasClass("big-page")){}else{
                $("body").toggleClass("big-page");
            }
        }
        else{ // 否则收起
            if($("body").hasClass("big-page")){
                $("body").toggleClass("big-page");
            }else{
                window.localStorage.setItem('bgpage','0')
            }

        }
    }

}
init_sidebar();
// 切换侧边栏
$(function(){
    $(".js-toolbar-action").click(toggleSidebar);
});
// 切换侧边栏显示隐藏
function toggleSidebar(){
    console.log("切换侧边栏")
    $("body").toggleClass("big-page");
    if(window.localStorage.getItem('bgpage') === '1'){
        window.localStorage.setItem('bgpage','0');
        if(doc_editor_mode == '4'){
            luckysheet.resize();
        }
    }else{
        window.localStorage.setItem('bgpage','1');
        if(doc_editor_mode == '4'){
            luckysheet.resize();
        }
    }
    return false;
}

const darkmode =  new Darkmode({
    autoMatchOsTheme:false,

});

// 页面初始化夜间模式
initTheme = function(){
    themeDarkStatus = window.localStorage.getItem("theme-dark")
    // 如果本地存储为夜间模式
    if(themeDarkStatus == '1' && $("html").hasClass("theme-dark") == false){
        $("html").toggleClass("theme-dark")
        $(".theme-switch i").removeClass("mrdoc-icon-night")
        $(".theme-switch i").addClass("mrdoc-icon-light")
    }
    console.log(darkmode.isActivated())
    if(darkmode.isActivated()){
        darkmode.toggle()
    }
}
initTheme();
// 切换日/夜间模式
$(function(){
    $(".theme-switch").click(toggleDark);
});
function toggleDark(){
    if($("html").hasClass("theme-dark")){
        window.localStorage.removeItem("theme-dark")
        $(".theme-switch i").removeClass("mrdoc-icon-light")
        $(".theme-switch i").addClass("mrdoc-icon-night")
        $("a.theme-switch").attr("title","切换至夜间模式")
    }else{
        window.localStorage.setItem("theme-dark","1")
        $(".theme-switch i").removeClass("mrdoc-icon-night")
        $(".theme-switch i").addClass("mrdoc-icon-light")
        $("a.theme-switch").attr("title","切换至日间模式")
    }
    $("html").toggleClass("theme-dark");
    console.log(darkmode.isActivated())
    if(darkmode.isActivated()){
        darkmode.toggle();
    }
}




/*
    页面初始化字体设置
*/
font_stauts = window.localStorage.getItem('font-sans')
if(font_stauts == 'serif'){// 字体类型
    $(".doc-content").toggleClass("switch-font")
    $("#content").toggleClass("switch-font")
}
if(window.localStorage.getItem('font-size')){// 字体大小
    font_size = window.localStorage.getItem('font-size')
    console.log(font_size)
    $('#content').css({'font-size':font_size+'rem'})
}else{
    window.localStorage.setItem('font-size',1.0)
}

/*
    返回顶部
*/
$(document).ready(function() {
    // 初始时，“返回顶部”标签隐藏
    $(".toTop").hide();
    // $(".editDoc").hide();
    $("#doc-container-body").scroll(function() {
        // 若滚动的高度，超出指定的高度后，“返回顶部”的标签出现。
        if($("#doc-container-body").scrollTop() >= 140) {
            $(".toTop").show();
            // $(".editDoc").show();
        } else {
            $(".toTop").hide();
            // $(".editDoc").hide();
        }
    })
    // 绑定点击事件，实现返回顶部的效果
    $(".toTop").click(function() {
        $("#doc-container-body").scrollTop(0);
    });
    // 生成当前网页链接
    $("input[name=current_url]").val(document.URL)
});

/*
    切换字体类型
*/
$(function(){
    $('.font-switch').click(switchFont);
});
//切换文档内容字体类型
function switchFont(){
    if(font_stauts == 'serif'){
        $(".doc-content").toggleClass("switch-font")
        $("#content").toggleClass("switch-font")
        window.localStorage.setItem('font-sans','sans')
    }else{
        $(".doc-content").toggleClass("switch-font")
        $("#content").toggleClass("switch-font")
        window.localStorage.setItem('font-sans','serif')
    }
};
//放大字体
$(function(){
    $('.font-large').click(largeFont);
});
function largeFont(){
    var font_size = window.localStorage.getItem('font-size')
    console.log(font_size)
    if(parseFloat(font_size) < 1.4){
        size = parseFloat(font_size) + 0.1
        $('#content').css({'font-size':size+'rem'})
        window.localStorage.setItem('font-size',size)
    }else{
        console.log("xxx")
    }
};
//缩小字体
$(function(){
    $('.font-small').click(smallFont);
});
function smallFont(){
    var font_size = window.localStorage.getItem('font-size')
    if(parseFloat(font_size) >= 0.6){
        size = parseFloat(font_size) - 0.1
        $('#content').css({'font-size':size+'rem'})
        window.localStorage.setItem('font-size',size)
    }else{
        console.log("xxx")
    }
};

/*
    显示打赏图片
*/
$("#dashang").click(function(r){
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['480px','400px'],
        shadeClose: true,
        content: $('#dashang_img')
      });
});

/*
    右侧文档目录
*/
// 切换文档目录
$(document).on('click', '.switch-toc', function () {
    $(this).toggleClass("layui-icon-right layui-icon-down");//切换图标
    var parentLi = $(this).closest('.doctree-li');
    parentLi.find('.sub-items').first().toggleClass('visible');
  });

// $(".switch-toc-div").click(function(e){
//     console.log(e)
//     $(this).children("i").trigger('click')
// });

// 展开文档树
function openDocTree(){
    $("nav ul.summary ul").each(function(obj){
        console.log(obj,this)
        $(this).removeClass("toc-close")
        $(this).prev().children('i').toggleClass("layui-icon-right layui-icon-down");//切换图标
    })

};
// 收起文档树
function closeDocTree(){
    $("nav ul.summary ul").each(function(obj){
        console.log(obj,this)
        $(this).addClass("toc-close")
        $(this).prev().children('i').toggleClass("layui-icon-right layui-icon-down");//切换图标
    })
};

/*
    文档分享
*/
// 显示分享弹出框
$("#share").click(function(r){
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['350px','350px'],
        shadeClose: true,
        content: $('#share_div')
      });
});
// 复制文档链接
copyUrl = function(){
    var crt_url_val = document.getElementById("copy_crt_url");
    crt_url_val.select();
    window.clipb
    document.execCommand("Copy");
    layer.msg("链接复制成功！")
};
$("#copy_doc_url").click(function(){
    copyUrl();
});

// 生成文档链接二维码
doc_qrcode = function(){
    new QRCode("url_qrcode", {
        text: document.URL,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
};
doc_qrcode();

/*
    文集水印
*/
function svgToBase64(svg) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function createSvg(text, fontSize = 14, opacity = 0.15) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" style="transform: rotate(-15deg); transform-origin: 50% 50%;">
        <text
        x="50%" y="50%"
        dominant-baseline="middle" text-anchor="middle"
        fill="rgba(156, 162, 169, ${opacity})"
        font-family="'PingFang SC', 'Microsoft YaHei', Arial, sans-serif"
        font-size="${fontSize}px">
        ${text}
        </text>
    </svg>`;
    return svgToBase64(svg);
}

function initWhterMark(text) {
    const wm = document.getElementById('wm');
    const svg1 = createSvg(text);
    const svg2 = createSvg(text);

    wm.style.backgroundImage = `url('${svg1}'), url('${svg2}')`;
    wm.style.backgroundPosition = `109px 109px, 0 0`;
}

// 文集、文档收藏函数
function collect(id,type){
    $.ajax({
        url:'/my_collect/',
        type:'post',
        data:{'type':type,'id':id},
        success:function(r){
            layer.msg(r.data)
        },
        error:function(){
            layer.msg("操作异常")
        }
    });

}
// 收藏文集
$("#collect_pro").click(function(e){
    $(this).toggleClass("layui-icon-star-fill layui-icon-star");
    $(this).toggleClass("collected");
    collect(pro_id,2);
});
// 收藏文档
$("#collect_doc").click(function(){
    $(this).toggleClass("layui-icon-star-fill layui-icon-star");
    $(this).toggleClass("collected");
    collect(doc_id,1);
});

/*
    ########################################################
    ### 文集阅读页面JavaScript函数和变量定义 ###
    ########################################################
*/



/*
    ########################################################
    ### 文档阅读页面JavaScript函数和变量定义 ###
    ########################################################
*/

// 初始化文档内容渲染
function initDocRender(mode){
    if(mode == 1){
        var marked = new markedParse();
        marked.getHtml({
            id:'content',
            value:$("#content textarea").val(),
            cdn:"/static/mr-marked/",
            hljsLineNumber:code_line_number ? true : false,
        })
        marked.renderGraphic()
        var docToc = marked.getToc();
        $("#toc-container").append(docToc);
    }else if(mode == 2){
        var md_content = $("#content textarea").val()
        Vditor.preview(document.getElementById('content'),md_content,
        {
            "cdn":"/static/vditor",
            markdown:{mark:true},
            speech: {enable: true,},
            anchor: 1,
            hljs:{lineNumber:code_line_number ? true : false},
            after () {
                var sub_ele = "<div class='markdown-toc editormd-markdown-toc'></div>"
                $("#toc-container").append(sub_ele)
                var outlineElement = $("#toc-container div")
                Vditor.outlineRender(document.getElementById('content'), outlineElement[0])
                $('#toc-container div ul').addClass('markdown-toc-list')
                if (outlineElement[0].innerText.trim() !== '') {
                    outlineElement[0].style.display = 'block';
                    var toc_cnt = $(".markdown-toc-list ul").children().length;
                }
                // 图片放大显示
                var img_options = {
                    url: 'data-original',
                    fullscreen:false,//全屏
                    rotatable:false,//旋转
                    scalable:false,//翻转
                    button:false,//关闭按钮
                    toolbar:false,
                    title:false,
                };
                var img_viewer = new Viewer(document.getElementById('content'), img_options);
                // 渲染文档目录
                var toc_cnt = $(".markdown-toc-list").children().length;
                // console.log(toc_cnt)
                if(toc_cnt > 0){
                    // console.log('显示文档目录')
                    $(".tocMenu").show();
                    initSidebar('.sidebar', '.doc-content', mode=2);
                };
                // 高亮搜索词
                keyLight('doc-content',getQueryVariable("highlight"));
                // 跳转到搜索词
                scrollIntoKey('doc-content',getQueryVariable("highlight"));
            },
        })
    }else if(mode == 4){
        //配置项
        var options = {
            container: 'luckysheet', //luckysheet为容器id
            lang: 'zh',
            showGridLines:true,
            allowEdit:false,
            showtoolbar:false, // 是否显示顶部工具栏
            showinfobar: false, // 是否显示顶部信息栏
            showsheetbar: true, // 是否显示底部sheet页按钮
            showstatisticBar: true, // 是否显示底部计数栏
            sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
            userInfo: false, // 右上角的用户信息展示样式
            enableAddRow:false, // 允许添加行
            enableAddBackTop:false, // 回到顶部

            // plugins: ['chart'],
            showstatisticBarConfig: {
                count:false,
                view:false,
                zoom:false,
            },
            showsheetbarConfig: {
                add: false, //新增sheet
                // menu: false, //sheet管理菜单
                // sheet: false, //sheet页显示
            },
            data:JSON.parse($("#sheet_table_content").val()),

        }
        luckysheet.create(options)
    }
};

// URL参数解析
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// 搜索词高亮
function keyLight(id, key, bgColor){
    // console.log(id,key,decodeURI(key))
    if(key != false){
        key = decodeURI(key);
        var markInstance = new Mark(document.getElementById(id));
        markInstance.mark(key);
    }
};

// 搜索词跳转
function scrollIntoKey(id,key){
    var searchRegex = new RegExp(decodeURIComponent(key), 'iu');
    var elements = document.getElementById(id).querySelectorAll("h1,h2,h3,h4,h5,h6,p,a");
    // 遍历元素列表
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        // 检查元素的文本内容是否包含搜索的文本
        if (searchRegex.test(element.textContent)) {
            // console.log(element)
            // 将匹配的元素滚动到可视区域
            element.scrollIntoView({ block: 'start' });
            // 找到第一个匹配后退出循环
            break;
        }
    }
}

// 判断是否为微信内置浏览器
function isWeChatBrowser() {
    // alert(navigator.userAgent)
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('micromessenger') && !ua.includes('wxwork');
}