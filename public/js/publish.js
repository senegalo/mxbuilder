(function($){
    $(function(){
        mxBuilder.layout.menu.find("#publish").on({
            click: function(){
                mxBuilder.selection.clearSelection();
                var args = mxBuilder.pages.publishAll();
                $.extend(args,{
                    success: function(data){
                        mxBuilder.dialogs.alertDialog.show('Webiste Published successfully.</br><a href="'+data.website+'" target="_blank">Go to the website >></a>');
                    }
                });
                mxBuilder.api.website.publish(args);
            }
        });
    });
}(jQuery))