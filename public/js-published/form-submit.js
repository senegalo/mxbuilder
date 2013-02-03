(function($){
    
    $(function(){
        $(".form-to-mail-component-instance").each(function(){
            var element = $(this);
            
            element.find('input[type="button"]').on({
                click: function click(){
                    var submitButton = $(this).attr("disabled","disabled");
                    var loading = $('<img src="images/loading.gif" style="height:15px;"/>').insertAfter(submitButton);
                    $.post("mail.php",{
                        name: element.find('.form-name').val(),
                        email: element.find(".form-email").val(),
                        subject: element.find(".form-subject").val(),
                        message: element.find(".form-message").val()
                    },function(){
                        submitButton.removeAttr("disabled");
                        loading.remove();
                        if(element.data("after-submit") == "redirect"){
                            location.href = element.data("redirect-page");
                        } else {
                            var msg = element.find(".after-submit-message")
                            var theForm = element.find("form");
                            if(element.data("hide-form") == 1){
                                theForm.fadeOut(300,function(){
                                    msg.fadeIn(300);
                                });
                                if(element.data("redisplay") == 1){
                                    setTimeout(function(){
                                        msg.fadeOut(300,function(){
                                            theForm.fadeIn(300)
                                        });
                                    },element.data("redisplay-seconds")*1000);
                                }
                            } else {
                                msg.fadeIn(300);
                            }
                        }
                    });
                }
            });
        });
    });
    
}(jQuery));