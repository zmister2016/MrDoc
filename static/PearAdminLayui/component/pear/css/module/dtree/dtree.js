/**
 *@Name dtree 树形组件
 *@Author 智慧的小西瓜
 *@DOCS http://www.wisdomelon.com/DTreeHelper/
 *@License https://www.layui.com/
 *@LASTTIME 2019/10/24
 *@VERSION v2.5.6
 */
layui.define(['jquery','layer','form'], function(exports) {
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form;

    // 树的公共定义样式汇总
    var LI_NAV_CHILD = "dtree-nav-ul-sid", LI_NAV_ITEM = "dtree-nav-item",
        LI_DIV_ITEM = "dtree-nav-div",  DTREEFONTSPECIAL="dtreefont-special", NONETITLE="dtree-none-text",
        LI_DIV_MENUBAR = "dtree-menubar",
        LI_DIV_TOOLBAR = "dtree-toolbar", TOOLBAR_TOOL = "dtree-toolbar-tool",  TOOLBAR_TOOL_EM = "dtree-toolbar-fixed",
        LI_DIV_CHECKBAR = "dtree-nav-checkbox-div",
        LI_CLICK_CHECKBAR = "d-click-checkbar",		//绑定点击复选框时需要用到
        LI_DIV_TEXT_CLASS = "t-click", UL_ROOT="dtree",
        LI_NAV_FIRST_LINE = "dtree-nav-first-line", LI_NAV_LINE = "dtree-nav-line", LI_NAV_LAST_LINE = "dtree-nav-last-line";


    // 树的公共指定
    var NAV_THIS = "dtree-nav-this",	//当前节点
        NAV_SHOW = "dtree-nav-show",	//显示子节点
        NAV_HIDE = "dtree-nav-hide",	//隐藏节点
        NAV_DIS = "dtree-disabled",		//禁用节点
        ICON_HIDE = "dtree-icon-hide",  //隐藏图标
        $BODY = $("body"),				//body选择器
        $WIN = $(window),				//window窗口
        $DOC = $(document),				//当前文档
        MOD_NAME = "dtree",				//模块名称
        VERSION = "v2.5.6",				//版本
        OPTIONS = {},					//全局属性配置
        DTrees = {};				    //当前被实例化的树的集合

    // 树的自定义图标
    var DTREEFONT = "dtreefont",									//默认使用图标字体
        LI_DIV_CHECKBAR_ON = "dtree-icon-fuxuankuangxuanzhong", 	//复选框选中图标
        LI_DIV_CHECKBAR_OUT = "dtree-icon-fuxuankuang", 			//复选框未选中图标
        LI_DIV_CHECKBAR_NOALL = "dtree-icon-fuxuankuang-banxuan",	//复选框半选图标
        LI_DIV_MENUBAR_DOWN = "dtree-icon-move-down", 				//menubar的展开全部的图标
        LI_DIV_MENUBAR_UP = "dtree-icon-move-up", 					//menubar的收缩全部的图标
        LI_DIV_MENUBAR_REFRESH = "dtree-icon-refresh",				//menubar的刷新图标
        LI_DIV_MENUBAR_CHECKALL = "dtree-icon-roundcheckfill", 		//menubar的全选图标
        LI_DIV_MENUBAR_UNCHECKALL = "dtree-icon-roundclosefill", 	//menubar的全不选图标
        LI_DIV_MENUBAR_INVERTALL = "dtree-icon-roundcheck", 		//menubar的反选图标
        LI_DIV_MENUBAR_DELETE = "dtree-icon-delete1", 				//menubar的删除图标
        LI_DIV_MENUBAR_SEARCH = "dtree-icon-search_list_light",		//menubar的搜索图标
        LI_DIV_TOOLBAR_PULLDOWN = "dtree-icon-pulldown", 			//toolbar的展开图标
        LI_DIV_TOOLBAR_PULLUP = "dtree-icon-pullup", 				//toolbar的收缩图标
        LI_DIV_TOOLBAR_ADD = "dtree-icon-roundadd", 				//toolbar的新增图标
        LI_DIV_TOOLBAR_EDIT = "dtree-icon-bianji", 					//toolbar的编辑图标
        LI_DIV_TOOLBAR_DEL = "dtree-icon-roundclose";				//toolbar的删除图标

    // 树的非叶子节点图标集合
    var nodeIconArray = {
        "-1": {"open": "dtree-icon-null-open", "close": "dtree-icon-null-close"},			//未指定
        "0" : {"open": "dtree-icon-wenjianjiazhankai", "close": "dtree-icon-weibiaoti5"},	//文件夹(二级图标默认样式)
        "1" : {"open": "dtree-icon-jian", "close": "dtree-icon-jia"},						//+-图标(一级图标默认样式)
        "2" : {"open": "dtree-icon-xiangxia1", "close": "dtree-icon-xiangyou"}				//箭头图标
    };

    // 树的叶子节点图标集合
    var leafIconArray = {
        "-1": "dtree-icon-null",				//未指定
        "0" : "dtree-icon-weibiaoti5", 			//文件夹
        "1" : "dtree-icon-yonghu",				//人员
        "2" : "dtree-icon-fenzhijigou",			//机构
        "3" : "dtree-icon-fenguangbaobiao",		//报表
        "4" : "dtree-icon-xinxipilu",			//信息
        "5" : "dtree-icon-shuye1",				//叶子(二级图标默认样式)
        "6" : "dtree-icon-caidan_xunzhang",	    //勋章
        "7" : "dtree-icon-normal-file",		    //文件
        "8" : "dtree-icon-dian",				//小圆点（一级图标默认样式）
        "9" : "dtree-icon-set-sm",				//齿轮
        "10" : "dtree-icon-rate"				//星星
    };

    // 树的自定义样式
    var DTREE = "dtree-",			//自定义样式前缀
        ITEMTHIS = "-item-this",	//自定义样式当前行选中后缀
        ITEM = "-item",				//自定义样式当前行后缀
        DFONT = "-dtreefont",		//自定义样式图标样式后缀
        FICON = "-ficon",			//自定义样式一级图标样式后缀
        ICON = "-icon",				//自定义样式二级图标样式后缀
        CBOX = "-checkbox",			//自定义样式复选框样式后缀
        CHS = "-choose";			//自定义样式复选框选中样式后缀

    // 树自定义操作事件名称集合	绑定dtree-click的事件
    var eventName = {
        checkNodeClick: "checkNodeClick",				//点击复选框
        itemNodeClick: "itemNodeClick"					//点击子节点div
    };

    // 树默认toolbar提供的功能集合	绑定dtree-tool的事件
    var defaultTool = {
        pulldown: "pulldown",							//点击展开当前节点下的全部节点
        pullup: "pullup",								//点击收缩当前节点下的全部节点
        addTool: "addToolbar",						//点击toolbar新增
        editTool: "editToolbar",						//点击toolbar编辑
        delTool: "delToolbar"						//点击toolbar删除
    };

    // 树默认menubar提供的功能集合	绑定dtree-menu的事件
    var defaultMenu = {
        moveDown: "moveDown",							//menubar展开全部节点
        moveUp: "moveUp",								//menubar收缩全部节点
        refresh: "refresh",								//menubar刷新树
        checkAll: "checkAll",							//menubar全选
        unCheckAll: "unCheckAll",						//menubar全不选
        invertAll: "invertAll",							//menubar反选
        remove: "remove",								//menubar删除选中节点
        searchNode: "searchNode"						//menubar查询节点
    };

    // 树的公共事件
    var event = {
        getElemId: function(options){	// 根据传入的参数获取ID
            var elem = options.elem || "";
            var obj = options.obj || $(elem);

            if (obj.length == 0) {	//页面中未找到绑定id
                return "";
            } else {
                return $(obj)[0].id;
            }
        },
        escape: function(html){
            if(typeof html !== 'string') return '';
            return html.replace(entityReg.escape, function(match){return entityMap.escape[match];});
        },
        unescape: function(str){
            if(typeof str !== 'string') return '';
            return str.replace(entityReg.unescape, function(match){return entityMap.unescape[match];});
        },
        cloneObj: function (obj, filter) {  //深复制对象方法
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            var str = "";
            if(typeof filter !== 'undefined') {str = filter.join(",");}
            for (var key in obj) {
                if(str.indexOf(key) == -1){
                    var val = obj[key];
                    newObj[key] = typeof val === 'object' ? event.cloneObj(val, typeof filter !== undefined ? filter : []): val;
                }

            }
            return newObj;
        },
        trimToDot: function(str){
            return str.replace(/ /g, ".");
        }
    };

    // 特殊符号转义
    var keys = Object.keys || function(obj) {
        obj = Object(obj);
        var arr = [];
        for(var a in obj) arr.push(a);
        return arr;
    };
    var invert = function(obj){
        obj = Object(obj);
        var result = {};
        for(var a in obj) result[obj[a]] = a;
        return result;
    };
    var entityMap = {
        escape: {
            "&" : "&amp;",
            "<" : "&lt;",
            ">" : "&gt;",
            "'" : "&quo;"
        }
    };
    entityMap.unescape = invert(entityMap.escape);
    var entityReg = {
        escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
    };

    //异步加载接口
    var AjaxHelper = {
        request : function(config) {
            var data = config.data ? config.data : {};
            var async = (typeof (config.async) === "boolean") ? config.async : true;
            $.ajax({
                type : config.type ? config.type : "POST",
                headers : config.headers,
                url : config.url,
                dataType : config.dataType ? config.dataType : "json",
                data : data,
                async : async,
                contentType : config.contentType,
                xhrFields: {withCredentials: config.withCredentials},
                success : config.success,
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof (config.error) === "function") {
                        config.error(XMLHttpRequest, textStatus, errorThrown);
                    } else {
                        layer.msg("异步加载失败： " + textStatus,{icon:5, shift:6});
                    }
                },
                statusCode : {
                    404 : function() {
                        layer.msg('未找到指定请求，请检查访问路径！',{icon:5, shift:6});
                    },
                    500 : function() {
                        layer.msg('系统错误！',{icon:5, shift:6});
                    }
                },
                complete : function(XMLHttpRequest, textStatus) {
                    if (typeof (config.complete) === "function") {
                        config.complete(XMLHttpRequest, textStatus);
                    }
                }
            });
        },
        serialize: function(param){	//json序列化   key=value&key1=value1
            var p = "?";
            for (var key in param) {
                p += key + "=" + param[key] + "&";
            }
            p = p.substring(0, p.length-1);
            return p;
        }
    };

    // 树类
    var DTree = function(options){
        var _this = this;
        /** 默认赋值**/
        this.formatter = {	// 数据过滤
            title: false    // 文字，默认不开启
        };
        this.response = {  // 树返回的json格式
            statusName: "code",		//返回标识
            statusCode: 200,		//返回码
            message: "message",		//返回信息
            rootName: "data",		//根节点名称
            treeId: "id",			//节点ID
            parentId: "parentId",	//父节点ID
            title: "title",			//节点名称
            ficonClass: "ficonClass", //自定义一级图标
            iconClass: "iconClass",	  //自定义二级图标
            childName: "children",	//子节点名称
            last: "last",		//是否最后一级节点
//			level: "level",			//层级
            spread: "spread",		//展开
            disabled: "disabled",	//禁用
            hide: "hide",		//隐藏
            checkArr: "checkArr",	//复选框列表
            checked: "checked", //是否选中
            type: "type",			//复选框标记
            basicData: "basicData"	//表示用户自定义需要存储在树节点中的数据
        };
        this.defaultRequest = {  // 树的默认发起请求参数格式，最后会将value作为参数名称传递
            nodeId: "nodeId",		//节点ID
            parentId: "parentId",	//父节点ID
            context: "context",	//节点内容
            leaf: "leaf",		//是否叶子节点
            level: "level",		//层级
            spread: "spread",		//节点展开状态
            dataType: "dataType",	//节点标记
            checked: "checked",	//节点复选框选中状态
            initchecked: "initchecked",	//节点复选框初始状态
            basicData: "basicData",		//用户自定义的记录节点数据
            recordData: "recordData",		//当前data数据（排除basicData和children字段）
        };
        this.toolbarFun = {
            addTreeNode: function(param, $div) {	//添加树节点后调用的函数，用于用户自定义，如未指定则树不会发生变化
                return ;
            },
            editTreeNode: function(param, $div) {	//编辑树节点后调用的函数，用于用户自定义，如未指定则树不会发生变化
                return ;
            },
            editTreeLoad: function(param){	// 编辑树的数据回显，用于打开编辑时，回填数据
                return ;
            },
            delTreeNode: function(param, $div){	//删除树后调用的函数，用于用户自定义，如未指定则树不会发生变化
                return ;
            },
            loadToolbarBefore: function(buttons, param, $div){  // 右键菜单加载前的函数
                return buttons;
            }
        };
        this.toolbarStyle = {
            title: "节点",
            area: ["60%","80%"]
        };
        this.menubarFun = {
            remove: function(checkbarNodes){			//删除复选框选中节点，需要用户自定义，如未指定则树只是页面上做了修改
                return true;
            }
        };
        this.menubarTips = {
            toolbar: [],
            group: [defaultMenu.moveDown, defaultMenu.moveUp, defaultMenu.refresh, defaultMenu.checkAll, defaultMenu.unCheckAll, defaultMenu.invertAll, defaultMenu.remove, defaultMenu.searchNode],
            freedom: []
        };
        this.checkbarFun = {
            chooseBefore: function($i, node){	// 复选框点击前回调
                return true;
            },
            chooseDone: function(checkbarNodesParam) {	//复选框点击事件完毕后，返回该树关于复选框操作的全部信息，用于用户自定义，如未指定则树只是页面上做了修改
                return ;
            }
        };
        this.iframeDefaultRequest = {  //iframe的默认参数,目的是与加载树的参数不一样
            nodeId: "nodeId",		//节点ID
            parentId: "parentId",	//父节点ID
            context: "context",	//节点内容
            leaf: "leaf",		//是否叶子节点
            level: "level",		//层级
            spread: "spread",		//节点展开状态
            dataType: "dataType",	//节点标记
            checked: "checked",	//节点复选框选中状态
            initchecked: "initchecked",	//节点复选框初始状态
            basicData: "basicData",		//用户自定义的记录节点数据
            recordData: "recordData",		//当前data数据（排除basicData和children字段）
        };

        this.iframeFun = {
            iframeDone: function(iframeParam){	//iframe加载完毕后，用于用户自定义事件
                return ;
            }
        };
        this.style = {			//树最终使用的样式集合
            item: "",			//每一项div的样式
            itemThis: "",		//选中div的样式
            dfont: "",			//一级图标的样式
            icon: "",			//二级图标的样式
            cbox: "",			//复选框的样式
            chs: ""				//复选框选中的样式
        };
        this.usefontStyle = {		//树最终使用的图标集合
            fnode:{					//一级节点
                node:{				//非叶子节点
                    open:"",		//节点展开
                    close:""		//节点关闭
                },
                leaf:""				//叶子节点
            },
            snode:{					//二级节点
                node:{				//非叶子节点
                    open:"",		//节点展开
                    close:""		//节点关闭
                },
                leaf:""				//叶子节点
            },
            checkbox:{				//复选框
                on:"",				//复选框选中
                out:"",				//未选中
                noall:""			//半选
            },
            menubar:{				//菜单栏
                movedown:"",		//全部展开
                moveup:"",			//全部收缩
                refresh:"",			//刷新
                checkAll:"",		//全选
                unCheckAll:"",		//全不选
                invertAll:"",		//反选
                remove:"",			//删除
                search:""			//搜索
            },
            menubarExt:"",			//扩展菜单栏
            toolbar:{				//工具栏
                menubar:{			//依附在菜单栏的工具栏
                    movedown:"",	//全部展开
                    moveup:"",		//全部收缩
                    refresh:"",		//刷新
                    checkAll:"",	//全选
                    unCheckAll:"",	//全不选
                    invertAll:"",	//反选
                    remove:"",		//删除
                    search:""		//搜索
                },
                menubarExt:"",		//依附在菜单栏的扩展菜单栏
                pulldown:"",		//展开
                pullup:"",			//收缩
                add:"",				//添加
                edit:"",			//编辑
                del:""				//删除
            },
            toolbarExt:""			//扩展工具栏
        }

        /** 数据绑定**/
        this.node = {		// 树节点选中时，包含当前节点的全部信息
            nodeId: "",		//节点ID
            parentId: "",	//父节点ID
            context: "",	//节点内容
            leaf: "",		//是否叶子节点
            level: "",		//层级
            spread: "",		//节点展开状态
            dataType: "",	//节点标记
            checked: "",	//节点复选框选中状态
            initchecked: "",	//节点复选框初始状态
            basicData: "",		//用户自定义的记录节点数据
            recordData: "",		//当前data数据（排除basicData和children字段）
        };
        
        this.toolbarMenu = {};	// 工具栏右键菜单绑定的所有元素
        this.checkbarNode = [];	// 复选框标记的全部节点数据
        this.errData = [];		// 记录在渲染节点时有问题的数据
        this.checkArrLen = 0;	//添加节点的时判断复选框个数
        this.temp = [];	// 临时变量
        this.bak = "";	// 临时变量
        this.setting(options);
    };

    /******************** 初始参数加载 ********************/
    // 设置基本参数值
    DTree.prototype.setting = function(options) {
        this.options = options || {};

        /** 绑定元素参数（必填，2个参数项必填一个）**/
        this.elem = this.options.elem || OPTIONS.elem ||  ""; //树绑定的元素ID：#elem
        if(typeof this.options.obj === 'undefined'){
            if(this.elem) {
                if($(this.elem).length > 0) {
                    this.obj = $(this.elem);
                }
            }
        } else {
            this.obj = this.options.obj || OPTIONS.obj || this.obj; //树绑定的jquery元素，用于当元素是延迟加载出来的话，可以用这个找到
            this.elem = "#" + this.obj[0].id;
        }

        /** 基本参数**/
        this.scroll = this.options.scroll || OPTIONS.scroll || this.elem; //树的上级div容器，让树可以显示滚动条的div容器的ID
        this.accordion = (typeof (this.options.accordion) === "boolean") ? this.options.accordion : (typeof (OPTIONS.accordion) === "boolean") ? OPTIONS.accordion : false; //手风琴加载， 默认false
        if(this.accordion) {
            this.initLevel = 1; //默认展开节点  1节
        } else {
            this.initLevel = this.options.initLevel || OPTIONS.initLevel || 2; //默认展开节点  2节
        }
        this.type = this.options.type || OPTIONS.type || "load"; //树的加载方式  all，全量树，  load，增量树，默认load
        this.cache = (typeof (this.options.cache) === "boolean") ? this.options.cache : (typeof (OPTIONS.cache) === "boolean") ? OPTIONS.cache : true; //数据缓存，默认true
        this.record =  this.options.record || OPTIONS.record || false; //开启数据记录模式，默认false
        this.load = (typeof (this.options.load) === "boolean") ? this.options.load : (typeof (OPTIONS.load) === "boolean") ? OPTIONS.load : true; //开启加载动画，默认true
        this.none = this.options.none || OPTIONS.nont || "无数据";	 //初始加载无记录时显示文字
        this.tempHeight = this.options.height || OPTIONS.height; //临时转换高度变量
        if(this.tempHeight) { // 设置高度
            if(/^full-\d+$/.test(this.tempHeight)) {
                this.fullHeightGap = this.tempHeight.split('-')[1];
                this.height = $WIN.height() - this.fullHeightGap; //设置高度
            } else {
                this.fullHeightGap = this.tempHeight;
                this.height = this.tempHeight;
            }
        } else {
            this.fullHeightGap = "";
            this.height = "";
        }
        this.width = this.options.width || OPTIONS.width  || "260"; //宽度
        this.obj.css("width", this.width);

        /** 样式相关参数**/
        this.iconfont = this.options.iconfont || OPTIONS.iconfont || DTREEFONT; //默认图标字体 dtreefont
        this.iconfontStyle = this.options.iconfontStyle  || OPTIONS.iconfontStyle || {}; //用于自定义树的每个关键部位使用的图标
        this.nodeIconArray = $.extend(nodeIconArray, this.options.nodeIconArray || OPTIONS.nodeIconArray) || nodeIconArray; //用户自定义非叶子节点图标集合，node
        this.leafIconArray = $.extend(leafIconArray, this.options.leafIconArray || OPTIONS.leafIconArray) || leafIconArray; //用户自定义叶子节点图标集合，leaf
        this.skin = this.options.skin || OPTIONS.skin || "theme"; // 自定义样式
        if(this.skin == "layui"){ // layui主题
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : (typeof (OPTIONS.line) === "boolean") ? OPTIONS.line : true; //开启树线，默认开启
            this.ficon = this.options.ficon || OPTIONS.ficon || "7"; //一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'7'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示一级图标，默认'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; //一级图标中的leaf节点图标
            this.icon = this.options.icon || OPTIONS.icon || "-1"; //二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        } else if(this.skin == "laySimple"){ // laySimple主题
            this.line = this.options.line || OPTIONS.line || false; //开启树线，默认不开启
            this.ficon = this.options.ficon || OPTIONS.ficon || ["2","-1"];	//一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'-1'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "2") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示一级图标，默认'2'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];	// 一级图标中的leaf节点图标
            this.icon = this.options.icon || OPTIONS.icon || "-1"; //二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        } else { // 默认主题  或者自定义主题
            this.line = this.options.line || OPTIONS.line || false; //开启树线，默认不开启
            this.ficon = this.options.ficon || OPTIONS.ficon || "8"; //一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'8'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示一级图标，默认'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];	// 一级图标中的leaf节点图标
            this.icon = this.options.icon || OPTIONS.icon || "5"; //二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'5'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "0") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'0'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        }

        /** 数据加载参数**/
        this.url = this.options.url || OPTIONS.url || ""; //请求地址
        this.async = (typeof (this.options.async) === "boolean") ? this.options.async : (typeof (OPTIONS.async) === "boolean") ? OPTIONS.async : true; //异步同步加载,默认异步加载
        this.headers = this.options.headers || OPTIONS.headers || {}; //ajax header属性
        this.method = this.options.method || OPTIONS.method || "post"; //请求类型
        this.dataType = this.options.dataType || OPTIONS.dataType || "json"; //参数类型
        this.contentType = this.options.contentType || OPTIONS.contentType || "application/x-www-form-urlencoded"; //发送信息至服务器时内容编码类型
        this.defaultRequest = $.extend(this.defaultRequest, this.options.defaultRequest || OPTIONS.defaultRequest) || this.defaultRequest; //默认请求参数
        this.filterRequest = this.options.filterRequest || OPTIONS.filterRequest || [];	//过滤请求参数
        this.request = this.options.request || OPTIONS.request || {}; //用户自定义请求参数
        this.response = $.extend(this.response, this.options.response || OPTIONS.response) || this.response; //返回json格式
        this.data = this.options.data || OPTIONS.data || null; //初始化指定该参数，则不会访问异步接口
        this.dataFormat = this.options.dataFormat || OPTIONS.dataFormat || "levelRelationship"; //用于用户配置的data数据格式，list：列表，  levelRelationship：层级关系，默认
        this.dataStyle = this.options.dataStyle || OPTIONS.dataStyle || "defaultStyle"; //用于用户配置layui通用的json数据风格,layuiStyle:layui风格，defaultStyle：默认风格
        this.errDataShow = this.options.errDataShow || OPTIONS.errDataShow || false; //是否在递归数据出现错误后，显示错误信息，默认false
        this.withCredentials = this.options.withCredentials || OPTIONS.withCredentials || false; //是否允许跨域请求，默认false
        this.success = this.options.success || OPTIONS.success || function(data, obj){}; //树加载完毕后执行解析树之前的回调
        this.done = this.options.done || OPTIONS.done || function(data, obj){};	 //树加载完毕后的回调
        this.formatter = $.extend(this.formatter, this.options.formatter || OPTIONS.formatter) || this.formatter; //数据过滤
        this.error = this.options.error || OPTIONS.error || function(XMLHttpRequest, textStatus, errorThrown){}; // 异步加载异常回调
        this.complete = this.options.complete || OPTIONS.complete || function(XMLHttpRequest, textStatus){};	// 异步加载完成回调

        /** 复选框参数**/
        this.checkbar = this.options.checkbar || OPTIONS.checkbar || false; //是否开启复选框模式
        this.checkbarLoad = this.options.checkbarLoad || OPTIONS.checkbarLoad || "node"; //复选框作用范围，node：所有节点， leaf：最后一级；默认所有节点
        this.checkbarType = this.options.checkbarType || OPTIONS.checkbarType || "all";	//复选框选中形式	all：子集选中父级也选中，  no-all：子集选中父级半选中，子集全选父级选中，p-casc：父级选中子集全选，子集无法改变父级选中状态， self：没有任何级联关系，only：只能选中一个复选框。   默认all
        this.checkbarData = this.options.checkbarData || OPTIONS.checkbarData || "choose"; //复选框记录数据类型形式，  change表示记录变更数据，choose表示记录选中数据，all记录全部数据，halfChoose记录选中和半选中的数据，默认choose
        this.checkbarFun =  $.extend(this.checkbarFun, this.options.checkbarFun || OPTIONS.checkbarFun) || this.checkbarFun; //checkbar事件加载

        /** 菜单栏参数**/
        this.menubar = this.options.menubar || OPTIONS.menubar || false; //是否打开菜单栏
        this.menubarTips = $.extend(this.menubarTips, this.options.menubarTips || OPTIONS.menubarTips) || this.menubarTips; //菜单栏吸附， toolbar：依附在工具栏，group：依附在按钮组，freedom，自由
        this.menubarFun = $.extend(this.menubarFun, this.options.menubarFun || OPTIONS.menubarFun) || this.menubarFun; //menubar事件加载

        /** 工具栏参数**/
        this.toolbar = this.options.toolbar || OPTIONS.toolbar || false; //是否开启可编辑模式
        this.toolbarWay = this.options.toolbarWay || OPTIONS.toolbarWay || "contextmenu"; //工具栏显示方式，contextmenu:右键，follow:跟随节点，fixed:固定在节点右侧
        this.toolbarStyle = $.extend(this.toolbarStyle, this.options.toolbarStyle || OPTIONS.toolbarStyle) || this.toolbarStyle; //toolbar的自定义风格，标题，弹框大小
        this.toolbarLoad = this.options.toolbarLoad || OPTIONS.toolbarLoad || "node"; //toolbar作用范围：node:所有节点，noleaf:非最后一级节点，leaf:最后一级
        this.toolbarShow = this.options.toolbarShow || OPTIONS.toolbarShow || ["add","edit","delete"]; //toolbar三个按钮自定义加载
        this.toolbarBtn = this.options.toolbarBtn || OPTIONS.toolbarBtn || null; //toolbar增删改中内容的自定义加载
        this.toolbarExt = this.options.toolbarExt || OPTIONS.toolbarExt || []; //toolbar按钮扩展
        this.toolbarFun = $.extend(this.toolbarFun, this.options.toolbarFun || OPTIONS.toolbarFun) || this.toolbarFun; //toolbar事件加载

        /** iframe模式参数**/
        this.useIframe = this.options.useIframe || OPTIONS.useIframe || false; //是否加载iframe 默认false，
        this.iframeElem = this.options.iframeElem || OPTIONS.iframeElem || ""; //iframe的ID
        this.iframeUrl = this.options.iframeUrl || OPTIONS.iframeUrl || ""; //树关联的iframe地址
        this.iframeLoad = this.options.iframeLoad || OPTIONS.iframeLoad || "leaf"; //点击哪一层加载frame： node：所有节点， leaf：默认，最后一级
        this.iframeDefaultRequest = $.extend(this.iframeDefaultRequest, this.options.iframeDefaultRequest || OPTIONS.iframeDefaultRequest) || this.iframeDefaultRequest; //iframe的默认传递参数
        this.iframeRequest = $.extend(this.iframeRequest, this.options.iframeRequest) || $.extend(this.iframeRequest, OPTIONS.iframeRequest) || this.iframeRequest; //iframe的自定义参数
        this.iframeFun = $.extend(this.iframeFun, this.options.iframeFun) || $.extend(this.iframeFun, OPTIONS.iframeFun) || this.iframeFun;	//iframe事件加载

        /** 下拉树模式参数**/
        this.select = this.options.select || false; 
        if(this.select) {
        	// 重置下拉树
        	this.selectSetting();
        }
        
        /** 调用确认最终主题方法*/
        this.ensureTheme();
    };

    // 设置基本参数值
    DTree.prototype.reloadSetting = function(options) {
        this.options = $.extend(this.options, options) || this.options;

        /** 绑定元素参数**/
        this.elem = this.options.elem || this.elem;	  //树绑定的元素ID：#elem
        if(typeof this.options.obj === 'undefined'){
            if(this.elem) {
                if($(this.elem).length > 0) {
                    this.obj = $(this.elem);
                }
            }
        } else {
            this.obj = this.options.obj || this.obj; //树绑定的jquery元素，用于当元素是延迟加载出来的话，可以用这个找到
            this.elem = "#" + this.obj[0].id;
        }

        /** 基本参数**/
        this.scroll = this.options.scroll || this.scroll; //树的上级div容器，让树可以显示滚动条的div容器
        this.accordion = (typeof (this.options.accordion) === "boolean") ? this.options.accordion : this.accordion; //开启手风琴加载
        if(this.accordion) {
            this.initLevel = 1; //默认展开节点  1节
        } else {
            this.initLevel = this.options.initLevel || this.initLevel; //默认展开节点  2节
        }
        this.type = this.options.type || this.type; //树的加载方式  all，全量树，  load，增量树，默认load
        this.cache = (typeof (this.options.cache) === "boolean") ? this.options.cache : this.cache; //开启数据缓存
        this.record = (typeof (this.options.record) === "boolean") ? this.options.record : this.record; //开启数据记录模式
        this.load = (typeof (this.options.load) === "boolean") ? this.options.load : this.load; //开启加载动画
        this.none = this.options.none || this.none;  //初始节点加载无数据时显示文字
        this.tempHeight = this.options.height || this.height; //临时转换高度变量
        if(this.tempHeight) {  //设置高度
            if(/^full-\d+$/.test(this.tempHeight)) {
                this.fullHeightGap = this.tempHeight.split('-')[1];
                this.height = $WIN.height() - this.fullHeightGap;
            } else {
                this.fullHeightGap = this.tempHeight;
                this.height = this.tempHeight;
            }
        }
        this.width = this.options.width || this.width; //宽度
        this.obj.css("width", this.width);

        /** 样式相关参数**/
        this.line = (typeof (this.options.line) === "boolean") ? this.options.line : this.line; //开启树线，默认不开启
        this.iconfont = this.options.iconfont || this.iconfont; //默认图标字体 dtreefont
        this.iconfontStyle = this.options.iconfontStyle || this.iconfontStyle; //用于自定义树的每个关键部位使用的图标
        this.nodeIconArray = $.extend(nodeIconArray, this.options.nodeIconArray) || this.nodeIconArray;	//用户自定义非叶子节点图标集合，node
        this.leafIconArray = $.extend(leafIconArray, this.options.leafIconArray) || this.leafIconArray;	//用户自定义叶子节点图标集合，leaf
        this.skin = this.options.skin || this.skin;	//自定义样式
        if(this.skin == "layui"){ //layui主题
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : true; //开启树线，默认开启
            this.ficon = this.options.ficon || this.ficon; //一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'7'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; //一级图标中的leaf节点图标
            this.icon = this.options.icon || this.icon;	//二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        } else if(this.skin == "laySimple"){ //laySimple主题
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : false; //开启树线，默认不开启
            this.ficon = this.options.ficon || this.ficon; //一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'-1'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "2") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'2'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];//一级图标中的leaf节点图标
            this.icon = this.options.icon || this.icon;	//二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        } else { // 默认主题  或者自定义主题
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : false; //开启树线，默认不开启
            this.ficon = this.options.ficon || this.ficon; //一级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示一级图标。默认'8'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; // 一级图标中的leaf节点图标
            this.icon = this.options.icon || this.icon;	//二级图标样式，0：文件夹，1：人员，2：机构，3：报表，4：信息，5：叶子，6：勋章，7：文件，8：小圆点，9：齿轮，10：星星， -1：不显示二级图标。默认'5'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "0") : this.icon[0]; //二级图标中的node节点图标。0：文件夹，1：+、-，2：三角形， -1：不显示二级图标，默认'0'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二级图标中的leaf节点图标
        }

        /** 数据加载参数**/
        this.url = this.options.url || this.url; //请求地址
        this.async = (typeof (this.options.async) === "boolean") ? this.options.async : this.async;	//异步同步加载,默认异步加载
        this.headers = this.options.headers || this.headers; //ajax header属性
        this.method = this.options.method || this.method; //请求类型
        this.dataType = this.options.dataType || this.dataType; //参数类型
        this.contentType = this.options.contentType || this.contentType; //发送信息至服务器时内容编码类型
        this.defaultRequest = $.extend(this.defaultRequest, this.options.defaultRequest) || this.defaultRequest; //默认请求参数
        this.filterRequest = this.options.filterRequest || this.filterRequest; //过滤请求参数
        this.request = this.options.request || this.request; //用户自定义请求参数
        this.response = $.extend(this.response, this.options.response) || this.response; //返回json格式
        this.data = this.options.data || this.data; //初始化指定该参数，则不会访问异步接口
        this.dataFormat = this.options.dataFormat || this.dataFormat; //用于用户配置的data数据格式，list：列表，  levelRelationship：层级关系，默认
        this.dataStyle = this.options.dataStyle || this.dataStyle; //用于用户配置layui通用的json数据风格,layuiStyle:layui风格，defaultStyle：默认风格
        this.errDataShow = (typeof (this.options.errDataShow) === "boolean") ? this.options.errDataShow : this.errDataShow; //是否在使用list模式递归数据出现错误时，显示错误信息
        this.withCredentials = (typeof (this.options.withCredentials) === "boolean") ? this.options.withCredentials : this.withCredentials; //是否允许跨域请求
        this.success = this.options.success || this.success; //树加载完毕后执行解析树之前的回调
        this.done = this.options.done || this.done; //树加载完毕后的回调
        this.formatter = $.extend(this.formatter, this.options.formatter)|| this.formatter; //数据过滤
        this.error = this.options.error || this.error; //异步加载异常回调
        this.complete = this.options.complete || this.complete; //异步加载完成回调

        /** 复选框参数**/
        this.checkbar = this.options.checkbar || this.checkbar; //是否开启复选框模式
        this.checkbarLoad = this.options.checkbarLoad || this.checkbarLoad; //复选框作用范围，node：所有节点， leaf：最后一级；默认所有节点
        this.checkbarType = this.options.checkbarType || this.checkbarType;	//复选框选中形式	all：子集选中父级也选中，  no-all：子集选中父级半选中，子集全选父级选中，p-casc：父级选中子集全选，子集无法改变父级选中状态， self：没有任何级联关系，only：只能选中一个复选框。   默认all
        this.checkbarData = this.options.checkbarData || this.checkbarData; //复选框记录数据类型形式，  change表示记录变更数据，choose表示记录选中数据，all记录全部数据，halfChoose记录选中和半选中的数据，默认choose
        this.checkbarFun =  $.extend(this.checkbarFun, this.options.checkbarFun)|| this.checkbarFun; //checkbar事件加载

        /** 菜单栏参数**/
        this.menubar = this.options.menubar || this.menubar; //是否打开菜单栏
        this.menubarTips = $.extend(this.menubarTips, this.options.menubarTips) || this.menubarTips; //菜单栏吸附， toolbar：依附在工具栏，group：依附在按钮组，freedom，自由
        this.menubarFun = $.extend(this.menubarFun, this.options.menubarFun) || this.menubarFun; //menubar事件加载

        /** 工具栏参数**/
        this.toolbar = this.options.toolbar || this.toolbar; //是否开启工具栏
        this.toolbarWay = this.options.toolbarWay || this.toolbarWay; //工具栏显示方式，contextmenu:右键，follow:跟随节点，fixed:固定在节点右侧
        this.toolbarStyle = $.extend(this.toolbarStyle, this.options.toolbarStyle) || this.toolbarStyle; //toolbar的自定义风格，标题，弹框大小
        this.toolbarLoad = this.options.toolbarLoad || this.toolbarLoad; //toolbar作用范围：node:所有节点，noleaf:非最后一级节点，leaf:最后一级
        this.toolbarShow = this.options.toolbarShow || this.toolbarShow; //toolbar三个按钮
        this.toolbarBtn = this.options.toolbarBtn || this.toolbarBtn; //toolbar增删改中内容的自定义加载
        this.toolbarExt = this.options.toolbarExt || this.toolbarExt; //toolbar按钮扩展
        this.toolbarFun = $.extend(this.toolbarFun, this.options.toolbarFun) || this.toolbarFun; //toolbar事件加载

        /** iframe模式参数**/
        this.useIframe = this.options.useIframe || this.useIframe;//是否加载iframe 默认false
        this.iframeElem = this.options.iframeElem || this.iframeElem; //iframe的ID
        this.iframeUrl = this.options.iframeUrl || this.iframeUrl; //树关联的iframe地址
        this.iframeLoad = this.options.iframeLoad || this.iframeLoad; //点击哪一层加载frame： node：所有节点， leaf：默认，最后一级
        this.iframeDefaultRequest = $.extend(this.iframeDefaultRequest, this.options.iframeDefaultRequest) || this.iframeDefaultRequest; //iframe的默认传递参数
        this.iframeRequest = $.extend(this.iframeRequest, this.options.iframeRequest) || this.iframeRequest; //iframe的自定义参数
        this.iframeFun = $.extend(this.iframeFun, this.options.iframeFun) || this.iframeFun; //iframe事件加载

        /** 下拉树模式参数**/
        if(this.select) {
        	// 重置下拉树
        	this.reloadSelectSetting();
        }
        
        /** 调用确认最终主题方法*/
        this.ensureTheme();
        
    };
    
    // 设置下拉树的基本参数值
    DTree.prototype.selectSetting = function() {
    	/** select模式参数*/
        this.select = true; //配置成select模式
        
        this.selectInitVal = this.obj.attr("data-value") || this.options.selectInitVal || "";	//输入框的值
        this.selectTreeDiv = this.obj[0].id + "_tree_div";		// 上级DIV节点
        this.selectCardDiv = this.obj[0].id + "_select_card_div";	// 上级layui卡片节点
        this.selectDiv = this.obj[0].id + "_select_div";		// 模拟的select节点
        this.selectTipsName = this.obj[0].id + "_select_input"; // select的提示输入框名称
        this.selectTips = this.options.selectTips || "请选择";			// 输入框的提示语
        this.selectInputName = this.options.selectInputName || {nodeId: this.obj[0].id + "_select_nodeId"};  // select表单中的元素
        
        // 调取下拉树的特殊处理页面元素标识
        this.renderSelectDom();
    }
    
    // 重新设置下拉树的基本参数值
    DTree.prototype.reloadSelectSetting = function() {
        
    	this.selectInitVal = this.obj.attr("data-value") || this.options.selectInitVal || this.selectInitVal;	//输入框的值
        this.selectTips = this.options.selectTips || this.selectTips;			// 输入框的提示语
        this.selectInputName = $.extend(this.selectInputName, this.options.selectInputName) || this.selectInputName;  // select表单中的元素
        
        // 调取下拉树的特殊处理页面元素标识
        this.reloadSelectDom();
    }

    /******************** 下拉树设置区域 ********************/
    // 渲染下拉树的Dom结构
    DTree.prototype.renderSelectDom = function() {
        var _this = this;
        var rootId = _this.obj[0].id;
        
        // 设置自定义表单隐藏域
        var selectInputName = _this.selectInputName;
        var selectInput = [];
        for(var key in selectInputName) {
        	selectInput.push('<input type="hidden" dtree-id="' + rootId + '" dtree-node="' + key + '" name="' + selectInputName[key] + '" value="" readonly>');
        }

        // 设置html
        var prevHtml = ['<div class="layui-unselect layui-form-select" dtree-id="' + rootId + '" dtree-select="' + _this.selectDiv + '">',
			            '<div class="layui-select-title">', selectInput.join(""), 
			            '<input type="text" dtree-id="' + rootId + '" id="' +  _this.selectTipsName +'_id" name="' + _this.selectTipsName + '" placeholder="' + _this.selectTips + '" value="" readonly class="layui-input layui-unselect">',
			            '<i class="layui-edge"></i>',
			            '</div></div>'].join('');

        _this.obj.before(prevHtml);

        _this.obj.wrap('<div class="layui-card dtree-select" dtree-id="' + rootId + '" dtree-card="' + _this.selectCardDiv + '"></div>').wrap('<div class="layui-card-body"></div>').wrap('<div id="' + _this.selectTreeDiv + '"></div>');
    
    }
    
    // 重新渲染下拉树的Dom结构
    DTree.prototype.reloadSelectDom = function() {
        var _this = this;
        var rootId = _this.obj[0].id;
        
        // 设置自定义表单隐藏域
        var selectInputName = _this.selectInputName;
        var selectInput = [];
        for(var key in selectInputName) {
        	selectInput.push('<input type="hidden" dtree-id="' + rootId + '" dtree-node="' + key + '" name="' + selectInputName[key] + '" value="" readonly>');
        }
        
        $("div[dtree-id='"+rootId+"'][dtree-select='"+_this.selectDiv+"']").find("div.layui-select-title").html("");

        // 设置html
        var prevHtml = [selectInput.join(""), 
			            '<input type="text" dtree-id="' + rootId + '" id="' +  _this.selectTipsName +'_id" name="' + _this.selectTipsName + '" placeholder="' + _this.selectTips + '" value="" readonly class="layui-input layui-unselect">',
			            '<i class="layui-edge"></i>'].join('');

        $("div[dtree-id='"+rootId+"'][dtree-select='"+_this.selectDiv+"']").find("div.layui-select-title").html(prevHtml);

    }

    // 设置输入框的值
    DTree.prototype.selectVal = function(param) {
        var _this = this;
        var rootId = _this.obj[0].id;
        var selectInputName = _this.selectInputName;
        var selectTipsNameValue = "";
        var selectValues = {};
        
        // 如果开启了复选框，则此方法用来取值
        if(_this.checkbar) {
        	$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "']").each(function(){
        		var name = $(this).attr("name");
        		var val = $(this).val();
        		selectValues[name] = val;
        	});
        } else {
        	if(typeof param === 'undefined') { // 不传，则为当前树中记录的ID
            	param = _this.getNowParam();
            }
            if(typeof param === 'string') { // 传递ID，则查询树节点ID对应的值
            	param = _this.getParam(param);
            }
            
            selectTipsNameValue = param["context"];
        	for(var key in selectInputName) {
        		selectValues[selectInputName[key]] = param[key];
        		$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+selectInputName[key]+"']").val(param[key] || "");
        	}
        	
        	if(param["nodeId"] && !param["context"]) {
        		selectTipsNameValue = _this.getParam(param["nodeId"]);
        	}
        	
            // 返显提示输入框值
            $("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+_this.selectTipsName+"']").val(selectTipsNameValue || "");
            
        }
        
        
        // 返回隐藏域中的值
        return selectValues;
    }
    
    // 设置复选框模式中的下拉树的值
    DTree.prototype.selectCheckboxVal = function() {
    	var _this = this;
    	var rootId = _this.obj[0].id;
    	var selectInputName = _this.selectInputName;
    	
    	// 获取全部复选框选中节点
    	var param = _this.getCheckbarJsonArrParam();
    	
    	selectTipsNameValue = param["context"];
    	var selectValues = {};
    	for(var key in selectInputName) {
    		var value = param[key].join(",");
    		selectValues[selectInputName[key]] = value;
    		$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+selectInputName[key]+"']").val(value);
    	}
    	
    	$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+_this.selectTipsName+"']").val(selectTipsNameValue);
    	
    	// 返回隐藏域中的值
        return selectValues;
    }
    
    // 重置下拉树的值
    DTree.prototype.selectResetVal = function() {
    	var _this = this;
    	var rootId = _this.obj[0].id;
    	// 表单清空
        $("input[dtree-id='"+rootId+"']").val("");
        // 节点重置
        _this.cancelNavThis();
        if(_this.checkbar) {
        	// 复选框重置
        	_this.cancelCheckedNode();
        }
    }


    /******************** 字体及图标区域 ********************/
    // 确认最终主题
    DTree.prototype.ensureTheme = function(){
        var _this = this;

        // 确认style
        this.style.item = DTREE + this.skin + ITEM;
        this.style.itemThis = DTREE + this.skin + ITEMTHIS;
        this.style.dfont = DTREE + this.skin + DFONT;
        this.style.ficon = DTREE + this.skin + FICON;
        this.style.icon = DTREE + this.skin + ICON;
        this.style.cbox = DTREE + this.skin + CBOX;
        this.style.chs = DTREE + this.skin + CHS;

        // 确认usefontStyle
        var iconfont = this.iconfont;
        var iconfonts = [];
        if(typeof iconfont === 'string') {
            iconfonts.push(iconfont);
        } else {
            iconfonts = iconfont;
        }

        var iconfontStyle = this.iconfontStyle;
        var iconfontStyles = [];
        if(iconfontStyle.length == undefined) {
            iconfontStyles.push(iconfontStyle);
        } else {
            iconfontStyles = iconfontStyle;
        }

        for(var i=0; i<iconfonts.length; i++){
            var ifont = iconfonts[i];
            var ifontStyle = iconfontStyles[i];
            if(typeof ifontStyle !== 'undefined') {
                // 判断，赋值
                this.useDefaultOrUserDefineFnodeStyle(ifont, ifontStyle.fnode);
                this.useDefaultOrUserDefineSnodeStyle(ifont, ifontStyle.snode);
                this.useDefaultOrUserDefineCheckboxStyle(ifont, ifontStyle.checkbox);
                this.useDefaultOrUserDefineMenubarStyle(ifont, ifontStyle.menubar);
                this.useDefaultOrUserDefineMenubarExtStyle(ifont, ifontStyle.menubarExt);
                this.useDefaultOrUserDefineToolbarStyle(ifont, ifontStyle.toolbar);
                this.useDefaultOrUserDefineToolbarExtStyle(ifont, ifontStyle.toolbarExt);
            }
        }
    };

    // 赋值一级图标
    DTree.prototype.useDefaultOrUserDefineFnodeStyle = function(ifont, fnode){
        var _this = this;
        var tempOpen = this.usefontStyle.fnode.node.open;
        var tempClose = this.usefontStyle.fnode.node.close;
        var tempLeaf = this.usefontStyle.fnode.leaf;

        if(typeof fnode === 'undefined'){
            this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一级图标中的node节点open图标
            this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一级图标中的node节点close图标
            this.usefontStyle.fnode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.fleafIcon]) : tempLeaf; // 一级图标中的node节点的leaf图标
        } else {
            var node = fnode.node;
            var leaf = fnode.leaf;
            if(typeof node === 'undefined'){
                this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一级图标中的node节点open图标
                this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一级图标中的node节点close图标
            } else {
                var open = node.open;
                var close = node.close;
                if(typeof open === 'undefined'){
                    this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一级图标中的node节点open图标
                } else {
                    this.usefontStyle.fnode.node.open = ifont + " " + open;
                }
                if(typeof close === 'undefined') {
                    this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一级图标中的node节点close图标
                } else {
                    this.usefontStyle.fnode.node.close = ifont + " " + close;
                }
            }
            if(typeof leaf === 'undefined'){
                this.usefontStyle.fnode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.fleafIcon]) : tempLeaf; // 一级图标中的node节点的leaf图标
            } else {
                this.usefontStyle.fnode.leaf = ifont + " " + leaf;
            }
        }
    };

    // 赋值二级图标
    DTree.prototype.useDefaultOrUserDefineSnodeStyle = function(ifont, snode){
        var _this = this;
        var tempOpen = this.usefontStyle.snode.node.open;
        var tempClose = this.usefontStyle.snode.node.close;
        var tempLeaf = this.usefontStyle.snode.leaf;

        if(typeof snode === 'undefined'){
            this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二级图标中的node节点open图标
            this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二级图标中的node节点close图标
            this.usefontStyle.snode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.leafIcon]) : tempLeaf; // 二级图标中的leaf节点图标
        } else {
            var node = snode.node;
            var leaf = snode.leaf;
            if(typeof node === 'undefined') {
                this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二级图标中的node节点open图标
                this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二级图标中的node节点close图标
            } else {
                var open = node.open;
                var close = node.close;
                if(typeof open === 'undefined'){
                    this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二级图标中的node节点open图标
                } else {
                    this.usefontStyle.snode.node.open = ifont + " " + open;
                }
                if(typeof close === 'undefined') {
                    this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二级图标中的node节点close图标
                } else {
                    this.usefontStyle.snode.node.close = ifont + " " + close;
                }
            }
            if(typeof leaf === 'undefined') {
                this.usefontStyle.snode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.leafIcon]) : tempLeaf; // 二级图标中的leaf节点图标
            } else {
                this.usefontStyle.snode.leaf = ifont + " " + leaf;
            }
        }
    };

    // 赋值复选框图标
    DTree.prototype.useDefaultOrUserDefineCheckboxStyle = function(ifont, checkbox){
        var _this = this;
        var tempOn = this.usefontStyle.checkbox.on;
        var tempOut = this.usefontStyle.checkbox.out;
        var tempNoall = this.usefontStyle.checkbox.noall;

        if(typeof checkbox === 'undefined'){
            this.usefontStyle.checkbox.on = (tempOn == "") ? (ifont + " " + LI_DIV_CHECKBAR_ON) : tempOn;
            this.usefontStyle.checkbox.out = (tempOut == "") ? (ifont + " " + LI_DIV_CHECKBAR_OUT) : tempOut;
            this.usefontStyle.checkbox.noall = (tempNoall == "") ? (ifont + " " + LI_DIV_CHECKBAR_NOALL) : tempNoall;
        } else {
            var on = checkbox.on;
            var out = checkbox.out;
            var noall = checkbox.noall;
            if(typeof on === 'undefined') {
                this.usefontStyle.checkbox.on = (tempOn == "") ? (ifont + " " + LI_DIV_CHECKBAR_ON) : tempOn;
            } else {
                this.usefontStyle.checkbox.on = ifont + " " + on;
            }
            if(typeof out === 'undefined') {
                this.usefontStyle.checkbox.out = (tempOut == "") ? (ifont + " " + LI_DIV_CHECKBAR_OUT) : tempOut;
            } else {
                this.usefontStyle.checkbox.out = ifont + " " + out;
            }
            if(typeof noall === 'undefined') {
                this.usefontStyle.checkbox.noall = (tempNoall == "") ? (ifont + " " + LI_DIV_CHECKBAR_NOALL) : tempNoall;
            } else {
                this.usefontStyle.checkbox.noall = ifont + " " + noall;
            }
        }
    };

    // 赋值菜单栏图标
    DTree.prototype.useDefaultOrUserDefineMenubarStyle = function(ifont, menubar){
        var _this = this;
        var tempMovedown = this.usefontStyle.menubar.movedown;
        var tempMoveup = this.usefontStyle.menubar.moveup;
        var tempRefresh = this.usefontStyle.menubar.refresh;
        var tempCheckAll = this.usefontStyle.menubar.checkAll;
        var tempUncheckAll = this.usefontStyle.menubar.unCheckAll;
        var tempInvertAll = this.usefontStyle.menubar.invertAll;
        var tempRemove = this.usefontStyle.menubar.remove;
        var tempSearch = this.usefontStyle.menubar.search;

        if(typeof menubar === 'undefined'){
            this.usefontStyle.menubar.movedown = (tempMovedown == "") ? (ifont + " " + LI_DIV_MENUBAR_DOWN) : tempMovedown;
            this.usefontStyle.menubar.moveup = (tempMoveup == "") ? (ifont + " " + LI_DIV_MENUBAR_UP) : tempMoveup;
            this.usefontStyle.menubar.refresh = (tempRefresh == "") ? (ifont + " " + LI_DIV_MENUBAR_REFRESH) : tempRefresh;
            this.usefontStyle.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_CHECKALL) : tempCheckAll;
            this.usefontStyle.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_UNCHECKALL) : tempUncheckAll;
            this.usefontStyle.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + LI_DIV_MENUBAR_INVERTALL) : tempInvertAll;
            this.usefontStyle.menubar.remove = (tempRemove == "") ? (ifont + " " + LI_DIV_MENUBAR_DELETE) : tempRemove;
            this.usefontStyle.menubar.search = (tempSearch == "") ? (ifont + " " + LI_DIV_MENUBAR_SEARCH) : tempSearch;
        } else {
            var movedown = menubar.movedown;
            var moveup = menubar.moveup;
            var refresh = menubar.refresh;
            var checkAll = menubar.checkAll;
            var unCheckAll = menubar.unCheckAll;
            var invertAll = menubar.invertAll;
            var remove = menubar.remove;
            var search = menubar.search;
            if(typeof movedown === 'undefined') {
                this.usefontStyle.menubar.movedown = (tempMovedown == "") ? (ifont + " " + LI_DIV_MENUBAR_DOWN) : tempMovedown;
            } else {
                this.usefontStyle.menubar.movedown = ifont + " " + movedown;
            }
            if(typeof moveup === 'undefined') {
                this.usefontStyle.menubar.moveup = (tempMoveup == "") ? (ifont + " " + LI_DIV_MENUBAR_UP) : tempMoveup;
            } else {
                this.usefontStyle.menubar.moveup = ifont + " " + moveup;
            }
            if(typeof refresh === 'undefined') {
                this.usefontStyle.menubar.refresh = (tempRefresh == "") ? (ifont + " " + LI_DIV_MENUBAR_REFRESH) : tempRefresh;
            } else {
                this.usefontStyle.menubar.refresh = ifont + " " + refresh;
            }
            if(typeof checkAll === 'undefined') {
                this.usefontStyle.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_CHECKALL) : tempCheckAll;
            } else {
                this.usefontStyle.menubar.checkAll = ifont + " " + checkAll;
            }
            if(typeof unCheckAll === 'undefined') {
                this.usefontStyle.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_UNCHECKALL) : tempUncheckAll;
            } else {
                this.usefontStyle.menubar.unCheckAll = ifont + " " + unCheckAll;
            }
            if(typeof invertAll === 'undefined') {
                this.usefontStyle.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + LI_DIV_MENUBAR_INVERTALL) : tempInvertAll;
            } else {
                this.usefontStyle.menubar.invertAll = ifont + " " + invertAll;
            }
            if(typeof remove === 'undefined') {
                this.usefontStyle.menubar.remove = (tempRemove == "") ? (ifont + " " + LI_DIV_MENUBAR_DELETE) : tempRemove;
            } else {
                this.usefontStyle.menubar.remove = ifont + " " + remove;
            }
            if(typeof search === 'undefined') {
                this.usefontStyle.menubar.search = (tempSearch == "") ? (ifont + " " + LI_DIV_MENUBAR_SEARCH) : tempSearch;
            } else {
                this.usefontStyle.menubar.search = ifont + " " + search;
            }
        }
    };

    // 赋值扩展菜单栏图标
    DTree.prototype.useDefaultOrUserDefineMenubarExtStyle = function(ifont, menubarExt){
        var _this = this;
        var tempExt = this.usefontStyle.menubarExt;

        if(typeof menubarExt === 'undefined'){
            this.usefontStyle.menubarExt = (tempExt == "") ? ifont : tempExt;
        } else {
            this.usefontStyle.menubarExt = menubarExt;
        }
    };

    // 赋值工具栏图标
    DTree.prototype.useDefaultOrUserDefineToolbarStyle = function(ifont, toolbar){
        var _this = this;
        var tempMovedown = this.usefontStyle.toolbar.menubar.movedown;
        var tempMoveup = this.usefontStyle.toolbar.menubar.moveup;
        var tempRefresh = this.usefontStyle.toolbar.menubar.refresh;
        var tempCheckAll = this.usefontStyle.toolbar.menubar.checkAll;
        var tempUnCheckAll = this.usefontStyle.toolbar.menubar.unCheckAll;
        var tempInvertAll = this.usefontStyle.toolbar.menubar.invertAll;
        var tempRemove = this.usefontStyle.toolbar.menubar.remove;
        var tempSearch = this.usefontStyle.toolbar.menubar.search;
        var tempExt = this.usefontStyle.toolbar.menubarExt;
        var tempPulldown = this.usefontStyle.toolbar.pulldown;
        var tempPullup = this.usefontStyle.toolbar.pullup;
        var tempAdd = this.usefontStyle.toolbar.add;
        var tempEdit = this.usefontStyle.toolbar.edit;
        var tempDel = this.usefontStyle.toolbar.del;


        if(typeof toolbar === 'undefined'){
            this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
            this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
            this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
            this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
            this.usefontStyle.toolbar.menubar.unCheckAll = (tempUnCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUnCheckAll;
            this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
            this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
            this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
            this.usefontStyle.toolbar.menubarExt = (tempExt == "") ? this.usefontStyle.menubarExt : tempExt;
            this.usefontStyle.toolbar.pulldown = (tempPulldown == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLDOWN) : tempPulldown;
            this.usefontStyle.toolbar.pullup = (tempPullup == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLUP) : tempPullup;
            this.usefontStyle.toolbar.add = (tempAdd == "") ? (ifont + " " + LI_DIV_TOOLBAR_ADD) : tempAdd;
            this.usefontStyle.toolbar.edit = (tempEdit == "") ? (ifont + " " + LI_DIV_TOOLBAR_EDIT) : tempEdit;
            this.usefontStyle.toolbar.del = (tempDel == "") ? (ifont + " " + LI_DIV_TOOLBAR_DEL) : tempDel;
        } else {
            var menubar = toolbar.menubar;
            var menubarExt = toolbar.menubarExt;
            var pulldown = toolbar.pulldown;
            var pullup = toolbar.pullup;
            var add = toolbar.add;
            var edit = toolbar.edit;
            var del = toolbar.del;

            if(typeof menubar === 'undefined'){
                this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
                this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
                this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
                this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
                this.usefontStyle.toolbar.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUncheckAll;
                this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
                this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
                this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
            } else {
                var movedown = menubar.movedown;
                var moveup = menubar.moveup;
                var refresh = menubar.refresh;
                var checkAll = menubar.checkAll;
                var unCheckAll = menubar.unCheckAll;
                var invertAll = menubar.invertAll;
                var remove = menubar.remove;
                var search = menubar.search;
                if(typeof movedown === 'undefined') {
                    this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
                } else {
                    this.usefontStyle.toolbar.menubar.movedown = ifont + " " + movedown;
                }
                if(typeof moveup === 'undefined') {
                    this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
                } else {
                    this.usefontStyle.toolbar.menubar.moveup = ifont + " " + moveup;
                }
                if(typeof refresh === 'undefined') {
                    this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
                } else {
                    this.usefontStyle.toolbar.menubar.refresh = ifont + " " + refresh;
                }
                if(typeof checkAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
                } else {
                    this.usefontStyle.toolbar.menubar.checkAll = ifont + " " + checkAll;
                }
                if(typeof unCheckAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUncheckAll;
                } else {
                    this.usefontStyle.toolbar.menubar.unCheckAll = ifont + " " + unCheckAll;
                }
                if(typeof invertAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
                } else {
                    this.usefontStyle.toolbar.menubar.invertAll = ifont + " " + invertAll;
                }
                if(typeof remove === 'undefined') {
                    this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
                } else {
                    this.usefontStyle.toolbar.menubar.remove = ifont + " " + remove;
                }
                if(typeof search === 'undefined') {
                    this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
                } else {
                    this.usefontStyle.toolbar.menubar.search = ifont + " " + search;
                }
            }

            if(typeof menubarExt === 'undefined'){
                this.usefontStyle.toolbar.menubarExt = (tempExt == "") ? this.usefontStyle.menubarExt : tempExt;
            } else {
                this.usefontStyle.toolbar.menubarExt = menubarExt;
            }

            if(typeof pulldown === 'undefined'){
                this.usefontStyle.toolbar.pulldown = (tempPulldown == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLDOWN) : tempPulldown;
            } else {
                this.usefontStyle.toolbar.pulldown = ifont + " " + pulldown;
            }
            if(typeof pullup === 'undefined'){
                this.usefontStyle.toolbar.pullup = (tempPullup == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLUP) : tempPullup;
            } else {
                this.usefontStyle.toolbar.pullup = ifont + " " + pullup;
            }
            if(typeof add === 'undefined'){
                this.usefontStyle.toolbar.add = (tempAdd == "") ? (ifont + " " + LI_DIV_TOOLBAR_ADD) : tempAdd;
            } else {
                this.usefontStyle.toolbar.add = ifont + " " + add;
            }
            if(typeof edit === 'undefined'){
                this.usefontStyle.toolbar.edit = (tempEdit == "") ? (ifont + " " + LI_DIV_TOOLBAR_EDIT) : tempEdit;
            } else {
                this.usefontStyle.toolbar.edit = ifont + " " + edit;
            }
            if(typeof del === 'undefined'){
                this.usefontStyle.toolbar.del = (tempDel == "") ? (ifont + " " + LI_DIV_TOOLBAR_DEL) : tempDel;
            } else {
                this.usefontStyle.toolbar.del = ifont + " " + del;
            }
        }
    };

    // 赋值扩展工具栏图标
    DTree.prototype.useDefaultOrUserDefineToolbarExtStyle = function(ifont, toolbarExt){
        var _this = this;
        var tempExt = this.usefontStyle.toolbarExt;

        if(typeof toolbarExt === 'undefined'){
            this.usefontStyle.toolbarExt = (tempExt == "") ? ifont : tempExt;
        } else {
            this.usefontStyle.toolbarExt = toolbarExt;
        }
    };

    // 设置图标的展开关闭，以及展开时/关闭时是最后一级图标的处理
    DTree.prototype.operateIcon = function($i_spread, $i_node){
        var _this = this;
        var ficonClass = $i_spread.attr("data-iconClass");
        var iconClass = $i_node.attr("data-iconClass");
        return{
            open: function(){
                $i_spread.attr("data-spread","open");
                $i_node.attr("data-spread","open");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.close);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.open);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.close);
                    $i_node.addClass(_this.usefontStyle.snode.node.open);
                }
            },
            close: function(){
                $i_spread.attr("data-spread","close");
                $i_node.attr("data-spread","close");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.open);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.close);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.open);
                    $i_node.addClass(_this.usefontStyle.snode.node.close);
                }
            },
            openWithLeaf: function(){
                $i_spread.attr("data-spread","open");
                $i_node.attr("data-spread","open");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.leaf);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.open);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.leaf);
                    $i_node.addClass(_this.usefontStyle.snode.node.open);
                }
            },
            closeWithLeaf: function(){
                $i_spread.attr("data-spread","last");
                $i_node.attr("data-spread","last");

                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.open);
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.close);
                    $i_spread.addClass(_this.usefontStyle.fnode.leaf);
                }

                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.open);
                    $i_node.removeClass(_this.usefontStyle.snode.node.close);
                    $i_node.addClass(_this.usefontStyle.snode.leaf);
                }
            }
        }
    };

    // 显示树线
    DTree.prototype.showLine = function($lis){
        var _this = this;
        if(_this.line){
            if($lis && $lis.length > 0) {
                $lis.each(function(){
                    _this.showLineLi($(this));
                });
            } else {
                _this.obj.find("li[data-id]").each(function(){
                    _this.showLineLi($(this));
                });
            }
        }
    }

    // 真正显示树线的方法
    DTree.prototype.showLineLi = function($li){
        var _this = this;
        var $div = $li.children("div"),
            $nextLi = $li.next("li"),
            $ul = $li.parent("ul");
        if($ul[0].id == _this.obj[0].id) {
            // 根节点下的节点
            $li.removeClass(LI_NAV_LINE);
            $li.removeClass(LI_NAV_LAST_LINE);
            $li.addClass(LI_NAV_FIRST_LINE);
        } else {
            // 非根节点下的节点
            var $pnextLi = $ul.parent("li").next("li");
            if($pnextLi.length == 0) {
                if($nextLi.length == 0){
                    $li.removeClass(LI_NAV_LINE);
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.addClass(LI_NAV_LAST_LINE);
                } else {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LAST_LINE);
                    $li.addClass(LI_NAV_LINE);
                }
            }else {
                var $pnextdiv = $pnextLi.children("div");
                if($nextLi.length == 0 && $div.children("cite").attr("data-leaf") == "leaf" && $pnextdiv.children("cite").attr("data-leaf") == "leaf") {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LINE);
                    $li.addClass(LI_NAV_LAST_LINE);
                } else {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LAST_LINE);
                    $li.addClass(LI_NAV_LINE);
                }
            }
        }
    }

    /******************** 初始化数据区域 ********************/
    // 设置高度
    DTree.prototype.autoHeight = function(){
        var _this = this;
        var height = _this.height;
        if(height != "") {
            if(_this.elem == _this.scroll){
                _this.obj.parent().css("height", height + "px");
            } else {
                var $toolbarDiv = _this.obj.closest(_this.scroll);
                $toolbarDiv.css("height", height + "px");
            }
        }
    };

    // 重载树
    DTree.prototype.reload = function(options){
        var _this = this;
        _this.reloadSetting(options);
        _this.init();
    };

    // 初始化树
    DTree.prototype.init = function(){
        var _this = this;
        if (typeof _this !== "object") {
            //_this.obj.html(_this.getNoneDom().errText("树组件未成功加载，请检查配置"));
            layer.msg("树组件未成功加载，请检查配置", {icon:5});
            return ;
        }

        // 设置组件高度
        _this.autoHeight();

        if(_this.data) {
            if(typeof _this.data.length === 'undefined'){
                //_this.obj.html(_this.getNoneDom().errText("数据解析异常，data数据格式不正确"));
                layer.msg("数据解析异常，data数据格式不正确", {icon:5});
                return ;
            }

            if(_this.data.length == 0) {
                _this.obj.html(_this.getNoneDom().text());
                return ;
            }

            //先将ul中的元素清空
            _this.obj.html("");

            setTimeout(function () {
                // 加载完毕后执行树解析前的回调
                _this.success(_this.data, _this.obj);

                // 第一次解析树
                if (_this.dataFormat == 'list'){
                    //1.识别根节点ul中的data-id标签，判断顶级父节点
                    var pid = _this.obj.attr("data-id");
                    //2.构建一个存放节点的树组
                    var rootListData = _this.queryListTreeByPid(pid, _this.data);
                    _this.loadListTree(rootListData, _this.data, 1);
                } else {
                    _this.loadTree(_this.data, 1);
                }

                // 显示树线
                _this.showLine();

                // 这种情况下需要一开始就将toolbar显示在页面上
                if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                    _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                }

                // 判断是否存在错误数据，并是否打印错误数据
                _this.msgErrData();
                
                // 设置复选框的初始值
                if(_this.select){
                	_this.selectVal(_this.selectInitVal);
                }

                // 保存树副本
                _this.bak = _this.obj.html();
                
                // 加载完毕后的回调
                _this.done(_this.data, _this.obj);
            }, 100);
        } else {
            if (!_this.url) {
                //_this.obj.html(_this.getNoneDom().errText("数据请求异常，url参数未指定"));
                layer.msg("数据请求异常，url参数未指定", {icon:5});
                return ;
            }

            //先将ul中的元素清空
            _this.obj.html("");

            var index = _this.load ? layer.load(1) : "";

            AjaxHelper.request({
                async: _this.async,
                headers: _this.headers,
                type: _this.method,
                url: _this.url,
                dataType: _this.dataType,
                contentType: _this.contentType,
                withCredentials: _this.withCredentials,
                data: _this.getFilterRequestParam(_this.getRequestParam()),
                success: function(result) {
                    if (typeof result === 'string') {
                        result = $.parseJSON(result);
                    }
                    
                    // 加载完毕后执行树解析前的回调
                    _this.success(result, _this.obj);
                    
                    var code = "";
                    if (_this.dataStyle == 'layuiStyle'){
                        code = result[_this.response.statusName];
                    } else {
                        code = result.status[_this.response.statusName];
                    }

                    if (code == _this.response.statusCode) {
                        var d = result[_this.response.rootName];

                        if(typeof d.length === 'undefined'){
                            _this.obj.html(_this.getNoneDom().errText("数据解析异常，url回调后的数据格式不正确"));
                            //layer.msg("数据解析异常，url回调后的数据格式不正确", {icon:5});
                            return ;
                        }

                        if(d.length == 0) {
                            _this.obj.html(_this.getNoneDom().text());
                            return ;
                        }

                        // 第一次解析树
                        if (_this.dataFormat == 'list'){
                            //1.识别根节点ul中的data-id标签，判断顶级父节点
                            var pid = _this.obj.attr("data-id");
                            //2.构建一个存放节点的树组
                            var rootListData = _this.queryListTreeByPid(pid, d);
                            _this.loadListTree(rootListData, d, 1);
                        } else {
                            _this.loadTree(d, 1);
                        }

                        // 显示树线
                        _this.showLine();

                        // 这种情况下需要一开始就将toolbar显示在页面上
                        if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                            _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                        }

                        // 判断是否存在错误数据，并是否打印错误数据
                        _this.msgErrData();
                        
                        // 设置复选框的初始值
                        if(_this.select){
                        	_this.selectVal(_this.selectInitVal);
                        }

                        // 保存树副本
                        _this.bak = _this.obj.html();
                        
                        // 加载完毕后的回调
                        _this.done(result, _this.obj);
                    } else {
                        // 如果打印不出任何信息说明是在这里，用了错误的数据格式， 或返回码不正确
                        if (_this.dataStyle == 'layuiStyle'){
                            _this.obj.html(_this.getNoneDom().errText(result[_this.response.message]));
                            _this.error(null, code, result[_this.response.message]);
                            //layer.msg(result[_this.response.message], {icon:2});
                        } else {
                            _this.obj.html(_this.getNoneDom().errText(result.status[_this.response.message]));
                            _this.error(null, code, result.status[_this.response.message]);
                            //layer.msg(result.status[_this.response.message], {icon:2});
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){// 异步加载异常回调
                    _this.obj.html(_this.getNoneDom().errText(textStatus + ": " + errorThrown));
                    _this.error(XMLHttpRequest, textStatus, errorThrown);
                },
                complete: function(XMLHttpRequest, textStatus){// 异步加载完成回调
                    if(_this.load){layer.close(index);}
                    _this.complete(XMLHttpRequest, textStatus);
                }
            });
        }
    };

    // 加载子节点
    DTree.prototype.getChild = function($div, data) {
        var _this = this, $ul = $div.next("ul");

        _this.setNodeParam($div);

        if(typeof data !== 'undefined') {
            if(typeof data.length === 'undefined'){
                //_this.obj.html(_this.getNoneDom().errText("数据解析异常，data数据格式不正确"));
                layer.msg("数据解析异常，data数据格式不正确", {icon:5});
                return ;
            }

            //先将ul中的元素清空
            $ul.html("");

            // 解析树
            if (_this.dataFormat == 'list'){
                var pid = _this.node.nodeId;
                var level = parseInt(_this.node.level)+1;

                var listData = _this.queryListTreeByPid(pid, data);
                _this.loadListTree(listData, _this.data, level);
            } else {
                _this.loadTree(data, level);
            }

            // 显示树线
            _this.showLine();

            // 这种情况下需要一开始就将toolbar显示在页面上
            if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
            }

            // 判断是否存在错误数据，并是否打印错误数据
            _this.msgErrData();
            
            // 保存树副本
            _this.bak = _this.obj.html();

        } else {
            if (!_this.url) {
                //_this.obj.html(_this.getNoneDom().errText("数据请求异常，url参数未指定"));
                layer.msg("数据请求异常，url参数未指定", {icon:5});
                return ;
            }

            $ul.html("");
            var index = _this.load ? layer.load(1) : "";
            AjaxHelper.request({
                async: _this.async,
                headers: _this.headers,
                type: _this.method,
                url: _this.url,
                dataType: _this.dataType,
                withCredentials: _this.withCredentials,
                data:  _this.getFilterRequestParam(_this.getRequestParam()),
                success: function(result) {
                    if (typeof result === 'string') {
                        result = $.parseJSON(result);
                    }
                    var code = "";
                    if (_this.dataStyle == 'layuiStyle'){
                        code = result[_this.response.statusName];
                    } else {
                        code = result.status[_this.response.statusName];
                    }

                    if (code == _this.response.statusCode) {
                        // 解析树
                        var pid = _this.node.nodeId;
                        var level = parseInt(_this.node.level)+1;
                        if (_this.dataFormat == 'list'){
                            var pListData = _this.queryListTreeByPid(pid, result[_this.response.rootName]);
                            _this.loadListTree(pListData, result[_this.response.rootName], level, $ul);
                        } else {
                            _this.loadTree(result[_this.response.rootName], level, $ul);
                        }

                        // 显示树线
                        _this.showLine();

                        // 这种情况下需要一开始就将toolbar显示在页面上
                        if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                            _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                        }

                        // 判断是否存在错误数据，并是否打印错误数据
                        _this.msgErrData();

                        $ul.addClass(NAV_SHOW);
                        
                        // 保存树副本
                        _this.bak = _this.obj.html();
                    } else {
                        if (_this.dataStyle == 'layuiStyle'){
                            _this.obj.html(_this.getNoneDom().errText(result[_this.response.message]));
                            _this.error(null, code, result[_this.response.message]);
                            //layer.msg(result[_this.response.message], {icon:2});
                        } else {
                            _this.obj.html(_this.getNoneDom().errText(result.status[_this.response.message]));
                            _this.error(null, code, result.status[_this.response.message]);
                            //layer.msg(result.status[_this.response.message], {icon:2});
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){// 异步加载异常回调
                    _this.obj.html(_this.getNoneDom().errText(textStatus + ": " + errorThrown));
                    _this.error(XMLHttpRequest, textStatus, errorThrown);
                },
                complete: function(XMLHttpRequest, textStatus){// 异步加载完成回调
                    if(_this.load){layer.close(index);}
                    _this.complete(XMLHttpRequest, textStatus);
                }
            });
        }
    };

    // 初始化树或者拼接树
    DTree.prototype.loadListTree = function(pListData, listData, level, $ul){
        var _this = this;
        $ul = $ul || _this.getNodeDom().nowOrRootUl();	//当前选中的节点或根节点
        if (pListData.length > 0){
            for (var i = 0; i < pListData.length; i++) {
                // 1.获取已知节点的全部数据
                var data = pListData[i];
                if(typeof data !== "object") continue;
                var parseData = _this.parseData(data);
                var childListData = _this.queryListTreeByPid(parseData.treeId(), listData); // 根据已知数据的id判断该条数据是否还有子数据

                // 3. 页面元素加载数据
                $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(childListData.length), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(level), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), ($ul.hasClass(UL_ROOT) ? "root" : "item")));
                // 4.有子数据的元素加载子节点
                if(childListData.length > 0){
                    var cLevel = parseInt(level)+1;
                    _this.loadListTree(childListData, listData, cLevel, _this.obj.find("ul[data-id='"+parseData.treeId()+"']"));
                }
            }
        }
    };

    // 根据父ID查找list数据中匹配的元素
    DTree.prototype.queryListTreeByPid = function(pid, listData){
        var _this = this;
        var rootListData = [];
        if (listData) {
            for (var i = 0; i < listData.length; i++) {
                var data = listData[i];
                if(typeof data !== "object") continue;
                if(pid == "null" || pid == null){
                    if(data[_this.response.parentId] == null) { rootListData.push(data); }
                } else {
                    if (data[_this.response.parentId] == pid){
                        if (data[_this.response.treeId] == pid){
                            _this.errData.push(data);
                        } else {
                            rootListData.push(data);
                        }
                    }
                }
            }
        }
        return rootListData;
    };

    // 初始化树或者拼接树
    DTree.prototype.loadTree = function(root, level, $ul){
        var _this = this;
        if (root) {
            $ul = $ul || _this.getNodeDom().nowOrRootUl();	//当前选中的节点或根节点
            for (var i = 0; i < root.length; i++) {	// 遍历跟节点或追加的跟节点
                var data = root[i];
                if(typeof data !== "object") continue;
                if(data[_this.response.treeId] == data[_this.response.parentId]) { _this.errData.push(data); }
                var parseData = _this.parseData(data);
                var children = parseData.children();
                $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(children.length), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(level), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), ($ul.hasClass(UL_ROOT) ? "root" : "item")));
                if (children.length != 0) {
                    var cLevel = parseInt(level)+1;
                    _this.loadTree(children, cLevel, _this.obj.find("ul[data-id='"+parseData.treeId()+"']"));
                }
            }
        }
    };

    // 判断在数据加载时是否存在错误数据，并是否打印错误数据
    DTree.prototype.msgErrData = function() {
        var _this = this;
        if(_this.errData.length > 0 && _this.errDataShow) {
            var title = "";
            for(var i=0; i<_this.errData.length; i++) {
                var edata = _this.errData[i];
                title += "数据：【"+edata[_this.response.title]+"】中节点id和上级id值一致！ \n";
            }
            layer.msg(title, {icon:2,time:5000});
        }
        // 显示之后，将错误数据制空
        _this.errData = [];
    };

    // 解析data数据
    DTree.prototype.parseData = function(data) {
        var _this = this;

        return {
            treeId: function(){
                return data[_this.response.treeId];
            },
            parentId: function(){
                return data[_this.response.parentId];
            },
            fmtTitle: function(){
                if(typeof _this.formatter.title === 'function'){
                    var ftitle = _this.formatter.title(data);
                    var tt = data[_this.response.title];
                    tt = (ftitle == "" || ftitle == undefined || ftitle == null) ? tt : ftitle;
                    return tt || "";
                }
                return data[_this.response.title];
            },
            title: function(){
                return data[_this.response.title];
            },
            level: function(){
                return data[_this.response.level] || "";
            },
            ficonClass: function(){
                return data[_this.response.ficonClass] || "";
            },
            iconClass: function(){
                return data[_this.response.iconClass] || "";
            },
            last: function(len){
                return ((len == 0) ?
                    ((typeof (data[_this.response.last]) === "boolean") ? data[_this.response.last] : true) :
                    ((typeof (data[_this.response.last]) === "boolean") ? data[_this.response.last] : false));
            },
            spread: function(level){
                return ((level < _this.initLevel) ?
                    ((typeof (data[_this.response.spread]) === "boolean") ? data[_this.response.spread] : true) :
                    ((typeof (data[_this.response.spread]) === "boolean") ? data[_this.response.spread] : false));
            },
            disabled: function(){
                return (typeof (data[_this.response.disabled]) === "boolean") ? data[_this.response.disabled] : false;
            },
            hide: function(){
                return (typeof (data[_this.response.hide]) === "boolean") ? data[_this.response.hide] : false;
            },
            checkArr: function(){
                var checkArr = [];
                var checkArrData = data[_this.response.checkArr];
                if(typeof checkArrData === 'string'){
                    if(checkArrData.indexOf("{") > -1 && checkArrData.indexOf("}") > -1){
                        checkArrData = JSON.parse(checkArrData);
                    } else {
                        checkArrData = {"type":"0","checked":checkArrData};
                    }
                }
                if(typeof checkArrData === 'object'){
                    if(typeof checkArrData.length === 'undefined'){
                        checkArr.push(checkArrData);
                    } else {
                        checkArr = checkArrData;
                    }
                }

                if(checkArr.length > 0 && checkArr.length > _this.checkArrLen){
                    _this.checkArrLen = checkArr.length;		// 获取复选框个数
                }
                return checkArr;

            },
            children: function(){
                return data[_this.response.childName] || [];
            },
            basicData: function(){
                return event.escape(JSON.stringify(data[_this.response.basicData])) || JSON.stringify({});
            },
            recordData: function(){
                var recordData = _this.record ? event.cloneObj(data, [_this.response.treeId,
                    _this.response.parentId,
                    _this.response.title,
                    _this.response.iconClass,
                    _this.response.childName,
                    _this.response.last,
                    _this.response.spread,
                    _this.response.disabled,
                    _this.response.hide,
                    _this.response.checkArr,
                    _this.response.checked,
                    _this.response.type,
                    _this.response.basicData]) : {};

                return event.escape(JSON.stringify(recordData));
            },
            data: function(){
                return data;
            }
        }

    };

    //当无节点数据时显示dom
    DTree.prototype.getNoneDom = function(){
        var _this = this,
            rootId = _this.obj[0].id,
            noneTitle = _this.none;

        return {
            text: function(){
                return "<div class='"+NONETITLE+"' dtree-id='"+rootId+"'>"+noneTitle+"</div>";
            },
            errText: function(errInfo){
                return "<div class='"+NONETITLE+"' dtree-id='"+rootId+"'>"+errInfo+"</div>";
            }
        }
    };

    //新增节点的dom值
    DTree.prototype.getDom = function(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide) {
        var _this = this,
            rootId = _this.obj[0].id,
            toolbar = _this.toolbar,
            checkbar = _this.checkbar;

        return {
            fnode: function() {	// + - 图标
                // 获取图标的变量
                var fnodeIcon = _this.fnodeIcon,
                    fleafIcon = _this.fleafIcon;

                var fleafIconLeaf = _this.usefontStyle.fnode.leaf,
                    fnodeIconOpen =  _this.usefontStyle.fnode.node.open,
                    fnodeIconClose =  _this.usefontStyle.fnode.node.close;

                if(ficonClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        fleafIconLeaf = iconfont + " " + ficonClass;
                        fnodeIconOpen = iconfont + " " + ficonClass;
                        fnodeIconClose = iconfont + " " + ficonClass;
                    } else {
                        fleafIconLeaf = iconfont[0] + " " + ficonClass;
                        fnodeIconOpen = iconfont[0] + " " + ficonClass;
                        fnodeIconClose = iconfont[0] + " " + ficonClass;
                    }
                }

                if(fnodeIcon != "-1" && fleafIcon != "-1"){	// 都加载
                    return last ? "<i class='"+fleafIconLeaf+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon != "-1" && fleafIcon == "-1"){	// 加载node 隐藏leaf
                    return last ? "<i class='"+fleafIconLeaf+" "+ICON_HIDE+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon == "-1" && fleafIcon != "-1"){	// 隐藏node 加载leaf
                    return last ? "<i class='"+fleafIconLeaf+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon == "-1" && fleafIcon == "-1"){	// 都隐藏
                    return last ? "<i class='"+fleafIconLeaf+" "+ICON_HIDE+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' style='display:none;'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }
            },
            node: function() {	// 二级图标样式
                // 获取图标的变量
                var nodeIcon = _this.nodeIcon,
                    leafIcon = _this.leafIcon;

                var sleafIconLeaf = _this.usefontStyle.snode.leaf,
                    snodeIconOpen =  _this.usefontStyle.snode.node.open,
                    snodeIconClose =  _this.usefontStyle.snode.node.close;
                if(iconClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        sleafIconLeaf = iconfont + " " + iconClass;
                        snodeIconOpen = iconfont + " " + iconClass;
                        snodeIconClose = iconfont + " " + iconClass;
                    } else {
                        sleafIconLeaf = iconfont[0] + " " + iconClass;
                        snodeIconOpen = iconfont[0] + " " + iconClass;
                        snodeIconClose = iconfont[0] + " " + iconClass;
                    }
                }

                if(nodeIcon != "-1" && leafIcon != "-1"){	// 都加载
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon != "-1" && leafIcon == "-1"){	// 加载node 隐藏leaf
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon == "-1" && leafIcon != "-1"){	// 隐藏node 加载leaf
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隐藏
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }
            },
            checkbox: function() {	// 复选框
                var flag = false;
                if(_this.checkbarLoad == "node"){if (checkbar) {flag = true;}} else {if (last) {if (checkbar) {flag = true;}}}

                if(flag){
                    var result = "<div class='"+LI_DIV_CHECKBAR+"' data-id='"+treeId+"' dtree-id='"+rootId+"'>";
                    if(checkArr && checkArr.length > 0){

                        for (var i = 0; i < checkArr.length; i++) {
                            var checkData = checkArr[i];
                            var checked = checkData.checked;
                            var CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            if (checked == "2") {	//半选择
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.noall + " " + _this.style.chs;
                            } else if (checked == "1") {	//选择
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.on + " " + _this.style.chs;
                            } else {	//未选择或者无值
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            }
                            var disClass = "";
                            if(disabled){disClass = NAV_DIS;}
                            result += "<i class='"+CHOOSE_CLASS+" "+_this.style.dfont+" "+_this.style.cbox+" "+disClass+"' data-id='"+treeId+"' dtree-id='"+rootId+"' data-checked='"+checkData.checked+"' data-initchecked='"+checkData.checked+"' data-type='"+checkData.type+"' dtree-click='"+eventName.checkNodeClick+"' data-par='."+LI_CLICK_CHECKBAR+"' dtree-disabled='"+disabled+"'></i>";
                        }
                    }
                    result += "</div>";
                    return result;
                }

                return "";
            },
            text: function() {	// 文字显示
                var disClass = "";
                if(disabled){disClass = NAV_DIS;}
                return "<cite class='"+LI_DIV_TEXT_CLASS+" "+disClass+"' data-id='"+treeId+"' data-leaf='"+(last ? "leaf" : "node")+"' dtree-disabled='"+disabled+"' data-title='"+title+"' >"+fmtTitle+"</cite>";
            },
            ul: function() {	//子节点ul
                return last ? "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" :
                    (spread ? "<ul class='"+LI_NAV_CHILD+" "+NAV_SHOW+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" : "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>");
            }
        };
    };

    //替换节点的dom值，或指定值
    DTree.prototype.replaceDom = function($div, treeId, last, spread, disabled, hide) {
        var _this = this,
            rootId = _this.obj[0].id,
            toolbar = _this.toolbar,
            checkbar = _this.checkbar;

        return {
            fnode: function(ficonClass) {	// + - 图标
                var fnode = "";

                // 获取图标的变量
                var fnodeIcon = _this.fnodeIcon,
                    fleafIcon = _this.fleafIcon;

                var fleafIconLeaf = _this.usefontStyle.fnode.leaf,
                    fnodeIconOpen =  _this.usefontStyle.fnode.node.open,
                    fnodeIconClose =  _this.usefontStyle.fnode.node.close;

                if(ficonClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        fleafIconLeaf = iconfont + " " + ficonClass;
                        fnodeIconOpen = iconfont + " " + ficonClass;
                        fnodeIconClose = iconfont + " " + ficonClass;
                    } else {
                        fleafIconLeaf = iconfont[0] + " " + ficonClass;
                        fnodeIconOpen = iconfont[0] + " " + ficonClass;
                        fnodeIconClose = iconfont[0] + " " + ficonClass;
                    }
                }

                if(fnodeIcon != "-1" && leafIcon != "-1"){	// 都加载
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon != "-1" && leafIcon == "-1"){	// 加载node 隐藏leaf
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon != "-1"){	// 隐藏node 加载leaf
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隐藏
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }
                if(fnode != ""){_this.getNodeDom($div).fnode().replaceWith($(fnode));}
            },
            node: function(iconClass) {	// 二级图标样式
                var snode = "";

                // 获取图标的变量
                var nodeIcon = _this.nodeIcon,
                    leafIcon = _this.leafIcon;

                var sleafIconLeaf = _this.usefontStyle.snode.leaf,
                    snodeIconOpen =  _this.usefontStyle.snode.node.open,
                    snodeIconClose =  _this.usefontStyle.snode.node.close;
                if(iconClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        sleafIconLeaf = iconfont + " " + iconClass;
                        snodeIconOpen = iconfont + " " + iconClass;
                        snodeIconClose = iconfont + " " + iconClass;
                    } else {
                        sleafIconLeaf = iconfont[0] + " " + iconClass;
                        snodeIconOpen = iconfont[0] + " " + iconClass;
                        snodeIconClose = iconfont[0] + " " + iconClass;
                    }
                }

                if(nodeIcon != "-1" && leafIcon != "-1"){	// 都加载
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon != "-1" && leafIcon == "-1"){	// 加载node 隐藏leaf
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon != "-1"){	// 隐藏node 加载leaf
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隐藏
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }
                if(snode != ""){_this.getNodeDom($div).snode().replaceWith($(snode));}
            },
            checkbox: function(checkArr) {	// 复选框
                var flag = false;
                if(_this.checkbarLoad == "node"){if (checkbar) {flag = true;}} else {if (last) {if (checkbar) {flag = true;}}}

                if(flag){
                    var result = "<div class='"+LI_DIV_CHECKBAR+"' data-id='"+treeId+"' dtree-id='"+rootId+"'>";
                    if(checkArr && checkArr.length > 0){

                        for (var i = 0; i < checkArr.length; i++) {
                            var checkData = checkArr[i];
                            var checked = checkData.checked;
                            var CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            if (checked == "2") {	//半选择
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.noall + " " + _this.style.chs;
                            } else if (checked == "1") {	//选择
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.on + " " + _this.style.chs;
                            } else {	//未选择或者无值
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            }
                            var disClass = "";
                            if(disabled){disClass = NAV_DIS;}
                            result += "<i class='"+CHOOSE_CLASS+" "+_this.style.dfont+" "+_this.style.cbox+" "+disClass+"' data-id='"+treeId+"' dtree-id='"+rootId+"' data-checked='"+checkData.checked+"' data-initchecked='"+checkData.checked+"' data-type='"+checkData.type+"' dtree-click='"+eventName.checkNodeClick+"' data-par='."+LI_CLICK_CHECKBAR+"' dtree-disabled='"+disabled+"'></i>";
                        }
                    }
                    result += "</div>";
                    _this.getNodeDom($div).snode().next("div").replaceWith($(result));
                }
            },
            text: function(title) {	// 文字显示
                var disClass = "";
                if(disabled){disClass = NAV_DIS;}
                var cite = "<cite class='"+LI_DIV_TEXT_CLASS+" "+disClass+"' data-id='"+treeId+"' data-leaf='"+(last ? "leaf" : "node")+"' dtree-disabled='"+disabled+"' >"+title+"</cite>"
                _this.getNodeDom($div).cite().replaceWith($(cite));
            },
            ul: function() {	//子节点ul
                var ul = last ? "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" :
                    (spread ? "<ul class='"+LI_NAV_CHILD+" "+NAV_SHOW+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" : "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>");
                _this.getNodeDom($div).nextUl().replaceWith($(ul));
            },
            div: function(){
                $div.attr("data-id", treeId);
            },
            basicData: function(basicData){
                basicData = (basicData == "{}") ? "" : basicData;
                $div.attr("data-basic", basicData);
            },
            recordData: function(recordData){
                recordData = (recordData == "{}") ? "" : recordData;
                $div.attr("data-record", recordData);
            },
            p_li: function(pId){
            	var $li = $div.parent("li");
            	$li.attr("data-id", treeId);
                if(pId) {
                	$li.attr("data-pid", pId);
                }
                return $li;
            }
        };

    };

    // 获取拼接好的li
    DTree.prototype.getLiItemDom =  function(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide, basicData, recordData, flag) {
        var _this = this,
            rootId = _this.obj[0].id;

        var dom = _this.getDom(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide);
        basicData = (basicData == "{}") ? "" : basicData;
        recordData = (recordData == "{}") ? "" : recordData;
        var div = "<div class='"+LI_DIV_ITEM+" "+_this.style.item+"' data-id='"+treeId+"' dtree-id='"+rootId+"' dtree-click='"+eventName.itemNodeClick+"' data-basic='"+basicData+"' data-record='"+recordData+"' dtree-disabled='"+disabled+"' dtree-hide='"+hide+"' ";
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                if(_this.toolbarLoad == "node") { div += " d-contextmenu='true'>"; }
                if(_this.toolbarLoad == "noleaf") { if(!last){ div += " d-contextmenu='true'>"; } else { div += " d-contextmenu='false'>";} }
                if(_this.toolbarLoad == "leaf") { if(last){ div += " d-contextmenu='true'>"; } else { div += " d-contextmenu='false'>";} }
            } else { div += " d-contextmenu='false'>"; }
        } else { div += " d-contextmenu='false'>"; }

        var hideClass = "";
        var lineClass = "";
        if(hide){hideClass = NAV_HIDE;}
        var li = ["<li " + "class='"+LI_CLICK_CHECKBAR+" "+LI_NAV_ITEM+" "+hideClass+" "+lineClass+"'" + "data-id='"+treeId+"'" + "data-pid='"+(flag == "root" ? ((typeof parentId !== undefined && parentId != "") ? parentId : "-1") : parentId)+"'" + "dtree-id='"+rootId+"'" + "data-index='"+level+"'" + "dtree-hide='"+hide+"'" +">" +
        div ,
            dom.fnode(),
            dom.node(),
            dom.checkbox(),
            dom.text(),
            "</div>", dom.ul(), "</li>"].join("");

        return li;
    };

    // 初始化节点，用于数据回显
    DTree.prototype.dataInit = function(chooseId){
        var _this = this;
        var $div = _this.obj.find("div[data-id='"+chooseId+"']");
        _this.getNodeDom($div).parentLi().find("."+NAV_THIS).removeClass(NAV_THIS);
        _this.getNodeDom($div).parentLi().find("."+_this.style.itemThis).removeClass(_this.style.itemThis);
        $div.addClass(NAV_THIS);
        $div.addClass(_this.style.itemThis);
        _this.setNodeParam($div);
        // 将该节点的父节点全部展开
        var $li_parents = $div.parents("."+LI_NAV_ITEM);
        $li_parents.children("ul").addClass(NAV_SHOW);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).addClass(_this.usefontStyle.fnode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).removeClass(_this.usefontStyle.fnode.node.close);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).addClass(_this.usefontStyle.snode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).removeClass(_this.usefontStyle.snode.node.close);
        return _this.getNowParam();
    };
    
    // 基于备份的Html数据回滚
    DTree.prototype.rollbackHtml = function(chooseId){
    	var _this = this;
    	if(_this.bak) {
    		_this.obj.html(_this.bak);
    		// 取消全部选中状态
    		_this.cancelNavThis();
    		if(_this.checkbar) {
    			_this.cancelCheckedNode();
    			_this.chooseDataInit(chooseId);
    		} else {
    			_this.dataInit(chooseId);
    		}
    		
    		_this.bak = _this.obj.html();
    	}
    };

    
    /******************** 基础事件区域 ********************/
    // 数据格式化
    DTree.prototype.escape = function(html){
        return event.escape(html);
    };

    // 格式化数据转回正常数据
    DTree.prototype.unescape = function(str){
        return event.unescape(str);
    };

    // 取消选中div
    DTree.prototype.cancelNavThis = function(){
        var _this = this;
        _this.obj.find("div[data-id]").parent().find("."+NAV_THIS).removeClass(NAV_THIS);
        _this.obj.find("div[data-id]").parent().find("."+_this.style.itemThis).removeClass(_this.style.itemThis);
    }

    // 选中div
    DTree.prototype.navThis = function(id){
        var _this = this;
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null) {
            _this.cancelNavThis();
            $div.addClass(NAV_THIS);
            $div.addClass(_this.style.itemThis);
        }
    }

    // 手风琴模式操作其他节点
    DTree.prototype.accordionUL = function($ul) {
        var _this = this;
        if(_this.accordion) {
            $ul.closest("li[data-index]").siblings("li[data-index]").children("ul[data-id]").removeClass(NAV_SHOW);
            var $divs = $ul.closest("li[data-index]").siblings("li[data-index]").children("ul[data-id]").prev("div");
            if($divs.length && $divs.length > 0) {
                for (var i=0; i<$divs.length; i++) {
                    var $div = $($divs[i]);
                    var $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode();
                    if($i_spread.attr("data-spread") != 'last'){
                        _this.operateIcon($i_spread, $i_node).close();
                    }
                }
            }

        }
    };

    // 展开或隐藏节点  作用点： div
    DTree.prototype.clickSpread = function($div) {
        var _this = this;
        var $i_spread = _this.getNodeDom($div).fnode(),
            $i_node = _this.getNodeDom($div).snode(),
            $cite = _this.getNodeDom($div).cite(),
            spread = $i_spread.attr("data-spread"),
            $ul = $div.next("ul");

        if ($ul.length > 0) {
            if (spread == "close") {
                if (_this.type=="load") {	//增加加载
                    if (_this.cache) {	//开启缓存
                        if ($ul.html()) {
                            $ul.addClass(NAV_SHOW);
                            _this.accordionUL($ul);
                        } else {	//加载节点
                            _this.getChild($div);
                            _this.accordionUL($ul);
                        }
                    }else {	//每次取新的数据
                        $ul.html("");
                        _this.getChild($div);
                        _this.accordionUL($ul);
                    }
                } else {	// 全量加载
                    $ul.addClass(NAV_SHOW);
                    _this.accordionUL($ul);
                }
                _this.operateIcon($i_spread, $i_node).open();
            } else if (spread == "open") {
                $ul.removeClass(NAV_SHOW);
                _this.operateIcon($i_spread, $i_node).close();
            }
        }
    };

    // 设置节点为disabled
    DTree.prototype.setDisabledNodes = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
            var $cite = $div.children("cite[data-leaf]");
            if($div != null && $div.attr("dtree-disabled") != "true") {
                $div.attr("dtree-disabled", "true");
                $i.attr("dtree-disabled", "true");
                $i.addClass(NAV_DIS);
                $cite.attr("dtree-disabled", "true");
                $cite.addClass(NAV_DIS);
            }
        }
    };
    
    // 设置全部节点为disabled
    DTree.prototype.setDisabledAllNodes = function(){
    	var _this = this;
    	_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"']").each(function(){
    		var $div = $(this);
    		var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
    		var $cite = $div.children("cite[data-leaf]");
    		if($div != null && $div.attr("dtree-disabled") != "true") {
    			$div.attr("dtree-disabled", "true");
    			$i.attr("dtree-disabled", "true");
    			$i.addClass(NAV_DIS);
    			$cite.attr("dtree-disabled", "true");
    			$cite.addClass(NAV_DIS);
    		}
    	});
    };

    // 将节点的disabled取消
    DTree.prototype.cancelDisabledNodes = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
            var $cite = $div.children("cite[data-leaf]");
            if($div != null && $div.attr("dtree-disabled") == "true") {
                $div.attr("dtree-disabled", "false");
                $i.attr("dtree-disabled", "false");
                $i.removeClass(NAV_DIS);
                $cite.attr("dtree-disabled", "false");
                $cite.removeClass(NAV_DIS);
            }
        }
    };

    // 获取指定disabled节点的值
    DTree.prototype.getDisabledNodesParam = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        var disabledNodes = [];
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            if($div != null && $div.attr("dtree-disabled") == "true") {
                disabledNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
            }
        }
        return disabledNodes;
    };

    // 获取全部disabled节点的值
    DTree.prototype.getAllDisabledNodesParam = function(){
        var _this = this;
        var disabledNodes = [];
        _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='true']").each(function(){
            var $div = $(this);
            disabledNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
        });
        return disabledNodes;
    };

    // 设置节点为hide
    DTree.prototype.setHideNodes = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            var $li = $div.parent("li[dtree-hide]");
            if($div != null && $div.attr("dtree-hide") != "true") {
                $div.attr("dtree-hide", "true");
                $li.attr("dtree-hide", "true");
                $li.addClass(NAV_HIDE);
            }
        }
    };
    // 将节点的hide取消
    DTree.prototype.cancelHideNodes = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            var $li = $div.parent("li[dtree-hide]");
            if($div != null && $div.attr("dtree-hide") == "true") {
                $div.attr("dtree-hide", "false");
                $li.attr("dtree-hide", "false");
                $li.removeClass(NAV_HIDE);
            }
        }
    };

    // 获取指定hide节点的值
    DTree.prototype.getHideNodesParam = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        var hideNodes = [];
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            if($div != null && $div.attr("dtree-hide") == "true") {
                hideNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
            }
        }
        return hideNodes;
    };

    // 获取全部hide节点的值
    DTree.prototype.getAllHideNodesParam = function(){
        var _this = this;
        var hideNodes = [];
        _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-hide='true']").each(function(){
            var $div = $(this);
            hideNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
        });
        return hideNodes;
    };

    // 刷新树
    DTree.prototype.refreshTree = function(){
        var _this = this;
        _this.obj.html("");	// 清空树结构
        _this.initNodeParam(); // 清空参数
        _this.init(); //执行初始化方法
    }

    // 局部刷新树--新增子节点时
    DTree.prototype.partialRefreshAdd = function($div, data){
        var _this = this;
        $ul = $div.next("ul");

        // 判断当前点击的节点是否是最后一级节点，如果是，则需要修改节点的样式
        var $icon_i = $div.find("i[data-spread]");
        if ($icon_i.eq(0).attr("data-spread") == "last") {
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
        } else {	//如果不是，也要修改节点样式
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).open();
        }
        $ul.addClass(NAV_SHOW);	//展开UL
        _this.accordionUL($ul);

        if(data) {
            if(data.length && data.length > 0) {
                _this.getChild($div, data);
            } else {
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var level = parseInt($div.parent("li").attr("data-index"))+1;
                    $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(0), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), "item"));

                    // 建造完毕后，选中该DIV
                    $thisDiv = $ul.find("div[data-id='"+parseData.treeId()+"']");
                    _this.setNodeParam($thisDiv);

                    _this.showLine($ul.find("li"));
                } else {
                    layer.msg("添加失败,节点ID为undefined！",{icon:5});
                    // 重新赋值
                    _this.setNodeParam($div);
                }
            }
        } else {
            _this.getChild($div);
        }
    }

    // 局部刷新树--编辑当前节点选中节点时
    DTree.prototype.partialRefreshEdit = function($div, data){
        var _this = this;
        $ul = $div.next("ul"),
        $p_li = $div.parent("li");

        if(data) {
            if(typeof data === 'object') {
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var replaceDom = _this.replaceDom($div, parseData.treeId(), parseData.last(0), parseData.spread(), parseData.disabled(), parseData.hide());
                    replaceDom.div();
                    replaceDom.node(parseData.iconClass());
                    replaceDom.checkbox(parseData.checkArr());
                    replaceDom.text(parseData.title());
                    replaceDom.ul();
                    replaceDom.basicData(parseData.basicData());
                    replaceDom.recordData(parseData.recordData());
                    
                    var parentId = parseData.parentId();
                    var oldParentId = $p_li.attr("data-pid");
                    if(parentId && parentId != oldParentId) {
                    	// 变更了父节点
                    	$p_li = replaceDom.p_li(parentId);
                    	
                    	// 根据parentId找到下挂节点的ul
                    	var $goto_div = _this.getNodeDom(parentId).div(), 
                    		$goto_ul = _this.getNodeDom(parentId).nextUl();
                    	// 判断父级ul中是否还存在li,如果不存在，则需要修改节点的样式
                        if($goto_ul.children("li").length == 0){
                            var $icon_i = $goto_div.find("i[data-spread]");
                            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
                            $goto_ul.addClass(NAV_SHOW);
                        }
                    	$goto_ul.append($p_li);
                    } else {
                    	replaceDom.p_li();
                    }
                    _this.setNodeParam($div);
                } else {
                    layer.msg("编辑失败,节点ID为undefined！",{icon:5});
                    // 重新赋值
                    _this.setNodeParam($div);
                }
            } else {
                _this.getNodeDom($div).cite().html(data);
            }
        }
    }

    // 局部刷新树--当前节点选中被删除时
    DTree.prototype.partialRefreshDel = function($div){
        var _this = this;
        $p_li = $div.parent("li");
        $p_ul = _this.getNodeDom($div).parentUl();
        $p_div = _this.getNodeDom($div).parentDiv();

        $p_li.remove();
        _this.showLine($p_ul.find("li"));
        // 判断父级ul中是否还存在li,如果不存在，则需要修改节点的样式
        if($p_ul.children("li").length == 0){
            var $icon_i = $p_div.find("i[data-spread]");
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).closeWithLeaf();
        }
        _this.initNodeParam();
    }

    /******************** 复选框区域 ********************/
    // 初始化复选框的值
    DTree.prototype.chooseDataInit = function(chooseIds){
        var _this = this;
        var chooseId = chooseIds.split(",");
        for (var i=0; i<chooseId.length; i++) {
            _this.obj.find("i[dtree-click='"+eventName.checkNodeClick+"']").each(function(){
                if ($(this).attr("data-id") == chooseId[i]) {
                    _this.checkStatus($(this)).check();
                }
            });
        }
        // 展开选中节点的父节点
        var $li_parents = _this.obj.find("i[dtree-click='"+eventName.checkNodeClick+"'][data-checked='1']").parents("."+LI_NAV_ITEM);
        $li_parents.children("ul").addClass(NAV_SHOW);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).addClass(_this.usefontStyle.fnode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).removeClass(_this.usefontStyle.fnode.node.close);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).addClass(_this.usefontStyle.snode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).removeClass(_this.usefontStyle.snode.node.close);
        return _this.getCheckbarNodesParam();
    };

    //实现复选框点击，子集选中父级也选中
    DTree.prototype.checkAllOrNot =  function($i) {
        var _this = this;
        //$i 当前点击的checkbox
        var dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//当前checkbox的上级li节点
            $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
            $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

        if ($i.attr("data-checked") == "1") {
            // 处理当前节点的选中状态
            _this.checkStatus($i).noCheck();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

            // 处理父级节点的选中状态
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                if (flag == 0) {
                    //把父级去掉选中
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    _this.checkStatus($item_i).noCheck();
                }
            }
        } else {
            // 处理当前节点的选中状态
            _this.checkStatus($i).check();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();

            // 处理父级节点的选中状态
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                //把父级选中
                _this.checkStatus($item_i).check();
            }
        }
    };

    //实现复选框点击， no-all 子集选中父级半选中，子集全选父级选中
    DTree.prototype.checkAllOrNoallOrNot =  function($i) {
        var _this = this;
        //$i 当前点击的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//当前checkbox的上级li节点
            $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
            $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

        if ($i.attr("data-checked") == "1") {	//当前复选框为选中状态，点击后变为未选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).noCheck();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

            // 处理父级节点的选中状态
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                if (flag == 0) {
                    //把父级去掉选中
                    _this.checkStatus($item_i).noCheck();
                } else {
                    //把父级半选
                    _this.checkStatus($item_i).noallCheck();
                }
            }
        } else {		//当前复选框为未选中状态，点击后变为选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).check();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();

            // 处理父级节点的选中状态
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag1 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                var flag2 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']").length;
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                if (flag1 != flag2) {
                    // 父级复选框半选
                    _this.checkStatus($item_i).noallCheck();
                } else {
                    // 父级复选框全选
                    _this.checkStatus($item_i).check();
                }
            }
        }
    };

    //实现复选框点击，p-casc：父级选中子集全选，子集无法改变父级选中状态
    DTree.prototype.checkAllOrPcascOrNot = function($i) {
        var _this = this;
        //$i 当前点击的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//当前checkbox的上级li节点
            $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
            $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

        if ($i.attr("data-checked") == "1") {	//当前复选框为选中状态，点击后变为未选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).noCheck();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

        } else {		//当前复选框为未选中状态，点击后变为选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).check();

            // 处理子级节点的选中状态
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();
        }
    };

    //实现复选框点击，self：各自选中互不影响
    DTree.prototype.checkOrNot = function($i) {
        var _this = this;
        //$i 当前点击的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//当前checkbox的上级li节点
            $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
            $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

        if ($i.attr("data-checked") == "1") {	//当前复选框为选中状态，点击后变为未选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).noCheck();
        } else {		//当前复选框为未选中状态，点击后变为选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).check();
        }
    };

    //实现复选框点击，only：只能选中1个复选框
    DTree.prototype.checkOnly = function($i) {
        var _this = this;
        //$i 当前点击的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//当前checkbox的上级li节点
            $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
            $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

        var checked = $i.attr("data-checked");
        // 将全部节点全部设为未选中状态
        var $all_i = _this.obj.find("i[data-checked]");
        _this.checkStatus($all_i).noCheck();

        if (checked != "1") {	//当前复选框为未选中状态，点击后变为选中状态
            // 处理当前节点的选中状态
            _this.checkStatus($i).check();
        }
    };

    //实现复选框点击
    DTree.prototype.changeCheck = function($i) {
        var _this = this;
        var temp = _this.temp;
        if(typeof $i === 'undefined') {
            $i = temp[0];
        }
        // 复选框选中事件
        if (_this.checkbarType == "all") {
            _this.checkAllOrNot($i);
        } else if(_this.checkbarType == "no-all") {
            _this.checkAllOrNoallOrNot($i);
        } else if(_this.checkbarType == "p-casc") {
            _this.checkAllOrPcascOrNot($i);
        } else if(_this.checkbarType == "self") {
            _this.checkOrNot($i);
        } else if(_this.checkbarType == "only") {
            _this.checkOnly($i);
        } else {
            _this.checkAllOrNot($i);
        }

        if(_this.select) {
        	// 设置复选框模式中的下拉树的值
        	_this.selectCheckboxVal();
        }
        
        // 获取复选框选中节点的内容
        var checkbarNodes = _this.setAndGetCheckbarNodesParam(true);
        
        // 用户自定义想做的事情
        _this.checkbarFun.chooseDone(checkbarNodes);
        layui.event.call(this, MOD_NAME, "chooseDone("+$(_this.obj)[0].id+")", {"checkbarParams": checkbarNodes});
        _this.temp = [];
    };

    //复选框半选状态初始化设置
    DTree.prototype.initNoAllCheck = function(){
        var _this = this;
        //1.获取所有选中节点
        var $is = _this.obj.find("i[data-checked='1']");
        if($is.length > 0){
            for ( var key = 0; key < $is.length; key++) {
                var $i = $($is[key]),
                    dataPar = $i.attr("data-par"),
                    dataType = $i.attr("data-type"),
                    $li = $i.closest(dataPar),		//当前checkbox的上级li节点
                    $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
                    $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

                // 处理父级节点的选中状态
                for (var i = 1, item = $parent_li; i < item.length; i++) {
                    var flag1 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                    var flag2 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']").length;
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    if (flag1 != flag2) {
                        // 父级复选框半选
                        _this.checkStatus($item_i).noallCheck();
                    } else {
                        // 父级复选框全选
                        _this.checkStatus($item_i).check();
                    }
                }
            }
        }
    };

    //复选框选中状态初始化设置
    DTree.prototype.initAllCheck = function(){
        var _this = this;
        //1.获取所有选中节点
        var $is = _this.obj.find("i[data-checked='1']");
        if($is.length > 0){
            for ( var key = 0; key < $is.length; key++) {
                var $i = $($is[key]),
                    dataPar = $i.attr("data-par"),
                    dataType = $i.attr("data-type"),
                    $li = $i.closest(dataPar),		//当前checkbox的上级li节点
                    $parent_li = $i.parents(dataPar),		//当前checkbox的所有父级li节点
                    $child_li = $li.find(dataPar);	//当前checkbox的上级li节点下的所有子级li节点

                // 处理父级节点的选中状态
                for (var i = 1, item = $parent_li; i < item.length; i++) {
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    // 父级复选框全选
                    _this.checkStatus($item_i).check();
                }
            }
        }
    };

    // 设置复选框选中/未选中/半选  _this.checkStatus($i).check();  _this.checkStatus($i).noCheck();   _this.checkStatus($i).noallCheck();
    DTree.prototype.checkStatus = function($i) {
        var _this = this;
        return {
            check: function(){
                $i.removeClass(_this.usefontStyle.checkbox.out);
                $i.removeClass(_this.usefontStyle.checkbox.noall);
                $i.addClass(_this.usefontStyle.checkbox.on);
                $i.addClass(_this.style.chs);
                $i.attr("data-checked","1");
            },
            noCheck: function(){
                $i.removeClass(_this.usefontStyle.checkbox.noall);
                $i.removeClass(_this.usefontStyle.checkbox.on);
                $i.removeClass(_this.style.chs);
                $i.addClass(_this.usefontStyle.checkbox.out);
                $i.attr("data-checked","0");
            },
            noallCheck: function(){
                $i.removeClass(_this.usefontStyle.checkbox.out);
                $i.removeClass(_this.usefontStyle.checkbox.on);
                $i.addClass(_this.usefontStyle.checkbox.noall);
                $i.addClass(_this.style.chs);
                $i.attr("data-checked","2");
            }
        }
    };

    // 设置树的复选框操作值的全部参数,并获取
    DTree.prototype.setAndGetCheckbarNodesParam = function(requestParamFlag) {
        var _this = this;
        //操作前先清空
        _this.checkbarNode = [];
        // 选择所有复选框节点
        if (_this.checkbarData == "change"){	//记录变更数据
            _this.obj.find("i[data-par][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if ($i.attr("data-checked") != $i.attr("data-initchecked")) {
                	if(requestParamFlag) {
                		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
                	} else {
                		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
                	}
                }
            });
        } else if (_this.checkbarData == "all"){	//记录全部数据
            _this.obj.find("i[data-par][data-checked][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        } else if (_this.checkbarData == "choose"){	//记录选中数据
            _this.obj.find("i[data-par][data-checked='1'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        } else if (_this.checkbarData == "halfChoose"){	//记录选中和半选数据
            _this.obj.find("i[data-par][data-checked='1'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
            _this.obj.find("i[data-par][data-checked='2'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        }
        return _this.checkbarNode;
    };

    // 获取树的复选框操作值的全部参数
    DTree.prototype.getCheckbarNodesParam = function() {
        var _this = this;
        return _this.setAndGetCheckbarNodesParam(true);
    };

    // 获取树的一个复选框的参数
    DTree.prototype.getCheckbarNodeParam = function($div, $i){
        var _this = this;
        var temp_node = {};
        temp_node.nodeId = $div.attr("data-id");
        temp_node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        temp_node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        temp_node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        temp_node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        temp_node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;
        
        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        temp_node.basicData = basicData;
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        temp_node.recordData = recordData;
        
        temp_node.dataType = $i.attr("data-type");
        temp_node.checked = $i.attr("data-checked");
        temp_node.initchecked = $i.attr("data-initchecked");
        return temp_node;
    };
    
    // 获取基于返回参数的树的复选框参数
    DTree.prototype.getCheckbarJsonArrParam = function(){
    	var _this = this;
    	var checkbarJsonArr = {
			nodeId: [],		//节点ID
            parentId: [],	//父节点ID
            context: [],	//节点内容
            leaf: [],		//是否叶子节点
            level: [],		//层级
            spread: [],		//节点展开状态
            dataType: [],	//节点标记
            checked: [],	//节点复选框选中状态
            initchecked: [],	//节点复选框初始状态
            basicData: [],		//用户自定义的记录节点数据
            recordData: [],		//当前data数据（排除basicData和children字段）
    	};
    	// 获取全部复选框选中节点
    	var params = _this.setAndGetCheckbarNodesParam(false);
    	if(params && params.length > 0) {
    		for(var i=0; i<params.length; i++) { 
    			var param = params[i];
    			console.log(param);
    			checkbarJsonArr["nodeId"].push(param["nodeId"]);
    			checkbarJsonArr["parentId"].push(param["parentId"]);
    			checkbarJsonArr["context"].push(param["context"]);
    			checkbarJsonArr["leaf"].push(param["leaf"]);
    			checkbarJsonArr["level"].push(param["level"]);
    			checkbarJsonArr["spread"].push(param["spread"]);
    			checkbarJsonArr["dataType"].push(param["dataType"]);
    			checkbarJsonArr["checked"].push(param["checked"]);
    			checkbarJsonArr["initchecked"].push(param["initchecked"]);
    			checkbarJsonArr["basicData"].push(param["basicData"]);
    			checkbarJsonArr["recordData"].push(param["recordData"]);
    		}
    	}
    	
    	checkbarJsonArr = _this.getRequestParam(checkbarJsonArr);
    	console.log(checkbarJsonArr);
    	return checkbarJsonArr;
    };

    //判断复选框是否发生变更
    DTree.prototype.changeCheckbarNodes = function(){
        var flag = false;
        var _this = this;
        _this.obj.find("i[data-par]").each(function(){
            var $i = $(this);
            $div = $i.closest("."+LI_DIV_ITEM);

            if ($i.attr("data-checked") != $i.attr("data-initchecked")) {
                flag = true;
                return true;
            }
        });
        return flag;
    };
    
    //点击节点选中/不选 复选框
    DTree.prototype.clickNodeCheckbar = function(nodeId){
    	var _this = this;
    	var $checkbar = _this.getNodeDom(nodeId).checkbox();
    	_this.temp = [$checkbar];
		_this.changeCheck();
    }
    
    //复选框全选
    DTree.prototype.checkAllNode = function(nodeId){
    	var _this = this;
    	 var $i = _this.obj.find("i[data-par][data-checked!='1']");
         if($i.length > 0) { _this.checkStatus($i).check(); }
    }
    
    //取消全部复选框选中
    DTree.prototype.cancelCheckedNode = function(nodeId){
    	var _this = this;
    	var $i = _this.obj.find("i[data-par][data-checked!='0']");
    	if($i.length > 0) { _this.checkStatus($i).noCheck(); }
    }
    
    //反选复选框
    DTree.prototype.invertCheckedNode = function(nodeId){
    	var _this = this;
    	if(_this.obj.find("i[data-par]").length > 0) {
            var b = false;
            _this.obj.find("i[data-par]").each(function(){
                var $i = $(this);
                if($i.attr("data-checked") == '2'){
                    b = true;
                }else if($i.attr("data-checked") == '0') {
                    _this.checkStatus($i).check();
                }else if($i.attr("data-checked") == '1') {
                    _this.checkStatus($i).noCheck();
                }
            });

            if(b) {
                _this.initNoAllCheck();
            } else {
                _this.initAllCheck();
            }
        }
    }
    
    //删除选中节点
    DTree.prototype.removeCheckedNode = function(nodeId){
    	var _this = this;
    	var len = _this.obj.find("i[data-par][data-checked='1']").length;
        if(len == 0){
            layer.msg("请至少选中一个节点",{icon:2});
        }else{
            //操作前先清空
            _this.checkbarNode = [];
            // 选择所有复选框节点
            var i_node = {};
            _this.obj.find("i[data-par][data-checked='1']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);

                _this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            });

            layer.confirm('确定要删除选中节点？', {icon: 3, title:'删除选中节点'}, function(index1){
                var flag = _this.menubarFun.remove(_this.checkbarNode);
                if(flag){
                    _this.obj.find("i[data-par][data-checked='1']").closest("."+LI_DIV_ITEM).next("ul").remove();
                    _this.obj.find("i[data-par][data-checked='1']").closest("."+LI_DIV_ITEM).remove();
                    _this.checkbarNode=[];
                }

                layer.close(index1);
            });
        }
    }

    /******************** 工具栏及菜单栏区域 ********************/
    // 初始化菜单栏和工具栏的div
    DTree.prototype.initTreePlus = function(){
        var _this = this;
        // 初始化菜单栏和工具栏的div
        _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).remove();
        _this.toolbarMenu = {};
        if(_this.menubar && _this.menubarTips.group && _this.menubarTips.group.length > 0) _this.obj.before("<div class='"+LI_DIV_MENUBAR+"' id='dtree_menubar_"+_this.obj[0].id+"'><div class='layui-btn-group'></div></div>");
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).remove();
                _this.obj.before("<div class='"+LI_DIV_TOOLBAR+" layui-nav' id='dtree_toolbar_"+_this.obj[0].id+"'><div class='layui-nav-item'><dl class='layui-nav-child layui-anim'></dl></div></div>");
            }
        }

    };

    // 开启工具栏和菜单栏
    DTree.prototype.openTreePlus = function(){
        var _this = this;
        // 先对工具栏做处理，因为菜单栏可能会与工具栏产生关联。
        var ggMenu = [];
        if(_this.toolbar) _this.getToolbarDom();

        if(_this.menubar) {
            var menubarTips = _this.menubarTips,
                mtbar = menubarTips.toolbar,
                group = menubarTips.group,
                freedom = menubarTips.freedom;
            if(mtbar && mtbar.length > 0){
                // 菜单栏吸附工具栏上
                for(var i=0; i<mtbar.length; i++){
                    var mt = mtbar[i];
                    if(typeof mt === 'string'){
                        _this.getMenubarToolDom(mt);
                    }
                    if(typeof mt === 'object'){
                        _this.getExtMenubarToolDom(mt);
                    }
                }
            }
            if(group && group.length > 0){
                // 菜单栏吸附在上方的按钮组div中
                for(var i=0; i<group.length; i++){
                    var gg = group[i];
                    if(typeof gg === 'string'){
                        ggMenu.push(_this.getMenubarDom(gg));
                    }
                    if(typeof gg === 'object'){
                        ggMenu.push(_this.getExtMenubarDom(gg));
                    }
                }
                _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).children('div.layui-btn-group').append(ggMenu.join(""));

            }
        }
    };


    /******************** 菜单栏区域 ********************/
    // 获取菜单栏
    DTree.prototype.getMenubarDom = function(menu){
        var _this = this;
        var rootId = _this.obj[0].id;
        var gg = "";
        switch (menu) {
            case defaultMenu.moveDown:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.moveDown+"' title='展开全部节点'><i class='"+_this.usefontStyle.menubar.movedown+"'></i></button>";
                break;
            case defaultMenu.moveUp:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.moveUp+"' title='收缩全部节点'><i class='"+_this.usefontStyle.menubar.moveup+"'></i></button>";
                break;
            case defaultMenu.refresh:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.refresh+"' title='刷新'><i class='"+_this.usefontStyle.menubar.refresh+"'></i></button>";
                break;
            case defaultMenu.checkAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.checkAll+"' title='全选节点'><i class='"+_this.usefontStyle.menubar.checkAll+"'></i></button>" : "";
                break;
            case defaultMenu.unCheckAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.unCheckAll+"' title='全不选节点'><i class='"+_this.usefontStyle.menubar.unCheckAll+"'></i></button>" : "";
                break;
            case defaultMenu.invertAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.invertAll+"' title='反选节点'><i class='"+_this.usefontStyle.menubar.invertAll+"'></i></button>" : "";
                break;
            case defaultMenu.remove:
                gg = (_this.checkbar) ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.remove+"' title='删除选中节点'><i class='"+_this.usefontStyle.menubar.remove+"'></i></button>" : "";
                break;
            case defaultMenu.searchNode:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.searchNode+"' title='查询节点'><i class='"+_this.usefontStyle.menubar.search+"'></i></button>";
                break;
        }
        return gg;
    };

    // 获取扩展菜单栏
    DTree.prototype.getExtMenubarDom = function(menu){
        var _this = this;
        return "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+_this.obj[0].id+"' d-menu='"+menu.menubarId+"' title='"+menu.title+"'><i class='"+_this.usefontStyle.menubarExt+" "+menu.icon+"'></i></button>";
    };

    // 获取依附在工具栏的菜单栏
    DTree.prototype.getMenubarToolDom = function(menu){
        var _this = this;
        var rootId = _this.obj[0].id;
        switch (menu) {
            case defaultMenu.moveDown:
                _this.toolbarMenu[defaultMenu.moveDown] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.moveDown, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.movedown, "展开全部");
                break;
            case defaultMenu.moveUp:
                _this.toolbarMenu[defaultMenu.moveUp] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.moveUp, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.moveup, "收缩全部");
                break;
            case defaultMenu.refresh:
                _this.toolbarMenu[defaultMenu.refresh] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.refresh, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.refresh, "刷新");
                break;
            case defaultMenu.checkAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.checkAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.checkAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.checkAll, "全选节点");
                break;
            case defaultMenu.unCheckAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.unCheckAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.unCheckAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.unCheckAll, "全不选节点");
                break;
            case defaultMenu.invertAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.invertAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.invertAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.invertAll, "反选节点");
                break;
            case defaultMenu.remove:
                if(_this.checkbar)
                    _this.toolbarMenu[defaultMenu.remove] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.remove, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.remove, "删除选中");
                break;
            case defaultMenu.searchNode:
                _this.toolbarMenu[defaultMenu.searchNode] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.searchNode, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.searchNode, "查询");
                break;
        }
    };

    // 获取依附在工具栏的扩展菜单栏
    DTree.prototype.getExtMenubarToolDom = function(menu){
        var _this = this;
        _this.toolbarMenu[menu.menubarId] = _this.setToolbarDom().setMenuToolbarOption(menu.menubarId, menu.title, _this.usefontStyle.toolbar.menubarExt+" "+menu.icon, "");
    };

    // menubar内置方法
    DTree.prototype.menubarMethod = function(){
        var _this = this;
        return {
            openAllNode: function(obj){  // 展开所有节点
                var $ulNode = obj || _this.obj.children("li").children("ul");
                // 遍历所有ul子节点
                for (var i = 0; i < $ulNode.length; i++) {
                    // 获取当前节点的信息
                    var $ul = $($ulNode[i]),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    if (leaf == "leaf") { continue;	}	// 说明是叶子了，则继续循环下一个

                    if (spread == "open") {
                        // 说明该节点已经展开了，则进行子节点循环
                    } else {
                        if (_this.type=="load") {	//是否全量加载
                            if (_this.cache) {	//是否开启缓存
                                if ($ul.html()) {
                                    $ul.addClass(NAV_SHOW);
                                } else {	//加载节点
                                    _this.getChild($div);
                                }
                            }else {	//每次取新的数据
                                $ul.html("");
                                _this.getChild($div);
                            }
                        } else {	// 全量加载
                            $ul.addClass(NAV_SHOW);
                        }
                        _this.operateIcon($i_spread, $i_node).open();

                    }
                    var $childUl = $ul.children("li").children("ul");
                    _this.menubarMethod().openAllNode($childUl);
                }
            },
            closeAllNode: function(){ //收缩所有节点
                _this.obj.find("."+LI_NAV_CHILD).each(function(){
                    // 获取当前节点的信息
                    var $ul = $(this),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    $ul.removeClass(NAV_SHOW);
                    _this.operateIcon($i_spread, $i_node).close();
                });
            },
            refreshTree: function(){// 刷新树
                _this.refreshTree();
            },
            checkAll: function(){ // 全选节点
            	_this.checkAllNode();
            },
            unCheckAll: function(){ // 全不选节点
                _this.cancelCheckedNode();
            },
            invertAll: function(){ // 反选节点
            	_this.invertCheckedNode();
            },
            remove: function(){// 删除选中节点
            	_this.removeCheckedNode();
            },
            searchNode: function(){//模糊查询该值，展开该值节点
                layer.prompt({
                    formType: 0,
                    value: "",
                    title: '查询节点'
                }, function(value, index1, elem){
                    if (value) {
                        var flag = _this.searchNode(value);
                        if (!flag) {
                            layer.msg("该名称节点不存在！", {icon:5});
                        }
                    } else {
                        layer.msg("未指定查询节点名称", {icon:5});
                    }
                    layer.close(index1);
                });
            },
            extMethod: function(menuId, $div, flag){
                if(_this.menubar && _this.menubarTips.group && _this.menubarTips.group.length > 0 && flag == "group"){
                    for(var i=0; i<_this.menubarTips.group.length; i++){
                        var ext = _this.menubarTips.group[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
                if(_this.menubar && _this.menubarTips.toolbar && _this.menubarTips.toolbar.length > 0 && flag == "toolbar"){
                    for(var i=0; i<_this.menubarTips.toolbar.length; i++){
                        var ext = _this.menubarTips.toolbar[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
                if(_this.menubar && _this.menubarTips.freedom && _this.menubarTips.freedom.length > 0 && flag == "freedom"){
                    for(var i=0; i<_this.menubarTips.freedom.length; i++){
                        var ext = _this.menubarTips.freedom[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
            }
        };
    };

    // menubar监听方法
    DTree.prototype.menubarListener = function(menuId, flag){
        var _this = this;
        var $div = _this.getNodeDom().nowDiv();
        switch (menuId) {
            case defaultMenu.moveDown:	// 展开全部节点
                _this.menubarMethod().openAllNode();
                break;
            case defaultMenu.moveUp:	// 收缩全部节点
                _this.menubarMethod().closeAllNode();
                break;
            case defaultMenu.refresh:
                _this.menubarMethod().refreshTree(); // 刷新树
                break;
            case defaultMenu.checkAll:
                _this.menubarMethod().checkAll();
                break;
            case defaultMenu.unCheckAll:
                _this.menubarMethod().unCheckAll();
                break;
            case defaultMenu.invertAll:
                _this.menubarMethod().invertAll();
                break;
            case defaultMenu.remove:
                _this.menubarMethod().remove();
                break;
            case defaultMenu.searchNode:
                _this.menubarMethod().searchNode();
                break;
            default:
                _this.menubarMethod().extMethod(menuId, $div, flag);
                break;
        }
    };

    //模糊查询该值，展开该值节点
    DTree.prototype.searchNode = function(value){
        var _this = this;
        var b = false;
        var $lis = [];
        _this.obj.find("cite[data-leaf]").each(function(){
            var $nthis = $(this);
            var html = $nthis.html();
            if(html.indexOf(value) > -1){
                if($nthis.attr("data-leaf") == "leaf") {
                    // 叶子节点提供包含父节点的所有信息
                    var title = "";
                    $nthis.parents("li").each(function(){
                        title = "-" + $(this).find("cite[data-leaf]").html() + title;
                    });
                    title = title.substring(1, title.length);
                    $nthis.attr("title", title);
                }
                // 保存当前cite所在的li及父li中包含该值，则只保留父的
                var i = 0;
                $nthis.parents("li").each(function(){
                    var html2 = $(this).find("cite[data-leaf]").html();
                    if(html2.indexOf(value) > -1){
                        i++;
                    }
                    if(i >= 2){
                        return true;
                    }
                });
                if (i < 2){
                    $lis.push($nthis.closest("li").prop("outerHTML"));
                }
            }
        });
        if($lis.length > 0) {
            b = true;
            // 1.将树节点清空
            _this.obj.html("");
            // 2.遍历所有cite节点，展开当前cite节点
            for(var i=0; i<$lis.length; i++){
                _this.obj.append($lis[i]);
            }
        }
        return b;
    };


    /******************** 工具栏区域 ********************/
    // 获取工具栏
    DTree.prototype.getToolbarDom = function(){
        var _this = this;
        var toolbarShow = _this.toolbarShow,
            toolbarExt = _this.toolbarExt,
            toolbarWay = _this.toolbarWay;

        if(toolbarShow.length > 0){
            for(var i=0; i<toolbarShow.length; i++){
                var show = toolbarShow[i];
                if(show == "pulldown"){
                    _this.toolbarMenu[defaultTool.pulldown] = _this.setToolbarDom().setToolbarOption(defaultTool.pulldown, _this.toolbarStyle.title, _this.usefontStyle.toolbar.pulldown, "展开");
                }
                if(show == "pullup"){
                    _this.toolbarMenu[defaultTool.pullup] = _this.setToolbarDom().setToolbarOption(defaultTool.pullup, _this.toolbarStyle.title, _this.usefontStyle.toolbar.pullup, "收缩");
                }
                if(show == "add"){
                    _this.toolbarMenu[defaultTool.addTool] = _this.setToolbarDom().setToolbarOption(defaultTool.addTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.add, "新增");
                }
                if(show == "edit"){
                    _this.toolbarMenu[defaultTool.editTool] = _this.setToolbarDom().setToolbarOption(defaultTool.editTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.edit, "编辑");
                }
                if(show == "delete"){
                    _this.toolbarMenu[defaultTool.delTool] = _this.setToolbarDom().setToolbarOption(defaultTool.delTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.del, "删除");
                }
            }
        }
        if(toolbarExt.length > 0){
            for(var i=0; i<toolbarExt.length; i++){
                var ext = toolbarExt[i];
                _this.toolbarMenu[ext.toolbarId] = _this.setToolbarDom().setToolbarOption(ext.toolbarId, ext.title, _this.usefontStyle.toolbarExt+" "+ext.icon, "");
            }
        }
    };

    // 设置工具栏按钮
    DTree.prototype.setToolbarDom = function(){
        var _this = this;
        var toolbarWay = _this.toolbarWay;

        return {
            setToolbarOption: function(toolbarId, title, classId, other){
                if(toolbarWay == "contextmenu") {
                    return "<dd><a dtree-tool='"+toolbarId+"'><i class='"+classId+"'></i>&nbsp;"+other +title+"</a></dd>";
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    return "<a dtree-tool='"+toolbarId+"' title='"+other + title+"'><i class='"+classId+"'></i></a>";
                }
            },
            setMenuToolbarOption: function(menubarId, title, classId, other){
                var rootId = _this.obj[0].id;
                if(toolbarWay == "contextmenu") {
                    return "<dd><a dtree-id='"+rootId+"' d-menu='"+menubarId+"'><i class='"+classId+"'></i>&nbsp;"+other +title+"</a></dd>";
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    return "<a dtree-id='"+rootId+"' d-menu='"+menubarId+"' title='"+other + title+"'><i class='"+classId+"'></i></a>";
                }
            },
            setToolbarPlace: function(toolbarMenu){
                if(toolbarWay == "contextmenu") {
                    if(toolbarMenu){
                        _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).find('div.layui-nav-item>dl.layui-nav-child').html("");
                        for(var key in toolbarMenu){
                            _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).find('div.layui-nav-item>dl.layui-nav-child').append(toolbarMenu[key]);
                        }
                    }
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    _this.obj.find("cite[data-leaf][dtree-disabled='false']").each(function(){
                        var $cite = $(this);
                        _this.dynamicToolbarDom($cite);
                    });
                }
            }
        }
    };

    // 在节点后动态绑定fixed和follow条件的工具栏
    DTree.prototype.dynamicToolbarDom = function($cite){
        var _this = this;
        var toolbarWay = _this.toolbarWay;
        if($cite.next("em."+TOOLBAR_TOOL_EM).length == 0) {
            var $div = $cite.parent("div");
            var param = _this.getRequestParam(_this.getTempNodeParam($div));
            var toolbarMenus = _this.toolbarFun.loadToolbarBefore(event.cloneObj(_this.toolbarMenu), param, $div);
            var hideCls = (toolbarWay == "follow") ? NAV_HIDE : "";
            var em = ["<em class='"+TOOLBAR_TOOL_EM+" "+hideCls+"'>"];
            if(toolbarMenus){
                for(var key in toolbarMenus){
                    em.push(toolbarMenus[key]);
                }
            }
            em.push("</em>");
            $cite.after(em.join(''));
        }
    }

    // 隐藏toolbar
    DTree.prototype.toolbarHide = function() {
        var _this = this;
        if(_this.toolbar && _this.toolbarWay == "contextmenu") {
            var $toolBarDiv = _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id);
            $toolBarDiv.find(".layui-nav-child").removeClass('layui-anim-fadein layui-show');
        }
    }

    // toolbar内置方法
    DTree.prototype.toolbarMethod = function(){
        var _this = this;
        return {
            pulldown: function(obj){ // 展开当前点击节点的下面全部节点
                if(!obj) return;
                var $ulNode = obj;
                // 遍历所有ul子节点
                for (var i = 0; i < $ulNode.length; i++) {
                    // 获取当前节点的信息
                    var $ul = $($ulNode[i]),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    if (leaf == "leaf") { continue;	}	// 说明是叶子了，则继续循环下一个

                    if (spread == "open") {
                        // 说明该节点已经展开了，则进行子节点循环
                    } else {
                        if (_this.type=="load") {	//是否全量加载
                            if (_this.cache) {	//是否开启缓存
                                if ($ul.html()) {
                                    $ul.addClass(NAV_SHOW);
                                } else {	//加载节点
                                    _this.getChild($div);
                                }
                            }else {	//每次取新的数据
                                $ul.html("");
                                _this.getChild($div);
                            }
                        } else {	// 全量加载
                            $ul.addClass(NAV_SHOW);
                        }
                        _this.operateIcon($i_spread, $i_node).open();

                    }
                    var $childUl = $ul.children("li").children("ul");
                    _this.toolbarMethod().pulldown($childUl);
                }
            },
            pullup: function($li){ // 收缩当前点击节点的下面全部节点
                $li.find("."+LI_NAV_CHILD).each(function(){
                    // 获取当前节点的信息
                    var $ul = $(this),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    $ul.removeClass(NAV_SHOW);
                    _this.operateIcon($i_spread, $i_node).close();
                });
            }
        }
    };

    // toolbar监听方法
    DTree.prototype.toolbarListener = function(tool, $div) {
        var _this = this;
        var $cite = $div.children("cite[data-leaf]"),
            $ul = $div.next("ul"),
            $p_li = $div.parent("li[data-index]"),	//当前选中节点的顶级li节点
            $p_ul = $p_li.parent("ul"),	//当前选中节点的顶级li节点的父级ul
            $p_div = $p_ul.prev("div"), //当前选中节点的顶级li节点的父级ul的前一个div
            title = $cite.html();
        switch (tool) {
            case defaultTool.pulldown:
                _this.toolbarMethod().pulldown($ul);
                break;
            case defaultTool.pullup:
                _this.toolbarMethod().pullup($p_li);
                break;
            case defaultTool.addTool:
                var content = _this.loadToolBar(title, defaultTool.addTool);

                layer.open({
                    title: "新增"+_this.toolbarStyle.title,
                    type: 1,
                    area: _this.toolbarStyle.area,
                    content: content,
                    success: function(layero, index){
                        form.render();
                        form.on("submit(dtree_addNode_form)",function(data){
                            var data = data.field;
                            var parentId = $div.attr("data-id"),
                                id = $div.attr("data-id")+"_node_"+$ul[0].childNodes.length,
                                leaf = true,
                                checked = "0",
                                level = parseInt($p_li.attr("data-index"))+1;

                            // 创建子节点的DOM，添加子节点
                            var checkArr = [];
                            if (_this.checkArrLen > 0) {
                                for (var i = 0; i < _this.checkArrLen; i++) {
                                    checkArr.push({"type":i,"checked":"0"});
                                }
                            }

                            $ul.append(_this.getLiItemDom(id, parentId, data.addNodeName, data.addNodeName, true, "", "", checkArr, level, false, false, false, "", "", "item"));
                            // 先将li节点隐藏
                            $ul.find("li[data-id='"+id+"']").hide();
                            // 重新赋值
                            var $addDiv = $ul.find("div[data-id='"+id+"']");
                            node = _this.getNodeParam($addDiv);

                            //获取组装后的requestNode,组合参数
                            var requestNode = _this.getRequestParam(node);
                            requestNode = $.extend(requestNode, data);

                            _this.temp = [id, $ul, $div, level];
                            // 用户自定义想做的事情
                            _this.toolbarFun.addTreeNode(requestNode, $div);

                            layer.close(index);
                            return false;
                        });
                    }
                });
                break;
            case defaultTool.editTool:
                var content = _this.loadToolBar(title, defaultTool.editTool);

                layer.open({
                    title: "编辑"+_this.toolbarStyle.title,
                    type: 1,
                    area: _this.toolbarStyle.area,
                    content: content,
                    success: function(layero, index){
                        _this.toolbarFun.editTreeLoad(_this.getRequestParam(_this.getNodeParam($div)));
                        form.render();
                        form.on("submit(dtree_editNode_form)",function(data){
                            var data = data.field;
                            $cite.html(data.editNodeName);
                            node = _this.getNodeParam($div);
                            var requestNode = _this.getRequestParam(node);
                            requestNode = $.extend(requestNode, data);
                            _this.temp = [$cite, $div, title, $p_div];
                            _this.toolbarFun.editTreeNode(requestNode, $div);

                            layer.close(index);
                        });
                    }
                });
                break;
            case defaultTool.delTool:
                layer.confirm('确定要删除该'+_this.toolbarStyle.title+'？', {icon: 3, title:'删除'+_this.toolbarStyle.title}, function(index){
                    var node = _this.getNodeParam($div);
                    _this.temp = [$p_li, $p_div];
                    _this.toolbarFun.delTreeNode(_this.getRequestParam(_this.getNodeParam($div)), $div);

                    layer.close(index);
                });
                break;
            default:
                if(_this.toolbarExt.length > 0){
                    for(var i=0; i<_this.toolbarExt.length; i++){
                        var ext = _this.toolbarExt[i];
                        if (tool == ext.toolbarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div)), $div);
                            break;
                        }
                    }
                }
                break;
        }
    }


    // 加载toolBar中的内容
    DTree.prototype.loadToolBar = function(title, name){
        var _this = this;
        var toolbarShow = _this.toolbarShow;
        var nodeBarContents = _this.toolbarBtn;

        var html = "";
        switch (name) {
            case defaultTool.addTool:
                var addNodeBarDef = [{"label": "当前选中", "name": "nodeTitle", "type": "text", "value": title, "defElem": "nowChoose", "readonly": true},
                    {"label": "新增"+_this.toolbarStyle.title, "name": "addNodeName", "type": "text", "value": "", "defElem": "nowChange", "verify": "required"},
                    {"type": "submit", "value": "确认添加", "defElem": "btn", "filter": "dtree_addNode_form"}];

                //2. 用户自定义的节点内容
                var addNodeBar = ['<div class="'+TOOLBAR_TOOL+'"><form class="layui-form layui-form-pane" lay-filter="dtree_addNode_form">'];

                if(nodeBarContents != null && nodeBarContents.length > 0){
                    if(nodeBarContents[0] != null && nodeBarContents[0] != undefined && nodeBarContents[0].length > 0){
                        var addNodeBarContents = nodeBarContents[0];
                        // 1. 检查是否包含了now、newly、btn这三个默认项,将其他元素依次排列，将特殊元素至于栈顶
                        for(var i=0; i<addNodeBarContents.length; i++){
                            var defElem = addNodeBarContents[i].defElem;
                            if(defElem == "nowChoose") {
                                $.extend(addNodeBarDef[0], addNodeBarContents[i]);
                            } else if(defElem == "nowChange") {
                                $.extend(addNodeBarDef[1], addNodeBarContents[i]);
                            } else if(defElem == "btn") {
                                $.extend(addNodeBarDef[2], addNodeBarContents[i]);
                            } else {
                                addNodeBarDef.push(addNodeBarContents[i]);
                            }
                        }
                    }
                }

                // 2. 遍历生成全部表单标签
                for(var j=0; j<addNodeBarDef.length; j++){
                    var type = addNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "text":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).text());
                            break;
                        case "textarea":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).textarea());
                            break;
                        case "select":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).select());
                            break;
                        case "hidden":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).hidden());
                            break;

                    }
                }

                var addBtn = ['<div class="layui-form-item">', '<div class="layui-input-block" style="margin-left:0px;text-align:center;">'];
                // 3.遍历生成按钮
                for(var j=0; j<addNodeBarDef.length; j++){
                    var type = addNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "submit":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).submit());
                            break;
                        case "button":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).button());
                            break;
                        case "reset":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).reset());
                            break;

                    }
                }
                addBtn.push('</div></div>');
                addNodeBar.push(addBtn.join(''));
                addNodeBar.push('</form></div>');
                html = addNodeBar.join('');
                break;

            case defaultTool.editTool:
                var editNodeBarDef = [{"label": "当前选中", "name": "nodeTitle", "type": "text", "value": title, "defElem": "nowChoose", "readonly": true},
                    {"label": "编辑"+_this.toolbarStyle.title, "name": "editNodeName", "type": "text", "value": "", "defElem": "nowChange", "verify": "required"},
                    {"type": "submit", "value": "确认编辑", "defElem": "btn", "filter": "dtree_editNode_form"}];

                var editNodeBar = ['<div class="'+TOOLBAR_TOOL+'"><form class="layui-form layui-form-pane" lay-filter="dtree_editNode_form">'];
                //2. 用户自定义的节点内容
                if(nodeBarContents != null && nodeBarContents.length > 0){

                    if(nodeBarContents[1] != null && nodeBarContents[1] != undefined && nodeBarContents[1].length > 0){
                        var editNodeBarContents = nodeBarContents[1];
                        // 1. 检查是否包含了now、newly、btn这三个默认项,将其他元素依次排列，将特殊元素至于栈顶
                        for(var i=0; i<editNodeBarContents.length; i++){
                            var defElem = editNodeBarContents[i].defElem;
                            if(defElem == "nowChoose") {
                                $.extend(editNodeBarDef[0], editNodeBarContents[i]);
                            } else if(defElem == "nowChange") {
                                $.extend(editNodeBarDef[1], editNodeBarContents[i]);
                            } else if(defElem == "btn") {
                                $.extend(editNodeBarDef[2], editNodeBarContents[i]);
                            } else {
                                editNodeBarDef.push(editNodeBarContents[i]);
                            }
                        }

                    }
                }
                // 2. 遍历生成全部表单标签
                for(var j=0; j<editNodeBarDef.length; j++){
                    var type = editNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "text":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).text());
                            break;
                        case "textarea":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).textarea());
                            break;
                        case "select":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).select());
                            break;
                        case "hidden":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).hidden());
                            break;
                    }
                }

                var editBtn = ['<div class="layui-form-item">', '<div class="layui-input-block" style="margin-left:0px;text-align:center;">'];
                // 3.遍历生成按钮
                for(var j=0; j<editNodeBarDef.length; j++){
                    var type = editNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "submit":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).submit());
                            break;
                        case "button":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).button());
                            break;
                        case "reset":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).reset());
                            break;

                    }
                }
                editBtn.push('</div></div>');
                editNodeBar.push(editBtn.join(''));
                editNodeBar.push('</form></div>');
                html = editNodeBar.join('');
                break;
        }
        return html;
    };

    // 获取toolbar详细的标签信息
    DTree.prototype.loadToolBarDetail = function(nodeBarContents){
        var _this = this;
        var readonly = (typeof (nodeBarContents.readonly) === "boolean") ? nodeBarContents.readonly : false;
        var disabled = (typeof (nodeBarContents.disabled) === "boolean") ? nodeBarContents.disabled : false;
        var id = nodeBarContents.id ? nodeBarContents.id : "";
        var name = nodeBarContents.name ? nodeBarContents.name : "";
        var val = nodeBarContents.value ? nodeBarContents.value : "";
        var verify = nodeBarContents.verify ? nodeBarContents.verify : "";
        var placeholder = nodeBarContents.placeholder ? nodeBarContents.placeholder : val;
        return{
            text: function(){
                return ['<div class="layui-form-item">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<input type="text" class="layui-input f-input" value="'+val+'" placeholder="'+placeholder+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '/>',
                    '</div>',
                    '</div>'].join('');
            },
            textarea: function(){
                return ['<div class="layui-form-item layui-form-text">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<textarea class="layui-textarea f-input" value="'+val+'" placeholder="'+placeholder+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '>'+val+'</textarea>',
                    '</div>',
                    '</div>'].join('');
            },
            hidden: function(){
                return ['<input type="hidden" class="layui-input f-input" value="'+val+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '/>'].join('');
            },
            select: function(){
                var optionsData = (typeof nodeBarContents.optionsData === 'object') ? nodeBarContents.optionsData : nodeBarContents.optionsData();
                var options = "";
                for(var key in optionsData){
                    if(val == optionsData[key]){
                        options += "<option value='"+key+"' selected>"+optionsData[key]+"</option>";
                    } else {
                        options += "<option value='"+key+"'>"+optionsData[key]+"</option>";
                    }
                }
                return ['<div class="layui-form-item">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<select lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '>',
                    options,
                    '</select>', '</div>', '</div>'].join('');
            },
            submit: function(){
                var filter = nodeBarContents.filter;
                return ['<button type="button" class="layui-btn layui-btn-normal btn-w100" lay-submit lay-filter="'+filter+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    '>'+val+'</button>'].join('');
            },
            button: function(){
                return ['<button type="button" class="layui-btn layui-btn-normal btn-w100" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    ' >'+val+'</button>'].join('');
            },
            reset: function(){
                return ['<button type="reset" class="layui-btn layui-btn-primary btn-w100" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    '>'+val+'</button>'].join('');
            }
        }
    };

    // 新增节点后改变节点内容
    DTree.prototype.changeTreeNodeAdd = function(returnID){
        var _this = this;
        var temp = _this.temp;
        var id = temp[0], $ul = temp[1], $div = temp[2], level = temp[3];
        var flag = false;
        if(returnID){
            var $thisDiv = _this.obj.find("[data-id='"+id+"']");
            if(typeof returnID === "object"){
                // 如果是JSON格式数据，则将当前DIV删除，重新建造DIV
                $thisDiv.remove();
                var parseData = _this.parseData(returnID);

                if(parseData.treeId()){
                    $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(0), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), "item"));

                    // 建造完毕后，选中该DIV
                    $thisDiv = $ul.find("div[data-id='"+parseData.treeId()+"']");
                    _this.setNodeParam($thisDiv)
                } else {
                    layer.msg("添加失败,节点ID为undefined！",{icon:5});
                    // 将li节点删除
                    $ul.find("li[data-id='"+id+"']").remove();
                    // 重新赋值
                    _this.setNodeParam($div);
                    // 临时变量制空
                    _this.temp = [];
                    return ;
                }
            }else if(returnID == 'refresh'){
                // 如果是设置为refresh参数，则向后台发送请求，获取新增节点下的真实参数，局部刷新树。
                flag = true;
            } else if(typeof returnID === "string" || typeof returnID === 'number' || returnID == true){
                $thisDiv.attr("data-id", returnID);
                // 将li节点展示
                $ul.find("li[data-id='"+returnID+"']").show();
                _this.setNodeParam($thisDiv)
            }

            // 判断当前点击的节点是否是最后一级节点，如果是，则需要修改节点的样式
            var $icon_i = $div.find("i[data-spread]");
            if ($icon_i.eq(0).attr("data-spread") == "last") {
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
            } else {	//如果不是，也要修改节点样式
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).open();
            }
            $ul.addClass(NAV_SHOW);	//展开UL
            _this.accordionUL($ul);
            if(flag) {
                _this.getChild($div);
            } else {
                //		_this.showLine();
                _this.showLine($ul.find("li"));
                // 这种情况下需要在新增节点后对节点新增工具栏
                if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                    _this.dynamicToolbarDom($thisDiv.find("cite[data-leaf]"));
                }
            }

        } else {
            // 将li节点删除
            $ul.find("li[data-id='"+id+"']").remove();
            // 重新赋值
            _this.setNodeParam($div);
        }

        _this.temp = []; // 临时变量制空

    };

    // 编辑页打开后显示编辑页内容
    DTree.prototype.changeTreeNodeDone = function(param){
        var _this = this;
        form.val('dtree_editNode_form', param);
        form.render();
    };

    // 修改节点后改变节点内容
    DTree.prototype.changeTreeNodeEdit = function(returnID){
        var _this = this;
        var temp = _this.temp;
        var $cite = temp[0], $div = temp[1], title = temp[2], $p_div = temp[3];
        var flag = false;
        if(returnID){
            if(typeof returnID === "object"){
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var replaceDom = _this.replaceDom($div, parseData.treeId(), parseData.last(0), parseData.spread(), parseData.disabled(), parseData.hide());
                    replaceDom.node(parseData.iconClass());
                    replaceDom.checkbox(parseData.checkArr());
                    replaceDom.text(parseData.title());
                    replaceDom.ul();
                    replaceDom.basicData(parseData.basicData());
                    replaceDom.recordData(parseData.recordData());
                    _this.setNodeParam($div);
                } else {
                    layer.msg("编辑失败,节点ID为undefined！",{icon:5});
                    // 重新赋值
                    _this.setNodeParam($div);
                }
            }
        } else {
            $cite.html(title);
            _this.getNodeParam($div);
        }

        _this.temp = []; // 临时变量制空
    };

    // 删除节点后改变节点内容
    DTree.prototype.changeTreeNodeDel = function(flag){
        var _this = this;
        var temp = _this.temp;
        var $p_li = temp[0],
            $p_ul = $p_li.parent("ul"),
            $p_div = temp[1];

        if(flag){
            $p_li.remove();
            _this.showLine($p_ul.find("li"));
            // 判断父级ul中是否还存在li,如果不存在，则需要修改节点的样式
            if($p_ul.children("li").length == 0){
                var $icon_i = $p_div.find("i[data-spread]");
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).closeWithLeaf();
            }
            _this.initNodeParam();
        }

        _this.temp = []; // 临时变量制空
    };

    /******************** iframe区域 ********************/
    // 加载iframe
    DTree.prototype.loadIframe = function($div, iframeParam) {
        var _this = this;
        var $cite = _this.getNodeDom($div).cite();
        if (!_this.useIframe) {		// 启用iframe
            return false;
        }
        var iframeElem = _this.iframeElem,
            iframeUrl = _this.iframeUrl,
            iframeLoad = _this.iframeLoad;

        var flag = iframeLoad == "leaf" ? (($cite.attr("data-leaf") == "leaf") ? true : false) : true;

        if (flag) {
            if ($(iframeElem).length > 0) {		//iframe存在
                if (!iframeUrl) {
                    layer.msg("数据请求异常，iframeUrl参数未指定", {icon:5});
                    return false;
                }
                var param = AjaxHelper.serialize(iframeParam);
                if(iframeUrl.indexOf("?")> -1){
                    param = "&"+param.substring(1, param.length);
                }
                var url = iframeUrl + param;
                $(iframeElem).attr("src", url);
            } else {
                layer.msg("iframe绑定异常，请确认页面中是否有iframe页对应的容器", {icon:5});
                return false;
            }
        }
        return flag;
    };

    // 获取传递出去的参数，根据iframe.iframeDefaultRequest、iframe.iframeRequest和node拼出发出请求的参数
    DTree.prototype.getIframeRequestParam = function(nodes){
        var _this = this;
        var request = _this.iframeRequest,
            defaultRequestNames = _this.iframeDefaultRequest,
            node = nodes || _this.node,
            requestParam = {};

        // 先拼用户自定义的，在拼树生成的，这样的话用户可以自定义当树未生成时的节点的初始值
        for ( var key in request) {
            requestParam[key] = request[key];
        }
        for ( var key in defaultRequestNames) {
            var paramName = defaultRequestNames[key];
            var paramValue = node[key];
            if(typeof paramValue === "boolean"){
                requestParam[paramName] = paramValue;
            }else {
                if(paramValue){
                    requestParam[paramName] = paramValue;
                }
            }
        }

        // 解决传递中文的乱码问题
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;	//正则匹配中文
        for(var key in requestParam){
            if(reg.test(requestParam[key])) {
                var str = requestParam[key];
                requestParam[key] = encodeURI(encodeURI(str));
            }
        }

        return requestParam;
    };

    /******************** 数据回调区域 ********************/
    // 根据具体的id获取基于当前id的div以及对应的其他dom元素
    DTree.prototype.getNodeDom = function(id){
        var _this = this;
        // 获取当前div，如果id就是一个dom，则就是这个，如果不是则进行选择。如果选不中则为null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        return {
            div: function(){	// 获取当前div
                return $div;
            },
            fnode: function(){	// 获取一级图标元素
                return ($div == null) ? null : $div.find("i[data-spread]").eq(0);
            },
            snode: function(){	// 获取二级图标元素
                return ($div == null) ? null : $div.find("i[data-spread]").eq(1);
            },
            checkbox: function(){		// 获取复选框元素
                return ($div == null) ? null : $div.find("i[data-par]");
            },
            cite: function(){	// 获取cite元素
                return ($div == null) ? null : $div.find("cite[data-leaf]");
            },
            nextUl: function(){	// 获取相邻的ul元素
                return ($div == null) ? null : $div.next("ul");
            },
            parentLi: function(){	// 获取父级li元素
                return ($div == null) ? null : $div.parent("li");
            },
            parentUl: function(){	// 获取基于当前$div的上级$ul
                return ($div == null) ? null : $div.parent("li").parent("ul");
            },
            parentDiv: function(){  // 获取基于当前$div的上级$div
                return ($div == null) ? null : $div.parent("li").parent("ul").prev("div");
            },
            nowDiv: function(){		// 获取当前选中节点，没有则返回null
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS);
            },
            nowOrRootDiv: function(){	// 获取当前选中节点，没有则返回根节点下的第一个div
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? _this.obj.children("li").eq(0).children("div").eq(0) : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS);
            },
            nowOrRootUl: function(){	// 获取当前选中节点下一个UL 或根节点。为了将新节点放入ul下
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? _this.obj : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).next("ul");
            }
        }
    };

    // 获取当前选中节点下一个UL 或根节点。为了将新节点放入ul下
    DTree.prototype.getNowNodeUl =  function() {
        var _this = this;
        return _this.getNodeDom().nowOrRootUl();
    };

    // 获取当前选中节点 或第一个根节点。
    DTree.prototype.getNowNode =  function() {
        var _this = this;
        return _this.getNodeDom().nowOrRootDiv();
    };

    // 获取当前选中节点 无则返回null。
    DTree.prototype.getNowNodeOrNull =  function() {
        var _this = this;
        return _this.getNodeDom().nowDiv();
    };

    // 获取指定节点。
    DTree.prototype.getNode =  function(id) {
        var _this = this;
        return _this.getNodeDom(id).div();
    };

    // 设置当前选中节点的全部参数
    DTree.prototype.setNodeParam = function($div) {
        var _this = this;
        _this.node.nodeId = $div.attr("data-id");
        _this.node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        _this.node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        _this.node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        _this.node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        _this.node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;

        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        _this.node.basicData = basicData;
        
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        _this.node.recordData = recordData;
        
        if (_this.getNodeDom($div).checkbox()) {
            var dataTypes = "", checkeds = "", initcheckeds = "";
            _this.getNodeDom($div).checkbox().each(function(){
                dataTypes += $(this).attr("data-type") + ",";
                checkeds += $(this).attr("data-checked") + ",";
                initcheckeds += $(this).attr("data-initchecked") + ",";
            });
            dataTypes = dataTypes.substring(0, dataTypes.length-1);
            checkeds = checkeds.substring(0, checkeds.length-1);
            initcheckeds = initcheckeds.substring(0, initcheckeds.length-1);

            _this.node.dataType = dataTypes;
            _this.node.checked = checkeds;
            _this.node.initchecked = initcheckeds;
        }
    };

    // 获取当前选中节点的全部参数
    DTree.prototype.getNodeParam = function($div) {
        var _this = this;
        if ($div) {
            _this.setNodeParam($div);
        } else {
            if(_this.obj.find("div[data-id]").parent().find("."+NAV_THIS).length == 0){
                _this.initNodeParam();
            }
        }
        return this.node;
    };

    // 获取一个临时的node参数
    DTree.prototype.getTempNodeParam = function($div) {
        var _this = this;
        var temp_node = {};
        temp_node.nodeId = $div.attr("data-id");
        temp_node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        temp_node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        temp_node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        temp_node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        temp_node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;
        
        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        temp_node.basicData = basicData;
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        temp_node.recordData = recordData;
        
        if (_this.getNodeDom($div).checkbox()) {
            var dataTypes = "", checkeds = "", initcheckeds = "";
            _this.getNodeDom($div).checkbox().each(function(){
                dataTypes += $(this).attr("data-type") + ",";
                checkeds += $(this).attr("data-checked") + ",";
                initcheckeds += $(this).attr("data-initchecked") + ",";
            });
            dataTypes = dataTypes.substring(0, dataTypes.length-1);
            checkeds = checkeds.substring(0, checkeds.length-1);
            initcheckeds = initcheckeds.substring(0, initcheckeds.length-1);

            temp_node.dataType = dataTypes;
            temp_node.checked = checkeds;
            temp_node.initchecked = initcheckeds;
        }
        return temp_node;
    };

    // 重置参数
    DTree.prototype.initNodeParam = function(){
        var _this = this;
        _this.node.nodeId = "";
        _this.node.parentId = "";
        _this.node.context = "";
        _this.node.leaf = "";
        _this.node.level = "";
        _this.node.spread = "";
        _this.node.dataType = "";
        _this.node.checked = "";
        _this.node.initchecked = "";
        _this.node.basicData = "";
        _this.node.recordData = "";
        
        if(_this.select) {
             _this.selectResetVal();
        }
    };

    // 获取传递出去的参数，根据defaultRequest、request和node拼出发出请求的参数
    DTree.prototype.getRequestParam = function(nodes){
        var _this = this;
        var request = _this.request,
            defaultRequestNames = _this.defaultRequest,
            node = nodes || _this.node,
            requestParam = {};

        // 先拼用户自定义的，在拼树生成的，这样的话用户可以自定义当树未生成时的节点的初始值
        for ( var key in request) {
            requestParam[key] = request[key];
        }
        for ( var key in defaultRequestNames) {
            var paramName = defaultRequestNames[key];
            var paramValue = node[key];
            if(typeof paramValue === "boolean"){
                requestParam[paramName] = paramValue;
            }else {
                if(paramValue){
                    requestParam[paramName] = paramValue;
                }
            }

        }
        return requestParam;
    };

    // 获取filterParam过滤后的requestParam
    DTree.prototype.getFilterRequestParam = function(requestParam){
        var _this = this;
        var filterRequest = _this.filterRequest;
        return event.cloneObj(requestParam, filterRequest);
    };

    // 获取当前选中值
    DTree.prototype.getNowParam = function(){
        var _this = this;

        return _this.getRequestParam(_this.getNodeParam());
    };

    // 获取指定节点选中值
    DTree.prototype.getParam = function(id){
        var _this = this;

        // 获取当前div，如果id就是一个dom，则就是这个，如果不是则进行选择。如果选不中则为null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().node(_this.getTempNodeParam($div)); } else { return {}; }
    };

    // 获取参数的上级节点
    DTree.prototype.getParentParam = function(id){
        var _this = this;
        // 获取当前div，如果id就是一个dom，则就是这个，如果不是则进行选择。如果选不中则为null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().parentNode($div); } else { return {}; }
    };

    // 获取参数的全部上级节点
    DTree.prototype.getAllParentParam = function(id){
        var _this = this;
        // 获取当前div，如果id就是一个dom，则就是这个，如果不是则进行选择。如果选不中则为null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        var arr = [];
        if($div != null){
            var level = _this.getTempNodeParam($div).level;
            for(var i=1; i<level; i++){  // 从1开始遍历，如果level等于1说明是根节点
                arr.unshift(_this.callbackData().parentNode($div));
                $div = _this.getNodeDom($div).parentDiv();
            }
        }
        return arr;
    };

    // 获取参数的下级节点
    DTree.prototype.getChildParam = function(id){
        var _this = this;
        // 获取当前div，如果id就是一个dom，则就是这个，如果不是则进行选择。如果选不中则为null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().childNode($div); } else { return []; }
    };

    // 获取回调数据
    DTree.prototype.callbackData = function(){
        var _this = this;
        return {
            dom: function($dom){  // 获取dom
                return $dom;
            },
            node: function(node){	// 获取当前节点值
                return _this.getRequestParam(node);
            },
            childNode: function($div){	// 获取下级节点值
                var $childDivs = $div.next("ul").find("li."+LI_NAV_ITEM+" div."+LI_DIV_ITEM);
                var childNode = [];
                if($childDivs && $childDivs.length > 0){
                    $childDivs.each(function(){
                        var $cDiv = $(this);
                        childNode.push(_this.getRequestParam(_this.getTempNodeParam($cDiv)));
                    });
                }
                return childNode;
            },
            parentNode: function($div){	// 获取上级节点值
                var pId = _this.getNodeDom($div).parentLi().attr("data-pid");
                var $pdiv = _this.obj.find("div[data-id='"+pId+"']");
                if($pdiv.length > 0) {return _this.getRequestParam(_this.getTempNodeParam($pdiv));} else {return {};}

            }
        }
    };

    /******************** 事件回调区域 ********************/
    // 绑定浏览器事件
    DTree.prototype.bindBrowserEvent = function(){
        var _this = this;
        var rootId = _this.obj[0].id;

        // 绑定文件夹展开/收缩的图标的点击事件，点击时给当前节点的div添加选中class
        _this.obj.on("click", "i[data-spread]", function(event) {
            event.stopPropagation();
            var $i = $(this),
                $div = $i.parent("div"),
                node = _this.getNodeParam($div);

            _this.toolbarHide();
            _this.navThis($div);
            _this.clickSpread($div);	// 展开或隐藏节点

            // 树状态改变后，用户自定义想做的事情
            layui.event.call(this, MOD_NAME, "changeTree("+$(_this.obj)[0].id+")",  {
                dom: _this.callbackData().dom($i),
                param: _this.callbackData().node(node),
                show: _this.callbackData().dom($i).attr("data-spread") == "open" ? true : false
            });
        });

        // 绑定所有子节点div的单击事件，点击时触发加载iframe或用户自定义想做的事情
        _this.obj.on("click", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event) {
            event.stopPropagation();
            var $div = $(this),
                $cite = $div.find("cite"),
                node = _this.getNodeParam($div);
            _this.toolbarHide();
            _this.navThis($div);
            
            if(_this.select) {
                _this.selectVal(node.nodeId);
                $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").click();
            }

            if (_this.useIframe) {
                var iframeParam = _this.getFilterRequestParam(_this.getIframeRequestParam(node));
                var flag = _this.loadIframe($div, iframeParam);	// 加载iframe
                if (flag) {
                    // iframe加载完毕后，用户自定义想做的事情
                    _this.iframeFun.iframeDone(iframeParam);

                    layui.event.call(this, MOD_NAME, "iframeDone("+$(_this.obj)[0].id+")",  {
                        "iframeParam": iframeParam,
                        dom: _this.callbackData().dom($div)
                    });
                }
            } else {
                // 单击事件执行完毕后，用户自定义想做的事情
                layui.event.call(this, MOD_NAME, "node("+$(_this.obj)[0].id+")", {
                    param: _this.callbackData().node(node),
                    childParams: _this.callbackData().childNode($div),
                    parentParam: _this.callbackData().parentNode($div),
                    dom: _this.callbackData().dom($div)
                });
            }
        });

        // 绑定所有子节点div的双击事件，暴露on给用户自定义
        _this.obj.on("dblclick", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event) {
            event.stopPropagation();
            var $div = $(this),
                $cite = $div.find("cite"),
                node = _this.getNodeParam($div);
            _this.toolbarHide();
            _this.navThis($div);

            if(_this.select) {
                _this.selectVal(node.nodeId);
                $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").click();
            }

            // 双击事件执行完毕后，用户自定义想做的事情
            layui.event.call(this, MOD_NAME, "nodedblclick("+$(_this.obj)[0].id+")",  {
                param: _this.callbackData().node(node),
                childParams: _this.callbackData().childNode($div),
                parentParam: _this.callbackData().parentNode($div),
                dom: _this.callbackData().dom($div)
            });
        });

        if(_this.checkbar) {
            // 绑定cheboxbar的节点复选框
            _this.obj.on("click", "i[dtree-click='"+eventName.checkNodeClick+"'][dtree-disabled='false']", function(event) {
                _this.toolbarHide();
                var $i = $(this),
                    $div = $i.closest("div[dtree-click='"+eventName.itemNodeClick+"']"),
                    node = _this.getNodeParam($div);
                // 复选框选中前的回调
                var flag = _this.checkbarFun.chooseBefore($i, _this.getRequestParam(node));
                _this.temp = [$i];
                if(flag){_this.changeCheck();}
                
                event.stopPropagation();
            });
        }

        if(_this.menubar) {
            // 绑定menubar的点击事件
            _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).on("click", "button[d-menu]", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("d-menu"), "group");
            });

            // 绑定menubar的点击事件
            _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).on("click", "a[d-menu]", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("d-menu"), "toolbar");
            });

            // 绑定menubar的点击按钮事件
            _this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").on("click", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("dtree-menu"), "freedom");
            });
        }

        if(_this.toolbar) {
            if(_this.toolbarWay == "contextmenu") {
                //绑定所有子节点div的右键点击事件，用于显示toolbar
                _this.obj.on("contextmenu", "div[dtree-click='"+eventName.itemNodeClick+"'][d-contextmenu='true'][dtree-disabled='false']", function(e){
                    var $div = $(this),
                        node = _this.getNodeParam($div);

                    _this.toolbarHide();
                    // toolbar加载前执行的方法，执行完毕之后创建按钮
                    _this.setToolbarDom().setToolbarPlace(_this.toolbarFun.loadToolbarBefore(event.cloneObj(_this.toolbarMenu), _this.getRequestParam(node), $div));

                    var e = e || window.event,
                        mx = e.pageX - $div.offset().left +45 ,
                        my = $div.offset().top - _this.obj.closest(_this.scroll).offset().top +15;

                    _this.navThis($div);
                    var $toolBarDiv = _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id);
                    $toolBarDiv.find(".layui-nav-child").addClass('layui-anim-fadein layui-show');
                    $toolBarDiv.css({'left':mx+'px','top':my+'px'});

                    e.stopPropagation();
                    return false;
                });

                // 绑定装载树的上层出现滚动条的容器，让toolbar隐藏
                _this.obj.closest(_this.scroll).scroll(function() {
                    _this.toolbarHide();
                });

                // 绑定toolbar的点击事件
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $div = _this.getNodeDom().nowOrRootDiv(),
                        node = _this.getNodeParam($div);
                    _this.toolbarHide();
                    var tool = $(this).attr("dtree-tool");
                    _this.toolbarListener(tool, $div);
                });
            } else if(_this.toolbarWay == "fixed") {
                // 绑定toolbar的点击事件
                _this.obj.on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $a = $(this),
                        $cite = $a.parent("em."+TOOLBAR_TOOL_EM).prev("cite"),	//当前选中节点的text
                        $div = $cite.parent("div"),
                        node = _this.getNodeParam($div);
                    var tool = $a.attr("dtree-tool");

                    _this.toolbarHide();
                    _this.navThis($div);
                    _this.toolbarListener(tool, $div);
                });
            } else if(_this.toolbarWay == "follow") {
                //绑定所有子节点div的mouseover mouseout事件，用于显示或隐藏toolbar
                _this.obj.on("mouseover mouseout", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event){
                    var $div = $(this),
                        $toolBarEm = $div.children("em."+TOOLBAR_TOOL_EM);
                    if(event.type == "mouseover"){
                        $toolBarEm.removeClass(NAV_HIDE);
                        event.stopPropagation();
                    } else if(event.type == "mouseout"){
                        $toolBarEm.addClass(NAV_HIDE);
                        event.stopPropagation();
                    }
                });

                // 绑定toolbar的点击事件
                _this.obj.on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $a = $(this),
                        $cite = $a.parent("em."+TOOLBAR_TOOL_EM).prev("cite"),	//当前选中节点的text
                        $div = $cite.parent("div"),
                        node = _this.getNodeParam($div);
                    var tool = $a.attr("dtree-tool");

                    _this.toolbarHide();
                    _this.navThis($div);
                    _this.toolbarListener(tool, $div);
                });
            }
        }

        if(_this.select) {
            // 绑定select的点击事件
            $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").on("click", function(event){
                event.stopPropagation();
                $(this).toggleClass("layui-form-selected");
                $("div[dtree-id='" + rootId + "'][dtree-card='"+_this.selectCardDiv+"']").toggleClass("dtree-select-show layui-anim layui-anim-upbit");
            
                // 下拉树面板开闭状态改变后，用户自定义想做的事情
                layui.event.call(this, MOD_NAME, "changeSelect("+$(_this.obj)[0].id+")",  {
                	show: $(this).hasClass("layui-form-selected"),
                    param: _this.selectVal()
                });
            });

        }
    };

    // 绑定body的单击，让本页面所有的toolbar隐藏
    $BODY.on("click", function(event){
        $("div."+LI_DIV_TOOLBAR).find(".layui-show").removeClass('layui-anim-fadein layui-show');
       // $("div[dtree-id][dtree-select]").removeClass("layui-form-selected");
       // $("div[dtree-id][dtree-card]").removeClass("dtree-select-show layui-anim layui-anim-upbit");
        
    });

    // 解绑浏览器事件
    DTree.prototype.unbindBrowserEvent = function(){
        var _this = this;

        // 本身事件解绑
        _this.obj.unbind();
        // 菜单栏解绑
        if(_this.menubar){
            _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).unbind();
            if(_this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").length > 0){
                _this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").unbind();
            }
        }

        // 工具栏解绑
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).unbind();
                if(_this.obj.closest(_this.scroll).length > 0){
                    _this.obj.closest(_this.scroll).unbind();
                }
            }
        }
        
        // 下拉树解绑
        if(_this.select) {
            // 解绑select的点击事件
        	$("div[dtree-id='" + _this.obj[0].id + "'][dtree-select='"+_this.selectDiv+"']").removeClass("layui-form-selected");
            $("div[dtree-id='" + _this.obj[0].id + "'][dtree-card='"+_this.selectCardDiv+"']").removeClass("dtree-select-show layui-anim layui-anim-upbit");
            $("div[dtree-id='" + _this.obj[0].id + "'][dtree-select='"+_this.selectDiv+"']").unbind();
        }
    };


    /** 外部访问 **/
    var dtree = {
        set: function(options){ //设置全局属性
            if(typeof options !== 'undefined') {
                $.extend(OPTIONS, options);
            }
        },
        render: function(options){	// 初始化树
            var dTree = null;
            var id = event.getElemId(options);
            if(id == "") {
                layer.msg("页面中未找到绑定id", {icon:5});
            } else {
                dTree = DTrees[id];
                if(typeof dTree === 'object'){
                    dTree.unbindBrowserEvent();
                }
                // 创建树
                dTree = new DTree(options);
                // 添加到树数组中去
                DTrees[id] = dTree;
                dTree.initTreePlus();
                dTree.openTreePlus();
                dTree.init();
                dTree.bindBrowserEvent();
            }

            return dTree;
        },
        renderSelect: function(options){ 	// 初始化下拉树
            var dTree = null;
            var id = event.getElemId(options);
            if(id == "") {
                layer.msg("页面中未找到绑定id", {icon:5});
            } else {
                dTree = DTrees[id];
                if(typeof dTree === 'object'){
                    dTree.unbindBrowserEvent();
                }
                // 创建下拉树
                dTree = new DTree(options);
                dTree.selectSetting();
                // 添加到树数组中去
                DTrees[id] = dTree;
                dTree.initTreePlus();
                dTree.openTreePlus();
                dTree.init();
                dTree.bindBrowserEvent();
            }

            return dTree;
        },
        reload: function(dTree, options){  // 重新加载树
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            dTree.reloadSetting(options);
            dTree.initTreePlus();
            dTree.openTreePlus();
            dTree.initNodeParam();
            dTree.init();
            dTree.unbindBrowserEvent();
            dTree.bindBrowserEvent();
        },
        on: function(events, callback) {	// 绑定事件
            if(events.indexOf("'") > 0){
                events = events.replace(/'/g,"");
            }
            if(events.indexOf('"') > 0) {
                events = events.replace(/"/g,"");
            }
            return layui.onevent.call(this, MOD_NAME, events, callback);
        },
        click: function(dTree, id) { // 模拟单击事件
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            $("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-id='"+dTree.obj[0].id+"'][data-id='"+id+"']").click();
        },
        getNowParam: function(dTree){  // 获取当前选中值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.getNowParam();	// 获取当前选中值
        },
        getParam: function(dTree, id){  // 获取指定节点值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.getParam(id);	// 获取指定节点值
        },
        getParentParam: function(dTree, id){  // 获取参数的上级节点
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.getParentParam(id);
        },
        getAllParentParam: function(dTree, id){  // 获取参数的全部上级节点
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.getAllParentParam(id);
        },
        getChildParam: function(dTree, id){  // 获取参数的全部下级节点
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.getChildParam(id);
        },
        getCheckbarNodesParam: function(dTree){  // 获取复选框选中值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return {};
            }
            return dTree.getCheckbarNodesParam();	// 获取复选框选中值
        },
        dataInit: function(dTree, chooseId){  // 初始化选中树，针对数据反选
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            if(chooseId){
                return dTree.dataInit(chooseId);
            }
        },
        chooseDataInit: function(dTree, chooseIds){	// 初始化复选框选中，针对数据反选
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            if(chooseIds){
                return dTree.chooseDataInit(chooseIds);
            }
        },
        changeCheckbarNodes: function(dTree){	//判断复选框是否发生变更
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.changeCheckbarNodes();
        },
        initNoAllCheck: function(dTree) { //复选框半选状态初始化设置
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.initNoAllCheck();
        },
        initAllCheck: function(dTree){ // 复选框选中状态初始化设置
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.initAllCheck();
        },
        selectVal: function(dTree, param){  // select模式设置输入框选中值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法获取失败，请检查ID或对象传递是否正确",{icon:2});
                return ;
            }
            return dTree.selectVal(param);	// select模式设置输入框选中值
        },
        escape: function(html){  // 字符串格式化
            return event.escape(html);
        },
        unescape: function(str){  // 字符串反格式化
            return event.unescape(str);
        },
        version: function(){  //获取版本号
            return VERSION;
        }
    };

    exports('dtree', dtree);
});