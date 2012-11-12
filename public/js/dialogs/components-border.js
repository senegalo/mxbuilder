(function($){
    
    $(function(){
                
        var theDialog = mxBuilder.layout.templates.find(".component-border-dialog").appendTo(mxBuilder.layout.selectionSafe)
        .find(".border-width").slider({
            min: 0,
            max: 20,
            slide: function slide(event,ui){
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
                if(rgba.dirty !== true){
                    mxBuilder.dialogs.componentsBorder.setColor(rgba);
                } else {
                    mxBuilder.dialogs.componentsBorder.setOpacityOnly(rgba.a);
                }
                
            }
        })
        .end()
        .find("#component-border-color").on({
            input: function input(){
                var that = $(this);
                var colors = that.val().toLowerCase().match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/);
                if(colors){
                    var theColor = mxBuilder.dialogs.componentsBorder.getColor();
                    var newColor = {
                        r: parseInt(colors[1],16),
                        g: parseInt(colors[2],16),
                        b: parseInt(colors[3],16)
                    }
                    if(theColor.dirty !== true){
                        $.extend(theColor,newColor);
                        mxBuilder.dialogs.componentsBorder.setColor(theColor);
                    } else {
                        mxBuilder.dialogs.componentsBorder.setColorOnly(newColor);
                    }
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
            __elements: null,
            __originalElements: null,
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
            show: function show(elements){
                this.__originalElements = elements;
                
                //cache the instances
                this.__elements = elements.find(".apply-border");
                this.__elements = this.__elements.length == 0 ? elements : this.__elements;
                
                this.setWidth(this.getWidth());
                this.setRadius(this.getRadius());
                this.setColor(this.getColor());
                this.__theDialog.dialog("open");
                mxBuilder.activeStack.push(this.__theDialog);
            },
            getWidth: function getWidth(){
                var theWidth = false;
                this.__elements.each(function(){
                    var currentWidth = $(this).css("borderWidth");
                    if(currentWidth != theWidth && theWidth !== false){
                        theWidth = false;
                        return false;
                    }
                    theWidth = currentWidth;
                });
                return theWidth !== false ? theWidth.replace("px", "") : theWidth;
            },
            getRadius: function getRadius(){
                var theRadius = false;
                this.__elements.each(function(){
                    var currentRadius = $(this).css("borderRadius");
                    if(currentRadius != theRadius && theRadius !== false){
                        theRadius = false;
                        return false;
                    }
                    theRadius = currentRadius;
                });
                return theRadius !== false? theRadius.replace("px","") : theRadius;
            },
            setWidth: function setWidth(width){
                if(width !== false){
                    this.__theDialog.find("#component-border-width").val(width)
                    .end()
                    .find(".border-width").slider("value",width);
                    this.setSimWidth(width);
                    if(this.__elements){
                        this.__elements.css({
                            borderWidth:width,
                            borderStyle: "solid"
                        });
                        this.__originalElements.trigger("borderWidthChanged");
                        mxBuilder.selection.revalidateSelectionContainer();
                    }
                } else {
                    this.__theDialog.find("#component-border-width").val("")
                    .end()
                    .find(".border-width").slider("value",0);
                    this.setSimWidth(0);
                }
            },
            setRadius: function setRadius(radius){
                
                var selection = ["TopLeft","TopRight","BottomLeft","BottomRight"];
                if(radius !== false){
                    this.__theDialog.find(".component-sim").children("div").each(function(){
                        $(this).css("border"+selection.shift()+"Radius",radius);
                    });
                
                    this.__theDialog.find(".corner-slider").slider("value",radius)
                    .end()
                    .find("#component-border-corner-radius").val(radius);
                
                    if(this.__elements){
                        this.__elements.css("borderRadius",radius);
                        this.__originalElements.trigger("borderRadiusChanged");
                    }
                } else {
                    this.__theDialog.find(".component-sim").children("div").each(function(){
                        $(this).css("border"+selection.shift()+"Radius",0);
                    });
                
                    this.__theDialog.find(".corner-slider").slider("value",0)
                    .end()
                    .find("#component-border-corner-radius").val("");
                }
            },
            getColor: function getColor(){
                //Initial Color detection
                var selectedColor = null;
                this.__elements.each(function(){
                    var that = $(this);
                    var color = that.css("borderColor");
                    
                    color = mxBuilder.utils.getColorObj(color);
                    if(selectedColor === null){
                        selectedColor = color;
                    } else {
                        selectedColor = selectedColor.equal(color);
                    }
                });
                return selectedColor;
            },
            setColor: function setColor(rgba){
                if(rgba.dirty !== true){
                    this.__elements.css("borderColor",rgba.toString());
                    this.__theDialog.find(".component-sim").children("div").css("borderColor",rgba.toString());
                    this.__theDialog.find("#component-border-color").val(rgba.toHex())
                    .end()
                    .find("#component-border-opacity").val(rgba.a*100);
                } else {
                    if(!rgba.r || !rgba.b || !rgba.g){
                        this.__theDialog.find(".component.sim").children("div").css("borderColor", "#000000")
                        this.__theDialog.find("#component-border-color").val("");
                    } else {
                        this.__theDialog.find(".component.sim").children("div").css("borderColor", rgba.toHex())
                        this.__theDialog.find("#component-border-color").val(rgba.toString());
                    }
                    
                    if(!rgba.a){
                        this.__theDialog.find("#component-border-opacity").val('');
                    } else {
                        this.__theDialog.find("#component-border-opacity").val(rgba.a*100);
                    }
                    
                }
            },
            setColorOnly: function setColorOnly(color){
                this.__elements.each(function(){
                    var that = $(this);
                    var parsedElementColor = mxBuilder.utils.getColorObj(that.css("borderColor"));
                    $.extend(parsedElementColor,color);
                    that.css("borderColor", parsedElementColor.toString());
                });
            },
            setOpacityOnly: function setOpacityOnly(opacity){
                this.__elements.each(function(){
                    var that = $(this);
                    var parsedElementColor = mxBuilder.utils.getColorObj(that.css("borderColor"));
                    parsedElementColor.a = opacity;
                    that.css("borderColor", parsedElementColor.toString());
                });
            }
        }
        
        mxBuilder.dialogs.componentsBorder.setWidth(0);
        mxBuilder.dialogs.componentsBorder.setRadius(0);
        
    });
    
}(jQuery))