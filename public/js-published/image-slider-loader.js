(function($){
    
    $(function(){
        $(".image-gallery-slider").each(function(){
            var element = $(this);
            
            var settings = {
                autoPlay: element.data("ap"),
                transitionSpeed: element.data("tr"),
                indicator: element.data("in"),
                action: element.data("ac"),
                navigation: element.data("na")
            }
            
            element.imageSlider(settings);
        });
    });
    
}(jQuery));