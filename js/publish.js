(function($){
    $(function(){
       mxBuilder.layout.menu.find("#publish").on({
           click: function(){
               var out = mxBuilder.pages.publishAll();
               for(var i in out){
                   console.log(out[i]);
               }
           }
       });
    });
}(jQuery))