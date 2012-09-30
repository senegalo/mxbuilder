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
                rgba.a = $(this).val()/100;
                mxBuilder.dialogs.componentsBackground.setColor(rgba);
            }
        })
        .end()
        .find("#component-background-color").on({
            input: function input(){
                var that = $(this);
                var colors = that.val().match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/);
                if(colors){
                    var theColor = mxBuilder.dialogs.componentsBackground.getColor();
                    theColor.r = parseInt(colors[1],16);
                    theColor.g = parseInt(colors[2],16);
                    theColor.b = parseInt(colors[3],16);
                    mxBuilder.dialogs.componentsBackground.setColor(theColor);
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
            __instance: null,
            show: function show(instance){
                //cache the instances
                this.__instance = instance.find(".apply-background");
                this.__instance = this.__instance.length == 0 ? instance : this.__instance;
                
                this.setColor(this.getColor());
                this.__theDialog.dialog("open");
                mxBuilder.activeStack.push(this.__theDialog);
            },
            getColor: function getColor(){
                var color = this.__instance.css("backgroundColor");
                return mxBuilder.utils.getColorObj(color);
            },
            setColor: function setColor(rgba){
                this.__instance.css("backgroundColor",rgba.toString());
                this.__theDialog.find("#component-background-color").val(rgba.toHex())
                .end()
                .find("#component-background-opacity").val(rgba.a*100);
            }
        }
    });
    
}(jQuery))