(function($){
    
    $(function(){
        var theDialog = mxBuilder.layout.templates.find(".progress-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            modal: true
        });
        
        theDialog.parent().find(".ui-dialog-titlebar").hide();
    
        mxBuilder.dialogs.progressDialog = {
            show: function show(msg){
                if(msg){
                    this.msg(msg);
                }
                theDialog.dialog("open");
            },
            msg: function msg(msg){
                theDialog.text(msg);
            },
            hide: function hide(){
                theDialog.dialog("close");
            }
        } 
    });
    
}(jQuery));