/**
 * name: formSelects
 * 基于Layui Select多选
 * version: 4.0.0.0910
 * http://sun.faysunshine.com/layui/formSelects-v4/dist/formSelects-v4.js
 */
(function(layui, window, factory) {
	if(typeof exports === 'object') { // 支持 CommonJS
		module.exports = factory();
	} else if(typeof define === 'function' && define.amd) { // 支持 AMD
		define(factory);
	} else if(window.layui && layui.define) { //layui加载
		layui.define(['jquery'], function(exports) {
			exports('select', factory());
		});
	} else {
		window.formSelects = factory();
	}
})(typeof layui == 'undefined' ? null : layui, window, function() {
	let v = '4.0.0.0910',
		NAME = 'xm-select',
		PNAME = 'xm-select-parent',
		INPUT = 'xm-select-input',
		TDIV = 'xm-select--suffix',
		THIS = 'xm-select-this',
		LABEL = 'xm-select-label',
		SEARCH = 'xm-select-search',
		SEARCH_TYPE = 'xm-select-search-type',
		SHOW_COUNT = 'xm-select-show-count',
		CREATE = 'xm-select-create',
		CREATE_LONG = 'xm-select-create-long',
		MAX = 'xm-select-max',
		SKIN = 'xm-select-skin',
		DIRECTION = "xm-select-direction",
		HEIGHT = 'xm-select-height',
		DISABLED = 'xm-dis-disabled',
		DIS = 'xm-select-dis',
		TEMP = 'xm-select-temp',
		RADIO = 'xm-select-radio',
		LINKAGE= 'xm-select-linkage',
		DL = 'xm-select-dl',
		DD_HIDE = 'xm-select-hide',
		HIDE_INPUT = 'xm-hide-input',
		SANJIAO = 'xm-select-sj',
		ICON_CLOSE = 'xm-icon-close',
		FORM_TITLE = 'xm-select-title',
		FORM_SELECT = 'xm-form-select',
		FORM_SELECTED = 'xm-form-selected',
		FORM_NONE = 'xm-select-none',
		FORM_EMPTY = 'xm-select-empty',
		FORM_INPUT = 'xm-input',
		FORM_DL_INPUT = 'xm-dl-input',
		FORM_SELECT_TIPS = 'xm-select-tips',
		CHECKBOX_YES = 'xm-iconfont',
		FORM_TEAM_PID = 'XM_PID_VALUE',
		CZ = 'xm-cz',
		CZ_GROUP = 'xm-cz-group',
		TIPS = '请选择',
		data = {},
		events = {
			on: {},
			endOn: {},
			filter: {},
			maxTips: {},
			opened: {},
			closed: {}
		},
		ajax = {
			type: 'get',
			header: {

			},
			first: true,
			data: {},
			searchUrl: '',
			searchName: 'keyword',
			searchVal: null,
			keyName: 'name',
			keyVal: 'value',
			keySel: 'selected',
			keyDis: 'disabled',
			keyChildren: 'children',
			dataType: '',
			delay: 500,
			beforeSuccess: null,
			success: null,
			error: null,
			beforeSearch: null,
			response: {
				statusCode: 0,
				statusName: 'code',
				msgName: 'msg',
				dataName: 'data'
			},
			tree: {
				nextClick: function(id, item, callback){
					callback([]);
				},
				folderChoose: true,
				lazy: true
			}
		},
		quickBtns = [
			{icon: 'xm-iconfont icon-quanxuan', name: '全选', click: function(id, cm){
				cm.selectAll(id, true, true);
			}},
			{icon: 'xm-iconfont icon-qingkong', name: '清空', click: function(id, cm){
				cm.removeAll(id, true, true);
			}},
			{icon: 'xm-iconfont icon-fanxuan', name: '反选', click: function(id, cm){
				cm.reverse(id, true, true);
			}},
			{icon: 'xm-iconfont icon-pifu', name: '换肤', click: function(id, cm){
				cm.skin(id);
			}}
		],
		$ = window.$ || (window.layui && window.layui.jquery),
		$win = $(window),
		ajaxs = {},
		fsConfig = {},
		fsConfigs = {},
		FormSelects = function(options) {
			this.config = {
				name: null, //xm-select="xxx"
				max: null,
				maxTips: (id, vals, val, max) => {
					let ipt = $(`[xid="${this.config.name}"]`).prev().find(`.${NAME}`);
					if(ipt.parents('.layui-form-item[pane]').length) {
						ipt = ipt.parents('.layui-form-item[pane]');
					}
					ipt.attr('style', 'border-color: red !important');
					setTimeout(() => {
						ipt.removeAttr('style');
					}, 300);
				},
				init: null, //初始化的选择值,
				on: null, //select值发生变化
				opened: null,
				closed: null,
				filter: (id, inputVal, val, isDisabled) => {
					return val.name.indexOf(inputVal) == -1;
				},
				clearid: -1,
				direction: 'auto',
				height: null,
				isEmpty: false,
				btns: [quickBtns[0], quickBtns[1], quickBtns[2]],
				searchType: 0,
				create: (id, name) => {
					return Date.now();
				},
				template: (id, item) => {
					return item.name;
				},
				showCount: 0,
				isCreate: false,
				placeholder: TIPS,
				clearInput: false,
			};
			this.select = null;
			this.values = [];
			$.extend(this.config, options, {
				searchUrl: options.isSearch ? options.searchUrl : null,
				placeholder: options.optionsFirst ? (
					options.optionsFirst.value ? TIPS : (options.optionsFirst.innerHTML || TIPS)
				) : TIPS,
				btns: options.radio ? [quickBtns[1]] : [quickBtns[0], quickBtns[1], quickBtns[2]],
			}, fsConfigs[options.name] || fsConfig);
			if(isNaN(this.config.showCount) || this.config.showCount <= 0) {
 				this.config.showCount = 19921012;
 			}
		};
	
	//一些简单的处理方法
	let Common = function(){
		this.appender();
		this.on();
		this.onreset();
	};
	
	Common.prototype.appender = function(){//针对IE做的一些拓展
		//拓展Array map方法
		if(!Array.prototype.map){Array.prototype.map=function(i,h){var b,a,c,e=Object(this),f=e.length>>>0;if(h){b=h}a=new Array(f);c=0;while(c<f){var d,g;if(c in e){d=e[c];g=i.call(b,d,c,e);a[c]=g}c++}return a}};
		
		//拓展Array foreach方法
		if(!Array.prototype.forEach){Array.prototype.forEach=function forEach(g,b){var d,c;if(this==null){throw new TypeError("this is null or not defined")}var f=Object(this);var a=f.length>>>0;if(typeof g!=="function"){throw new TypeError(g+" is not a function")}if(arguments.length>1){d=b}c=0;while(c<a){var e;if(c in f){e=f[c];g.call(d,e,c,f)}c++}}};
	
		//拓展Array filter方法
 		if(!Array.prototype.filter){Array.prototype.filter=function(b){if(this===void 0||this===null){throw new TypeError()}var f=Object(this);var a=f.length>>>0;if(typeof b!=="function"){throw new TypeError()}var e=[];var d=arguments[1];for(var c=0;c<a;c++){if(c in f){var g=f[c];if(b.call(d,g,c,f)){e.push(g)}}}return e}};
	}
	
	Common.prototype.init = function(target){
		//初始化页面上已有的select
		$((target ? target : `select[${NAME}]`)).each((index, select) => {
			let othis = $(select),
				id = othis.attr(NAME),
				hasLayuiRender = othis.next(`.layui-form-select`),
 				hasRender = othis.next(`.${PNAME}`),
 				options = {
 					name: id,
 					disabled: select.disabled,
 					max: othis.attr(MAX) - 0,
 					isSearch: othis.attr(SEARCH) != undefined,
 					searchUrl: othis.attr(SEARCH),
 					isCreate: othis.attr(CREATE) != undefined,
 					radio: othis.attr(RADIO) != undefined,
 					skin: othis.attr(SKIN),
 					direction: othis.attr(DIRECTION),
 					optionsFirst: select.options[0],
 					height: othis.attr(HEIGHT),
 					formname: othis.attr('name') || othis.attr('_name'),
 					layverify: othis.attr('lay-verify') || othis.attr('_lay-verify'),
 					layverType: othis.attr('lay-verType'),
 					searchType: othis.attr(SEARCH_TYPE) == 'dl' ? 1 : 0,
 					showCount: othis.attr(SHOW_COUNT) - 0,
 				},
				value = othis.find('option[selected]').toArray().map((option) => {//获取已选中的数据
					return {
						name: option.innerHTML,
						value: option.value,
					}
				}),
				fs = new FormSelects(options);
			
			fs.values = value;
			
			if(fs.config.init) {
				fs.values = fs.config.init.map(item => {
					if(typeof item == 'object') {
						return item;
					}
					return {
						name: othis.find(`option[value="${item}"]`).text(),
						value: item
					}
				}).filter(item => {
					return item.name;
				});
				fs.config.init = fs.values.concat([]);
			}else{
				fs.config.init = value.concat([]);
			}
			
			!fs.values && (fs.values = []);

			data[id] = fs;

			//先取消layui对select的渲染
			hasLayuiRender[0] && hasLayuiRender.remove();
			hasRender[0] && hasRender.remove();

			//构造渲染div
			let dinfo = this.renderSelect(id, fs.config.placeholder, select); 
			let heightStyle = !fs.config.height || fs.config.height == 'auto' ? '' : `xm-hg style="height: 34px;"`;
			let inputHtml = [
				`<div class="${LABEL}">`,
					`<input type="text" fsw class="${FORM_INPUT} ${INPUT}" ${fs.config.isSearch ? '' : 'style="display: none;"'} autocomplete="off" debounce="0" />`,
				`</div>`
			];
			let reElem =
				$(`<div class="${FORM_SELECT}" ${SKIN}="${fs.config.skin}">
					<input class="${HIDE_INPUT}" value="" name="${fs.config.formname}" lay-verify="${fs.config.layverify}" lay-verType="${fs.config.layverType}" type="text" style="position: absolute;bottom: 0; z-index: -1;width: 100%; height: 100%; border: none; opacity: 0;"/>
					<div class="${FORM_TITLE} ${fs.config.disabled ? DIS : ''}">
						<div class="${FORM_INPUT} ${NAME}" ${heightStyle}>
							${inputHtml.join('')}
							<i class="${SANJIAO}"></i>
						</div>
						<div class="${TDIV}">
							<input type="text" autocomplete="off" placeholder="${fs.config.placeholder}" readonly="readonly" unselectable="on" class="${FORM_INPUT}">
						</div>
						<div></div>
					</div>
					<dl xid="${id}" class="${DL} ${fs.config.radio ? RADIO:''}">${dinfo}</dl>
				</div>`);
				
			var $parent = $(`<div class="${PNAME}" FS_ID="${id}"></div>`);
 			$parent.append(reElem)
 			othis.after($parent);
 			othis.attr('lay-ignore', '');
 			othis.removeAttr('name') && othis.attr('_name', fs.config.formname);
 			othis.removeAttr('lay-verify') && othis.attr('_lay-verify', fs.config.layverify);
			
			//如果可搜索, 加上事件
			if(fs.config.isSearch){
				ajaxs[id] = $.extend({}, ajax, {searchUrl: fs.config.searchUrl}, ajaxs[id]);
				$(document).on('input', `div.${PNAME}[FS_ID="${id}"] .${INPUT}`, (e) => {
					this.search(id, e, fs.config.searchUrl);
				});
				if(fs.config.searchUrl){//触发第一次请求事件
					this.triggerSearch(reElem, true);
				}
			}else{//隐藏第二个dl
				reElem.find(`dl dd.${FORM_DL_INPUT}`).css('display', 'none');
			}
		});
	}
	
	Common.prototype.search = function(id, e, searchUrl, call){
		let input;
		if(call){
			input = call;
		}else{
			input = e.target;
			let keyCode = e.keyCode;
			if(keyCode === 9 || keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
				return false;
			}
		}
		let inputValue = $.trim(input.value);
		//过滤一下tips
		this.changePlaceHolder($(input));
		
		let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		searchUrl = ajaxConfig.searchUrl || searchUrl;
		let fs = data[id],
			isCreate = fs.config.isCreate,
			reElem = $(`dl[xid="${id}"]`).parents(`.${FORM_SELECT}`);
		//如果开启了远程搜索
		if(searchUrl){
			if(ajaxConfig.searchVal){
				inputValue = ajaxConfig.searchVal;
				ajaxConfig.searchVal = '';
			}
			if(!ajaxConfig.beforeSearch || (ajaxConfig.beforeSearch && ajaxConfig.beforeSearch instanceof Function && ajaxConfig.beforeSearch(id, searchUrl, inputValue))){
				let delay = ajaxConfig.delay;
				if(ajaxConfig.first){
					ajaxConfig.first = false;
					delay = 10;
				}
				clearTimeout(fs.clearid);
				fs.clearid = setTimeout(() => {
					reElem.find(`dl > *:not(.${FORM_SELECT_TIPS})`).remove();
					reElem.find(`dd.${FORM_NONE}`).addClass(FORM_EMPTY).text('请求中');
					this.ajax(id, searchUrl, inputValue, false, null, true);
				}, delay);
			}
		}else{
			reElem.find(`dl .${DD_HIDE}`).removeClass(DD_HIDE);
			//遍历选项, 选择可以显示的值
			reElem.find(`dl dd:not(.${FORM_SELECT_TIPS})`).each((idx, item) => {
				let _item = $(item);
				let searchFun = events.filter[id] || data[id].config.filter;
				if(searchFun && searchFun(id, inputValue, this.getItem(id, _item), _item.hasClass(DISABLED)) == true){
					_item.addClass(DD_HIDE);
				}
			});
			//控制分组名称
			reElem.find('dl dt').each((index, item) => {
				if(!$(item).nextUntil('dt', `:not(.${DD_HIDE})`).length) {
					$(item).addClass(DD_HIDE);
				}
			});
			//动态创建
			this.create(id, isCreate, inputValue);
			let shows = reElem.find(`dl dd:not(.${FORM_SELECT_TIPS}):not(.${DD_HIDE})`);
			if(!shows.length){
				reElem.find(`dd.${FORM_NONE}`).addClass(FORM_EMPTY).text('无匹配项');
			}else{
				reElem.find(`dd.${FORM_NONE}`).removeClass(FORM_EMPTY);
			}
		}
	}
	
	Common.prototype.isArray = function(obj){
		return Object.prototype.toString.call(obj) == "[object Array]";
	}
	
	Common.prototype.triggerSearch = function(div, isCall){
		(div ? [div] : $(`.${FORM_SELECT}`).toArray()).forEach((reElem, index) => {
			reElem = $(reElem);
			let id = reElem.find('dl').attr('xid')
			if((id && data[id] && data[id].config.isEmpty) || isCall){
				this.search(id, null, null, data[id].config.searchType == 0 ? reElem.find(`.${LABEL} .${INPUT}`) : reElem.find(`dl .${FORM_DL_INPUT} .${INPUT}`));
			}
		});
	}
	
	Common.prototype.clearInput = function(id){
		let div = $(`.${PNAME}[fs_id="${id}"]`);
		let input = data[id].config.searchType == 0 ? div.find(`.${LABEL} .${INPUT}`) : div.find(`dl .${FORM_DL_INPUT} .${INPUT}`);
		input.val('');
	}
	
	Common.prototype.ajax = function(id, searchUrl, inputValue, isLinkage, linkageWidth, isSearch, successCallback, isReplace){
		let reElem = $(`.${PNAME} dl[xid="${id}"]`).parents(`.${FORM_SELECT}`);
		if(!reElem[0] || !searchUrl){
			return ;
		}
		let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		let ajaxData = $.extend(true, {}, ajaxConfig.data);
		ajaxData[ajaxConfig.searchName] = inputValue;
		//是否需要对ajax添加随机时间
		//ajaxData['_'] = Date.now();
		$.ajax({
			type: ajaxConfig.type,
			headers: ajaxConfig.header,
			url: searchUrl,
			data: ajaxConfig.dataType == 'json' ? JSON.stringify(ajaxData) : ajaxData,
			success: (res) => {
				if(typeof res == 'string'){
					res = JSON.parse(res);
				}
				ajaxConfig.beforeSuccess && ajaxConfig.beforeSuccess instanceof Function && (res = ajaxConfig.beforeSuccess(id, searchUrl, inputValue, res));
				if(this.isArray(res)){
					let newRes = {};
 					newRes[ajaxConfig.response.statusName] = ajaxConfig.response.statusCode;
 					newRes[ajaxConfig.response.msgName] = "";
 					newRes[ajaxConfig.response.dataName] = res;
 					res = newRes;
				}
				if(res[ajaxConfig.response.statusName] != ajaxConfig.response.statusCode) {
 					reElem.find(`dd.${FORM_NONE}`).addClass(FORM_EMPTY).text(res[ajaxConfig.response.msgName]);
 				}else{
					reElem.find(`dd.${FORM_NONE}`).removeClass(FORM_EMPTY);
					this.renderData(id, res[ajaxConfig.response.dataName], isLinkage, linkageWidth, isSearch, isReplace);
 					data[id].config.isEmpty = res[ajaxConfig.response.dataName].length == 0;
				}
 				successCallback && successCallback(id);
				ajaxConfig.success && ajaxConfig.success instanceof Function && ajaxConfig.success(id, searchUrl, inputValue, res);
			},
			error: (err) => {
				reElem.find(`dd[lay-value]:not(.${FORM_SELECT_TIPS})`).remove();
				reElem.find(`dd.${FORM_NONE}`).addClass(FORM_EMPTY).text('服务异常');
				ajaxConfig.error && ajaxConfig.error instanceof Function && ajaxConfig.error(id, searchUrl, inputValue, err);
			}
		});
	}
	
	Common.prototype.renderData = function(id, dataArr, linkage, linkageWidth, isSearch, isReplace){
		if(linkage){//渲染多级联动
			this.renderLinkage(id, dataArr, linkageWidth);
			return;
		}
		if(isReplace){
			this.renderReplace(id, dataArr);
			return;
		}
		
		let reElem = $(`.${PNAME} dl[xid="${id}"]`).parents(`.${FORM_SELECT}`);
		let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		let pcInput = reElem.find(`.${TDIV} input`);

		dataArr = this.exchangeData(id, dataArr);
		let values = [];
		reElem.find('dl').html(this.renderSelect(id, pcInput.attr('placeholder') || pcInput.attr('back'), dataArr.map((item) => {
			let itemVal = $.extend({}, item, {
				innerHTML: item[ajaxConfig.keyName],
				value: item[ajaxConfig.keyVal],
				sel: item[ajaxConfig.keySel],
				disabled: item[ajaxConfig.keyDis],
				type: item.type,
				name: item[ajaxConfig.keyName]
			});
			if(itemVal.sel){
				values.push(itemVal);
			}
			return itemVal;
		})));

		let label = reElem.find(`.${LABEL}`);
		let dl = reElem.find('dl[xid]');
		if(isSearch){//如果是远程搜索, 这里需要判重
			let oldVal = data[id].values;
			oldVal.forEach((item, index) => {
				dl.find(`dd[lay-value="${item.value}"]`).addClass(THIS);
			});
			values.forEach((item, index) => {
				if(this.indexOf(oldVal, item) == -1){
					this.addLabel(id, label, item);
					dl.find(`dd[lay-value="${item.value}"]`).addClass(THIS);
					oldVal.push(item);
				}
			});
		}else{
			values.forEach((item, index) => {
				this.addLabel(id, label, item);
				dl.find(`dd[lay-value="${item.value}"]`).addClass(THIS);
			});
			data[id].values = values;
		}
		this.commonHandler(id, label);
	}
	
	Common.prototype.renderLinkage = function(id, dataArr, linkageWidth){
		let result = [],
			index = 0,
			temp = {"0": dataArr},
			ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		db[id] = {};
		do{
			let group = result[index ++] = [],
				_temp = temp;
			temp = {};
			$.each(_temp, (pid, arr) => {
				$.each(arr, (idx, item) => {
					let val = {
						pid: pid,
						name: item[ajaxConfig.keyName],
						value: item[ajaxConfig.keyVal],
					};
					db[id][val.value] = $.extend(item, val);
					group.push(val);
					let children = item[ajaxConfig.keyChildren];
					if(children && children.length){
						temp[val.value] = children;
					}
				});
			});
		}while(Object.getOwnPropertyNames(temp).length);
		
		let reElem = $(`.${PNAME} dl[xid="${id}"]`).parents(`.${FORM_SELECT}`);
		let html = ['<div class="xm-select-linkage">'];
		
		$.each(result, (idx, arr) => {
			let groupDiv = [`<div style="left: ${(linkageWidth-0) * idx}px;" class="xm-select-linkage-group xm-select-linkage-group${idx + 1} ${idx != 0 ? 'xm-select-linkage-hide':''}">`];
			$.each(arr, (idx2, item) => {
				let span = `<li title="${item.name}" pid="${item.pid}" xm-value="${item.value}"><span>${item.name}</span></li>`;
				groupDiv.push(span);
			});
			groupDiv.push(`</div>`);
			html = html.concat(groupDiv);
		});
		html.push('<div style="clear: both; height: 288px;"></div>');
		html.push('</div>');
		reElem.find('dl').html(html.join(''));
		reElem.find(`.${INPUT}`).css('display', 'none');//联动暂时不支持搜索
	}
	
	Common.prototype.renderReplace = function(id, dataArr){
		let dl = $(`.${PNAME} dl[xid="${id}"]`);
		let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;

		dataArr = this.exchangeData(id, dataArr);
		db[id] = dataArr;
		
		let html = dataArr.map((item) => {
			let itemVal = $.extend({}, item, {
				innerHTML: item[ajaxConfig.keyName],
				value: item[ajaxConfig.keyVal],
				sel: item[ajaxConfig.keySel],
				disabled: item[ajaxConfig.keyDis],
				type: item.type,
				name: item[ajaxConfig.keyName]
			});
			return this.createDD(id, itemVal);
		}).join('');
		
		dl.find(`dd:not(.${FORM_SELECT_TIPS}),dt:not([style])`).remove();
		dl.find(`dt[style]`).after($(html));
	}

	Common.prototype.exchangeData = function(id, arr){//这里处理树形结构
	    let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
	    let childrenName = ajaxConfig['keyChildren'];
	    let disabledName = ajaxConfig['keyDis'];
		db[id] = {};
	    let result = this.getChildrenList(arr, childrenName, disabledName, [], false);
        return result;
	}

	Common.prototype.getChildrenList = function(arr, childrenName, disabledName, pid, disabled){
	    let result = [], offset = 0;
	    for(let a = 0; a < arr.length; a ++){
            let item = arr[a];
            if(item.type && item.type == 'optgroup'){
            	result.push(item);
            	continue;
            }else{
            	offset ++;
            }
            let parentIds = pid.concat([]);
            parentIds.push(`${offset - 1}_E`);
            item[FORM_TEAM_PID] = JSON.stringify(parentIds);
            item[disabledName] = item[disabledName] || disabled;
            result.push(item);
            let child = item[childrenName];
            if(child && common.isArray(child) && child.length){
            	item['XM_TREE_FOLDER'] = true;
                let pidArr = parentIds.concat([]);
                let childResult = this.getChildrenList(child, childrenName, disabledName, pidArr, item[disabledName]);
                result = result.concat(childResult);
            }
        }
        return result;
	}

	Common.prototype.create = function(id, isCreate, inputValue){
		if(isCreate && inputValue){
			let fs = data[id],
				dl = $(`[xid="${id}"]`),
				tips=  dl.find(`dd.${FORM_SELECT_TIPS}.${FORM_DL_INPUT}`),
				tdd = null,
				temp = dl.find(`dd.${TEMP}`);
			dl.find(`dd:not(.${FORM_SELECT_TIPS}):not(.${TEMP})`).each((index, item) => {
				if(inputValue == $(item).find('span').attr('name')){
					tdd = item;
				}
			});
			if(!tdd){//如果不存在, 则创建
				let val = fs.config.create(id, inputValue);
				if(temp[0]){
					temp.attr('lay-value', val);
					temp.find('span').text(inputValue);
					temp.find('span').attr("name", inputValue);
					temp.removeClass(DD_HIDE);
				}else{
					tips.after($(this.createDD(id, {
						name: inputValue,
						innerHTML: inputValue,
						value: val
					}, `${TEMP} ${CREATE_LONG}`)));
				}
			}
		}else{
			$(`[xid=${id}] dd.${TEMP}`).remove();
		}
	}
	
	Common.prototype.createDD = function(id, item, clz){
		let ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		let name = $.trim(item.innerHTML);
		db[id][item.value] = $(item).is('option') ? (item = function(){
			let resultItem = {};
			resultItem[ajaxConfig.keyName] = name;
			resultItem[ajaxConfig.keyVal] = item.value;
			resultItem[ajaxConfig.keyDis] = item.disabled;
			return resultItem;
		}()) : item;
		let template = data[id].config.template(id, item);
		let pid = item[FORM_TEAM_PID];
		pid ? (pid = JSON.parse(pid)) : (pid = [-1]);
		let attr = pid[0] == -1 ? '' : `tree-id="${pid.join('-')}" tree-folder="${!!item['XM_TREE_FOLDER']}"`;
		return `<dd lay-value="${item.value}" class="${item.disabled ? DISABLED : ''} ${clz ? clz : ''}" ${attr}>
					<div class="xm-unselect xm-form-checkbox ${item.disabled ? DISABLED : ''}"  style="margin-left: ${(pid.length - 1) * 30}px">
						<i class="${CHECKBOX_YES}"></i>
						<span name="${name}">${template}</span>
					</div>
				</dd>`;
	}
	
	Common.prototype.createQuickBtn = function(obj, right){
		return `<div class="${CZ}" method="${obj.name}" title="${obj.name}" ${right ? 'style="margin-right: ' + right + '"': ''}><i class="${obj.icon}"></i><span>${obj.name}</span></div>`
	}
	
	Common.prototype.renderBtns = function(id, show, right){
		let quickBtn = [];
		let dl = $(`dl[xid="${id}"]`);
		quickBtn.push(`<div class="${CZ_GROUP}" show="${show}" style="max-width: ${dl.prev().width() - 54}px;">`);
		$.each(data[id].config.btns, (index, item) => {
			quickBtn.push(this.createQuickBtn(item, right));
		});
		quickBtn.push(`</div>`);
		quickBtn.push(this.createQuickBtn({icon: 'xm-iconfont icon-caidan', name: ''}));
		return quickBtn.join('');
	}
	
	Common.prototype.renderSelect = function(id, tips, select){
		db[id] = {};
		let arr = [];
		if(data[id].config.btns.length){
			setTimeout(() => {
				let dl = $(`dl[xid="${id}"]`);
				dl.parents(`.${FORM_SELECT}`).attr(SEARCH_TYPE, data[id].config.searchType);
				dl.find(`.${CZ_GROUP}`).css('max-width', `${dl.prev().width() - 54}px`);
			}, 10)
			arr.push([
				`<dd lay-value="" class="${FORM_SELECT_TIPS}" style="background-color: #FFF!important;">`,
					this.renderBtns(id, null, '30px'),
				`</dd>`,
				`<dd lay-value="" class="${FORM_SELECT_TIPS} ${FORM_DL_INPUT}" style="background-color: #FFF!important;">`,
					`<i class="xm-iconfont icon-sousuo"></i>`,
					`<input type="text" class="${FORM_INPUT} ${INPUT}" placeholder="请搜索"/>`,
				`</dd>`
			].join(''));
		}else{
			arr.push(`<dd lay-value="" class="${FORM_SELECT_TIPS}">${tips}</dd>`);
		}
		if(this.isArray(select)){
			$(select).each((index, item) => {
				if(item){
					if(item.type && item.type === 'optgroup') {
						arr.push(`<dt>${item.name}</dt>`);
					} else {
						arr.push(this.createDD(id, item));
					}
				}
			});
		}else{
			$(select).find('*').each((index, item) => {
				if(item.tagName.toLowerCase() == 'option' && index == 0 && !item.value){
					return ;
				}
				if(item.tagName.toLowerCase() === 'optgroup') {
					arr.push(`<dt>${item.label}</dt>`);
				} else {
					arr.push(this.createDD(id, item));
				}
			});
		}
		arr.push('<dt style="display:none;"> </dt>');
		arr.push(`<dd class="${FORM_SELECT_TIPS} ${FORM_NONE} ${arr.length === 2 ? FORM_EMPTY:''}">没有选项</dd>`);
		return arr.join('');
	}
	
	Common.prototype.on = function(){//事件绑定
		this.one();
		
		$(document).on('click', (e) => {
			if(!$(e.target).parents(`.${FORM_TITLE}`)[0]){//清空input中的值
				$(`.${PNAME} dl .${DD_HIDE}`).removeClass(DD_HIDE);
				$(`.${PNAME} dl dd.${FORM_EMPTY}`).removeClass(FORM_EMPTY);
				$(`.${PNAME} dl dd.${TEMP}`).remove();
				$.each(data, (key, fs) => {
					this.clearInput(key);
					if(!fs.values.length){
						this.changePlaceHolder($(`div[FS_ID="${key}"] .${LABEL}`));
					}
				});
			}
			$(`.${PNAME} .${FORM_SELECTED}`).each((index, item) => {
				this.changeShow($(item).find(`.${FORM_TITLE}`), false);
			}) ;
		});
	}
	
	Common.prototype.calcLabelLeft = function(label, w, call){
		let pos = this.getPosition(label[0]);
    	pos.y = pos.x + label[0].clientWidth;
    	let left = label[0].offsetLeft;
    	if(!label.find('span').length){
    		left = 0;
    	}else if(call){//校正归位
    		let span = label.find('span:last');
    		span.css('display') == 'none' ? (span = span.prev()[0]) : (span = span[0]);
			let spos = this.getPosition(span);
			spos.y = spos.x + span.clientWidth;
			
			if(spos.y > pos.y){
				left = left - (spos.y - pos.y) - 5;
			}else{
				left = 0;
			}
    	}else{
	    	if(w < 0){
				let span = label.find(':last');
				span.css('display') == 'none' ? (span = span.prev()[0]) : (span = span[0]);
				let spos = this.getPosition(span);
				spos.y = spos.x + span.clientWidth;
				if(spos.y > pos.y){
					left -= 10;
				}
	    	}else{
				if(left < 0){
					left += 10;
				}
				if(left > 0){
					left = 0;
				}
	    	}
    	}
    	label.css('left', left + 'px');
	}
	
	Common.prototype.one = function(target){//一次性事件绑定
		$(target ? target : document).off('click', `.${FORM_TITLE}`).on('click', `.${FORM_TITLE}`, (e) => {
			let othis = $(e.target),
				title = othis.is(FORM_TITLE) ? othis : othis.parents(`.${FORM_TITLE}`),
				dl = title.next(),
				id = dl.attr('xid');
			
			//清空非本select的input val
			$(`dl[xid]`).not(dl).each((index, item) => {
				this.clearInput($(item).attr('xid'));
			});
			$(`dl[xid]`).not(dl).find(`dd.${DD_HIDE}`).removeClass(DD_HIDE);
			
			//如果是disabled select
			if(title.hasClass(DIS)){
				return false;
			}
			//如果点击的是右边的三角或者只读的input
			if(othis.is(`.${SANJIAO}`) || othis.is(`.${INPUT}[readonly]`)){
				this.changeShow(title, !title.parents(`.${FORM_SELECT}`).hasClass(FORM_SELECTED));
				return false;
			}
			//如果点击的是input的右边, focus一下
			if(title.find(`.${INPUT}:not(readonly)`)[0]){
				let input = title.find(`.${INPUT}`),
					epos = {x: e.pageX, y: e.pageY},
					pos = this.getPosition(title[0]),
					width = title.width();
				while(epos.x > pos.x){
					if($(document.elementFromPoint(epos.x, epos.y)).is(input)){
						input.focus();
						this.changeShow(title, true);
						return false;
					}
					epos.x -= 50;
				}
			}
			
			//如果点击的是可搜索的input
			if(othis.is(`.${INPUT}`)){
				this.changeShow(title, true);
				return false;
			}
			//如果点击的是x按钮
			if(othis.is(`i[fsw="${NAME}"]`)){
				let val = this.getItem(id, othis),
				dd = dl.find(`dd[lay-value='${val.value}']`);
				if(dd.hasClass(DISABLED)){//如果是disabled状态, 不可选, 不可删
					return false;
				}
				this.handlerLabel(id, dd, false, val);
				return false;
			}
			
			this.changeShow(title, !title.parents(`.${FORM_SELECT}`).hasClass(FORM_SELECTED));
			return false;
		});
		$(target ? target : document).off('click', `dl.${DL}`).on('click', `dl.${DL}`, (e) => {
			let othis = $(e.target);
			if(othis.is(`.${LINKAGE}`) || othis.parents(`.${LINKAGE}`)[0]){//linkage的处理
				othis = othis.is('li') ? othis : othis.parents('li[xm-value]');
				let group = othis.parents('.xm-select-linkage-group'),
					id = othis.parents('dl').attr('xid');
				if(!id){
					return false;
				}
				//激活li
				group.find('.xm-select-active').removeClass('xm-select-active');
				othis.addClass('xm-select-active');
				//激活下一个group, 激活前显示对应数据
				group.nextAll('.xm-select-linkage-group').addClass('xm-select-linkage-hide');
				let nextGroup = group.next('.xm-select-linkage-group');
				nextGroup.find('li').addClass('xm-select-linkage-hide');
				nextGroup.find(`li[pid="${othis.attr('xm-value')}"]`).removeClass('xm-select-linkage-hide');
				//如果没有下一个group, 或没有对应的值
				if(!nextGroup[0] || nextGroup.find(`li:not(.xm-select-linkage-hide)`).length == 0){
					let vals = [],
						index = 0,
						isAdd = !othis.hasClass('xm-select-this');
					if(data[id].config.radio){
						othis.parents('.xm-select-linkage').find('.xm-select-this').removeClass('xm-select-this');
					}
					do{
						vals[index ++] = {
							name: othis.find('span').text(),
							value: othis.attr('xm-value')
						}
						othis = othis.parents('.xm-select-linkage-group').prev().find(`li[xm-value="${othis.attr('pid')}"]`);			
					}while(othis.length);
					vals.reverse();
					let val = {
						name: vals.map((item) => {
								return item.name;
							}).join('/'),
						value: vals.map((item) => {
								return item.value;
							}).join('/'),
					}
					this.handlerLabel(id, null, isAdd, val);
				}else{
					nextGroup.removeClass('xm-select-linkage-hide');
				}
				return false;
			}
			
			if(othis.is('dl')){
				return false;
			}
			
			if(othis.is('dt')){
				othis.nextUntil(`dt`).each((index, item) => {
					item = $(item);
					if(item.hasClass(DISABLED) || item.hasClass(THIS)){
												
					}else{
						item.find('i:not(.icon-expand)').click();
					}
				});
				return false;
			}
			let dd = othis.is('dd') ? othis : othis.parents('dd');
			let id = dd.parent('dl').attr('xid');
			
			if(dd.hasClass(DISABLED)){//被禁用选项的处理
				return false;
			}
			
			//菜单功效
			if(othis.is('i.icon-caidan')){
				let opens = [], closes = [];
				othis.parents('dl').find('dd[tree-folder="true"]').each((index, item) => {
					$(item).attr('xm-tree-hidn') == undefined ? opens.push(item) : closes.push(item); 
				});
				let arr = closes.length ? closes : opens;
				arr.forEach(item => item.click());
				return false;
			}
			//树状结构的选择
			let treeId = dd.attr('tree-id');
			if(treeId){
				//忽略右边的图标
				if(othis.is('i:not(.icon-expand)')){
					this.handlerLabel(id, dd, !dd.hasClass(THIS));
					return false;
				}
				let ajaxConfig = ajaxs[id] || ajax;
				let treeConfig = ajaxConfig.tree;
				let childrens = dd.nextAll(`dd[tree-id^="${treeId}"]`);
				if(childrens && childrens.length){
					let len = childrens[0].clientHeight;
					len ? (
						this.addTreeHeight(dd, len),
						len = 0
					) : (
						len = dd.attr('xm-tree-hidn') || 36, 
						dd.removeAttr('xm-tree-hidn'),
						dd.find('>i').remove(),
						(childrens = childrens.filter((index, item) => $(item).attr('tree-id').split('-').length - 1 == treeId.split('-').length))
					);
					childrens.animate({
						height: len
					}, 150)
					return false;
				}else{
					if(treeConfig.nextClick && treeConfig.nextClick instanceof Function){
						treeConfig.nextClick(id, this.getItem(id, dd), (res) => {
							if(!res || !res.length){
								this.handlerLabel(id, dd, !dd.hasClass(THIS));
							}else{
								dd.attr('tree-folder', 'true');
								let ddChilds = [];
								res.forEach((item, idx) => {
									item.innerHTML = item[ajaxConfig.keyName];
									item[FORM_TEAM_PID] = JSON.stringify(treeId.split('-').concat([idx]));
									ddChilds.push(this.createDD(id, item));
									db[id][item[ajaxConfig.keyVal]] = item;
								});
								dd.after(ddChilds.join(''));
							}
						});
						return false;
					}
				}
			}
			
			if(dd.hasClass(FORM_SELECT_TIPS)){//tips的处理
				let btn = othis.is(`.${CZ}`) ? othis : othis.parents(`.${CZ}`);
				if(!btn[0]){
					return false;
				}
				let method = btn.attr('method');
				let obj = data[id].config.btns.filter(bean => bean.name == method)[0];
				obj && obj.click && obj.click instanceof Function && obj.click(id, this);
				return false;
			}
			this.handlerLabel(id, dd, !dd.hasClass(THIS));
			return false;
		});
	}
	
	Common.prototype.addTreeHeight = function(dd, len){
		let treeId = dd.attr('tree-id');
		let childrens = dd.nextAll(`dd[tree-id^="${treeId}"]`);
		if(childrens.length){
			dd.append('<i class="xm-iconfont icon-expand"></i>');		
			dd.attr('xm-tree-hidn', len);
			childrens.each((index, item) => {
				let that = $(item);
				this.addTreeHeight(that, len);
			})
		}
	}
	
	let db = {};
	Common.prototype.getItem = function(id, value){
		if(value instanceof $){
			if(value.is(`i[fsw="${NAME}"]`)){
				let span = value.parent();
				return db[id][value] || {
					name: span.find('font').text(),
					value: span.attr('value')
				}
			}
			let val = value.attr('lay-value');
			return !db[id][val] ? (db[id][val] = {
				name: value.find('span[name]').attr('name'),
				value: val
			}) : db[id][val];
		}else if(typeof(value) == 'string' && value.indexOf('/') != -1){
			return db[id][value] || {
				name: this.valToName(id, value),
				value: value
			}
		}
		return db[id][value];
	}
	
	Common.prototype.linkageAdd = function(id, val){
		let dl = $(`dl[xid="${id}"]`);
		dl.find('.xm-select-active').removeClass('xm-select-active');
		let vs = val.value.split('/');
		let pid, li, index = 0;
		let lis = [];
		do{
			pid = vs[index];
			li = dl.find(`.xm-select-linkage-group${index + 1} li[xm-value="${pid}"]`);
			li[0] && lis.push(li);
			index ++;
		}while(li.length && pid != undefined);
		if(lis.length == vs.length){
			$.each(lis, (idx, item) => {
				item.addClass('xm-select-this');
			});
		}
	}
	
	Common.prototype.linkageDel = function(id, val){
		let dl = $(`dl[xid="${id}"]`);
		let vs = val.value.split('/');
		let pid, li, index = vs.length - 1;
		do{
			pid = vs[index];
			li = dl.find(`.xm-select-linkage-group${index + 1} li[xm-value="${pid}"]`);
			if(!li.parent().next().find(`li[pid=${pid}].xm-select-this`).length){
				li.removeClass('xm-select-this');
			}
			index --;
		}while(li.length && pid != undefined);
	}
	
	Common.prototype.valToName = function(id, val){
		let dl = $(`dl[xid="${id}"]`);
		let vs = (val + "").split('/');
		if(!vs.length){
			return null;
		}
		let names = [];
		$.each(vs, (idx, item) => {
			let name = dl.find(`.xm-select-linkage-group${idx + 1} li[xm-value="${item}"] span`).text();
			names.push(name);
		});
		return names.length == vs.length ? names.join('/') : null;
	}
	
	Common.prototype.commonHandler = function(key, label){
		if(!label || !label[0]){
			return ;
		}
		this.checkHideSpan(key, label);
		//计算input的提示语
		this.changePlaceHolder(label);
		//计算高度
		this.retop(label.parents(`.${FORM_SELECT}`));
		this.calcLabelLeft(label, 0, true);
		//表单默认值
		this.setHidnVal(key, label);
		//title值
		label.parents(`.${FORM_TITLE} .${NAME}`).attr('title', data[key].values.map((val) => {
			return val.name;
		}).join(','));
	}
	
	Common.prototype.initVal = function(id){
		let target = {};
		if(id){
			target[id] = data[id];
		}else{
			target = data;
		}
		$.each(target, (key, val) => {
			let values = val.values,		
				div = $(`dl[xid="${key}"]`).parent(),
				label = div.find(`.${LABEL}`),
				dl = div.find('dl');
			dl.find(`dd.${THIS}`).removeClass(THIS);
			
			let _vals = values.concat([]);
			_vals.concat([]).forEach((item, index) => {
				this.addLabel(key, label, item);
				dl.find(`dd[lay-value="${item.value}"]`).addClass(THIS);
			});
			if(val.config.radio){
				_vals.length && values.push(_vals[_vals.length - 1]);
			}
			this.commonHandler(key, label);
		});
	}
	
	Common.prototype.setHidnVal = function(key, label) {
 		if(!label || !label[0]) {
 			return;
 		}
 		label.parents(`.${PNAME}`).find(`.${HIDE_INPUT}`).val(data[key].values.map((val) => {
 			return val.value;
 		}).join(','));
 	}
	
	Common.prototype.handlerLabel = function(id, dd, isAdd, oval, notOn){
		let div = $(`[xid="${id}"]`).prev().find(`.${LABEL}`),
			val = dd && this.getItem(id, dd),
			vals = data[id].values,
			on = data[id].config.on || events.on[id],
			endOn = data[id].config.endOn || events.endOn[id];
		if(oval){
			val = oval;
		}
		let fs = data[id];
		if(isAdd && fs.config.max && fs.values.length >= fs.config.max){
			let maxTipsFun = events.maxTips[id] || data[id].config.maxTips;
 			maxTipsFun && maxTipsFun(id, vals.concat([]), val, fs.config.max);
			return ;
		}
		if(!notOn){
			if(on && on instanceof Function && on(id, vals.concat([]), val, isAdd, dd && dd.hasClass(DISABLED)) == false) {
				return ;
			}
		}
		let dl = $(`dl[xid="${id}"]`);
		isAdd ? (
			(dd && dd[0] ? (
				dd.addClass(THIS), 
				dd.removeClass(TEMP)
			) : (
				dl.find('.xm-select-linkage')[0] && this.linkageAdd(id, val)
			)),
			this.addLabel(id, div, val),
			vals.push(val)
		) : (
			(dd && dd[0] ? (
				dd.removeClass(THIS)
			) : (
				dl.find('.xm-select-linkage')[0] && this.linkageDel(id, val)
			)),
			this.delLabel(id, div, val),
			this.remove(vals, val)
		);
		if(!div[0]) return ;
		//单选选完后直接关闭选择域
		if(fs.config.radio){
			this.changeShow(div, false);
		}
		//移除表单验证的红色边框
		div.parents(`.${FORM_TITLE}`).prev().removeClass('layui-form-danger');
		
		//清空搜索值
		fs.config.clearInput && this.clearInput(id);
		
		this.commonHandler(id, div);
		
		!notOn && endOn && endOn instanceof Function && endOn(id, vals.concat([]), val, isAdd, dd && dd.hasClass(DISABLED));
	}
	
	Common.prototype.addLabel = function(id, div, val){
		if(!val) return ;
		let tips = `fsw="${NAME}"`;
		let [$label, $close] = [
			$(`<span ${tips} value="${val.value}"><font ${tips}>${val.name}</font></span>`), 
			$(`<i ${tips} class="xm-iconfont icon-close"></i>`)
		];
		$label.append($close);
		//如果是radio模式
		let fs = data[id];
		if(fs.config.radio){
			fs.values.length = 0;
			$(`dl[xid="${id}"]`).find(`dd.${THIS}:not([lay-value="${val.value}"])`).removeClass(THIS);
			div.find('span').remove();
		}
		//如果是固定高度
		div.find('input').css('width', '50px');
		div.find('input').before($label);
	}
	
	Common.prototype.delLabel = function(id, div, val){
		if(!val) return ;
		div.find(`span[value="${val.value}"]:first`).remove();
	}
	
	Common.prototype.checkHideSpan = function(id, div){
		let parentHeight = div.parents(`.${NAME}`)[0].offsetHeight + 5;
		div.find('span.xm-span-hide').removeClass('xm-span-hide');
		div.find('span[style]').remove();
		
		let count = data[id].config.showCount;
		div.find('span').each((index, item) => {
			if(index >= count){
				$(item).addClass('xm-span-hide');
			}
		});
		
		let prefix = div.find(`span:eq(${count})`);
		prefix[0] && prefix.before($(`<span style="padding-right: 6px;" fsw="${NAME}"> + ${div.find('span').length - count}</span>`))
	}
	
	Common.prototype.retop = function(div){//计算dl显示的位置
		let dl = div.find('dl'),
			top = div.offset().top + div.outerHeight() + 5 - $win.scrollTop(),
            dlHeight = dl.outerHeight();
		let up = div.hasClass('layui-form-selectup') || dl.css('top').indexOf('-') != -1 || (top + dlHeight > $win.height() && top >= dlHeight);
		div = div.find(`.${NAME}`);
		
		let fs = data[dl.attr('xid')];
		let base = dl.parents('.layui-form-pane')[0] && dl.prev()[0].clientHeight > 38 ? 14 : 10;
		if((fs && fs.config.direction == 'up') || up){
			up = true;
			if((fs && fs.config.direction == 'down')){
				up = false;
			}
		}
		let reHeight = div[0].offsetTop + div.height() + base;
		if(up) {
			dl.css({
				top: 'auto',
				bottom: reHeight + 3 + 'px',
			});
		} else {
			dl.css({
				top: reHeight + 'px',
				bottom: 'auto'
			});
		}
	}
	
	Common.prototype.changeShow = function(children, isShow){//显示于隐藏
		$('.layui-form-selected').removeClass('layui-form-selected');
		let top = children.parents(`.${FORM_SELECT}`),
			realShow = top.hasClass(FORM_SELECTED),
			id = top.find('dl').attr('xid');
		$(`.${PNAME} .${FORM_SELECT}`).not(top).removeClass(FORM_SELECTED);
		if(isShow){
			this.retop(top);
			top.addClass(FORM_SELECTED);
			top.find(`.${INPUT}`).focus();
			if(!top.find(`dl dd[lay-value]:not(.${FORM_SELECT_TIPS})`).length){
				top.find(`dl .${FORM_NONE}`).addClass(FORM_EMPTY);
			}
		}else{
			top.removeClass(FORM_SELECTED);
			this.clearInput(id);
			top.find(`dl .${FORM_EMPTY}`).removeClass(FORM_EMPTY);
			top.find(`dl dd.${DD_HIDE}`).removeClass(DD_HIDE);
			top.find(`dl dd.${TEMP}`).remove();
			//计算ajax数据是否为空, 然后重新请求数据
			if(id && data[id] && data[id].config.isEmpty){
				this.triggerSearch(top);
			}
			this.changePlaceHolder(top.find(`.${LABEL}`));
		}
		if(isShow != realShow){
			let openFun = data[id].config.opened || events.opened[id];
			isShow && openFun && openFun instanceof Function && openFun(id);
			let closeFun = data[id].config.closed || events.closed[id];
			!isShow && closeFun && closeFun instanceof Function && closeFun(id);
		}
	}
	
	Common.prototype.changePlaceHolder = function(div){//显示于隐藏提示语
		//调整pane模式下的高度
		let title = div.parents(`.${FORM_TITLE}`);
		title[0] || (title = div.parents(`dl`).prev());
		if(!title[0]){
			return ;
		}
		
		let id = div.parents(`.${PNAME}`).find(`dl[xid]`).attr('xid');
		if(data[id] && data[id].config.height){//既然固定高度了, 那就看着办吧
						
		}else{
			let height = title.find(`.${NAME}`)[0].clientHeight;
			title.css('height' , (height > 36 ? height + 4 : height) + 'px');
			//如果是layui pane模式, 处理label的高度
			let label = title.parents(`.${PNAME}`).parent().prev();
			if(label.is('.layui-form-label') && title.parents('.layui-form-pane')[0]){
				height = height > 36 ? height + 4 : height;
				title.css('height' , height + 'px');
				label.css({
					height: height + 2 + 'px',
					lineHeight: (height - 18) + 'px'
				})
			}
		}
		
		let input = title.find(`.${TDIV} input`),
			isShow = !div.find('span:last')[0] && !title.find(`.${INPUT}`).val();
		if(isShow){
			let ph = input.attr('back');
			input.removeAttr('back');
			input.attr('placeholder', ph);
		}else{
			let ph = input.attr('placeholder');
			input.removeAttr('placeholder');
			input.attr('back', ph)
		}
	}
	
	Common.prototype.indexOf = function(arr, val){
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].value == val || arr[i].value == (val ? val.value : val) || arr[i] == val || JSON.stringify(arr[i]) == JSON.stringify(val)) {
				return i;
			}
		}
		return -1;
	}
	
	Common.prototype.remove = function(arr, val){
		let idx = this.indexOf(arr, val ? val.value : val);
		if(idx > -1) {
			arr.splice(idx, 1);
			return true;
		}
		return false;
	}
	
	Common.prototype.selectAll = function(id, isOn, skipDis){
		let dl = $(`[xid="${id}"]`);
		if(!dl[0]){
			return ;
		}
		if(dl.find('.xm-select-linkage')[0]){
			return ;
		}
		dl.find(`dd[lay-value]:not(.${FORM_SELECT_TIPS}):not(.${THIS})${skipDis ? ':not(.'+DISABLED+')' :''}`).each((index, item) => {
			item = $(item);
			let val = this.getItem(id, item);
			this.handlerLabel(id, dl.find(`dd[lay-value="${val.value}"]`), true, val, !isOn);
		});
	}
	
	Common.prototype.removeAll = function(id, isOn, skipDis){
		let dl = $(`[xid="${id}"]`);
		if(!dl[0]){
			return ;
		}
		if(dl.find('.xm-select-linkage')[0]){//针对多级联动的处理
			data[id].values.concat([]).forEach((item, idx) => {
				let vs = item.value.split('/');
				let pid, li, index = 0;
				do{
					pid = vs[index ++];
					li = dl.find(`.xm-select-linkage-group${index}:not(.xm-select-linkage-hide) li[xm-value="${pid}"]`);
					li.click();
				}while(li.length && pid != undefined);
			});
			return ;
		}
		data[id].values.concat([]).forEach((item, index) => {
			if(skipDis && dl.find(`dd[lay-value="${item.value}"]`).hasClass(DISABLED)){
				
			}else{
				this.handlerLabel(id, dl.find(`dd[lay-value="${item.value}"]`), false, item, !isOn);
			}
		});
	}
	
	Common.prototype.reverse = function(id, isOn, skipDis){
		let dl = $(`[xid="${id}"]`);
		if(!dl[0]){
			return ;
		}
		if(dl.find('.xm-select-linkage')[0]){
			return ;
		}
		dl.find(`dd[lay-value]:not(.${FORM_SELECT_TIPS})${skipDis ? ':not(.'+DISABLED+')' :''}`).each((index, item) => {
			item = $(item);
			let val = this.getItem(id, item);
			this.handlerLabel(id, dl.find(`dd[lay-value="${val.value}"]`), !item.hasClass(THIS), val, !isOn);
		});
	}
	
	Common.prototype.skin = function(id){
		let skins = ['default' ,'primary', 'normal', 'warm', 'danger'];
		let skin = skins[Math.floor(Math.random() * skins.length)];
		$(`dl[xid="${id}"]`).parents(`.${PNAME}`).find(`.${FORM_SELECT}`).attr('xm-select-skin', skin);
		this.check(id) && this.commonHandler(id, $(`dl[xid="${id}"]`).parents(`.${PNAME}`).find(`.${LABEL}`));
	}
	
	Common.prototype.getPosition = function(e){
		let x = 0, y = 0;
        while (e != null) {
            x += e.offsetLeft;
            y += e.offsetTop;
            e = e.offsetParent;
        }
        return { x: x, y: y };
	};
	
	Common.prototype.onreset = function(){//监听reset按钮, 然后重置多选
		$(document).on('click', '[type=reset]', (e) => {
			$(e.target).parents('form').find(`.${PNAME} dl[xid]`).each((index, item) => {
				let id = item.getAttribute('xid'),
					dl = $(item),
					dd,
					temp = {};
				common.removeAll(id);
				data[id].config.init.forEach((val, idx) => {
					if(val && (!temp[val] || data[id].config.repeat) && (dd = dl.find(`dd[lay-value="${val.value}"]`))[0]){
						common.handlerLabel(id, dd, true);
						temp[val] = 1;
					}
				});
			})
		});
	}
	
	Common.prototype.bindEvent = function(name, id, fun){
		if(id && id instanceof Function){
			fun = id;
			id = null;
		}
		if(fun && fun instanceof Function){
			if(!id){
				$.each(data, (id, val) => {
					data[id] ? (data[id].config[name] = fun) : (events[name][id] = fun)				
				})
			}else{
				data[id] ? (data[id].config[name] = fun, delete events[name][id]) : (events[name][id] = fun)
			}
		}
	}
	
	Common.prototype.check = function(id, notAutoRender){
		if($(`dl[xid="${id}"]`).length) {
			return true;
		}else if($(`select[xm-select="${id}"]`).length){
			if(!notAutoRender){
				this.render(id, $(`select[xm-select="${id}"]`));
				return true;
			}
		}else{
			delete data[id];
			return false;
		}
	}
	
	Common.prototype.render = function(id, select){
		common.init(select);
		common.one($(`dl[xid="${id}"]`).parents(`.${PNAME}`));
		common.initVal(id);
	}
	
	Common.prototype.log = function(obj){
		console.log(obj);
	}
	
	let Select4 = function(){
		this.v = v;
		this.render();
	};
	let common = new Common();
	
	Select4.prototype.value = function(id, type, isAppend){
		if(typeof id != 'string'){
			return [];
		}
		let fs = data[id];
		if(!common.check(id)){
			return [];
		}
		if(typeof type == 'string' || type == undefined){
			let arr = fs.values.concat([]) || [];
			if(type == 'val') {
				return arr.map((val) => {
					return val.value;
				});
			}
			if(type == 'valStr') {
				return arr.map((val) => {
					return val.value;
				}).join(',');
			}
			if(type == 'name') {
				return arr.map((val) => {
					return val.name;
				});
			}
			if(type == 'nameStr') {
				return arr.map((val) => {
					return val.name;
				}).join(',');
			}
			return arr;
		}
		if(common.isArray(type)) {
			let dl = $(`[xid="${id}"]`),
				temp = {},
				dd,
				isAdd = true;
			if(isAppend == false){//删除传入的数组
				isAdd = false;
			}else if(isAppend == true){//追加模式
				isAdd = true;
			}else{//删除原有的数据
				common.removeAll(id);
			}
			if(isAdd){
				fs.values.forEach((val, index) => {
					temp[val.value] = 1;
				});
			}
			type.forEach((val, index) => {
				if(val && (!temp[val] || fs.config.repeat)){
					if((dd = dl.find(`dd[lay-value="${val}"]`))[0]){
						common.handlerLabel(id, dd, isAdd, null, true);
						temp[val] = 1;
					}else{
						let name = common.valToName(id, val);						
						if(name){
							common.handlerLabel(id, dd, isAdd, common.getItem(id, val), true);
							temp[val] = 1;
						}
					}
				}
			});
		}
	}
	
	Select4.prototype.on = function(id, fun, isEnd) {
		common.bindEvent(isEnd ? 'endOn' : 'on', id, fun);
		return this;
	}
	
	Select4.prototype.filter = function(id, fun){
		common.bindEvent('filter', id, fun);
		return this;
	}
	
	Select4.prototype.maxTips = function(id, fun){
		common.bindEvent('maxTips', id, fun);
		return this;
	}
	
	Select4.prototype.opened = function(id, fun){
		common.bindEvent('opened', id, fun);
		return this;
	}
	
	Select4.prototype.closed = function(id, fun){
		common.bindEvent('closed', id, fun);
		return this;
	}
	
	Select4.prototype.config = function(id, config, isJson){
		if(id && typeof id == 'object'){
			isJson = config == true;
			config = id;
			id = null;
		}
		if(config && typeof config== 'object'){
			if(isJson){
				config.header || (config.header = {});
				config.header['Content-Type'] = 'application/json; charset=UTF-8';
				config.dataType = 'json';
			}
			id ? (
				ajaxs[id] = $.extend(true, {}, ajaxs[id] || ajax, config), !common.check(id) && this.render(id),
				data[id] && config.direction && (data[id].config.direction = config.direction),
				data[id] && config.clearInput && (data[id].config.clearInput = true),
				config.searchUrl && data[id] && common.triggerSearch($(`.${PNAME} dl[xid="${id}"]`).parents(`.${FORM_SELECT}`), true)
			) : (
				$.extend(true, ajax, config),
				$.each(ajaxs, (key, item) => {
					$.extend(true, item, config)
				})
			);
		}
		return this;
	}
	
	Select4.prototype.render = function(id, options){
		if(id && typeof id == 'object'){
			options = id;
			id = null;
		}
		let config = options ? {
			init: options.init,
			disabled: options.disabled,
			max: options.max,
			isSearch: options.isSearch,
			searchUrl: options.searchUrl,
			isCreate: options.isCreate,
			radio: options.radio,
			skin: options.skin,
			direction: options.direction,
			height: options.height,
			formname: options.formname,
			layverify: options.layverify,
			layverType: options.layverType,
			showCount: options.showCount,
			placeholder: options.placeholder,
			create: options.create,
			filter: options.filter,
			maxTips: options.maxTips,
			on: options.on,
			on: options.on,
			opened: options.opened,
			closed: options.closed,
			template: options.template,
			clearInput: options.clearInput,
		} : {};
		
		options && options.searchType != undefined && (config.searchType = options.searchType == 'dl' ? 1 : 0);
		
		if(id){
			fsConfigs[id] = {};
			$.extend(fsConfigs[id], data[id] ? data[id].config : {}, config);
		}else{
			$.extend(fsConfig, config);
		}

		($(`select[${NAME}="${id}"]`)[0] ? $(`select[${NAME}="${id}"]`) : $(`select[${NAME}]`)).each((index, select) => {
			let sid = select.getAttribute(NAME);
			common.render(sid, select);
			setTimeout(() => common.setHidnVal(sid, $(`select[xm-select="${sid}"] + div.${PNAME} .${LABEL}`)), 10);
		});
		return this;
	}
	
	Select4.prototype.disabled = function(id){
		let target = {};
		id ? (common.check(id) && (target[id] = data[id])) : (target = data);
		
		$.each(target, (key, val) => {
			$(`dl[xid="${key}"]`).prev().addClass(DIS);
		});
		return this;
	}
	
	Select4.prototype.undisabled = function(id){
		let target = {};
		id ? (common.check(id) && (target[id] = data[id])) : (target = data);
		
		$.each(target, (key, val) => {
			$(`dl[xid="${key}"]`).prev().removeClass(DIS);
		});
		return this;
	}
	
	Select4.prototype.data = function(id, type, config){
		if(!id || !type || !config){
			common.log(`id: ${id} param error !!!`)
			return this;
		}
		if(!common.check(id)){
			common.log(`id: ${id} not render !!!`)
			return this;
		}
		this.value(id, []);
		this.config(id, config);
		if(type == 'local'){
			common.renderData(id, config.arr, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100');
		}else if(type == 'server'){
			common.ajax(id, config.url, config.keyword, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100');
		}
		return this;
	}
	
	Select4.prototype.btns = function(id, btns, config){
		if(id && common.isArray(id)){
			btns = id;
			id = null;
		}
		if(!btns || !common.isArray(btns)) {
			return this;
		};
		let target = {};
		id ? (common.check(id) && (target[id] = data[id])) : (target = data);
		
		btns = btns.map((obj) => {
			if(typeof obj == 'string'){
				if(obj == 'select'){
					return quickBtns[0];
				}
				if(obj == 'remove'){
					return quickBtns[1];
				}
				if(obj == 'reverse'){
					return quickBtns[2];
				}
				if(obj == 'skin'){
					return quickBtns[3];
				}
			}
			return obj;
		});
		
		$.each(target, (key, val) => {
			val.config.btns = btns;
			let dd = $(`dl[xid="${key}"]`).find(`.${FORM_SELECT_TIPS}:first`);
			if(btns.length){
				let show = config && config.show && (config.show == 'name' || config.show == 'icon') ? config.show : '';
				let html = common.renderBtns(key, show, config && config.space ? config.space : '30px');
				dd.html(html);
			}else{
				let pcInput = dd.parents(`.${FORM_SELECT}`).find(`.${TDIV} input`);
				let html = pcInput.attr('placeholder') || pcInput.attr('back');
				dd.html(html);
				dd.removeAttr('style');
			}
		});
		
		return this;
	}
	
	Select4.prototype.search = function(id, val){
		if(id && common.check(id)){
			ajaxs[id] = $.extend(true, {}, ajaxs[id] || ajax, {
				first: true,
				searchVal: val
			});
			common.triggerSearch($(`dl[xid="${id}"]`).parents(`.${FORM_SELECT}`), true);
		}
		return this;
	}
	
	Select4.prototype.replace = function(id, type, config){
		if(!id || !type || !config){
			common.log(`id: ${id} param error !!!`)
			return this;
		}
		if(!common.check(id, true)){
			common.log(`id: ${id} not render !!!`)
			return this;
		}
		let oldVals = this.value(id, 'val');
		this.value(id, []);
		this.config(id, config);
		if(type == 'local'){
			common.renderData(id, config.arr, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100', false, true);
			this.value(id, oldVals, true);
		}else if(type == 'server'){
			common.ajax(id, config.url, config.keyword, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100', false, (id) => {
				this.value(id, oldVals, true);
			}, true);
		}
	}
	
	return new Select4();
});