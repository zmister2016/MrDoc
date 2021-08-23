layui.define(['layer', 'form'], function(exports) {
	var layer = layui.layer,
		form = layui.form,
		$ = layui.$,
		key = '';
	delHtml()
	$('button').on('click', function() {
		var _this = $(this),
			size = _this.data('size'),
			type = _this.data('type'),
			html = '';
		key = randStrName();
		switch (type) {
			case 'text':
				html = input(type, size)
				break;
			case 'password':
				html = input(type, size)
				break;
			case 'select':
				html = select(size)
				break;
			case 'checkbox_a':
				html = checkbox_a(size)
				break;
			case 'checkbox_b':
				html = checkbox_b(size)
				break;
			case 'radio':
				html = radio(size)
				break;
			case 'textarea':
				html = textarea(size)
				break;
			case 'submit':
				html = submits(size)
				break;
			case 'del':
				$('form').html("\n")
				delHtml()
				$('.code-show').text('')
				return false
				break;
			default:
				layer.msg('类型错误', {
					icon: 2
				})
		}

		$('form').append(html);
		form.render();
		setHtml(html)
	})

	function delHtml() {
		layui.data('form_html', {
			key: 'html',
			remove: true
		});
	}

	function setHtml(html) {
		var h = layui.data('form_html');
		if (h && h.html) {
			var _d = h.html + html
		} else {
			var _d = html
		}
		layui.data('form_html', {
			key: 'html',
			value: _d
		})
		$('.code-show').text('<form class="layui-form" action="" onsubmit="return false">\n' + _d + '</form>')

	}

	function input(type, size) {
		var name = type === 'text' ? '输入框' : (type === 'password' ? '密码框' : '');
		var html = '  <div class="layui-form-item">\n' +
			'    <label class="layui-form-label">' + name + '</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <input type="' + type + '" name="' + key + '" required  lay-verify="required" placeholder="请输入' + name +
			'内容" autocomplete="off" class="layui-input">\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function select(size) {
		var html = '  <div class="layui-form-item">\n' +
			'    <label class="layui-form-label">选择框</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <select name="' + key + '" lay-verify="required" lay-search>\n' +
			'        <option value=""></option>\n' +
			'        <option value="0">北京</option>\n' +
			'        <option value="1">上海</option>\n' +
			'        <option value="2">广州</option>\n' +
			'        <option value="3">深圳</option>\n' +
			'        <option value="4">杭州</option>\n' +
			'      </select>\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function checkbox_a(size) {
		var html = '  <div class="layui-form-item">\n' +
			'    <label class="layui-form-label">复选框</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <input type="checkbox" name="' + key + '[]" title="写作">\n' +
			'      <input type="checkbox" name="' + key + '[]" title="阅读" checked>\n' +
			'      <input type="checkbox" name="' + key + '[]" title="发呆">\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function checkbox_b(size) {
		var html = '  <div class="layui-form-item">\n' +
			'    <label class="layui-form-label">开关</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <input type="checkbox" name="' + key + '" lay-skin="switch">\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function radio(size) {
		var html = '  <div class="layui-form-item">\n' +
			'    <label class="layui-form-label">单选框</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <input type="radio" name="' + key + '" value="男" title="男">\n' +
			'      <input type="radio" name="' + key + '" value="女" title="女" checked>\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function textarea(size) {
		var html = '  <div class="layui-form-item layui-form-text">\n' +
			'    <label class="layui-form-label">文本域</label>\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <textarea name="' + key + '" placeholder="请输入内容" class="layui-textarea"></textarea>\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function submits(size) {
		var html = '  <div class="layui-form-item">\n' +
			'    <div class="layui-input-' + size + '">\n' +
			'      <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>\n' +
			'      <button type="reset" class="layui-btn layui-btn-primary">重置</button>\n' +
			'    </div>\n' +
			'  </div>\n';
		return html;
	}

	function jscode() {
		var html = '<script>\n' +
			'  layui.use(\'form\', function(){\n' +
			'    var form = layui.form;\n' +
			'    form.on(\'submit(formDemo)\', function(data){\n' +
			'      layer.msg(JSON.stringify(data.field));\n' +
			'      return false;\n' +
			'    });\n' +
			'  });\n' +
			'</script>';
		return html;
	}

	function randStrName() {
		return Math.random().toString(36).substr(8);
	}
	var jscodehtml = jscode();
	$('.js-show').text(jscodehtml)
	form.on('submit(formDemo)', function(data) {
		layer.msg(JSON.stringify(data.field));
		return false;
	});
	exports('design', {});
});
