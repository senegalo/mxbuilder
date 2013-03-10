(function($){
    
    $(function(){
        $(".image-grid-component-instance td").each(function(){
           var element = $(this);
           element.css({
               backgroundImage: 'url("'+element.data("relurl")+'")'
           }).removeAttr("data-relurl");
        });
    });
    
}(jQuery));