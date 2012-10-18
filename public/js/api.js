(function($){
    $.ajaxSetup({
        type: "post",
        dataType: "json",
        cache: false
    });
    
    $(document).ajaxError(function(){
        mxBuilder.dialogs.alertDialog.show("Something went wrong... couldn't reach the server");
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
        },
        assets: {
            get: function get(args){
                $.ajax({
                    url: mxBuilder.config.baseURL+"/assets/get",
                    success: mxBuilder.api.__genericSuccess(args)
                });
            },
            remove: function remove(args){
                $.ajax({
                    url: mxBuilder.config.baseURL+"/assets/delete",
                    success: mxBuilder.api.__genericSuccess(args),
                    complete: args.complete,
                    data: {
                        "asset_id": args.assetID
                    }
                });
            },
            changeAssetName: function changeAssetName(args){
                $.ajax({
                   url: mxBuilder.config.baseURL+"/assets/change_asset_name",
                   success: mxBuilder.api.__genericSuccess(args),
                   complete: args.complete,
                   data: {
                       "asset_id": args.assetID,
                       "new_name": args.newName
                   }
                });
            },
            changeImageDefaults: function changeImageDefaults(args){
                $.ajax({
                    url: mxBuilder.config.baseURL+"/assets/change_image_defaults",
                    success: mxBuilder.api.__genericSuccess(args),
                    complete: args.complete,
                    data: {
                        "asset_id": args.assetID,
                        "caption": args.caption,
                        "title": args.title
                    }
                });
            }
        }
    }
}(jQuery));