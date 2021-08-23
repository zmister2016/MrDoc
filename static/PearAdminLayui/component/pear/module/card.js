layui.define(['table', 'laypage','jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'card',
		$ = layui.jquery,
		element = layui.element,
		laypage = layui.laypage;

	var pearCard = function(opt) {
		this.option = opt;
	};

	pearCard.prototype.render = function(opt) {
		var option = {
			// 构建的模型
			elem: opt.elem,
			// 数据 url 连接
			url: opt.url,
			// lineSize 每行的个数
			lineSize: opt.lineSize ? opt.lineSize : 4,
			// 共多少个
			pageSize: opt.pageSize ? opt.pageSize : 12,
			// 当前页
			currentPage: opt.currentSize ? opt.currentSize : 0,
			// 完 成 函 数
			done: opt.done ? opt.done : function() {
				alert("跳转页面");
			}
		}
		// 根 据 请 求 方 式 获 取 数 据
		if (option.url != null) {
			// 复制数据
			option.data = getData(option.url).data;
		}

		// 根据结果进行相应结构的创建
		var html = createComponent(option.data);

		$(option.elem).html(html);
		
		  // 初始化分页组件
		  laypage.render({
		    elem: 'cardpage'
		    ,count: 100
		    ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
		    ,jump: function(obj){
		      console.log(obj)
		    }
		  });
		  
		return new pearCard(option);
	}

	function createComponent(data) {
        var html = "<div class='pear-card-component'>"
        var content = createCards(data);
        var page = "<div id='cardpage'></div>"
        content = content + page;
        html += content + "</div>"
        return html;
	}


	/** 创建指定数量的卡片 */
	function createCards(data) {
		
		var content = "<div class='layui-row layui-col-space30'>";
		$.each(data, function(i, item) {

			content += createCard(item);

		})
		content += "</div>"
		return content;
	}


	/** 创建一个卡片 */
	function createCard(item) {

		var card =
			'<div class="layui-col-md3 ew-datagrid-item" data-index="0" data-number="1"> <div class="project-list-item"> <img class="project-list-item-cover" src="'+item.image+'"> <div class="project-list-item-body"> <h2>'+item.title+'</h2> <div class="project-list-item-text layui-text">'+item.remark+'</div> <div class="project-list-item-desc"> <span class="time">'+item.time+'</span> <div class="ew-head-list"> <img class="ew-head-list-item" lay-tips="曲丽丽" lay-offset="0,-5px" src="https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png"> <img class="ew-head-list-item" lay-tips="王昭君" lay-offset="0,-5px" src="https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png"> <img class="ew-head-list-item" lay-tips="董娜娜" lay-offset="0,-5px" src="https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png"> </div> </div> </div> </div> </div>'

		return card;
	}

	/** 同 步 请 求 获 取 数 据 */
	function getData(url) {

		$.ajaxSettings.async = false;
		var data = null;

		$.get(url, function(result) {
			data = result;
		});

		$.ajaxSettings.async = true;
		return data;
	}

	exports(MOD_NAME, new pearCard());
})
