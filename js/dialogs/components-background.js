(function($){
    
    $(function(){
        var html = '<div>';
        html += '<div style="margin-bottom: 10px;">';
        html += '<label for="component-border-color">Color:</label>';
        html += '<input type="text" id="component-background-color"/>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label for="component-border-color">Opacity:</label>';
        html += '<input type="number" min="0" max="100" step="1" id="component-background-opacity"/>%';
        html += '</div>';
        
        html += '</div>';
        
        var theDialog = $(html).find("#component-background-opacity").on({
            keydown: mxBuilder.utils.suppressNonDigitKeyEvent,
            input: function input(){
                var rgba = mxBuilder.dialogs.componentsBackground.getColor();
                var opacity =  $(this).val()/100;
                if(rgba.dirty !== true){
                    rgba.a = opacity;
                    mxBuilder.dialogs.componentsBackground.setColor(rgba);
                } else {
                    mxBuilder.dialogs.componentsBackground.setOpacityIndividually(opacity);
                }
            }
        })
        .end()
        .find("#component-background-color").on({
            input: function input(){
                var that = $(this);
                var colors = that.val().match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/);
                if(colors){
                    var theColor = mxBuilder.dialogs.componentsBackground.getColor();
                    var newColor = {
                        r: parseInt(colors[1],16),
                        g: parseInt(colors[2],16), 
                        b: parseInt(colors[3],16)
                    }
                    if(theColor.dirty !== true){
                        $.extend(theColor,newColor);
                        mxBuilder.dialogs.componentsBackground.setColor(theColor);
                    } else {
                        mxBuilder.dialogs.componentsBackground.setBackgroundColorIndividually(newColor);
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
            title: "Background Settings",
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
    
        mxBuilder.dialogs.componentsBackground = {
            __theDialog: theDialog,
            __elements: null,
            show: function show(elements){
                //cache the elements
                this.__elements = elements.find(".apply-background");
                this.__elements = this.__elements.length == 0 ? elements : this.__elements;
                
                var selectedColor = this.getColor();
                
                this.setColor(selectedColor);
                this.__theDialog.dialog("open");
                mxBuilder.activeStack.push(this.__theDialog);
            },
            getColor: function getColor(){
                var selectedColor = null;
                this.__elements.each(function(){
                    
                    var that = $(this);
                    var color = that.css("backgroundColor");
                    
                    color = mxBuilder.utils.getColorObj(color);
                    if(selectedColor === null){
                        selectedColor = color;
                    } else {
                        selectedColor = selectedColor.equal(color)
                    }
                });
                return selectedColor;
            },
            setColor: function setColor(rgba){
                if(rgba.dirty !== true){
                    this.__elements.css("backgroundColor",rgba.toString());
                    this.__theDialog.find("#component-background-color").val(rgba.toHex())
                    .end()
                    .find("#component-background-opacity").val(rgba.a*100);
                } else {
                    if(!rgba.r || !rgba.b || !rgba.g){
                        this.__theDialog.find("#component-background-color").val('')
                    } else {
                         this.__theDialog.find("#component-background-color").val(rgba.toHex());
                    }
                    if(!rgba.a){
                        this.__theDialog.find("#component-background-opacity").val('');
                    } else {
                        this.__theDialog.find("#component-background-opacity").val(rgba.a*100);
                    }
                }
            },
            setOpacityIndividually: function setOpacityIndividually(opacity){
                this.__elements.each(function(){
                    var that = $(this);
                    var parsedElementColor = mxBuilder.utils.getColorObj(that.css("backgroundColor"));
                    parsedElementColor.a = opacity;
                    that.css("backgroundColor", parsedElementColor.toString());
                });
            },
            setBackgroundColorIndividually: function setBackgroundColorIndividually(color){
                this.__elements.each(function(){
                    var that = $(this);
                    var parsedElementColor = mxBuilder.utils.getColorObj(that.css("backgroundColor"));
                    $.extend(parsedElementColor,color);
                    that.css("backgroundColor", parsedElementColor.toString());
                });
            }
        }
    });
    
}(jQuery))