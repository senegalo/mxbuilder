(function($){
    $(function(){
        mxBuilder.layout.menu.find("#publish").on({
            click: function(){
                mxBuilder.selection.clearSelection();
                var args = mxBuilder.pages.publishAll();
                $.extend(args,{
                    success: function(data){
                        alert(data.website);
                    }
                });
                mxBuilder.api.website.publish(args);
            }
        });
    });
}(jQuery))