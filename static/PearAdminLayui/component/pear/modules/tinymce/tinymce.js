//  菜单显示异常修改tinymce/skins/ui/oxide/skin.min.css:96 .tox-silver-sink的z-index值
//  http://tinymce.ax-z.cn/   中文文档

layui.define(['jquery'],function (exports) {
    var $ = layui.$

    var modFile = layui.cache.modules['tinymce'];

    var modPath = modFile.substr(0, modFile.lastIndexOf('.'))

    var setter = layui.setter || {}

    var response = setter.response || {}

    var settings = {
        base_url: modPath
        , images_upload_url: '/rest/doUpload'//图片上传接口
        , language: 'zh_CN'
        , response: {
            statusName: response.statusName || 'code'//返回状态字段
            , msgName: response.msgName || 'msg'//返回消息字段
            , dataName: response.dataName || 'data'//返回的数据
            , statusCode: response.statusCode || {
                ok: 0//数据正常
            }
        }
        , success: function (res, succFun, failFun) {//上传完成回调
            if (res[this.response.statusName] == this.response.statusCode.ok) {
                succFun('/showImage/' + res[this.response.dataName][0]['id']);
            } else {
                failFun(res[this.response.msgName]);
            }
        }
    };

    var t = {};

    t.render = function (option) {

        var admin = layui.admin || {}

        option.base_url = option.base_url ? option.base_url : settings.base_url

        option.language = option.language ? option.language : settings.language

        option.selector = option.selector ? option.selector : option.elem

        option.quickbars_selection_toolbar = option.quickbars_selection_toolbar ? option.quickbars_selection_toolbar : 'cut copy | bold italic underline strikethrough '

        option.plugins = option.plugins ? option.plugins : 'quickbars print preview searchreplace autolink fullscreen image link media codesample table charmap hr advlist lists wordcount imagetools indent2em';

        option.toolbar = option.toolbar ? option.toolbar : 'undo redo | forecolor backcolor bold italic underline strikethrough | indent2em alignleft aligncenter alignright alignjustify outdent indent | link bullist numlist image table codesample | formatselect fontselect fontsizeselect';

        option.resize = false;

        option.elementpath = false

        option.branding = false;

        option.contextmenu_never_use_native = true;

        option.menubar = option.menubar ? option.menubar : 'file edit insert format table';

        option.images_upload_url = option.images_upload_url ? option.images_upload_url : settings.images_upload_url;

        option.images_upload_handler = option.images_upload_handler !=null? option.images_upload_handle:function (blobInfo, succFun, failFun) {

            var formData = new FormData();

            formData.append('target', 'edit');

            formData.append('edit', blobInfo.blob());

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

        option.menu = option.menu ? option.menu : {
            file: {title: '文件', items: 'newdocument | print preview fullscreen | wordcount'},
            edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext selectall | searchreplace'},
            format: {
                title: '格式',
                items: 'bold italic underline strikethrough superscript subscript | formats | forecolor backcolor | removeformat'
            },
            table: {title: '表格', items: 'inserttable tableprops deletetable | cell row column'},
        };

        $.ajax({//获取插件
            url: option.base_url + '/tinymce.js',

            dataType: 'script',

            cache: true,

            async: false,
        });

        tinymce.init(option);

        t.tinymce = tinymce;

        return tinymce.activeEditor;
    };
    exports('tinymce', t);
});