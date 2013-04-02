(function($) {
    $.ajaxSetup({
        type: "post",
        dataType: "json",
        cache: false
    });

    $(document).ajaxError(function() {
        mxBuilder.dialogs.alertDialog.show("Something went wrong... couldn't reach the server");
    });

    mxBuilder.api = {
        _genericSuccess: function(args) {
            return function(data) {
                if (data && data.success && args.success) {
                    args.success(data);
                } else if (args.error) {
                    args.error(data);
                }
            };
        },
        website: {
            save: function save(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/websites/save",
                    data: {
                        "website_content": args.websiteData
                    },
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete
                });
            },
            get: function get(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/websites/get",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete
                });
            },
            publish: function publish(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/websites/publish",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete,
                    data: {
                        pages: args.pages,
                        layout: args.layout,
                        assets: args.assets,
                        has_forms: args.hasForms
                    }
                });
            }
        },
        assets: {
            get: function get(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/assets/get",
                    success: mxBuilder.api._genericSuccess(args)
                });
            },
            remove: function remove(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/assets/delete",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete,
                    data: {
                        "asset_ids": args.ids
                    }
                });
            },
            changeAssetName: function changeAssetName(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/assets/change_asset_name",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete,
                    data: {
                        "asset_id": args.assetID,
                        "new_name": args.newName
                    }
                });
            },
            updatePhotoProperties: function updatePhotoProperties(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/assets/update_photo_properties",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete,
                    data: {
                        "asset_id": args.assetID,
                        "caption": args.caption,
                        "title": args.title,
                        "name": args.name
                    }
                });
            },
            addFlickerImage: function addFlickerImage(args) {
                $.ajax({
                    url: mxBuilder.config.baseURL + "/assets/add_flicker_image",
                    success: mxBuilder.api._genericSuccess(args),
                    complete: args.complete,
                    data: {
                        flicker_obj: args.flickerObj
                    }
                });
            }
        },
        flicker: {
            defaults: {
                api_key: "ad9d2ae9ab5877431daefbb83d7dbab1",
                format: "json",
                nojsoncallback: 1
            },
            search: function search(obj) {
                var data = {
                    text: obj.keyword,
                    method: "flickr.photos.search",
                    license: "4",
                    sort: "relevance",
                    per_page: 500,
                    extras: "o_dims,original_format,owner_name"
                };
                $.extend(data, this.defaults);
                $.ajax({
                    url: "http://api.flickr.com/services/rest/",
                    data: data,
                    success: function(data) {
                        if (data.stat === "ok") {
                            if (obj.success) {
                                obj.success(data);
                            }
                        } else {
                            if (obj.error) {
                                obj.error(data);
                            }
                        }
                    },
                    error: function() {
                        if (obj.error) {
                            obj.error();
                        }
                    },
                    complete: function() {
                        if (obj.complete) {
                            obj.complete();
                        }
                    }
                });
            }
        }
    };
}(jQuery));