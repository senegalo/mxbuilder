(function($){
    
    $(function(){
        
        var template = mxBuilder.layout.templates.find(".flexly-menu-photos").remove();
        var templateImage = template.find(".flexly-menu-photos-list li").remove();
        
        mxBuilder.menuManager.menus.photos = {
            __theList: null,
            init: function init(){
                var photos = this;
                mxBuilder.menuManager.tabFooter.hide();
                mxBuilder.menuManager.tabTitle.text("Photos");
                
                //adding the buttons
                mxBuilder.menuManager.addButtonTo("flexly-icon-upload-light","main");
                mxBuilder.menuManager.addButtonTo("flexly-icon-search-light","main");
                
                mxBuilder.menuManager.addButtonTo("flexly-icon-photos-light", "aux");
                mxBuilder.menuManager.addButtonTo("flexly-icon-clipart-light", "aux").css({
                    opacity: 0.5
                });
                mxBuilder.menuManager.addButtonTo("flexly-icon-flicker-light", "aux").css({
                    opacity: 0.5
                });
                
                this.__theList = template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                
                mxBuilder.assets.each(function(){
                    photos.addItem(this);
                });
                
                
            },
            addItem: function addItem(obj){
                var leftColumn = this.__theList.find(".left-column ul");
                var rightColumn = this.__theList.find(".right-column ul");
                var theItem = templateImage.clone()
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
                .append('<img src="'+obj.location+"/"+obj.thumb+'" style="width:114px;height:'+(114/obj.ratio)+'px;"/>')
                .end()
                .find(".asset-name")
                .text(obj.name.reduceString(10))
                .end();
                if(leftColumn.height() > rightColumn.height()){
                    rightColumn.append(theItem);
                } else {
                    leftColumn.append(theItem);
                }
            },
            initUploader: function initUploader(uploadButton){
                var uploader = new plupload.Uploader(mxBuilder.uploaderSettings);

                uploadButton.click(function(event) {
                    uploader.start();
                    event.preventDefault();
                });

                uploader.init();

                uploader.bind('FilesAdded', function(up, files) {
                    //                    $.each(files, function(i, file) {
                    //                        $('#assets-upload-files-info').append(
                    //                            '<div id="' + file.id + '">' +
                    //                            file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
                    //                            '</div>');
                    //                    });
                    uploader.start();
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('UploadProgress', function(up, file) {
                    $('#' + file.id + " b").html(file.percent + "%");
                });

                uploader.bind('Error', function(up, err) {
                
                    mxBuilder.dialogs.alertDialog.show("Can't upload "+(err.file ? "the file '" + err.file.name +"' " : "")+"for the following reason: <br/>"+err.message);
                
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('FileUploaded', function(up, file, response) {
                    $('#' + file.id).remove();
                    response = JSON.parse(response.response);
                    if(response.success){
                        mxBuilder.assets.add(response);
                    } else {
                        mxBuilder.dialogs.alertDialog.show("Upload failed for the following reason: <br/>"+response.description);
                    }
                });
            }
        }
    });
}(jQuery))