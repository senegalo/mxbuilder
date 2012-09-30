(function($){
    
    $(function(){
        var html = '<div>';
        
        html += '<div class="component-sim" style="margin-right:auto;margin-left:auto;text-align:center;height:135px">';
        html += '<div data-sim="1001" style="border-width: 3px 0px 0px 3px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>';
        html += '<div data-sim="1100" style="border-width: 3px 3px 0px 0px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div><br/>';
        html += '<div data-sim="0011" style="border-width: 0px 0px 3px 3px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>';
        html += '<div data-sim="0110" style="border-width: 0px 3px 3px 0px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label for="component-border-corner-radius">Corners:</label>';
        html += '<input type="number" id="component-border-corner-radius" min="0" max="20" style="width:33px;"/> px';
        html += '<div class="corner-slider"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">'
        html += '<label for="component-border-width">Width:</label>';
        html += '<input type="number" id="component-border-width" min="0" max="20" style="width:33px;"/> px';
        html += '<div class="border-width"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label for="component-border-color">Color:</label>';
        html += '<input type="text" id="component-border-color"/>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label for="component-border-color">Opacity:</label>';
        html += '<input type="number" min="0" max="100" step="1" id="component-border-opacity"/>%';
        html += '</div>';
        
        html += '</div>';
        
        var theDialog = $(html).find(".border-width").slider({
            min: 0,
            max: 20,
            slide: function slider(event,ui){
                mxBuilder.dialogs.componentsBorder.setWidth(ui.value);
            }
        })
        .end()
        .find("#component-border-width").on({
            keydown: mxBuilder.utils.suppressNonDigitKeyEvent,
            input: function input(){
                mxBuilder.dialogs.componentsBorder.setWidth($(this).val());
            }
        })
        .end()
        .find(".corner-slider").slider({
            min: 0,
            max: 20,
            slide: function slider(event,ui){
                mxBuilder.dialogs.componentsBorder.setRadius(ui.value);
            }
        })
        .end()
        .find("#component-border-corner-radius").on({
            keydown: mxBuilder.utils.suppressNonDigitKeyEvent,
            input: function input(){
                mxBuilder.dialogs.componentsBorder.setRadius($(this).val());
            }
        })
        .end()
        .find("#component-border-opacity").on({
            keydown: mxBuilder.utils.suppressNonDigitKeyEvent,
            input: function input(){
                var rgba = mxBuilder.dialogs.componentsBorder.getColor();
                rgba.a = $(this).val()/100;
                mxBuilder.dialogs.componentsBorder.setColor(rgba);
            }
        })
        .end()
        .find("#component-border-color").on({
            input: function input(){
                var that = $(this);
                var colors = that.val().match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/);
                if(colors){
                    var theColor = mxBuilder.dialogs.componentsBorder.getColor();
                    theColor.r = parseInt(colors[1],16);
                    theColor.g = parseInt(colors[2],16);
                    theColor.b = parseInt(colors[3],16);
                    mxBuilder.dialogs.componentsBorder.setColor(theColor);
                }
            }
        })
        .end()
        .dialog({
            resizable: false,
            width: 300,
            autoOpen: false,
            zIndex: 10000008,
            title: "Border Settings",
            buttons: {
                Close: function Close(){
                    $(this).dialog("close");
                }
            }
        }).on({
            poppedFromActiveStack: function(){
                $(this).dialog("close");
            }
        });
        
        mxBuilder.dialogs.componentsBorder = {
            __theDialog: theDialog,
            __instance: null,
            __originalInstance: null,
            setSimWidth: function setSimWidth(width){
                this.__theDialog.find(".component-sim").children("div").each(function(){
                    var that = $(this);
                    var newWidth = that.data("sim").toString().split("");
                    for(var i in newWidth){
                        newWidth[i] = (newWidth[i]*width)+"px";
                    }
                    that.css({
                        borderWidth: newWidth.join(" ")
                    });
                });
            },
            show: function show(instance){
                this.__originalInstance = instance;
                //cache the instances
                this.__instance = instance.find(".apply-border");
                this.__instance = this.__instance.length == 0 ? instance : this.__instance;
                
                this.setWidth(this.__instance.css("borderWidth").replace("px",""));
                this.setRadius(this.__instance.css("borderRadius").replace("px",""));
                this.setColor(this.getColor());
                this.__theDialog.dialog("open");
                mxBuilder.activeStack.push(this.__theDialog);
            },
            setWidth: function setWidth(width){
                this.__theDialog.find("#component-border-width").val(width)
                .end()
                .find(".border-width").slider("value",width);
                this.setSimWidth(width);
                if(this.__instance){
                    this.__instance.css({
                        borderWidth:width,
                        borderStyle: "solid"
                    });
                    this.__originalInstance.trigger("borderWidthChanged");
                    mxBuilder.selection.revalidateSelectionContainer();
                }
            },
            setRadius: function setRadius(radius){
                radius = parseInt(radius,10);
                var selection = ["TopLeft","TopRight","BottomLeft","BottomRight"];
                this.__theDialog.find(".component-sim").children("div").each(function(){
                    $(this).css("border"+selection.shift()+"Radius",radius);
                });
                
                this.__theDialog.find(".corner-slider").slider("value",radius)
                .end()
                .find("#component-border-corner-radius").val(radius);
                
                if(this.__instance){
                    this.__instance.css("borderRadius",radius);
                    this.__originalInstance.trigger("borderRadiusChanged");
                }
            },
            getColor: function getColor(){
                var color = this.__instance.css("borderColor");
                return mxBuilder.utils.getColorObj(color);
            },
            setColor: function setColor(rgba){
                this.__instance.css("borderColor",rgba.toString());
                this.__theDialog.find(".component-sim").children("div").css("borderColor",rgba.toString());
                this.__theDialog.find("#component-border-color").val(rgba.toHex())
                .end()
                .find("#component-border-opacity").val(rgba.a*100);
            }
        }
        
        mxBuilder.dialogs.componentsBorder.setWidth(0);
        mxBuilder.dialogs.componentsBorder.setRadius(0);
        
    });
    
}(jQuery))