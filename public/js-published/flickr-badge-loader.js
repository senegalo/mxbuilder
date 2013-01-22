(function($){
    
    $(function(){
        $(".flexly-flickr-badge-component-instance").each(function(){
            var element = $(this);
            var imagesContainer = element.find(".images");
            var src = "http://www.flickr.com/badge_code_v2.gne?show_name=0";
            src += "&count="+element.data("count"); 
            src += "&display="+element.data("display");
            src += "&size="+element.data("imgsize");
            src += "&layout=h";
            src += "&source=user&user="+element.data("user");
                
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            $(script).on({
                load: function(){
                    var theImages = $(b_txt).find('a').attr("target","_blank");
                    theImages.addClass("flickr-badge-img");
                    imagesContainer.append(theImages);
                    element.width(imagesContainer.outerWidth(true));
                    element.height(imagesContainer.outerHeight(true));
                }
            });
            imagesContainer.get(0).appendChild(script);
        });
    });
    
}(jQuery));