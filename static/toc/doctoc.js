(function () {
    'use strict';
    var toc_cnt = $(".markdown-toc-list").children().length;
    // console.log(toc_cnt)
    if(toc_cnt > 0){
        // console.log('显示文档目录')
        $(".tocMenu").show();
        initSidebar('.sidebar', '.doc-content');
    }
})();

/**
* 左侧目录生成插件
* 代码参考了 https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js
* @param {string} sidebarQuery - 目录 Element 的 query 字符串 
* @param {string} contentQuery - 正文 Element 的 query 字符串
*/
function initSidebar(sidebarQuery, contentQuery) {
    addAllStyle();
    var sidebar = document.querySelector(sidebarQuery)    
    
    // 遍历文章中的所有 h1或 h2(取决于最大的 h 是多大) , 编辑为li.h3插入 ul
    var allHeaders = []
    var content = document.querySelector(contentQuery)
    for(var i = 1;i < 7; i++){
       //console.log(i,content.querySelectorAll('h' + i))
       allHeaders.push.apply(allHeaders,content.querySelectorAll('h' + i))
    }
    // console.log('目录列表：',allHeaders)
    
    //增加 click 点击处理,使用 scrollIntoView,增加控制滚动的 flag
    var scrollFlag = 0
    var scrollFlagTimer
    sidebar.addEventListener('click', function (e) {
        e.preventDefault()
        console.log(e.target.dataset.id)
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
            console.log('vditor目录')
            var target = document.getElementById(e.target.dataset.id)
            target.scrollIntoView({ behavior: 'smooth', block: "start" })
        }
    });
    
    //监听窗口的滚动和缩放事件
    //window.addEventListener('scroll', updateSidebar)
    //window.addEventListener('resize', throttle(updateSidebar))
    function updateSidebar() {
        if (scrollFlag) return // 如果存在scrollFlag，直接返回
        var doc = document.documentElement // 定义doc变量值为页面文档元素
        var top = doc && doc.scrollTop || document.body.scrollTop // 获取当前页面滚动条纵坐标
        if (!allHeaders.length) return // 如果allHeaders的列表长度为空，直接返回
        var last // 定义一个变量last
        // 按照allHeaders的列表长度进行遍历
        for (var i = 0; i < allHeaders.length; i++) { 
            var link = allHeaders[i] // 按索引取出一个目录link
            console.log("滚动条高度",top,document.body.clientHeight)
            // link.offsetTop 表示元素距离上方的距离
            // top 表示当前页面滚动条的纵坐标
            // document.body.clientHeight 表示页面可视区域高度
            // if (link.offsetTop > (top + document.body.clientHeight / 2 - 73)) {
            if (link.offsetTop > (top + document.body.clientHeight / 6)) {
                if (!last) { last = link }
                break
            } else {
                last = link
            }
        }
        if (last) {
            console.log(last.offsetTop)
            setActive(last.id, sidebar)
        }
    }
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
    //console.log(currentActive)
    
    // h2标题
    if (currentActive.classList.contains('h2') != -1) {
        // 添加 active 和 current
        currentActive.classList.add('active', 'current')
    }
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
    }
    
    //左侧目录太长时的效果
    currentActive.scrollIntoView({ behavior: 'smooth' })
}
/**
>增加 sidebar 需要的全部样式
@param {string} highlightColor - 高亮颜色, 默认为'#c7254e'
*/
function addAllStyle(highlightColor) {
    highlightColor = highlightColor || "#c7254e"
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
    addStyle(`.sidebar{position:fixed;    z-index: 10;
        top: 50px;
        right: 5px;
        bottom: 0;
        overflow-x: auto;
        overflow-y: auto;
        padding: 20px 20px 20px 20px;
        max-width: 250px;
        background-color:white;
        border-left:2px solid #dddddd;
    }`)
    addStyle(`.menu-root { list-style:none; text-align:left }`)
    addStyle(`.menu-root .h1-link{
        display:inline-block;
        color:rgb(44, 62, 80);
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:17.55px;
        font-weight:600;
        height:22px;
        line-height:22.5px;
        list-style-type:none;
        margin-block-end:11px;
        margin-block-start:11px;
    }`)
    addStyle(`.menu-root .h2-link:hover {
        border-bottom: 2px solid ${highlightColor};
    }`)
    addStyle(`.menu-root .h2-link.current+.menu-sub{
        display:block;
    }`)
    addStyle(`.menu-root .h2-link{
        color:rgb(127,140,141);
        cursor:pointer;
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:15px;
        height:auto;
        line-height:22.5px;
        list-style-type:none;
        text-align:left;
        text-decoration-color:rgb(127, 140, 141);
        text-decoration-line:none;
        text-decoration-style:solid;
        margin-left:12.5px;
    }`)
    addStyle(`.menu-sub {
        padding-left:25px;
        list-style:none;
        display:none;
    }`)
    addStyle(`.menu-sub .h3-link{
        color:#333333;
        cursor:pointer;
        display:inline;
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:12.75px;
        height:auto;
        line-height:19.125px;
        list-style-type:none;
        text-align:left;
        text-decoration-color:rgb(52, 73, 94);
        text-decoration-line:none;
        text-decoration-style:solid;
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