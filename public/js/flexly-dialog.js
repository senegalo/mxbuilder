(function($){
    $(function(){
        var template = mxBuilder.layout.templates.find(".flexly-dialog").remove();       
        var buttonPan = template.find(".flexly-button-pane").remove();
        
        mxBuilder.dialogs.flexlyDialog = {
            create: function create(settings){
                var buttons = settings.buttons;
                delete settings.buttons;
                
                var properties = {
                    modal: false,
                    resizable: true,
                    draggable: true,
                    zIndex: 10000008,
                    autoOpen: true,
                    content: ""
                };
                
                $.extend(properties,settings);
                
                var theDialog = template.clone()
                .find(".flexly-dialog-content")
                .append(properties.content)
                .end()
                .appendTo(mxBuilder.layout.selectionSafe)
                .dialog(properties);
                
                if(buttons){
                    var theButtonSet = buttonPan.clone().insertAfter(theDialog).find(".ui-dialog-buttonset");
                    for(var b in buttons){
                        var button = $('<button>'+buttons[b].label+'</button>').appendTo(theButtonSet);
                        if(buttons[b].klass){
                            button.prepend('<div class="flexly-dialog-button-icon flexly-icon '+buttons[b].klass+'"></div>');
                            button.addClass("flexly-dialog-button");
                        }
                        if(buttons[b].click){
                            (function(callback){
                                button.on({
                                    click: function(){
                                        callback.call(theDialog);
                                    }
                                });
                            }(buttons[b].click))
                        }
                    }
                }
                
                return theDialog;
            }
        }
        
    });
}(jQuery))