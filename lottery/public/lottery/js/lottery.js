;(function (factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD. Register as an anonymous module.
         define(['jquery'], factory);
     } else if (typeof exports === 'object') {
         // CommonJS / nodejs module
         module.exports = factory(require('jquery'));
     } else {
         // Browser globals
         factory(jQuery);
     }
 }(function ($) {
    var Lottery = function(obj) {
        var opt = {
            //元素id
            id : 'lottery',
            //转盘停止位置
            stopIndex : 1,
            //转盘开始位置
            activeIndex : 2,
            //转盘最快速度，越小越快
            maxSpeed : 60,
            //转动次数
            maxTimes : 20,
            afterStop : function(){
                alert('afterStop')
            }
        }
        $.extend(opt,obj);
        this.opt = opt;
        this.activeIndex = this.opt.activeIndex;
        this.times = 0;
        this.timer = 0;
        this.initialSpeed = 120; 
        //还未点击
        this.click = false;
        this.init();
        return this;
    };
    Lottery.prototype = {
        //初始化函数
        init : function(){
            var _this = this;
            if ($("#"+_this.opt.id).find(".lottery-item").length>0) {
                $lottery = $("#"+_this.opt.id);
                $items = $lottery.find(".lottery-item");
                _this.$lottery = $lottery;
                _this.itemCount = $items.length;
                $lottery.find(".lottery-item-"+_this.activeIndex).addClass("active");
            };
        },
        roll : function(){
            var index = this.activeIndex;
            var count = this.itemCount;
            var lottery = this.$lottery;
            $(lottery).find(".lottery-item-"+index).removeClass("active");
            index += 1;
            if (index > count-1) {
                index = 0;
            };
            $(lottery).find(".lottery-item-"+index).addClass("active");
            this.activeIndex = index;
            console.log(this.activeIndex)
        },
        bind : function(object, func) {  
            return function() {  
                return func.apply(object, arguments);  
            }  
        },
        //循环滚动
        loopRoll : function(){
            var _this = this;
            _this.times += 1;
            _this.roll();
            if(_this.times > _this.opt.maxTimes+10 && _this.opt.stopIndex == _this.activeIndex){
                clearTimeout(_this.timer)
                setTimeout(_this.bind(_this,_this.opt.afterStop),0)
                _this.times = 0;
                _this.click = false;
            }else{
                if(_this.times < _this.opt.maxTimes){
                    _this.initialSpeed -= 10;
                }else{
                    _this.initialSpeed += 20;
                }
                if(_this.initialSpeed < _this.opt.maxSpeed){
                    _this.initialSpeed = _this.opt.maxSpeed
                }
                _this.timer = setTimeout(_this.bind(_this,_this.loopRoll),_this.initialSpeed);
            }
        },
        start : function(){
            if(this.click){
                alert('转盘还未停止！')
            }else{
                this.loopRoll();
                //已点击
                this.click = true;
            }
        }
    }
    window.Lottery = Lottery;
    return Lottery;
 }))
