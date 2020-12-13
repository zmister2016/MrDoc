
# iceEditor富文本编辑器

#### 官方
+ iceEditor 官方网站 [https://www.iceui.net/iceEditor.html](https://www.iceui.net/iceEditor.html)
+ iceEditor 示例文档 [https://www.iceui.net/iceEditor/doc.html](https://www.iceui.net/iceEditor/doc.html)

#### 介绍
iceEditor是一款简约风格的富文本编辑器，体型十分娇小，无任何依赖，整个编辑器只有一个文件，功能却很不平凡！简约的唯美设计，简洁、极速、使用它的时候不需要引用jQuery、font、css……等文件，因为整个编辑器只是一个Js，支持上传图片、附件！支持添加音乐、视频！
iceEditor官方群：324415936

#### 优点
+ 纯原生开发，无任何依赖，冰清玉洁
+ 响应式布局，适应任何分辨率的设备
+ 整个编辑器只有一个文件，高效便捷
+ 简约的唯美设计，简洁、极速

#### 最新更新
# iceEditor v1.1.8
+ **2020-11-06**
+ [新增] 富文本粘贴按钮
+ [修复] 粘贴时或者文件上传造成多余的p、br标签BUG
+ [修复] 分割线样式消失BUG
+ **2020-10-23**
+ [新增] filterTag标签过滤
+ [新增] filterStyle样式过滤
+ [新增] word粘贴
+ [新增] 富文本粘贴
+ [新增] 粘贴图片
+ [新增] 粘贴时，网络图片下载到本地
+ [新增] 上传图片和附件的监听方法
# iceEditor v1.1.7
+ **2020-09-25**
+ [修复] line的样式问题
+ **2020-09-09**
+ [增加] 增加禁用输入方法
+ [增加] 增加启用输入方法
+ [增加] 增加监听输入方法
+ **2020-09-02**
+ [修复] ajax进度条报错问题
+ **2020-07-27**
+ [修改] 将所有的语义标签、文字大小、颜色、粗体、删除线、斜体……全部改为span标签，使用style定义样式
+ [增加] 将当前光标位置样式，同步到菜单高亮上
+ [增加] ajax一系列配置项
+ [增加] 插入表情功能以及配置项
+ **2020-07-25**
+ [修复] 源码视图下，p标签错位
+ [修复] 源码视图下，粘贴出现多余的p标签
+ [查看其它更新](https://www.iceui.net/iceEditor/update.html) 

#### 提示
[iceui](https://gitee.com/iceui/iceui) 前端框架已经已集成该编辑器。

#### 注意
iceEditor.js的引用禁止放在head标签内，请尽量放在body中或body后面！

#### 引入
+ 下载下来直接引入iceEditor.js即可，放在body中或body后面
+ 推荐引入下面的cdn加速链接
+ CDN最新版：https://cdn.jsdelivr.net/gh/iceuinet/iceEditor@latest/src/iceEditor.min.js
+ 需要CDN历史版，请更改@后面的版本号，最低为1.1.6版本
+ 历史版：https://cdn.jsdelivr.net/gh/iceuinet/iceEditor@1.1.6/src/iceEditor.min.js

#### 使用
```html
<!-- 也可以直接使用textarea，放在form表单中可以直接提交 -->
<!-- <textarea id="editor" name="content"> 欢迎使用iceEditor富文本编辑器 </textarea> -->
<div id="editor"> 欢迎使用iceEditor富文本编辑器 </div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/iceuinet/iceEditor/src/iceEditor.min.js"></script>
```
```javascript
//第一步：创建实例化对象
var e = new ice.editor('content');

//第二步：配置图片或附件上传提交表单的路径
//如果你的项目使用的php开发，可直接使用upload.php文件
//其它的编程语言需要你单独处理，后期我会放出.net java等语言代码
//具体与你平常处理multipart/form-data类型的表单一样
//唯一需要注意的就是：处理表单成功后要返回json格式字符串，不能包含其它多余的信息：
//url：文件的地址
//name：文件的名称（包含后缀）
//error：上传成功为0，其它为错误信息，将以弹窗形式提醒用户
//例如批量上传了两张图片：
//[
//	{url:'/upload/img/153444.jpg', name:'153444.jpg', error:0},
//	{url:'/upload/img/153445.jpg', name:'153445.jpg', error:'禁止该文件类型上传'}
//]
e.uploadUrl="/iceEditor/src/upload.php";

//第三步：配置菜单（默认加载全部，无需配置）
e.menu = [
  'backColor',                 //字体背景颜色
  'fontSize',                  //字体大小
  'foreColor',                 //字体颜色
  'bold',                      //粗体
  'italic',                    //斜体
  'underline',                 //下划线
  'strikeThrough',             //删除线
  'justifyLeft',               //左对齐
  'justifyCenter',             //居中对齐
  'justifyRight',              //右对齐
  'indent',                    //增加缩进
  'outdent',                   //减少缩进
  'insertOrderedList',         //有序列表
  'insertUnorderedList',       //无序列表
  'superscript',               //上标
  'subscript',                 //下标
  'createLink',                //创建连接
  'unlink',                    //取消连接
  'hr',                        //水平线
  'table',                     //表格
  'files',                     //附件
  'music',                     //音乐
  'video',                     //视频
  'insertImage',               //图片
  'removeFormat',              //格式化样式
  'code',                      //源码
  'line'                       //菜单分割线
];

//第四步：创建
e.create();
```

#### 设置编辑器尺寸
```javascript
var e = new ice.editor('content');
e.width='700px';   //宽度
e.height='300px';  //高度
e.create();
```

#### 禁用编辑器
```javascript
//初始化过程中的禁用方式
var e = new ice.editor('content');
e.disabled=true;
e.create();

//通过方法禁用输入
e.inputDisabled();

//取消禁用，恢复输入状态
e.inputEnable();
```

#### 获取内容
```javascript
var e = new ice.editor('content');
console.log(e.getHTML());  //获取HTML格式内容
console.log(e.getText());  //获取Text格式内容
console.log(e.getValue());  //同getHTML，只是为了好记
```

#### 设置内容
```javascript
var e = new ice.editor('content');
e.setValue('hello world！');
```

#### 追加内容
```javascript
var e = new ice.editor('content');
e.addValue('hello world！');
```

#### 监听输入内容
```javascript
var e = new ice.editor('content');
//html：html格式
//text：纯文本格式
e.inputCallback(function(html,text){
  //console.log(this.getHTML()) 方法内的this为e对象，html等价于this.getHTML()
  console.log(html);
});
```

#### 禁用截图粘贴功能
```javascript
var e = new ice.editor('content');
e.screenshot=false;
```

#### 禁用截图粘贴直接上传功能
```javascript
//禁用后，将默认以base64格式显示图片
var e = new ice.editor('content');
e.screenshotUpload=false;
```

#### 网络图片自动下载到本地
```javascript
var e = new ice.editor('content');
e.imgAutoUpload=false;
```

#### 开启富文本粘贴，可粘贴Word
```javascript
var e = new ice.editor('content');
e.pasteText=false;
```

#### 配置插入表情的表情列表
```javascript
var e = new ice.editor('content');

//type分两种，img和text，类型img为图片表情，content为图片的地址，类型text为文字表情，content为文字表情
//以下是简单示例，收集于网络，由某网友整理，仅供参考，如有版权侵犯，请您及时联系我，QQ：308018629，我将及时处理！
//如果您有推荐的开源免费的表情，可联系我或者进入官方QQ群324415936，我将表情内置到编辑器中
e.face=[{
    title: '新浪',
    type: 'img',
    list: [
      {title:'嘻嘻',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif'},
      {title:'哈哈',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif'},
      {title:'可爱',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif'},
      {title:'可怜',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif'},
      {title:'挖鼻屎',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif'},
      {title:'吃惊',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif'},
      {title:'害羞',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif'},
      {title:'挤眼',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif'},
      {title:'闭嘴',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif'},
      {title:'鄙视',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif'},
      {title:'爱你',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif'},
      {title:'泪',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif'},
      {title:'偷笑',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif'},
      {title:'亲亲',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif'},
      {title:'生病',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif'},
      {title:'太开心',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif'},
      {title:'懒得理你',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif'},
      {title:'右哼哼',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif'},
      {title:'左哼哼',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif'},
      {title:'嘘',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif'},
      {title:'衰',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif'},
      {title:'委屈',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif'},
      {title:'吐',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif'},
      {title:'打哈欠',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif'},
      {title:'抱抱',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif'},
      {title:'怒',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif'},
      {title:'疑问',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif'},
      {title:'馋嘴',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif'},
      {title:'拜拜',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif'},
      {title:'思考',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif'},
      {title:'汗',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif'},
      {title:'困',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif'},
      {title:'睡觉',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif'},
      {title:'钱',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif'},
      {title:'失望',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif'},
      {title:'酷',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif'},
      {title:'花心',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif'},
      {title:'哼',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif'},
      {title:'鼓掌',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif'},
      {title:'晕',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif'},
      {title:'悲伤',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif'},
      {title:'抓狂',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif'},
      {title:'黑线',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif'},
      {title:'阴险',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif'},
      {title:'怒骂',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif'},
      {title:'心',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif'},
      {title:'伤心',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif'},
      {title:'ok',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif'},
      {title:'耶',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif'},
      {title:'good',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif'},
      {title:'不要',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif'},
      {title:'赞',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif'},
      {title:'来',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif'},
      {title:'弱',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif'},
      {title:'蜡烛',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif'},
      {title:'蛋糕',content:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif'}
    ]
  }, {
    title: '文字',
    type: 'text',
    list: [
      {title:'开心',content:'(^_^)'},
      {title:'受不了',content:'(>_<)'},
      {title:'鄙视',content:'(¬､¬)'},
      {title:'难过',content:'(*>﹏<*)'},
      {title:'可爱',content:'(｡◕‿◕｡)'},
      {title:'无奈',content:'╮(╯_╰)╭'},
      {title:'惊喜',content:'╰(*°▽°*)╯'},
      {title:'听音乐',content:'♪(^∇^*)'},
      {title:'害羞',content:'(✿◡‿◡)'},
      {title:'睡啦',content:'(∪｡∪)..zzZ'},
      {title:'臭美',content:'(o≖◡≖)'},
      {title:'流汗',content:'(ーー゛)'}
    ]
  }];
e.create();
```

#### ajax回调
```javascript
var e = new ice.editor('content');

//ajax的xhr设置
e.ajax.xhr = function(xhr){};  

//ajax超时回调   
e.ajax.timeout = function(xhr){};

//ajax成功回调
e.ajax.success = function(res,xhr){};

//ajax失败回调
e.ajax.error = function(res,xhr){};

//ajax不管成功失败都调用
e.ajax.complete = function(res,xhr){};

//ajax进度回调
e.ajax.progress = function(percent,evt,xhr){};

//上传附件
e.filesUpload.success = function(res){};      //成功
e.filesUpload.error = function(res,xhr){};    //失败
e.filesUpload.complete = function(res,xhr){}; //不管成功失败都调用

//上传图片
e.imgUpload.success = function(res){};      //成功
e.imgUpload.error = function(res,xhr){};    //失败
e.imgUpload.complete = function(res,xhr){}; //不管成功失败都调用
```

#### 插件开发
```javascript
var e = new ice.editor('content');
e.addValue('hello world！');

//┌────────────────────────────────────────────────────────────────────────
//│ e.plugin(options)传参说明
//│────────────────────────────────────────────────────────────────────────
//│ options     {json}
//│  ├ name     {string}   [必填]菜单唯一的name，可配置menu项显示与顺序
//│  ├ menu     {string}   [必填]展示在菜单栏上的按钮，可为图标或者文字
//│  ├ data     {string}   execCommand的命令
//│  ├ id       {string}   菜单按钮上的id
//│  ├ css      {string}   菜单按钮上的class
//│  ├ style    {string}   该插件的style，以css文件中的样式形式书写
//│  ├ dropdown {string}   下拉菜单里的html，如果定义了popup，则该参数失效
//│  ├ popup    {json} 弹窗json
//│  │    ├ width   {int}    弹窗的宽度
//│  │    ├ height  {int}    弹窗的高度
//│  │    ├ title   {string} 弹窗上的标题
//│  │    └ content {string} 弹窗的内容，可为html
//│  ├ click   {function} 按钮点击事件
//│  └ success {function} 插件安装成功后会自动执行该方法
//└────────────────────────────────────────────────────────────────────────

//下拉菜单类型
e.plugin({
    menu:'代码语言',
    name:'codeLanguages',
    dropdown:`
        <div class="iceEditor-codeLanguages" style="padding:10px 20px;">
            <div>前端请引用iceCode.js</div>
            <select>
                <option disabled selected>代码语言</option>
                <option value ="php">php</option>
                <option value ="js">js</option>
                <option value="html">html</option>
                <option value="java">java</option>
            </select>
        </div>`,
    success:function(e,z){
        //获取content中的按钮
        var select = e.getElementsByTagName('select')[0];
        //设置点击事件
        select.onchange=function(){
            var str = z.getSelectHTML().replace(/<\s*\/p\s*>/ig,"\r\n").replace(/<[^>]+>/ig,'').trim();
            var pre = z.c('pre');
            pre.className = 'iceCode:'+select.value;
            pre.innerHTML = str.length?str:"\r\n";
            z.setHTML(pre,true);
            select.getElementsByTagName('option')[0].selected = true;
        }   
    }
});

//function方式
e.plugin({
	menu:'function方式',
	name:'click',
	click:function(e,z){
		z.setText('hello world');
	}
});
//execCommand命令
e.plugin({
	menu:'删除命令',
	name:'del',
	data:'delete'
});
//下拉菜单类型
e.plugin({
	menu:'下拉菜单',
	name:'dropdown',
	dropdown:'<div class="iceEditor-exec" data="copy" style="padding:10px 20px;">复制选中的文字</div>',
});
//弹出层类型
e.plugin({
	menu:'弹窗演示',
	name:'popup',
	style:'.demo-p{margin-bottom:10px}.demo-button{padding:0 10px}',
	popup:{
		width:230,
		height:120,
		title:'我是一个demo',
		content:'<p class="demo-p">在光标处插入hello world!</p> <button class="demo-button" type="button">确定</button>',
	},
	success:function(e,z){
		//获取content中的按钮
		var btn = e.getElementsByTagName('button')[0];
		//设置点击事件
		btn.onclick=function(){
			z.setText('hello world');
			//关闭本弹窗
			e.close()
		}	
	}
});
e.create();
```