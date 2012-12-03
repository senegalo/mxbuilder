(function($){
    
    $(function(){
        
        var template = mxBuilder.layout.templates.find(".flexly-menu-photos").remove();
        var templateImage = template.find(".flexly-menu-photos-list li").remove();
        
        mxBuilder.menuManager.menus.photos = {
            __theList: null,
            __template: template,
            __templateImage: templateImage,
            init: function init(){
                var photos = this;
                mxBuilder.menuManager.hideFooter();
                mxBuilder.menuManager.tabTitle.text("Photos");
                
                //adding the buttons
                var uploadButton = mxBuilder.menuManager.addButtonTo("flexly-icon-upload-light","main");
                mxBuilder.menuManager.addButtonTo("flexly-icon-search-light","main").on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photosSearch");
                    }
                });
                
                mxBuilder.menuManager.addButtonTo("flexly-icon-photos-light", "aux");
                mxBuilder.menuManager.addButtonTo("flexly-icon-clipart-light", "aux").css({
                    opacity: 0.5
                });
                mxBuilder.menuManager.addButtonTo("flexly-icon-flicker-light", "aux").css({
                    opacity: 0.5
                });
                
                this.__theList = this.__template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                
                mxBuilder.assets.each(function(){
                    photos.addItem(this);
                });
                
                this.initUploader(uploadButton);
            },
            addItem: function addItem(obj,prependFlag,list){
                list = list ? list : this.__theList;
                var leftColumn = list.find(".left-column ul");
                var rightColumn = list.find(".right-column ul");
                var theItem = this.__templateImage.clone()
                .find(".asset-image").draggable({
                    helper: function helper(event){
                        return theItem.find(".asset-image").clone()
                        .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                        .data("component","ImageComponent")
                        .data("extra",{
                            originalAssetID: obj.id
                        })
                        .appendTo(mxBuilder.layout.container);
                    },
                    dragstop: function dragstop(event, ui){
                        ui.helper.remove();
                    }
                })
                .append('<img src="'+obj.location+"/"+obj.thumb+'" style="width:114px;height:'+(114/obj.ratio)+'px;" title="'+obj.name+'"/>')
                .end()
                .find(".asset-name")
                .text(obj.name.reduceString(10))
                .attr("title",obj.name)
                .end()
                .find(".photo-delete")
                .on({
                    click: function click(){
                        var theLi = $(this).parents("li:first");
                        mxBuilder.dialogs.deleteDialog({
                            msg: "Are you sure you want to delete the selected image ? <br/>If it's used anywhere it will be automatically removed",
                            callback: function callback(){
                                mxBuilder.api.assets.remove({
                                    assetID: theLi.data("assetid"),
                                    success: function(){     
                                        mxBuilder.assets.remove(theLi.data("assetid"));
                                        theLi.css({
                                            height: theLi.outerHeight(),
                                            width: theLi.outerWidth(),
                                            padding: 0
                                        })
                                        .contents()
                                        .remove()
                                        .end().animate({
                                            height: 0
                                        },300,"linear",function(){
                                            $(this).remove()
                                        });
                                        mxBuilder.menuManager.revalidateScrollbar();
                                    }
                                });
                            }
                        });
                    }
                })
                .end()
                .find(".photo-properties")
                .on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photoProperties",$(this).parents("li:first").data("assetid"));
                    }
                })
                .end()
                .data("assetid",obj.id);
                
                var theSelCol = leftColumn.height() > rightColumn.height() ? rightColumn:leftColumn;
                if(prependFlag){
                    theSelCol.prepend(theItem);
                } else {
                    theSelCol.append(theItem);
                }
            },
            initUploader: function initUploader(uploadButton){
                var uploader = new plupload.Uploader(mxBuilder.uploaderSettings);
                var uploaderBrowserButton = mxBuilder.layout.templates.find("#photos-select-files").appendTo(document.body);
                var uploaderNotification = mxBuilder.layout.templates.find(".photo-upload-notification")
                .find('.progress')
                .progressbar({
                    max: 100,
                    varlue: 0
                })
                .end()
                .appendTo(document.body)
                .hide();
                uploadButton.on({
                    click: function click(){
                        uploaderBrowserButton.trigger("click");
                    }
                });

                uploader.init();

                uploader.bind('FilesAdded', function(up, files) {
                    uploaderNotification.find(".progress")
                    .progressbar('option','value',0)
                    .end()
                    .find(".info")
                    .text("0%")
                    .end()
                    .show();
                    
                    uploader.start();
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('UploadProgress', function(up, file) {
                    uploaderNotification.find(".progress")
                    .progressbar('option','value', up.total.percent)
                    .end()
                    .find(".info")
                    .text(up.total.percent+"%");
                });

                uploader.bind('Error', function(up, err) {
                
                    mxBuilder.dialogs.alertDialog.show("Can't upload "+(err.file ? "the file '" + err.file.name +"' " : "")+"for the following reason: <br/>"+err.message);
                
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('FileUploaded', function(up, file, response) {
                    response = JSON.parse(response.response);
                    if(up.total.queued == 0){
                        uploaderNotification.hide();
                    }
                    if(response.success){
                        mxBuilder.assets.add(response,true);
                        mxBuilder.menuManager.menus.photos.addItem(response,true);
                        mxBuilder.menuManager.revalidateScrollbar();
                    } else {
                        mxBuilder.dialogs.alertDialog.show("Upload failed for the following reason: <br/>"+response.description);
                    }
                });
            }
        }
        
    });
}(jQuery))