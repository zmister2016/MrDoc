// ****生成可编辑HTML表格****
function InsertLine(obj) {
  var table_id = "#" + $(obj).attr("name");
  var name = $(obj).attr("name");
  var count = $(obj).parent().prevAll().length - 1;
  console.log(count);
  $(obj).parent().parent().after(linebody(count, name));
  for (var i = 1; i < $(table_id).find("tr").length; i++) {
      var Lnum = i + "#";
      $(table_id).find("tr").eq(i).find("td").eq(0).html(Lnum);
  }
}

function linebody(count, name) {
  var body = "<tr><td></td>";
  for (var i = 0; i < count; i++) {
      body += "<td><div contenteditable='true'></div></td>";
  }

  body += "<td><img src='/static/mrdoc-editor/add.gif' name='" + name + "' style='cursor: pointer' onclick='InsertLine(this)'>" +
      "<img src='/static/mrdoc-editor/delete.gif'  name='" + name + "' style='cursor: pointer' onclick='DeleteLine(this)'></td>";
  body += "</tr>";

  return body;
}

function DeleteLine(obj) {
  var table_id = "#" + $(obj).attr("name");
  $(obj).parent().parent().remove();
  for (var i = 1; i < $(table_id).find("tr").length; i++) {
      var Lnum = i + "#";
      $(table_id).find("tr").eq(i).find("td").eq(0).html(Lnum);
  }
}

function Deleterow(obj) {
  var table_id = "#" + $(obj).attr("name");
  var ti = $(obj).parent().prevAll().length;
  console.log(ti);
  for (var i = 0; i < $(table_id).find("tr").length; i++) {
      $(table_id).find("tr").eq(i).find("td").eq(ti).remove();
  }
}

function Insertrow(obj) {
  var ti = $(obj).parent().prevAll().length;
  var table_id = "#" + $(obj).attr("name");
  var name=$(obj).attr("name");
  var width = $(table_id).width();
  var td1 = "<td><div contenteditable='true' ></div></td>"
  var td = "<td><div contenteditable='true' style='float: left;width: 70%'>列名</div><img src='/static/mrdoc-editor/delete.gif'  name='" + name + "' style='cursor: pointer' onclick='Deleterow(this)'></td>"
  for (var i = 0; i < $(table_id).find("tr").length; i++) {
      if (i == 0) {
          $(table_id).find("tr").eq(i).find("td").eq(ti).before(td);
      } else {
          $(table_id).find("tr").eq(i).find("td").eq(ti).before(td1);
      }

  }
  var n = $(table_id).find("tr").length;
  width = width / n;
  for (var i = 0; i < $(table_id).find("tr").eq(0).find("td").length - 1; i++) {
      $(table_id).find("tr").eq(0).find("td").eq(i).width(width);
  }
}

function addbutton() {
  var btn = $("#TableGroup").find("table").length;
  var button = "<input type='button' value='表格" + btn + "' name='DataTable" + btn + "' id='DataBtn" + btn + "'\n" +
      "style='float:left' class='btn table-btn' onclick='changetable(this)'>";
  $("#BtnGroup").append(button);
  addtable(btn);
  var id = "#DataBtn" + btn;
}

function addtable(btn) {
  $("#TableGroup").empty();
  var row = $("#row").val();
  var col = $("#col").val();
  var id = '#DataTable' + btn;
  var name = 'DataTable' + btn;
  var body = "<table id='DataTable" + btn + "'  class='layui-table' style='text-align: center'><tr>";
  for (var i = 0; i <= col; i++) {
      if (i == 0) {
          body += "<td>序号</td>"
      } else {
          body += "<td><div contenteditable='true' style='float: left;width: 70%'>列名</div><img src='/static/mrdoc-editor/delete.gif' name='" + name + "' style='cursor: pointer' onclick='Deleterow(this)'></td>";

      }
  }
  body += "</tr>"
  for (var i = 1; i <= row; i++) {
      body += "<tr>";
      for (var j = 0; j <= col; j++) {
          if (j == 0) {
              body += "<td><div style='text-align: center;height: 100%'>" + i + "#</div></td>";
          } else {
              body += "<td><div contenteditable='true' style='text-align: center;height: 100%'></div></td>";
          }
      }
      body += "</tr>";
  }
  body += "</table>";
  $("#TableGroup").append(body);

  addsrc(id, name);
  $(id).siblings().hide();
  $(id).show();

}

function changetable(obj) {
  var table_id = "#" + $(obj).attr("name");
  $(table_id).siblings().hide();
  $(table_id).show();
  $(obj).addClass("btn-success");
  $(obj).siblings().removeClass("btn-success");
}

function addsrc(id, name) {
  for (var i = 0; i < $(id).find("tr").length; i++) {
      if (i == 0) {
          var td = "<td class='small'><img src='/static/mrdoc-editor/add.gif' name='" + name + "' style='cursor: pointer' onclick='Insertrow(this)'></td>";
          $(id).find("tr").eq(i).append(td);
      } else {
          var td = "<td><img src='/static/mrdoc-editor/add.gif' name='" + name + "' style='cursor: pointer' onclick='InsertLine(this)'>" +
              "<img src='/static/mrdoc-editor/delete.gif' name='" + name + "' style='cursor: pointer' onclick='DeleteLine(this)'></td>";
          $(id).find("tr").eq(i).append(td);
      }

  }
}


// **********HTML Table转Markdown相关js**************************** //

var NL = "\n";

// 转换表格 - 传入一个默认的id1
function convertTable(id) {
    var table = document.getElementById('DataTable1')
    var markdownResults = '';
    var tableElement = table;
    var markdownTable = convertTableElementToMarkdown(tableElement);
    markdownResults += markdownTable + NL + NL;
    return markdownResults;
  }

function reportResult(msg) {
  console.log(msg)
}

// 转换表格为Markdown
function convertTableElementToMarkdown(tableEl) {
  var rows = [];
  // 删除每行tr的第一个和最后一个td
  var trEls = tableEl.getElementsByTagName('tr');
  for(var i=0; i<trEls.length; i++) {
    var tableRow = trEls[i]; // 每一行tr
    var markdownRow = convertTableRowElementToMarkdown(tableRow, i);
    rows.push(markdownRow);
  }
  return rows.join(NL);
}

// 转换表格的行为Markdown
function convertTableRowElementToMarkdown(tableRowEl, rowNumber) {
  var cells = [];
  var cellEls = tableRowEl.children; // 每一个td
  for(var i=1; i<cellEls.length-1; i++) { // 从第二个td开始遍历，到倒数第二个td，也就是去除第一列的标识列和最后一列操作列
    var cell = cellEls[i];
    cells.push(cell.innerText.replace(/[\r\n]/g, '') + ' |');
    console.log(cells)
  }
  var row = '| ' + cells.join(" ");
  console.log('一行数据：')
  console.log(row)
  if(rowNumber == 0) {
    row = row + NL + createMarkdownDividerRow(cellEls.length-2); // length -2 就是去除第一列和最后一列的长度
  }
  return row;
}

// 创建Markdown分割线
function createMarkdownDividerRow(cellCount) {
  var dividerCells = [];
  for(i = 0; i<cellCount; i++) {
    dividerCells.push('---' + ' |');
  }
  return '| ' + dividerCells.join(" ");
}


// 文档浏览器缓存
function autoCacheDoc(){
  setInterval(() => {
      if(editor_mode == 1){
        var editor_value = editor.getMarkdown()
      }else if(editor_mode == 2){
        var editor_value = editor.getValue()
      }else if(editor_mode == 3){
        var editor_value = editor.getHTML()
      }
      window.localStorage.setItem('mrdoc_doc_cache',editor_value)
  }, 10000);
};

// 查看本地文档缓存
$("#doc-cache-btn").click(function(){
    var editor_cache = window.localStorage.getItem('mrdoc_doc_cache') // 获取文档缓存内容
    if(editor_cache === null){
        var editor_cache_cnt = 0
    }else{
        var editor_cache_cnt = editor_cache.replace(/\s+|[\r\n]/g,"").length
    }
    if(editor_cache_cnt > 5){ // 文档缓存去除空格换行后长度大于5
        console.log("存在文档缓存")
        $("#doc-cache-content").val(editor_cache)
        layer.open({
            title:"浏览器文档缓存",
            type:1,
            id:'doc-cache',
            area:['500px','500px'],
            content:$('#doc-cache-div'),
            btn:['使用缓存',"删除缓存"],
            success : function(index, layero) { // 成功弹出后回调
                form.render();
            },
            yes:function(index, layero){
                if(editor_mode == 1){
                    editor.insertValue(editor_cache)
                }else if(editor_mode == 2){
                    editor.setValue(editor_cache)
                }else if(editor_mode == 3){
                    editor.setValue(editor_cache)
                }
                window.localStorage.removeItem('mrdoc_doc_cache')
                layer.closeAll()
                autoCacheDoc();
            },
            btn2:function(index,layero){
                window.localStorage.removeItem('mrdoc_doc_cache')
                layer.closeAll()
            }
        })
    }else{
        layer.msg("暂无本地缓存")
    }
})

//修改预览div中a标签链接新窗口打开
$('div.editormd-preview').on('click','a',function(e){
  e.target.target = '_blank';
});
$("div.editormd-preview").on('click','a',function(e){
  e.target.target = '_blank';
})

/*
    小屏幕下的文集大纲显示处理
*/
//监听浏览器宽度的改变
window.onresize = function(){
    changeSidebar();
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
        $("body").removeClass("big-page");
    }
};
// 监听文档div点击
document.querySelector('.doc-body').addEventListener('click', function (e) {
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
//切换侧边栏显示隐藏
function toggleSidebar(){
    console.log("切换侧边栏")
    $("body").toggleClass("big-page");
    if(window.localStorage.getItem('bgpage') === '1'){
        window.localStorage.setItem('bgpage','0')
    }else{
        window.localStorage.setItem('bgpage','1')
    }
    return false;
}

//监听图片Tab选项卡切换
element.on('tab(img-tab)', function(data){
  //console.log(this); //当前Tab标题所在的原始DOM元素
  //console.log(data.index); //得到当前Tab的所在下标
  //console.log(data.elem); //得到当前的Tab大容器
  if(data.index == 1){
    layer.load(1);
    console.log('选择图片')
    $("#select-img-group").empty(); //删除已有分组按钮
    //请求新的分组数据
    $.post("/manage_image_group/",{'types':3},function(r){
        if(r.status){
            group_btn_str = ''
            for(var i in r.data){
                group_btn_str += '<button class="layui-btn layui-btn-normal layui-btn-sm" onclick="switchImgGroup(' + r.data[i].group_id +')">' + r.data[i].group_name + '(' + r.data[i].group_cnt + ')</button>'
            };
            $("#select-img-group").append(group_btn_str)
        }
    });
    //请求全部图片数据
    $.post("/manage_image/",{'types':2,'group_id':0},function(r){
        if(r.status){
            //调用分页显示
            laypage.render({
                elem: 'select-img-page',//分页的div
                count: r.data.length, //数据总数
                limit:15, //单页数
                jump: function(obj){
                    //渲染HTML
                    document.getElementById('select-img').innerHTML = function(){
                        var arr = []
                        var thisData = r.data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                        layui.each(thisData, function(index, item){
                            arr.push('<li class="select-img-list"><img class="select-img-list-i" onclick="insertImg(this);" src="' + item.path + '" title="' + item.name + '"data-url="' + item.path +'" /></li>');
                        });
                    return arr.join('');
                    }();
                }
            });
            layer.closeAll("loading");
        }else{
            layer.closeAll("loading");
            layer.msg("获取图片失败")
        }
    })
  }
});

// 插入选择的图片到编辑器
insertImg = function(e){
  console.log(e);
  if(editor_mode == 3){
    editor.addValue('<img src="' + e.getAttribute('data-url').replace(" ",'%20') + '" />')
  }else{
    editor.insertValue("\n![](" + e.getAttribute('data-url').replace(" ",'%20') + ")");
    editor.focus()
  }
  
};

// 按钮点击插入输入框图片链接
insertImgUrl = function(){
    if(editor_mode == 3){
        editor.addValue('<img src="' + $("#img_url_input").val() + '" />')
    }else{
        editor.insertValue("\n![](" + $("#img_url_input").val() + ")");
        editor.focus()
    }
    $("#img_url_input").val("")
    layer.closeAll();
    
};

// 切换图片分组
switchImgGroup = function(e){
  layer.load(1);
  $.post("/manage_image/", {
      'types': 2,
      'group_id': e
  },
  function(r) {
      if (r.status) {
          //调用分页显示
          laypage.render({
              elem: 'select-img-page',//分页的div
              count: r.data.length,//数据总数
              limit: 15,//单页数
              jump: function(obj) {
                  //渲染HTML
                  document.getElementById('select-img').innerHTML = function() {
                      var arr = []
                      var thisData = r.data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                      layui.each(thisData,
                      function(index, item) {
                          arr.push('<li class="select-img-list"><img class="select-img-list-i" onclick="insertImg(this);" src="' + item.path + '" title="' + item.name + '"data-url="' + item.path + '" /></li>');
                      });
                      return arr.join('');
                  } ();
              }
          });
          layer.closeAll("loading"); //关闭加载提示
      } else {
          layer.closeAll("loading");
          layer.msg("获取分组图片失败")
      }
  })
};

// 插入选择的附件到编辑器
insertAttach = function(e){
    if(editor_mode == 3){ // ice富文本编辑器
        editor.addValue('<a href= "/media/' + $(e).data('path') + '" download="' + $(e).data('name') + '">' + '[附件]' + $(e).data('name') + '</a>')
    }else{
        editor.insertValue("\n[【附件】"+ $(e).data('name') + "](/media/" + $(e).data('path') + ")");
    }
    layer.closeAll();
    
};

// 插入音视频到编辑器
insertMultimedia = function(e){
    if(e === 'audio'){
        editor.insertValue("\n![=audio](" + $("#audio_input").val() + ")");
    }else if(e === 'video'){
        editor.insertValue("\n![=video](" + $("#video_input").val() + ")");
    }else if(e === 'video_iframe'){
        editor.insertValue("\n![=video_iframe](" + $("#video_iframe_input").val() + ")");
    }
    $("#audio_input").val('')
    $("#video_input").val('')
    $("#video_iframe_input").val('')
    layer.closeAll();
    editor.focus()
};

//按钮选择上传图片
var upload = layui.upload;
upload.render({
    elem: '#upload_img',
    url: '/upload_doc_img/',
    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        layer.load(1); //上传loading
    },
    done: function(res, index, upload){ //上传后的回调
        //上传成功
        if(res.success == 1){
            if(editor_mode == 3){
                editor.addValue('<img src="' + res.url.replace(" ",'%20') + '" />')
            }else{
                editor.insertValue("\n![](" + res.url.replace(" ",'%20') + ")");
            }
            
            layer.closeAll();
            layer.msg("上传成功");
        }else{
            layer.closeAll();
            layer.msg(res.message)
        }
    },
    error:function(){
        layer.closeAll('loading'); //关闭loading
        layer.msg("系统异常，请稍后再试！")
    },
    accept: 'images', //允许上传的文件类型
    acceptMime:'image/*',
    field:'manage_upload',
});

// 按钮选择上传附件
var upload_attach = layui.upload;
upload_attach.render({
    elem: '#upload_attachment',
    url: '/manage_attachment/',
    data:{types:0},
    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        layer.load(1); //上传loading
    },
    done: function(res, index, upload){ //上传后的回调
        //上传成功，刷新页面
        if(res.status){
            if(editor_mode == 3){
                editor.addValue('<a href= "/media/' + res.data.url + '" download="' + res.data.name + '">' + '[附件]' + res.data.name + '</a>')
            }else{
                editor.insertValue("\n[【附件】"+ res.data.name + "](/media/" + res.data.url + ")");
            }
            layer.closeAll();
            layer.msg("上传成功");
        }else{
            layer.closeAll('loading');
            layer.msg(res.data)
        }
    },
    error:function(){
        layer.closeAll('loading'); //关闭loading
        layer.msg("系统异常，请稍后再试！")
    },
    accept: 'file', //允许上传的文件类型
    field:'attachment_upload',
})

// 按钮上传docx文档
var upload_docx_doc = layui.upload;
upload_docx_doc.render({
    elem:"#import-doc-docx",
    url:"/import/doc_docx/",
    data:{'type':'docx','editor_mode':editor_mode},
    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        layer.load(1); //上传loading
    },
    accept: 'file', //允许上传的文件类型
    exts:'docx',
    field:'import_doc_docx',
    done: function(res, index, upload){ //上传后的回调
        //上传成功，刷新页面
        if(res.status){
            if(editor_mode == 3){
                editor.addValue(res.data)
            }else if(editor_mode == 1){
                editor.insertValue(res.data);
            }else if(editor_mode == 2){
                editor.setValue(res.data);
            }
            layer.closeAll();
            layer.msg("导入成功");
        }else{
            layer.closeAll('loading');
            layer.msg(res.data)
        }
    },
    error:function(){
        layer.closeAll('loading'); //关闭loading
        layer.msg("系统异常，请稍后再试！")
    },
});

$("#doc-tag-set").click(function(){
    layer.open({
        type:1,
        title:"文档标签设置",
        content:$("#doc-tag-div"),
        area:['300px'],
        btn:['确定']
    })
});

// 粘贴表格文本框侦听paste粘贴事件
// 列宽的函数
function columnWidth(rows, columnIndex) {
  return Math.max.apply(null, rows.map(function(row) {
      return row[columnIndex].length
  }))
};

// 检查是否是个表格
function looksLikeTable(data) {
    return true
};
// 编辑器侦听paste粘贴事件
var pasteExcel = document.getElementById('pasteExcel')
pasteExcel.addEventListener("paste", function(event) {
    console.log('粘贴Excel')
    var clipboard = event.clipboardData
    var data = clipboard.getData('text/plain')
    data = data.replace(/(?:[\n\u0085\u2028\u2029]|\r\n?)$/, '');

    if(looksLikeTable(data)) {
        event.preventDefault()
    }else{
        return
    }
    // 行
    var rows = data.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(function(row) {
        console.log(row)
        return row.split("\t")
    })
    // 列对齐
    var colAlignments = []
    // 列宽
    var columnWidths = rows[0].map(function(column, columnIndex) {
        var alignment = "l"
        var re = /^(\^[lcr])/i
        var m = column.match(re)
        if (m) {
            var align = m[1][1].toLowerCase()
            if (align === "c") {
                alignment = "c"
            } else if (align === "r") {
            alignment = "r"
            }
        }
        colAlignments.push(alignment)
        column = column.replace(re, "")
        rows[0][columnIndex] = column
        return columnWidth(rows, columnIndex)
    })
    var markdownRows = rows.map(function(row, rowIndex) {
        return "| " + row.map(function(column, index) {
            return column + Array(columnWidths[index] - column.length + 1).join(" ")
        }).join(" | ") + " |"
        row.map
    })
    markdownRows.splice(1, 0, "|" + columnWidths.map(function(width, index) {
        var prefix = ""
        var postfix = ""
        var adjust = 0
        var alignment = colAlignments[index]
        if (alignment === "r") {
            postfix = ":"
            adjust = 1
        } else if (alignment == "c") {
            prefix = ":"
            postfix = ":"
        adjust = 2
        }
        return prefix + Array(columnWidths[index] + 3 - adjust).join("-") + postfix
    }).join("|") + "|")
    event.target.value = markdownRows.join("\n")
    return false
});