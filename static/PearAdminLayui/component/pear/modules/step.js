layui.define(['layer', 'carousel'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var carousel = layui.carousel;

    var renderDom = function (elem, stepItems, postion) {
        var stepDiv = '<div class="lay-step">';
        for (var i = 0; i < stepItems.length; i++) {
            stepDiv += '<div class="step-item">';
            if (i < (stepItems.length - 1)) {
                if (i < postion) {
                    stepDiv += '<div class="step-item-tail"><i class="step-item-tail-done"></i></div>';
                } else {
                    stepDiv += '<div class="step-item-tail"><i class=""></i></div>';
                }
            }
            var number = stepItems[i].number;
            if (!number) {
                number = i + 1;
            }
            if (i == postion) {
                stepDiv += '<div class="step-item-head step-item-head-active"><i class="layui-icon">' + number + '</i></div>';
            } else if (i < postion) {
                stepDiv += '<div class="step-item-head"><i class="layui-icon layui-icon-ok"></i></div>';
            } else {
                stepDiv += '<div class="step-item-head "><i class="layui-icon">' + number + '</i></div>';
            }
            var title = stepItems[i].title;
            var desc = stepItems[i].desc;
            var time = stepItems[i].time;
            if (title || desc || time) {
                stepDiv += '<div class="step-item-main">';
                if (title) {
                    stepDiv += '<div class="step-item-main-title">' + title + '</div>';
                }
                if (desc) {
                    stepDiv += '<div class="step-item-main-desc">' + desc + '</div>';
                }
                if (time) {
                    stepDiv += '<div class="step-item-main-time">' + time + '</div>';
                }
                stepDiv += '</div>';
            }
            stepDiv += '</div>';
        }
        stepDiv += '</div>';
        $(elem).prepend(stepDiv);
        var bfb = 100 / stepItems.length;
        $('.step-item').css('width', bfb + '%');
    };

    var pearStep = {
        render: function (param) {
            param.indicator = 'none'; // 不显示指示器
            param.arrow = 'always'; // 始终显示箭头
            param.autoplay = false; // 关闭自动播放
            if (!param.stepWidth) {
                param.stepWidth = '400px';
            }
            carousel.render(param);
            var stepItems = param.stepItems;
            renderDom(param.elem, stepItems, 0);
            $('.lay-step').css('width', param.stepWidth);
            carousel.on('change(' + param.filter + ')', function (obj) {
                $(param.elem).find('.lay-step').remove();
                renderDom(param.elem, stepItems, obj.index);
                $('.lay-step').css('width', param.stepWidth);
            });
            $(param.elem).find('.layui-carousel-arrow').css('display', 'none');
            $(param.elem).css('background-color', 'transparent');
        },
        next: function (elem) {
            $(elem).find('.layui-carousel-arrow[lay-type=add]').trigger('click');
        },
        pre: function (elem) {
            $(elem).find('.layui-carousel-arrow[lay-type=sub]').trigger('click');
        }
    };
    exports('step', pearStep);
});