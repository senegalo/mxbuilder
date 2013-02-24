(function($){
    
    $(function(){
        mxBuilder.shadowManager = {
            _shadows: {
                sh1 : {
                    id: "sh1",
                    name: "sh_3.png",
                    r: 18.1923
                },
                sh2: {
                    id: "sh2",
                    name: "sh_2.png",
                    r: 67.6428
                },
                sh3: {
                    id: "sh3",
                    name: "sh_15.png",
                    r: 17.2083
                },
                sh4: {
                    id: "sh4",
                    name: "sh_4.png",
                    r: 24.0833
                },
                sh5: {
                    id: "sh5",
                    name: "sh_5.png",
                    r: 23.825
                },
                sh6: {
                    id: "sh6",
                    name: "sh_6.png",
                    r: 28.7575
                },
                sh7: {
                    id: "sh7",
                    name: "sh_7.png",
                    r: 26.1666
                }
            },
            each: function(callback){
                for(var i in this._shadows){
                    callback.call(this._shadows[i]);
                }
            },
            applyShadow: function(settings){
                
                settings.parent = typeof settings.parent == "undefined" ? settings.element.parent() : settings.parent;
                
                //compensate for rounded corners
                if(typeof settings.rightRadius == "undefined"){
                    settings.rightRadius = settings.parent.css("borderBottomRightRadius");
                }
                if(typeof settings.leftRadius == "undefined"){
                    settings.leftRadius = settings.parent.css("borderBottomLeftRadius");
                }
                
                try {
                    settings.leftRadius = parseInt(settings.leftRadius,10);
                } catch(e){
                    settings.leftRadius = 0;
                }
                
                try {
                    settings.rightRadius = parseInt(settings.rightRadius,10);
                } catch(e){
                    settings.rightRadius = 0;
                }
                
                settings.width = typeof settings.width == "undefined"?settings.parent.width():settings.width;
                
                var width = settings.width-settings.rightRadius-settings.leftRadius;
                var height = width/this._shadows[settings.id].r;
                height = height<12?12:height;
                settings.element.css({
                    backgroundImage: 'url("public/images/shadows/'+this._shadows[settings.id].name+'")',
                    backgroundSize: width+"px "+height+"px",
                    height: height,
                    bottom: -1*height,
                    width: width,
                    left: settings.leftRadius
                });
            }
            
        }
    });
    
}(jQuery));