layui.define(['jquery'],function (exports) {
    var $ = layui.$

    var modFile = layui.cache.modules['tinymce'];

    var modPath = modFile.substr(0, modFile.lastIndexOf('.'))

    var setter = layui.setter || {}

    var response = setter.response || {}

    var plugin_filename = 'tinymce.min.js'//插件路径，不包含base_url部分

    var settings = {
        base_url: modPath
        , images_upload_url: ''//图片上传接口，可在option传入，也可在这里修改，option的值优先
        , language: 'zh_CN'//语言，可在option传入，也可在这里修改，option的值优先
        , response: {//后台返回数据格式设置
            statusName: response.statusName || 'code'//返回状态字段
            , msgName: response.msgName || 'msg'//返回消息字段
            , dataName: response.dataName || 'data'//返回的数据
            , statusCode: response.statusCode || {
                ok: 0//数据正常
            }
        }
        , success: function (res, succFun, failFun) {//图片上传完成回调 根据自己需要修改
            if (res[this.response.statusName] == this.response.statusCode.ok) {
                succFun(res[this.response.dataName]);
            } else {
                failFun(res[this.response.msgName]);
            }
        }
    };

    //  ----------------  以下代码无需修改  ----------------

    var t = {};

    //初始化
    t.render = function (options,callback) {

        initTinymce();

        var option = initOptions(options,callback)

        ,edit = t.get(option.elem);

        if (edit) {
            edit.destroy();
        }

        tinymce.init(option);

        return t.get(option.elem);
    };

    t.init = t.render

    // 获取ID对应的编辑器对象
    t.get = function (elem) {

        initTinymce();

        if (elem && /^#|\./.test(elem)) {
            var id = elem.substr(1);
            var edit = tinymce.editors[id];
            return edit
        } else {
            return false;
        }
    }

    //重载
    t.reload = function (elem, option, callback) {
           
        var options = {}

        if(typeof elem == 'string'){
            option.elem = elem
            options = $.extend({}, option)
        } else if (typeof elem == 'object' && typeof elem.elem == 'string'){
            options = $.extend({}, elem)
            callback = option
        } 

        var optionCache = layui.sessionData('layui-tinymce')[options.elem]

        delete optionCache.init_instance_callback

        $.extend(optionCache,options)

        return t.render(optionCache,callback)
    }

    function initOptions(option,callback) {
        
        var admin = layui.admin || {}

        var form = option.form || {}

        var file_field = form.name || 'edit' //文件字段名

        var form_data = form.data || {} //其他表单数据 {key:value, ...}

        option.suffix= isset(option.suffix) ? option.suffix : (plugin_filename.indexOf('.min')>-1 ? '.min' : '')

        option.base_url = isset(option.base_url) ? option.base_url : settings.base_url

        option.language = isset(option.language) ? option.language : settings.language

        option.selector = isset(option.selector) ? option.selector : option.elem

        option.quickbars_selection_toolbar = isset(option.quickbars_selection_toolbar) ? option.quickbars_selection_toolbar : 'cut copy | bold italic underline strikethrough '

        option.plugins = isset(option.plugins) ? option.plugins : 'code quickbars print preview searchreplace autolink fullscreen image link media codesample table charmap hr advlist lists wordcount imagetools indent2em';

        option.toolbar = isset(option.toolbar) ? option.toolbar : 'code undo redo | forecolor backcolor bold italic underline strikethrough | indent2em alignleft aligncenter alignright alignjustify outdent indent | link bullist numlist image table codesample | formatselect fontselect fontsizeselect';

        option.resize = isset(option.resize) ? option.resize : false;

        option.elementpath = isset(option.elementpath) ? option.elementpath : false;

        option.branding = isset(option.branding) ? option.branding : false;

        option.contextmenu_never_use_native = isset(option.contextmenu_never_use_native) ? option.contextmenu_never_use_native : true;

        option.menubar = isset(option.menubar) ? option.menubar : 'file edit insert format table';

        option.menu = isset(option.menu) ? option.menu : {
            file: {title: '文件', items: 'newdocument | print preview fullscreen | wordcount'},
            edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext selectall | searchreplace'},
            format: {
                title: '格式',
                items: 'bold italic underline strikethrough superscript subscript | formats | forecolor backcolor | removeformat'
            },
            table: {title: '表格', items: 'inserttable tableprops deletetable | cell row column'},
        };

        option.init_instance_callback =isset(option.init_instance_callback) ? option.init_instance_callback : function(inst) {
            if(typeof callback == 'function') callback(option,inst)
        };

        option.images_upload_url = isset(option.images_upload_url) ? option.images_upload_url : settings.images_upload_url;

        option.images_upload_handler = isset(option.images_upload_handler) ? option.images_upload_handler : function(blobInfo, succFun, failFun) {
            if(isEmpty(option.images_upload_url)){
                failFun("上传接口未配置");
                return console.error('images_upload_url未配置');
            }
            var formData = new FormData();
            formData.append(file_field, blobInfo.blob());
            if(typeof form_data == 'object'){
                for(var key in form_data){
                    formData.append(key, form_data[key]);
                }
            }
            var ajaxOpt = {
                url: option.images_upload_url,
                dataType: 'json',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    settings.success(res, succFun, failFun)
                },
                error: function (res) {
                    failFun("网络错误：" + res.status);
                }
            };
            if (typeof admin.req == 'function') {
                admin.req(ajaxOpt);
            } else {
                $.ajax(ajaxOpt);
            }
        }

        layui.sessionData('layui-tinymce',{
            key:option.selector,
            value:option
        })
        return option
    }

    function initTinymce() {
        if (typeof tinymce == 'undefined') {
            $.ajax({//获取插件
                url: settings.base_url + '/' + plugin_filename,
                dataType: 'script',
                cache: true,
                async: false,
            });
        }
    }

    function isset(value) {
        return typeof value !== 'undefined' && value !== null
    }

    function isEmpty(value) {
        if(typeof value === 'undefined' || value === null|| value === ''){
            return true
        } else if (value instanceof Array && value.length === 0){
            return true
        } else if (typeof value === 'object' && Object.keys(value).length === 0){
            return true
        }
        return false
    }

    exports('tinymce', t);

});
