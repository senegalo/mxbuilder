(function($){
    $(function(){
        mxBuilder.layout.menu.find("#header-background").on({
            click: function click(){
                mxBuilder.dialogs.componentsBackground.show(mxBuilder.layout.layoutHeader);
            }
        });
        
        mxBuilder.layout.menu.find("#body-background").on({
            click: function click(){
                mxBuilder.dialogs.componentsBackground.show($(document.body));
            }
        });
        
        mxBuilder.layout.menu.find("#footer-background").on({
            click: function click(){
                mxBuilder.dialogs.componentsBackground.show(mxBuilder.layout.layoutFooter);
            }
        });
        
    });
}(jQuery));