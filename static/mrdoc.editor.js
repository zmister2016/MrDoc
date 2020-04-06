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
