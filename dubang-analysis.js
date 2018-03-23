
(function(factory,global,$){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.DubangCanvas = factory(global,$));
})(function(window,$){

    var toPathLen = 50;     //水平展开的父节点的路径长度
    var childPathLen = 30;  //水平展开的子节点的路径长度
    var horToPathLen = 30;  //垂直展开的父节点的路径长度
    var horChildPathLen = 30;   //垂直展开的子节点的路径长度
    var lineWidth = 2;          //路径宽度
    var fontSize = "15px";      //节点文字大小
    var fontFamily = "serif";   //节点文字字体 
    var textAlign = 'left';     //节点文字水平排列
    var cateNameColor = "#fff"; //节点名称颜色
    var numColor = "#fae70a";   //节点数字颜色
    var bigBoxColor = "#031332";    //节点背景色
    var cateBoxColor = "#031d4f";   //节点名称背景色
    var boxBorderColor = "#14749d"; //节点边框颜色
    var canvasBackground = "#02142a";   //画布父元素背景色
    var metaFontSize = "60px";      //运算公式元素大小
    var metaFontFamily = "serif";   //运算公式元素字体
    var scaleX = 1;                 //画布X方向比例
    var scaleY = 1;                 //画布Y方向比例
    var firstNodeHeight = 25;

    //子结点展开方向
    var HORIZON = 'horizontal';
    var VERTICAL = 'vertical';
    var RIGHTVER = 'right-vertical';

    /**
     * 节点信息
     * x:节点x轴开始坐标
     * y:节点y轴开始坐标
     * xnum:节点数字x轴开始坐标
     * xname:节点名称x轴开始坐标
     * to:子节点数组
     * from:父节点数组
     * direct:子节点展开方向
     * level:节点层次
     */
    var catePos = {
        'ROE':{x:680, y:25, xnum:0,xname:0,to:['RC','ROTA'],direct:HORIZON,level:1},
        'DTAR':{x:300, y:185,xnum:0,xname:0,to:['TI','GA'],direct:HORIZON,level:2},
        'RC':{x:500, y:185, xnum:0,xname:0,to:['GA','TOE'],from:['ROE'],direct:HORIZON,level:2},
        'ROTA':{x:850, y:185, xnum:0,xname:0,to:['PM','TOTC'],from:['ROE'],direct:HORIZON,level:2},
        'TI':{x:30, y:345, xnum:0,xname:0,to:['CL','NCL'],from:['DTAR'],direct:HORIZON,level:3},
        'GA':{x:400, y:345,xnum:0,xname:0,to:['CA','NCA'],from:['DTAR','RC'],direct:HORIZON,level:3},
        'TOE':{x:600, y:345, xnum:0,xname:0,from:['RC'],level:3},
        'PM':{x:750, y:345, xnum:0,xname:0,to:['NM','GR'],from:['ROTA'],direct:HORIZON,level:3},
        'TOTC':{x:950, y:345, xnum:0,xname:0,from:['ROTA'],level:3},
        'CL':{x:30, y:505, xnum:0,xname:0,from:['TI'],level:4},
        'NCL':{x:250, y:505, xnum:0,xname:0,from:['TI'],level:4},
        'CA':{x:400, y:505,xnum:0,xname:0,to:['MR','AR','GIS'],from:['GA'],direct:VERTICAL,level:4},
        'NCA':{x:600, y:505, xnum:0,xname:0,from:['GA'],level:4},
        'NM':{x:750, y:505, xnum:0,xname:0,to:['GRC','TC','OR','IT'],from:['PM'],direct:VERTICAL,level:4},
        'GR':{x:950, y:505, xnum:0,xname:0,from:['PM'],level:4},
        'MR':{x:500, y:665, xnum:0,xname:0,from:['CA'],level:5},
        'AR':{x:500, y:785, xnum:0,xname:0,from:['CA'],level:6},
        'GIS':{x:500, y:905, xnum:0,xname:0,from:['CA'],level:7},
        'GRC':{x:850, y:665, xnum:0,xname:0,from:['NM'],level:5},
        'TC':{x:850, y:785, xnum:0,xname:0,to:['CIB','SE','GE','COF'],from:['NM'],direct:RIGHTVER,level:6},
        'OR':{x:850, y:905, xnum:0,xname:0,from:['NM'],level:7},
        'CIB':{x:1030, y:785, xnum:0,xname:0,from:['TC'],level:6},
        'IT':{x:850, y:1025, xnum:0,xname:0,from:['NM'],level:8},
        'SE':{x:1030, y:905, xnum:0,xname:0,from:['TC'],level:7},
        'GE':{x:1030, y:1025, xnum:0,xname:0,from:['TC'],level:8},
        'COF':{x:1030, y:1145, xnum:0,xname:0,from:['TC'],level:9},
    }

    /**
     * 运算公式元素信息
     */
    var formulaMetas = [
        {value:'1',x:50,y:240},
        {value:'÷',x:90,y:240},
        {value:'(',x:150,y:240},
        {value:'1',x:190,y:240},
        {value:'-',x:240,y:240},
        {value:')',x:430,y:240},
        {value:'=',x:460,y:240},
        {value:'×',x:710,y:240},
        {value:'÷',x:240,y:400},
        {value:'÷',x:530,y:400},
        {value:'×',x:880,y:400},
        {value:'+',x:185,y:570},
        {value:'+',x:545,y:570},
        {value:'×',x:880,y:570},
        {value:'+',x:545,y:785},
        {value:'-',x:885,y:785},
        {value:'+',x:545,y:905},
        {value:'+',x:885,y:905},
        {value:'+',x:1075,y:905},
        {value:'-',x:885,y:1025},
        {value:'+',x:1075,y:1025},
        {value:'+',x:1075,y:1145},
    ]

    var defaults = {
        width:1200,
        height:1300,
        selector:'dubang',
        //初始化配置时请按照该数组顺序进行
        category:[
            {code:'ROE',name:'净资产收益率',number:'8.01%'},
            {code:'DTAR',name:'资产负债率',number:'8.01%'},
            {code:'RC',name:'权益系数',number:'8.01%'},
            {code:'ROTA',name:'总资产收益率',number:'8.01%'},
            {code:'TI',name:'负债总额',number:'8.01%'},
            {code:'GA',name:'资产总额',number:'8.01%'},
            {code:'TOE',name:'所有者权益总额',number:'8.01%'},
            {code:'PM',name:'销售净利率',number:'8.01%'},
            {code:'TOTC',name:'总资产周转率',number:'8.01%'},
            {code:'CL',name:'流动负债',number:'8.01%'},
            {code:'NCL',name:'非流动负债',number:'8.01%'},
            {code:'CA',name:'流动资产',number:'8.01%'},
            {code:'NCA',name:'非流动资产',number:'8.01%'},
            {code:'NM',name:'净利润',number:'8.01%'},
            {code:'GR',name:'营业总收入',number:'8.01%'},
            {code:'MR',name:'货币资金',number:'185123.31亿'},
            {code:'AR',name:'应收账款',number:'8.01%'},
            {code:'GIS',name:'存货',number:'8.01%'},
            {code:'GRC',name:'营业总成本',number:'8.01%'},
            {code:'TC',name:'总成本',number:'8.01%'},
            {code:'CIB',name:'营业成本',number:'8.01%'},
            {code:'OR',name:'其他利润',number:'8.01%'},
            {code:'IT',name:'所得税',number:'8.01%'},
            {code:'SE',name:'销售费用',number:'8.01%'},
            {code:'GE',name:'管理费用',number:'8.01%'},
            {code:'COF',name:'财务费用',number:'8.01%'},
        ]
    }

    function DubangAnalysis(option){
        option = option || {};
        this.option = $.extend(true,{},defaults,option);
        this.el = this.option.selector ? document.getElementById(this.option.selector) : null;
        if(!this.el)return;
        if(!this.el.getContext)return;
        this.ctx = this.el.getContext('2d');
        this.init();
    }

    /**
     * 节点绘画
     * @param {Object} cont 
     * @param {Obejct} pos 
     */
    DubangAnalysis.prototype.drawBox = function(cont,pos){
        var ctx = this.ctx;
        
        pos.width = 120;
        pos.height = 80;
        pos.bottomy = pos.y+pos.height-15;
        pos.topy = pos.y+25;
        //绘画节点
        ctx.fillStyle = bigBoxColor;
        ctx.fillRect(pos.x,pos.y,pos.width,pos.height);
        //绘画节点边框
        ctx.strokeStyle = boxBorderColor;
        ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);
        //绘画节点名称box
        ctx.fillStyle = cateBoxColor;
        ctx.fillRect(pos.x,pos.y,pos.width,pos.height*0.5);
        //绘画节点名称box边框
        ctx.strokeStyle = boxBorderColor;
        ctx.strokeRect(pos.x,pos.y,pos.width,pos.height*0.5);
        //绘画节点名字
        ctx.fillStyle = cateNameColor;
        ctx.font = fontSize+" "+fontFamily;
        ctx.textAlign = textAlign;
        pos.nameWidth =ctx.measureText(cont.name).width
        pos.xname = pos.x + (pos.width-pos.nameWidth)*0.5;
        ctx.fillText(cont.name, pos.xname, pos.topy,pos.nameWidth);
        //绘画节点数字
        ctx.fillStyle = numColor;
        ctx.font = fontSize+" "+fontFamily;
        ctx.textAlign = textAlign;
        pos.numWidth = ctx.measureText(cont.number).width
        pos.xnum = pos.x + (pos.width-pos.numWidth)*0.5;
        ctx.fillText(cont.number, pos.xnum, pos.bottomy,pos.numWidth);
    }

    /**
     * 绘画节点路径
     * @param {Object} pos 
     * @param {String} code 
     */
    DubangAnalysis.prototype.drawLine = function(pos,code){
        var ctx = this.ctx;
        var to = pos.to;
        var from = pos.from;
        var minX=this.option.width,maxX=0,minY=this.option.height,maxY=0;
        var childEnd;
        if(to != null &&　to.length){
            if(pos.direct === HORIZON){
                minX = maxX = drawToLine(ctx,pos).x;
            }
            for(var i = 0,len = to.length;i<len;i++){
                var childPos = catePos[to[i]];
                var childFrom = childPos.from;
                if(!childFrom || !childFrom.length)continue;
                if(childFrom != null &&childFrom.length){
                    for(var j = 0,jlen = childFrom.length;j<jlen;j++){
                        if(childFrom[j] !== code)continue;
                        childEnd = drawFromLine(ctx,childPos,j+1,pos);
                        if(pos.direct === HORIZON){
                            if(minX>=childEnd.x)minX = childEnd.x;
                            if(maxX<=childEnd.x)maxX = childEnd.x;
                        }
                        if(pos.direct === VERTICAL){
                            if(maxX<=childEnd.x)maxX = childEnd.x;
                            if(maxY<=childEnd.y)maxY = childEnd.y;
                        }
                        if(pos.direct === RIGHTVER){
                            if(maxX<=childEnd.x)maxX = childEnd.x;
                            if(maxY<=childEnd.y)maxY = childEnd.y;
                            if(minX>=childEnd.x)minX = childEnd.x;
                            if(minY>=childEnd.y)minY = childEnd.y;
                        }
                    }
                }
            }
        }
        if(pos.direct === HORIZON){
            drawLinkLine(ctx,{x:minX,y:childEnd.y},{x:maxX,y:childEnd.y});
        }
        if(pos.direct === VERTICAL){
            drawLinkLine(ctx,{x:maxX,y:pos.y+pos.height},{x:maxX,y:maxY});
        }
        if(pos.direct === RIGHTVER){
            drawToLine(ctx,pos);
            drawLinkLine(ctx,{x:minX,y:minY},{x:maxX,y:maxY});
        }
        
    }

    /**
     * 绘画链接子节点路径
     * @param {Obejct} ctx 
     * @param {Object} pos 
     */
    function drawToLine(ctx,pos){
        var startX,startY,endX,endY;
        if(pos.direct === HORIZON){
            startX = pos.x + pos.width*0.5;
            startY = pos.y + pos.height;
            endX = startX;
            endY = startY + toPathLen;
        }
        if(pos.direct === RIGHTVER){
            startX = pos.x + pos.width;
            startY = pos.y + pos.height*0.5;
            endX = startX+30;
            endY = startY;
        }
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = boxBorderColor;
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.stroke();
        ctx.restore();
        return {x:endX,y:endY};
    }

    /**
     * 绘画链接父节点路径
     * @param {Object} ctx 
     * @param {Object} pos 
     * @param {Number} i 
     * @param {Object} parent 
     */
    function drawFromLine(ctx,pos,i,parent){
        var startX,startY,endX,endY;
        if(parent.direct == HORIZON){
            startX = pos.x + pos.width*(i/(pos.from.length+1));
            startY = pos.y;
            endX = startX;
            endY = startY - childPathLen;
        }
        if(parent.direct == VERTICAL){
            startX = pos.x;
            startY = pos.y + pos.height*0.5;
            endX = parent.x + parent.width*0.5;
            endY = startY;
        }
        if(parent.direct === RIGHTVER){
            startX = pos.x;
            startY = pos.y + pos.height*0.5;
            endX = startX - horChildPathLen;
            endY = startY;
        }
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = boxBorderColor;
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.stroke();
        ctx.restore();
        return {x:endX,y:endY}; 
    }

    /**
     * 绘画链接父节点和子节点路径
     * @param {Object} ctx 
     * @param {Object} startPos 
     * @param {Object} endPos 
     */
    function drawLinkLine(ctx,startPos,endPos){
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = boxBorderColor;
        ctx.beginPath();
        ctx.moveTo(startPos.x,startPos.y);
        ctx.lineTo(endPos.x,endPos.y);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * 绘画运算公式元素
     * @param {Object} ctx 
     * @param {Object} meta 
     */
    function drawMeta(ctx,meta){
        ctx.save();
        ctx.fillStyle = boxBorderColor;
        ctx.font = metaFontSize+" "+metaFontFamily;
        ctx.fillText(meta.value, meta.x, meta.y,ctx.measureText(meta.value).width);
        ctx.restore();
    }

    /**
     * 画布初始化
     */
    DubangAnalysis.prototype.init = function(){
        this.initCanvas();
        this.initBoxes();
        this.initEvent();
    }

    /**
     * 初始化节点
     */
    DubangAnalysis.prototype.initBoxes = function(){
        var ctx = this.ctx;
        var canvas = this.el;
        var category = this.option.category;
        var i = 0,pos;
        for(i = 0,len = category.length;i<len;i++){
            pos = catePos[category[i].code];
            this.drawBox(category[i],pos);
        }
        for(i = 0,len = category.length;i<len;i++){
            pos = catePos[category[i].code];
            this.drawLine(pos,category[i].code);
        }
        for(i = 0,len = formulaMetas.length;i<len;i++){
            var meta = formulaMetas[i];
            drawMeta(ctx,meta)
        }
    }

    /**
     * 初始化滚轮事件
     */
    DubangAnalysis.prototype.initEvent = function(){
        var that = this;
        var ctx = this.ctx;
        var canvas = this.el;
        var parent = canvas.parentNode;
        parent.style.background = canvasBackground;
        function wheelHandler(e){
            e = e || window.event;
            var delta = e.wheelDelta || e.delta || -e.detail;
            e.preventDefault();
            if(delta>0){
                scaleX += 0.05;
                scaleY += 0.05;
            }else{
                scaleX -= 0.05;
                scaleY -= 0.05;
            }
            if(scaleX>=1.5&&scaleY>=1.5){
                scaleX=1.5;
                scaleY=1.5;
                return;
            }
            if(scaleX<=0.1&&scaleY<=0.1){
                scaleX=0.1;
                scaleY=0.1;
                return;
            }
            ctx.clearRect(0,0,that.option.width,that.option.height);
            that.initCanvas();
            that.initBoxes();
        }

        parent.onmousewheel = wheelHandler;
        parent.onDOMMouseScroll = wheelHandler;
    }

    /**
     * 初始化画布
     */
    DubangAnalysis.prototype.initCanvas = function(){
        var canvas = this.el;
        var ctx = this.ctx;
        var oldheight = canvas.height;
        var oldwidth = canvas.width;
        var data=ctx.getImageData(0,0,oldwidth,oldheight);

        canvas.width = this.option.width*scaleX;
        canvas.height=this.option.height*scaleY;
        ctx.putImageData(data,0,0);
        ctx.scale(scaleX,scaleY);
    }
    
    function DubangCanvas(option){
        return new DubangAnalysis(option);
    }

    /**
     * 测试例子
     */
    var tmp =  DubangCanvas({category:[{code:'ROE',name:'净资产收益率',number:'8.01%'},{code:'DTAR',name:'资产负债率',number:'68.01%'}]});

    return DubangCanvas;
},window,window.$)