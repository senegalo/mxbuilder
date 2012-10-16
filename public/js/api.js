(function($){
    $.ajaxSetup({
        type: "post",
        dataType: "json",
        cache: false
    });
    
    $(document).ajaxError(function(){
        mxBuilder.dialogs.alert.show("Something went wrong... couldn't reach the server");
    });
    
    mxBuilder.api = {
        __genericSuccess: function(args){
            return function(data){
                if(data && data.success && args.success){
                    args.success(data);
                } else if(args.error){
                    args.error(data);
                }
            }
        },
        website: {
            save: function save(args){
                $.ajax({
                    url: mxBuilder.config.baseURL+"/websites/save",
                    data: {
                        "website_content": args.websiteData
                    },
                    success: mxBuilder.api.__genericSuccess(args)
                });
            },
            get: function get(args){
                $.ajax({
                    url: mxBuilder.config.baseURL+"/websites/get",
                    success: mxBuilder.api.__genericSuccess(args)
                });
            }
        }
    }
}(jQuery));