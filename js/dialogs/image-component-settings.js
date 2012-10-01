(function($) {
    
    var theDialog;
    
    $(function(){
        theDialog = mxBuilder.layout.templates.find(".image-component-chtitle-dialog").remove().dialog({
            title: "Image Settings",
            autoOpen: false,
            zIndex: 10000008,
            resizable: false,
            buttons: {
                Close: function(){
                    $(this).dialog("close");
                }
            }
        }).find("#image-component-settings-title").on({
            input: function(){
                mxBuilder.dialogs.imageComponentChangeTitle.setTitle($(this).val());
            }
        })
        .end();
        
        mxBuilder.dialogs.imageComponentChangeTitle = {
            __theDialog: theDialog,
            __instance: null,
            __theImage: null,
            show: function(instance){
                this.__instance = instance;
                this.__theImage = instance.find("img");
                this.__theDialog.find("#image-component-settings-title").val(this.getTitle())
                .end()
                .dialog("open");
            },
            setTitle: function(title){
                this.__theImage.attr("title",title);
            },
            getTitle: function(){
                return this.__theImage.attr("title");
            }
        }
    
    });
}(jQuery));