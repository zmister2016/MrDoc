(function($) {
    'use strict';
    var _rootWin = window;
    var regBackgroundRepeat = new RegExp('background-repeat: no-repeat no-repeat;', 'ig')
    window.mrdocClipper = {
        init: function() {
            var self = this;
            $(document).keydown(function(e) {
                // console.log(e)
                if (e.ctrlKey && e.shiftKey && e.keyCode == 88 /*x*/ ) {
                    var port = chrome.extension.connect({
                        name: 'createpopup'
                    });
                    port.postMessage();
                    self.createPopup(); //创建popup弹出窗口
                }
            });
            self.addWindowEventListener();
        },
        //html转Markdown
        html2md : function(html){
            // 实例化一个turndown
            var turndownService = new TurndownService({
                headingStyle:'atx', // 标题风格
                hr:'---', // 水平分割线
                bulletListMarker:'-', // 列表项
                codeBlockStyle:'fenced', //代码块样式
            })
            var md = turndownService.turndown(html)
            return md
        },
        //图片URL转base64
        img2base : function(url){
            //发送请求到background
            chrome.runtime.sendMessage({
                name: 'image2base64',
                data: url
            });
        },
        // 获取选择的内容
        getSelectedContent: function() {
            var self = this,
                commonAncestorContainer = self.getSelectionContainer(),
                content = '',
                title = '';
            if (commonAncestorContainer === null || $(commonAncestorContainer).text() === '') {
                content = false;
            } else if (commonAncestorContainer.nodeType === 3) {
                content = $(commonAncestorContainer).text();
                title = document.title; //content
            } else if (commonAncestorContainer.nodeType === 1) {
                var selectedHTML = self.getSelectedHTML();
                var tempNode = $('<div>', {
                    html: selectedHTML
                }).insertAfter($(commonAncestorContainer));
                self.getHTMLByNode(tempNode);
                var html = tempNode.html();
                // console.log(md)
                title = document.title; //tempNode.text();
                tempNode.remove();
                content = html;
            }
            
            if (content) {
                var port = chrome.extension.connect({
                    name: 'getselectedcontent'
                });
                port.postMessage({
                    title: title,
                    sourceurl: location.href,
                    content: content
                });
            }
        },
        // 获取选择容器
        getSelectionContainer: function() {
            var container = null;
            if (window.getSelection) {
                var selectionRange = window.getSelection();
                if (selectionRange.rangeCount > 0) {
                    var range = selectionRange.getRangeAt(0);
                    container = range.commonAncestorContainer;
                }
            } else {
                if (document.selection) {
                    var textRange = document.selection.createRange();
                    container = textRange.parentElement();
                }
            }
            return container;
        },

        // 获取选择的HTML
        getSelectedHTML: function() {
            var userSelection;
            if (window.getSelection) {
                //W3C Ranges
                userSelection = window.getSelection();
                //Get the range:
                if (userSelection.getRangeAt) {
                    var range = userSelection.getRangeAt(0);
                } else {
                    var range = document.createRange();
                    range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
                    range.setEnd(userSelection.focusNode, userSelection.focusOffset);
                }
                //And the HTML:
                var clonedSelection = range.cloneContents();
                var div = document.createElement('div');
                div.appendChild(clonedSelection);
                return div.innerHTML;
            } else if (document.selection) {
                //Explorer selection, return the HTML
                userSelection = document.selection.createRange();
                return userSelection.htmlText;
            } else {
                return '';
            }
        },
        // 获取页面内容
        getPageContent: function() {
            var self = this,
                port = chrome.extension.connect({
                    name: 'getpagecontent'
                });
            var h1 = $('h1').eq(0);
            port.postMessage({
                title:  document.title,
                sourceurl: location.href,
                content: self.getHTMLByNode($(document.body))
            });
        },
        //创建剪藏
        createMrClipWrap: function(zIndex, height) {
            if ($(document.body).is('frameset')) {
                return null;
            }
            var self = this;
            if (!self.closePopup) {
                self.closePopup = function() {
                    $(document).unbind('keydown.mrdocclipperpopup');
                    self.removeInspector();
                    self.isCreatedPopup = false;
                    self.popupInstance.fadeOut(function(e) {
                        $(this).remove();
                    });
                }
            }
            var el = $('<div mrclip="true" style="position:fixed;right:8px;top:8px;width:450px;height:' + height + 'px;\
            background-color:rgba(0,0,0,.5);z-index:;border-radius:1px;\
            box-shadow:rgba(51, 51, 51, 0.498039) 0px 0px 8px 0px;overflow:hidden;"></div>').css('z-index', zIndex).hide().appendTo(document.body).fadeIn();
            var iframe = $('<iframe frameborder="0" style="width:100%;height:100%;max-height:450px"></iframe>').appendTo(el),
                iframeWin = iframe[0].contentWindow,
                iframeDoc = iframe[0].contentDocument || iframeWin.document;

            return {
                wrap: el,
                iframe: iframe
            }
        },
        //创建打开加载页面
        createLoadingEl: function(zIndex) {
            var obj = this.createMrClipWrap(zIndex, 150);
            if (obj == null) return null;
            obj.iframe[0].src = chrome.extension.getURL('loading.html');
            return obj.wrap;
        },
        //创建打开popup页面
        createClipEl: function(zIndex) {
            var self = this;
            var obj = this.createMrClipWrap(zIndex, 450);
            if (obj == null) return null;
            obj.iframe[0].src = chrome.extension.getURL('popup.html');
            self.initDivHeight = parseInt(obj.wrap.css('height'));
            var judgeHeight = function(h) {
                if (h < 304) return 304;
                if (h > 644) return 644;
                return h;
            }
            self.changeHeight = function(changeStep) {
                obj.wrap.css('height', judgeHeight(self.initDivHeight + changeStep));
            }

            $(document).bind('keydown.mrdocclipperpopup', function(e) {
                if (e.keyCode == 27) {
                    self.closePopup();
                }
            });
            return obj.wrap;
        },
        //创建popup
        createPopup: function() {
            var self = this;
            if (self.isCreatedPopup) return;
            self.popupZIndex = 20120726;
            self.isCreatedPopup = true;
            var errorMessage = "page isn't be support",
                loadingEl, ClipEl;
            
            function showPage() {
                if (self.isLoadComplated == true) {
                    if (ClipEl) return true;
                    if (loadingEl) loadingEl.remove();
                    self.popupInstance = ClipEl = self.createClipEl(self.popupZIndex);
                    if (ClipEl == null) throw Error(errorMessage);
                    return true;
                } else {
                    if (loadingEl) return false;
                    self.popupInstance = loadingEl = self.createLoadingEl(self.popupZIndex);
                    if (loadingEl == null) throw Error(errorMessage);
                    return false;
                }
            }
            try {
                showPage();
                var handler = setInterval(function() {
                    if (showPage()) {
                        clearInterval(handler);
                    }
                }, 500);
            } catch (e) {
                self.isCreatedPopup = false;
                if (e.message == errorMessage) {
                    self.tipsReadyError();
                }
            }
        },
        //parent.postMessage窗口事件监听
        addWindowEventListener: function() {
            var self = this;
            window.addEventListener('message', function(e) {
                switch (e.data.name) {
                    case 'createinspectorfrommrdocpopup':
                        self.createInspector(e.data.autoExtractContent);
                        break;
                    case 'changeheightfrommrdocpopup':
                        self.changeHeight(e.data.param);
                        break;
                    case 'stopchangeheightfrommrdocpopup':
                        self.initDivHeight = parseInt(self.popupInstance.css('height'));
                        break;
                    case 'closefrommrdocpopup':
                        self.closePopup();
                        break;
                    case 'resetfrommrdocpopup':
                        self.clearMarks();
                        break;
                    case 'savenotefrommrdocpopup':
                        self.saveNote(e.data.notedata);
                        break;
                    case 'showinspectorfrommrdocpopup':
                        self.showInspector();
                        break;
                    case 'hideinspectorfrommrdocpopup':
                        self.hideInspector();
                        break;
                    case 'hidemaskfrommrdocpopup':
                        self.mask && self.mask.hide();
                        break;
                    case 'pageCompleted':
                        self.isLoadComplated = true;
                        break;
                    default:
                        break;
                }
            }, true);
        },
        //创建注入器
        createInspector: function(autoExtractContent) {
            var self = this,
                body = $(document.body);
            self.cover = $('<div mrclip="true" cover></div>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                'z-index': self.popupZIndex - 1
            });
            self.mask = $('<div mrclip="true" mask></div>').css({
                'border-radius': 5,
                border: '3px dashed black',
                position: 'absolute',
                top: -9999,
                left: -9999,
                width: 0,
                height: 0,
                'z-index': self.popupZIndex - 1,
                background: 'transparent'
            });
            // var backgroundImageSrc = chrome.extension.getURL('css/images/sprite.png'),
                //'chrome-extension://__MSG_@@extension_id__/sprites.png'
            //遮罩半透明
            var markInner = $('<div mrclip="true" markInner></div>').css({
                background: '#ccffcc',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0.35,
                width: '100%'
            })
                // //扩大选区按钮
                // markExpandor = $('<div mrclip="true" markExpandor></div>').css({
                //     background: 'url(' + backgroundImageSrc + ') -120px -66px no-repeat',
                //     height: 20,
                //     width: 20,
                //     cursor: 'pointer',
                //     position: 'absolute',
                //     top: 1,
                //     left: 1,
                //     'z-index': self.popupZIndex - 1
                // }).attr('title', chrome.i18n.getMessage('MarkExpandorTip')),
                // //关闭按钮
                // markClose = $('<span mrclip="true" markClose></span').css({
                //     background: 'url(' + backgroundImageSrc + ') -120px -44px no-repeat',
                //     height: 20,
                //     width: 20,
                //     cursor: 'pointer',
                //     position: 'absolute',
                //     top: 1,
                //     left: 23,
                //     'z-index': self.popupZIndex - 1
                // }).attr('title', chrome.i18n.getMessage('CancelTip'));
            //最外层的框
            self.mark = $('<div mrclip="true" mark></div>').css({
                'border-radius': 3,
                border: '3px dashed black',
                position: 'absolute',
                top: -9999,
                left: -9999,
                'z-index': self.popupZIndex - 1,
                background: 'transparent'
            }).append(markInner)
            //有些网页会把div强制为position:relative 导致选择区显示出错
            //手动将position强制为默认值
            //测试 http://www.smashingmagazine.com/2013/02/28/desktop-wallpaper-calendar-march-2013/
            self.markContainer = $('<div mrclip="true" style="position:static" markContainer></div>').appendTo(body).append(self.cover).append(self.mask);
            self.markedElements = {}; //save all marked page element
            self.marks = {}; //save all marks
            self.markCount = 0;
            self.body = body;
            body.bind('mousemove.mrdocclippermark', function(e) {
                self.mouseMoveMarkHandler(e);
            }).bind('click.mrdocclippermark', function(e) {
                self.clickMarkHandler(e);
            }).bind('mouseleave.mrdocclippermark', function(e) {
                self.mask.hide();
            });
            var title = document.title;
            //如果开启了自动提取正文
            if (autoExtractContent) {
                // 提取内容
                var extract = self.extractContent(document);
                if (extract.isSuccess) { //提取成功
                    var extractedContent = extract.content.asNode();
                    if (extractedContent.nodeType == 3) {
                        extractedContent = extractedContent.parentNode;
                    }
                    setTimeout(function() {
                        var title = document.title; //&& document.title.split('-')[0];
                        self.addMark($(extractedContent), self.mark.clone(), title.trim());
                    }, 0);
                } else { // 提取失败，选择整个网页
                    var extractedContent = document.body;
                    setTimeout(function() {
                        var title = document.title;
                        self.addMark($(extractedContent), self.mark.clone(), title.trim());
                    }, 0);
                }
            }else{ //没有开启自动提取正文
                var extractedContent = document.body;
                setTimeout(function() {
                    var title = document.title;
                    self.addMark('', self.mark.clone(), title.trim());
                }, 0);
            }
        },
        //隐藏注入器
        hideInspector: function() {
            var self = this;
            if (!self.markContainer) return;
            self.markContainer.hide();
            self.body.unbind('mousemove.mrdocclippermark').unbind('click.mrdocclippermark');
        },
        //显示注入器
        showInspector: function() {
            var self = this;
            if (!self.markContainer) return;
            self.markContainer.show();
            self.body.bind('mousemove.mrdocclippermark', function(e) {
                self.mouseMoveMarkHandler(e);
            }).bind('click.mrdocclippermark', function(e) {
                self.clickMarkHandler(e);
            })
        },
        //移除注入器
        removeInspector: function() {
            var self = this;
            if (!self.markContainer) return;
            self.markContainer.remove();
            self.markedElements = {};
            self.marks = {};
            self.markCount = 0;
            self.body.unbind('mousemove.mrdocclippermark').unbind('click.mrdocclippermark');
        },
        // 鼠标移动标记的处理
        mouseMoveMarkHandler: function(e) {
            var self = this;
            self.cover.show();
            self.mask.show();
            var target = self.elementFromPoint(e),
                isMark = target.attr('mrclip'),
                isIgnore = false;
            if (target.is('body, html') || isMark) {
                isIgnore = true;
            }
            //mouse in mark or remove-mark
            //hide cover so that remove-mark could be clicked
            if (!isMark && !isIgnore) {
                self.attachBox(target, self.mask);
            } else {
                self.cover.hide();
                self.mask.hide();
            }
        },
        // 点击标记框的处理
        clickMarkHandler: function(e) {
            console.log("点击了标记框")
            var self = this,
                target = self.elementFromPoint(e),
                isIgnore = false;
            if (target.is('iframe, frame')) {
                console.log('无法获取iframe及frame里面的内容');
                return false;
            }
            if (target.is('body, html')) {
                isIgnore = true;
            }
            self.removeMarkInElement(target);
            if (!isIgnore) {
                self.addMark(target, self.mark.clone());
                return false;
            }
            e.stopPropagation();
        },
        //添加标记到内容框
        addMark: function(target, mark, title) {
            var self = this,
                uid = 'mkmark_' + self.markCount;
            self.markContainer.append(mark);
            if(target == ''){ // 首次点击图标时，未选择页面元素，将其设为空字符串，以便自动设置标题
                self.markCount++;
                var html = ' ';
                var md = ' ';
            }else{
                self.attachBox(target, mark);
                self.markCount++;
                var html = self.getHTMLByNode(target);

                var md = self.html2md(html)
            }
            self.sendContentToPopup(uid, md, true, title); // 写入Markdown
            //self.sendContentToPopup(uid, html, true, title); // 写入HTML
            self.markedElements[uid] = target;
            self.marks[uid] = mark;
            mark.data('uid', uid).click(function(e) {
                self.delMark(mark);
                return false;
            });
            $(mark.children()[1]).click(function(e) {
                self.parentMark(mark);
                return false;
            });
        },
        //删除标记
        delMark: function(mark) {
            var self = this,
                uid = mark.data('uid');
            self.sendContentToPopup(uid);
            mark.remove();
            delete self.markedElements[uid];
        },
        //清除标记
        clearMarks: function() {
            var self = this;
            self.markContainer.html('').append(self.cover).append(self.mask);
            self.markedElements = {};
            self.marks = {};
            self.markCount = 0;
        },
        // 父级标记
        parentMark: function(mark) {
            var self = this,
                uid = mark.data('uid'),
                parent = self.markedElements[uid].parent();
            if (parent.is('html')) return;
            self.removeMarkInElement(parent);
            self.addMark(parent, self.mark.clone());
        },
        // 从元素中移除标记
        removeMarkInElement: function(el) {
            var self = this,
                markedPageElementInParent = {};
            for (var uid in self.markedElements) {
                if (el.find(self.markedElements[uid]).length > 0) {
                    markedPageElementInParent[uid] = true;
                }
            }
            for (var uid in self.marks) {
                if (markedPageElementInParent[uid]) {
                    self.delMark(self.marks[uid]);
                }
            }
        },
        //获取鼠标点击位置的元素
        elementFromPoint: function(e) {
            var self = this;
            self.cover.hide();
            self.mask.hide();
            var pos = {
                top: e.pageY - $(window).scrollTop(),
                left: e.pageX
            },
            target = $(document.elementFromPoint(pos.left, pos.top));
            self.cover.show();
            self.mask.show();
            return target;
        },
        //生成一个点击元素大小的附加框
        attachBox: function(target, el) {
            var self = this,
                body = self.body,
                size = {
                    height: target.outerHeight(),
                    width: target.outerWidth()
                },
                pos = {
                    left: target.offset().left,
                    top: target.offset().top
                }
                //box on the page edge
                //ajust the pos and size order to show the whole box
            var bodyOuterWidth = body.outerWidth();
            if (pos.left == 0) {
                if (size.width >= bodyOuterWidth) {
                    size.width = bodyOuterWidth - 6;
                }
            } else if (pos.left + size.width >= bodyOuterWidth) {
                size.width = bodyOuterWidth - pos.left - 6;
            } else {
                pos.left -= 3;
            }
            if (pos.top == 0) {
                size.height -= 3;
            } else {
                pos.top -= 3;
            }
            el.css({
                left: pos.left,
                top: pos.top,
                height: size.height,
                width: size.width
            });
        },
        // 从节点中获取HTML
        getHTMLByNode: function(node) {
            var self = this,
                filterTagsObj = self.filterTagsObj,
                nodeTagName = node[0].tagName.toLowerCase();
            if (filterTagsObj[nodeTagName]) { //如果标签名在过滤列表中，返回空字符串
                return '';
            }
            var allEles = node[0].querySelectorAll('*'),
                allElesLength = allEles.length,
                nodeCSSStyleDeclaration = getComputedStyle(node[0]);
            if (allElesLength == 0) {
                // 没有子节点
                if (!/^(img|a)$/.test(nodeTagName) && node[0].innerHTML == 0 && nodeCSSStyleDeclaration['background-image'] == 'none') {
                    return '';
                }
            }
            var cloneNode = node.clone(),
                allElesCloned = cloneNode[0].querySelectorAll('*'),
                el, cloneEl, color, cssStyleDeclaration, styleObj = {},
                cssValue, saveStyles = self.saveStyles;
            for (var j = allElesLength - 1, tagName; j >= 0; j--) {
                cloneEl = allElesCloned[j];
                tagName = cloneEl.tagName.toLowerCase();
                if (filterTagsObj[tagName] || cloneEl.getAttribute('mrclip')) {
                    $(cloneEl).remove();
                    continue;
                }
                if (tagName == 'br') {
                    continue;
                }
                el = allEles[j];
                cssStyleDeclaration = getComputedStyle(el);
                cloneEl = $(cloneEl);
                color = cssStyleDeclaration.color;
                styleObj = {};
                // 图片转base64，然后上传到MrDoc
                // if (tagName == 'img') {
                //     console.log("存在图片,解析上传……",)
                //     self.img2base(cloneEl[0].src) // 图片转base64
                //     chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
                //         if(request.name == 'img2base64url'){
                //             console.log("获取上传图片URL：",request.data)
                //             cloneEl[0].src = request.data
                //         };
                //     });

                //     continue;
                // }
                for (var cssProperty in saveStyles) {
                    cssValue = cssStyleDeclaration[cssProperty];
                    if (cssValue == saveStyles[cssProperty]) continue;
                    if (cssProperty == 'color') {
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                if (tagName == 'a') {
                    cloneEl.attr('href', el.href);
                } else if (/^(ul|ol|li)$/.test(tagName)) {
                    styleObj['list-style'] = cssStyleDeclaration['list-style'];
                }
                cloneEl.css(styleObj);
                self.removeAttrs(cloneEl);
            }
            if (nodeTagName == 'body') {
                return cloneNode[0].innerHTML.replace(regBackgroundRepeat, 'background-repeat: no-repeat;');
            } else {
                color = nodeCSSStyleDeclaration.color;
                styleObj = {};
                for (var cssProperty in saveStyles) {
                    cssValue = nodeCSSStyleDeclaration[cssProperty];
                    if (cssValue == saveStyles[cssProperty]) continue;
                    if (/^(margin|float)$/.test(cssProperty)) continue;
                    if (cssProperty == 'color') {
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                cloneNode.css(styleObj);
                self.removeAttrs(cloneNode);
                if (/^(img)$/.test(nodeTagName)) {
                    var imgSrc = $(cloneNode[0]).attr('src');
                    if (!/^http(s)?:\/\//.test(imgSrc)) {
                        $(cloneNode[0]).attr('src', window.location.protocol + '//' + window.location.host + '/' + imgSrc);
                    }
                }
                return cloneNode[0].outerHTML.replace(regBackgroundRepeat, 'background-repeat: no-repeat;');
            }
        },
        //过滤的标签对象
        filterTagsObj: {
            style: 1,
            script: 1,
            link: 1,
            iframe: 1,
            frame: 1,
            frameset: 1,
            noscript: 1,
            head: 1,
            html: 1,
            applet: 1,
            base: 1,
            basefont: 1,
            bgsound: 1,
            blink: 1,
            ilayer: 1,
            layer: 1,
            meta: 1,
            object: 1,
            embed: 1,
            input: 1,
            textarea: 1,
            button: 1,
            select: 1,
            canvas: 1,
            map: 1
        },
        //保存的样式
        saveStyles: {
            'background': 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box',
            'border': '0px none rgb(0, 0, 0)',
            'bottom': 'auto',
            'box-shadow': 'none',
            'clear': 'none',
            'color': 'rgb(0, 0, 0)',
            'cursor': 'auto',
            'display': '',
            //consider inline tag or block tag, this value must have
            'float': 'none',
            'font': '',
            //this value must have, since it affect the appearance very much and style inherit is very complex
            'height': 'auto',
            'left': 'auto',
            'letter-spacing': 'normal',
            'line-height': 'normal',
            'margin': '',
            'max-height': 'none',
            'max-width': 'none',
            'min-height': '0px',
            'min-width': '0px',
            'opacity': '1',
            'outline': 'rgb(0, 0, 0) none 0px',
            'overflow': 'visible',
            'padding': '',
            'position': 'static',
            'right': 'auto',
            'table-layout': 'auto',
            'text-align': 'start',
            'text-decoration': '',
            'text-indent': '0px',
            'text-shadow': 'none',
            'text-overflow': 'clip',
            'text-transform': 'none',
            'top': 'auto',
            'vertical-align': 'baseline',
            'visibility': 'visible',
            'white-space': 'normal',
            'width': 'auto',
            'word-break': 'normal',
            'word-spacing': '0px',
            'word-wrap': 'normal',
            'z-index': 'auto',
            'zoom': '1'
        },
        //移除属性
        removeAttrs: function(node) {
            var removeAttrs = ['id', 'class', 'height', 'width'];
            for (var i = 0, l = removeAttrs.length; i < l; i++) {
                node.removeAttr(removeAttrs[i]);
            }
            return node;
        },
        //从节点中提取内容
        extractContent: function(doc) {
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(doc);
            return res;
        },
        //发送内容到Popup中
        sendContentToPopup: function(uid, content, add, title) {
            //不能直接发送数据到popup页面，所以先连接到background页面
            if (add && !content) return; //添加空节点, return;
            var port = chrome.extension.connect({
                name: 'actionfrompopupinspecotr'
            });
            port.postMessage({
                uid: uid,
                content: content,
                add: add,
                title: title
            });
        }, 

        //保存文档
        saveNote: function(notedata) {
            var self = this,
                //发送消息到background.js
                port = chrome.extension.connect({
                    name: 'savenotefrompopup'
                });
            // 关闭 popup
            self.closePopup();
            notedata.sourceurl = location.href;
            port.postMessage(notedata);
        },

        //提示读取错误
        tipsReadyError: function() {
            var port = chrome.extension.connect({
                name: 'mrdocclipperisnotready'
            });
            var data = {
                'key': 'notClipPageInfo'
            }
            port.postMessage(data);
        }
    }
    mrdocClipper.init();
    $(function() {
        mrdocClipper.isLoadComplated = true;
    });
})(jQuery);