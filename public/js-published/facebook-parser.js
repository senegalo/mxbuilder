(function($){
    
    $(function(){
        $(document.body).on({
            fbReady: function(){
                FB.XFBML.parse();
            }
        })
    });
    
}(jQuery));