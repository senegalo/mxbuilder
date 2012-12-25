(function($){
    
    $(function(){
        
        mxBuilder.menuManager.menus.photosFlicker = {
            _template: mxBuilder.menuManager.menus.photos.__template.clone(),
            _templateImage: mxBuilder.menuManager.menus.photos.__templateImage.clone().find(".photo-delete,.photo-properties").remove().end(),
            _theList: null,
            _leftList: null,
            _rightList: null,
            _lastDisplayedIndex: 0,
            _currentSearchResults:null,
            init: function(){
                var flicker = this;
                mxBuilder.menuManager.hideFooter();
                mxBuilder.menuManager.tabTitle.text("Flicker");
                
                mxBuilder.menuManager.addButtonTo("flexly-icon-search-light","main").on({
                    click: function click(){
                        flicker.clearInfinitScroll();
                        flicker.search();
                    }
                });
                
                mxBuilder.menuManager.addButtonTo("flexly-icon-back-light","main").on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photos");
                    }
                });
                
                $('<input type="text" id="flicker-search-box"/>').appendTo(mxBuilder.menuManager.tabButtonsAux)
                .focus()
                .on({
                    keypress: function(event){
                        if(event.keyCode == 13){
                            flicker.clearInfinitScroll();
                            flicker.search();
                        }
                    }
                });     
                
                mxBuilder.menuManager.scrollContainer.on({
                    totalScroll: function(){
                        flicker.infinitScroll();
                    }
                })
                
                this._theList = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                this._leftList = this._theList.find(".right-column ul");
                this._rightList = this._theList.find(".left-column ul");
            },
            search: function(doNotAddOnSuccess){
                var flicker = this;
                var searchBox = $("#flicker-search-box");
                var theValue = $.trim(searchBox.val());
                if(theValue == ""){
                    mxBuilder.dialogs.alertDialog.show("Can't search for an empty string");
                } else {
                    flicker._leftList.empty();
                    flicker._rightList.empty();
                    mxBuilder.menuManager.revalidateScrollbar();
                    searchBox.attr("disabled","disabled");
                    mxBuilder.api.flicker.search({
                        keyword: theValue,
                        success: function(data){
                            searchBox.removeAttr("disabled");
                            flicker._currentSearchResults = data;
                            if(doNotAddOnSuccess !== false){
                                flicker.infinitScroll();
                            }
                            mxBuilder.menuManager.revalidateScrollbar();
                        }
                    });
                }
            },
            infinitScroll: function(){
                var p = this._lastDisplayedIndex+1;
                var heightBefore = this._theList.height();
                var breakPointHeight = 2*mxBuilder.menuManager.contentTab.height();
                for(var cnt=this._currentSearchResults.photos.photo.length;p<cnt;p++){
                    if(typeof this._currentSearchResults.photos.photo[p].originalsecret == "undefined"){
                        continue;
                    }
                    
                    this.addItem(this._currentSearchResults.photos.photo[p]);
                    if(this._theList.height()-heightBefore > breakPointHeight){
                        break;
                    }
                }
                mxBuilder.menuManager.revalidateScrollbar();
                this._lastDisplayedIndex = p;
            },
            clearInfinitScroll: function(){
                this._lastDisplayedIndex = 0;
            },
            addItem: function(imageObj){
                var height = 114*imageObj.o_height/imageObj.o_width;
                var theItem = this._templateImage.clone()
                .find(".asset-image")
                .append('<img src="http://farm'+imageObj.farm+'.staticflickr.com/'+imageObj.server+'/'+imageObj.id+'_'+imageObj.secret+'_m.jpg" style="width:114px;height:'+height+'px;"/>')
                .end()
                .find(".asset-name")
                .text(imageObj.title.reduceString(10))
                .attr("title",imageObj.title)
                .end()
                .find(".asset-image")
                .draggable({
                    helper: function helper(event){
                        return theItem.find(".asset-image").clone()
                        .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                        .data("component","FlickerAdapterComponent")
                        .data("extra",{
                            flickerObj: imageObj
                        })
                        .appendTo(mxBuilder.layout.container);
                    },
                    dragstop: function dragstop(event, ui){
                        ui.helper.remove();
                    }
                })
                .end();
                
                var theSelCol = this._leftList.height() > this._rightList.height() ? this._rightList:this._leftList;
                theSelCol.append(theItem);
            }
        }
    });
    
}(jQuery));