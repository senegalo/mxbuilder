(function($){
    $(function(){
        mxBuilder.layout.menu.find("#publish").on({
            click: function(){
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