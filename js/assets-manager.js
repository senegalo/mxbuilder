(function($){
    
    $(function(){
        var theDialog, assetTemplate, uploader, imageComponentTemplate;
        
        (function init(){
            
            
            assetTemplate = mxBuilder.layout.templates.find(".assets-template").removeClass("assets-template").remove();
            imageComponentTemplate = mxBuilder.layout.templates.find(".image-component-instance").clone();
        
            theDialog = mxBuilder.layout.templates.find(".assets-upload-dialog").remove().dialog({
                autoOpen: false,
                zIndex: 1000008,
                title: "Assets Manager",
                resizable: false,
                width: 300,
                buttons: {
                    Close: function Close(){
                        $(this).dialog("close");
                    }
                }
            });
        
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
                url : 'upload.php',
                flash_swf_url : 'js-libs/plupload/plupload.flash.swf',
                silverlight_xap_url : 'js-libs/plupload/plupload.silverlight.xap',
                filters : [{
                    title : "Image files", 
                    extensions : "jpg,gif,png"
                },
                {
                    title : "Zip files", 
                    extensions : "zip"
                }],
                resize : {
                    width : 320, 
                    height : 240, 
                    quality : 90
                }
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

            uploader.bind('FileUploaded', function(up, file) {
                $('#' + file.id).remove();
            });
        }());
        
        mxBuilder.assets = {
            __assets: {},
            add: function(obj){                
                //preping the stamp
                var theAsset = assetTemplate.clone().find("img").attr("src",obj.location+"/"+obj.thumb)
                .end()
                .appendTo(theDialog.find("#assets-container"));
                
                
                //Generating and assining the instance an id
                this.__assets[obj.id] = obj;
                
                //making the assets draggable
                theAsset.draggable({
                    helper: function helper(event){
                        return imageComponentTemplate.clone()
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
            },
            get: function(id){
                return this.__assets[id];
            }
        }
        
        mxBuilder.assets.add({
            location: "http://dev.2mhost.com/mxbuilder/uploads",
            full: "1-f.jpg",
            medium: "1-m.jpg",
            small: "1-s.jpg",
            thumb: "1-t.jpg",
            ratio: 1.5985,
            id: 12
        });
        
    });
    
}(jQuery))