(function($){
    
    $(function(){
        var theDialog, imageAssetTemplate, documentAssetTemplate, uploader, imageComponentTemplate;
        
        (function init(){
            
            
            imageAssetTemplate = mxBuilder.layout.templates.find(".assets-image-template").removeClass("assets-image-stemplate").remove();
            documentAssetTemplate = mxBuilder.layout.templates.find(".assets-document-template").removeClass("assets-document-template").remove();
            imageComponentTemplate = mxBuilder.layout.templates.find(".image-component-instance").clone();
            
            theDialog = mxBuilder.layout.templates.find(".assets-upload-dialog").remove().dialog({
                autoOpen: false,
                zIndex: 1000008,
                title: "Assets Manager",
                resizable: false,
                width: 400,
                buttons: {
                    Close: function Close(){
                        $(this).dialog("close");
                    }
                }
            }).find(".assets-tabs").tabs().end();
        
            $('<div class="assets-manager menu-item" style="font-weight:bold;cursor:pointer">Assets</div>').appendTo(mxBuilder.layout.menu).on({
                click: function(){
                    theDialog.dialog("open");
                }
            });
        
            uploader = new plupload.Uploader({
                runtimes : 'gears,html5,flash,silverlight,browserplus',
                browse_button : 'assets-select-files',
                container : 'assets-upload-container',
                max_file_size : '10mb',
                url : mxBuilder.config.baseURL+'/assets/upload',
                flash_swf_url : 'js-libs/plupload/plupload.flash.swf',
                silverlight_xap_url : 'js-libs/plupload/plupload.silverlight.xap',
                filters : [{
                    title : "Image files", 
                    extensions : "jpg,gif,png"
                },
                {
                    title : "Zip files", 
                    extensions : "zip"
                }]
            });

            $('#assets-upload-files').click(function(event) {
                uploader.start();
                event.preventDefault();
            });

            uploader.init();

            uploader.bind('FilesAdded', function(up, files) {
                $.each(files, function(i, file) {
                    $('#assets-upload-files-info').append(
                        '<div id="' + file.id + '">' +
                        file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
                        '</div>');
                });

                up.refresh(); // Reposition Flash/Silverlight
            });

            uploader.bind('UploadProgress', function(up, file) {
                $('#' + file.id + " b").html(file.percent + "%");
            });

            uploader.bind('Error', function(up, err) {
                $('#assets-upload-files-info').append("<div>Error: " + err.code +
                    ", Message: " + err.message +
                    (err.file ? ", File: " + err.file.name : "") +
                    "</div>"
                    );

                up.refresh(); // Reposition Flash/Silverlight
            });

            uploader.bind('FileUploaded', function(up, file, response) {
                $('#' + file.id).remove();
                mxBuilder.assets.add(JSON.parse(response.response));
            });
        }());
        
        mxBuilder.assets = {
            __assets: {},
            add: function(obj){                
                //preping the template
                var template;
                if(obj.type == "image"){
                    template = imageAssetTemplate.clone().data("id",obj.id).addClass("asset-"+obj.id)
                    .find("img")
                    .attr("src",obj.location+"/"+obj.thumb)
                    .end()
                    .find(".delete-asset").on({
                        click: function(){
                            var msg;
                            if(obj.type == "image"){
                                msg = "Are you sure you want to delete the selected image ?<br/> doing so will remove every instance of them in all the pages."
                            } else {
                                msg = "Are you sure you want remove the selected document ?<br/> if it is linked anywhere the links will no longer work.";
                            }
                            mxBuilder.dialogs.deleteDialog({
                                msg: msg,
                                callback: function(){
                                    mxBuilder.dialogs.progressDialog.show("Deleting asset...");
                                    mxBuilder.api.assets.remove({
                                       assetID: obj.id,
                                        success: function(data){
                                            mxBuilder.dialogs.progressDialog.msg("Deleted Successfully...");
                                            mxBuilder.assets.remove(obj.id);
                                        },
                                        error: function(data){
                                            mxBuilder.dialogs.progressDialog.msg("Delete Failed !")
                                        },
                                        complete: function(){
                                            setTimeout(function(){
                                                mxBuilder.dialogs.progressDialog.hide();
                                            },1500);
                                        }
                                    });
                                }
                            });
                        }
                    })
                    .end()
                    .insertBefore(theDialog.find("#assets-images-insertion-marker")).draggable({
                        helper: function helper(event){
                            return imageComponentTemplate.clone().css("zIndex","2000009")
                            .find("img").attr("src",obj.location+"/"+obj.thumb).end()
                            .data("component","ImageComponent")
                            .data("extra",{
                                originalAssetID: obj.id
                            })
                            .appendTo(mxBuilder.layout.container);
                        },
                        dragstop: function dragstop(event, ui){
                            ui.helper.remove();
                        }
                    });
                } else {
                    template = documentAssetTemplate.clone().appendTo(theDialog.find("#assets-document-container"));
                }
                
                template.find(".name").text(obj.name.reduceString(10));
                
                //Generating and assining the instance an id
                this.__assets[obj.id] = obj;
            },
            get: function(id){
                return this.__assets[id];
            },
            remove: function(id){
                if(this.__assets[id].type == "image"){
                    //remove the image from any active component
                    var components = mxBuilder.components.getComponentsByAssetID(id);
                    for(var c in components){
                        mxBuilder.pages.detachComponentFromPage(components[c]);
                        mxBuilder.selection.removeFromSelection(components[c].element);
                        components[c].destroy();
                    }
                
                    //remove from other pages
                    mxBuilder.pages.removeImgComponentFromPages(id);
                }
                //removing the image from the assets manager
                theDialog.find(".asset-"+id).remove();
                delete this.__assets[id];
            }
        }
    });
    
}(jQuery))