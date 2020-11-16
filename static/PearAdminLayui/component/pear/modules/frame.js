layui.define(['table', 'jquery', 'element'], function (exports) {
    "use strict";

    var MOD_NAME = 'frame',
        $ = layui.jquery,
		element = layui.element;
		
    var pearFrame = function (opt) {
        this.option = opt;
    };

    pearFrame.prototype.render = function (opt) {
        //默认配置值
		var option = {
			elem:opt.elem,
			url:opt.url,
			title:opt.title,
			width:opt.width,
			height:opt.height,
			done:opt.done ? opt.done: function(){ console.log("菜单渲染成功");}
		}
		
	    createFrameHTML(option);
	   
	    $("#"+option.elem).width(option.width);
	    $("#"+option.elem).height(option.height);
		
		return new pearFrame(option);
    } 
	
	pearFrame.prototype.changePage = function(url,title,loading){
		
		if(loading){
			var loading = $("#"+this.option.elem).find(".pear-frame-loading");
			
			loading.css({display:'block'});
		}
		
		$("#"+this.option.elem+" iframe").attr("src",url);
	 
	    $("#"+this.option.elem+" .title").html(title);
	
	     if(loading){
	     	var loading = $("#"+this.option.elem).find(".pear-frame-loading");
	     	
			setTimeout(function(){
				
				loading.css({display:'none'});
			
			},800)
	     	
	     }
	
	}
	
	pearFrame.prototype.refresh = function (time) {
		
		
		// 刷 新 指 定 的 选 项 卡
		if(time!=false){
			
			var loading = $("#"+this.option.elem).find(".pear-frame-loading");
			
			loading.css({display:'block'});
			
			if(time!=0){
				
				setTimeout(function(){
					loading.css({display:'none'});
				},time)
			}
			
		}
		
		$("#"+this.option.elem).find("iframe")[0].contentWindow.location.reload(true);
	}
	
	function createFrameHTML(option){
		
		 var iframe = "<iframe class='pear-frame-content' style='width:100%;height:100%;'  scrolling='auto' frameborder='0' src='"+option.url+"' ></iframe>"
	
	     var loading = '<div class="pear-frame-loading">'+
			       '<div class="ball-loader">'+
				      '<span></span><span></span><span></span><span></span>'+
			       '</div>'+
		        '</div></div>'
	
	     $("#"+option.elem).html(iframe+loading);	
	}
	
	exports(MOD_NAME,new pearFrame());
})