(function () {
    'use strict';
    // 获取文档目录数量
    if(mode == 3){
        $(".mce-toc h2").remove();
        $("#toc-container").prepend($(".mce-toc")[0]);
        var toc_cnt = $(".mce-toc ul").children().length;
        addTitleAnchorIcon();
    }else{
        var toc_cnt = $(".markdown-toc-list").children().length;
    }
    console.log(toc_cnt)
    if(toc_cnt > 0){
        // console.log('显示文档目录')
        $(".tocMenu").show();
        initSidebar('.sidebar', '.doc-content');
    }
})();

function addTitleAnchorIcon(){
    try{
        $('#content').find('h1, h2, h3, h4').each(function(){
            var heading = $(this);
            var heading_id = heading.attr('id');
            if(heading_id){
                var anchor = $('<a></a>')
                    .attr('href', '#' + heading_id)
                    .addClass('anchor')
                    .html('<span class="octicon octicon-link"></span>');
                
                heading.append(anchor);
            }
        })
    } catch (error) {
        console.error("标题锚点图标生成出错:", error);
    }
};

/**
* 左侧目录生成插件
* 代码参考了 https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js
* @param {string} sidebarQuery - 目录 Element 的 query 字符串 
* @param {string} contentQuery - 正文 Element 的 query 字符串
*/
function initSidebar(sidebarQuery, contentQuery, mode=1) {
    addAllStyle();
    var sidebar = document.querySelector(sidebarQuery)
    if(mode == 1){
        // 遍历文章中的所有 h1或 h2(取决于最大的 h 是多大) , 编辑为li.h3插入 ul
        var allHeaders = []
        var content = document.querySelector(contentQuery)
        for(var i = 1;i < 7; i++){
            // console.log(i,content.querySelectorAll('h' + i))
            allHeaders.push.apply(allHeaders,content.querySelectorAll('h' + i))
        }
        // console.log('目录列表：',allHeaders)
        
        //增加 click 点击处理,使用 scrollIntoView,增加控制滚动的 flag
        var scrollFlag = 0
        var scrollFlagTimer
        sidebar.addEventListener('click', function (e) {
            e.preventDefault()
            // console.log(e.target.dataset.id)
            if (e.target.href) {
                scrollFlag = 1
                clearTimeout(scrollFlagTimer)
                scrollFlagTimer = setTimeout(() => scrollFlag = 0, 1500)
                setActive(e.target, sidebar)
                var target = document.getElementById(e.target.getAttribute('href').slice(1))
                // console.log(e,target)
                // console.log(e.target.getAttribute('href').slice(1))
                target.scrollIntoView({ behavior: 'smooth', block: "start" })
            }else if(e.target.dataset.id){
                // console.log('vditor目录')
                var target = document.getElementById(e.target.dataset.id)
                target.scrollIntoView({ behavior: 'smooth', block: "start" })
            }
        });
        
        //监听窗口的滚动和缩放事件
        document.getElementById('doc-container-body').addEventListener('scroll', throttle(updateSidebar))
        // window.addEventListener('resize', throttle(updateSidebar))
        function updateSidebar() {
            if (scrollFlag) return // 如果存在scrollFlag，直接返回

            var doc = document.getElementById('doc-container-body') // 定义doc变量值为页面文档元素
            var top = doc && doc.scrollTop || document.body.scrollTop // 获取当前页面滚动条纵坐标
            
            if (!allHeaders.length) return // 如果allHeaders的列表长度为空，直接返回
            
            var last // 定义一个变量last
            // console.log(allHeaders)
            // 按照allHeaders的列表长度进行遍历
            
            for (const link of allHeaders) { 
                // console.log("当前元素：",link)
                // console.log("页面可视区域高度：",document.body.clientHeight)
                // console.log("元素距离顶部距离：",link.offsetTop)
                // console.log("当前页面滚动条纵坐标：",top)
                // console.log("页面元素距离浏览器工作区顶端的距离：", link.offsetTop - document.documentElement.scrollTop)
                // link.offsetTop 表示元素距离上方的距离
                // top 表示当前页面滚动条的纵坐标
                // document.body.clientHeight 表示页面可视区域高度
                var linkOffset  = link.offsetTop - doc.scrollTop;
                // console.log(linkOffset)
                if(linkOffset  > 150){
                }else if(linkOffset  < -150){
                }else{
                    if (!last) {last = link }
                    break
                }
            }
            if (last) {
                // console.log(last.offsetTop)
                setActive(last.id, sidebar)
            }
        }
    }else if(mode == 2){
        const headingElements = []
        Array.from(document.getElementById('content').children).forEach((item) => {
            if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
                headingElements.push(item)
            }
        })
        let toc = []
        document.getElementById('doc-container-body').addEventListener('scroll', () => {
            var doc = document.getElementById('doc-container-body') // 定义doc变量值为页面文档元素
            toc = []
            headingElements.forEach((item) => {
                toc.push({
                    id: item.id,
                    offsetTop: item.offsetTop,
                })
            })
            var last // 定义一个变量last
            for (let i = 0, iMax = toc.length; i < iMax; i++) {
                var link = headingElements[i] // 按索引取出一个目录link
                var link_to_top_offset = link.offsetTop - doc.scrollTop;
                if(link_to_top_offset > 150){
                }else if(link_to_top_offset < -150){
                }else{
                    if (!last) {
                        last = link
                        var index = i > 0 ? i : 0 
                        var previousActives = sidebar.querySelectorAll(`.active`)
                        ;[].forEach.call(previousActives, function (h) {
                            h.classList.remove('active')
                        })
                        document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('active')
                    }
                    break
                };
            };
        });
        $("#toc-container li").click(function(e){
            var linkId = $(this).children('span').data('target-id')
            // console.log(linkId)
            if(linkId){
                var previousActives = sidebar.querySelectorAll(`.active`)
                ;[].forEach.call(previousActives, function (h) {
                    h.classList.remove('active')
                })
                document.querySelector('span[data-target-id="' + linkId + '"]').classList.add('active');
                setTimeout(function() {
                    var target = document.getElementById(linkId)
                    target.scrollIntoView({ behavior: 'smooth', block: "start" });
                }, 30);
            }
            return false;
        })
    };
    let tocCollapseIcon = '<svg t="1750910790995" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8337" width="200" height="200"><path d="M317.724444 519.774815L157.392593 682.192593c-7.016296 7.111111-18.962963 2.085926-18.962963-7.964445V349.487407c0-10.05037 11.946667-15.075556 18.962963-7.964444l160.237037 162.322963c4.361481 4.456296 4.361481 11.567407 0.094814 15.928889zM885.096296 239.691852H171.899259c-11.757037 0-21.333333-9.576296-21.333333-21.333333s9.576296-21.333333 21.333333-21.333334h713.102222c11.757037 0 21.333333 9.576296 21.333334 21.333334s-9.481481 21.333333-21.238519 21.333333zM885.096296 435.38963H472.841481c-11.757037 0-21.333333-9.576296-21.333333-21.333334s9.576296-21.333333 21.333333-21.333333h412.254815c11.757037 0 21.333333 9.576296 21.333334 21.333333s-9.576296 21.333333-21.333334 21.333334zM885.096296 630.992593H472.841481c-11.757037 0-21.333333-9.576296-21.333333-21.333334s9.576296-21.333333 21.333333-21.333333h412.254815c11.757037 0 21.333333 9.576296 21.333334 21.333333s-9.576296 21.333333-21.333334 21.333334zM885.096296 826.595556H171.899259c-11.757037 0-21.333333-9.576296-21.333333-21.333334s9.576296-21.333333 21.333333-21.333333h713.102222c11.757037 0 21.333333 9.576296 21.333334 21.333333s-9.481481 21.333333-21.238519 21.333334z" p-id="8338"></path></svg>'
    $("#toc-container").prepend(`<strong><a href="javasript:void(0);" title="收起目录" onclick="toggleDocToc()">${tocCollapseIcon}</a> ${gettext("文档目录")}</strong><hr>`)
}

// 切换目录的显示
function toggleDocToc(){
    $(".sidebar").toggleClass("doc-toc-hide");
}

/**
*设置目录的激活状态,按既定规则添加 active 和 current 类
*>无论对h2还是 h3进行操作,首先都要移除所有的 active 和 current 类, 然后对 h2添加 active 和 current, 或对 h3添加 active 对其父目录添加 current
@param {String|HTMLElement}  id - HTML标题节点或 querySelector 字符串
@param {HTMLElement} sidebar - 边栏的 HTML 节点
*/
function setActive(id, sidebar) {
    //1.无论对h2还是 h3进行操作,首先都要移除所有的 active 和 current 类
    
    // 遍历目录中所有包含active类的HTMl元素，移除其active类
    var previousActives = sidebar.querySelectorAll(`.active`)
        ;[].forEach.call(previousActives, function (h) {
            h.classList.remove('active')
        })
    // 遍历目录中所有包含current类的HTML元素，移除其current类
    previousActives = sidebar.querySelectorAll(`.current`)
        ;[].forEach.call(previousActives, function (h) {
            h.classList.remove('current')
        })
    
    //获取要操作的目录节点
    var currentActive = typeof id === 'string'
        ? sidebar.querySelector('a[href="#' + id + '"]')
        : id
    // console.log(currentActive)
    
    if(currentActive !== null){
        // h2标题
        if (currentActive.classList.contains('h2') != -1) {
            // 添加 active 和 current
            currentActive.classList.add('active', 'current')
        };
        // h3标题
        if ([].indexOf.call(currentActive.classList, 'h3') != -1) {
            console.log("H3标题")
            // 添加 active 且对其父目录添加 current
            currentActive.classList.add('active')
            var parent = currentActive
            while (parent && parent.tagName != 'UL') {
                parent = parent.parentNode
            }
            parent.parentNode.querySelector('.h2-link').classList.add('current', 'active')
        };
        //左侧目录太长时的效果
        currentActive.scrollIntoView({ behavior: 'smooth' })
    }
    
}
/**
>增加 sidebar 需要的全部样式
@param {string} highlightColor - 高亮颜色, 默认为'#c7254e'
*/
function addAllStyle(highlightColor) {
    highlightColor = highlightColor || "#2176ff"
    var sheet = newStyleSheet()
    /**
    >创建一个新的`<style></style>`标签插入`<head>`中
    @return {Object} style.sheet,`它具有方法insertRule`
    */
    function newStyleSheet() {
        var style = document.createElement("style");
        // 对WebKit hack :(
        style.appendChild(document.createTextNode(""));
        // 将 <style> 元素加到页面中
        document.head.appendChild(style);
        return style.sheet;
    }
    var position = 0
    /**
    >添加一条 css 规则
    @param {string} str - css样式,也可以是@media
    */
    function addStyle(str) {
        sheet.insertRule(str,position++);
    }
    addStyle(`.sidebar{
        position:fixed;    
        z-index: 10;
        top: 60px;
        right: 5px;
        /* bottom: 0; */
        overflow-x: auto;
        overflow-y: auto;
        padding: 20px 20px 20px 20px;
        width:200px;
        max-height:calc(100vh - 120px - 100px);
        background-color:white;
        box-shadow: 4px 4px 4px 4px #ddd;
        font-size:16px;
    }`)
    addStyle(`@media only screen and (max-width : 1300px){
        .content-with-sidebar {
            margin-left:310px !important;
        }
    }`)
    addStyle(`.sidebar .active{
        color:${highlightColor};
        font-weight:700;
    }`)
    addStyle(`.sidebar a:hover{
        color:${highlightColor};
    }`)
}
/**
>函数节流
>参考https://juejin.im/entry/58c0379e44d9040068dc952f
@param {Fuction} fn - 要执行的函数
*/
function throttle(fn, interval = 300) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}