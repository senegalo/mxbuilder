(function($){
    
    //when ready
    $(function(){
        mxBuilder.selection.__selectionContainer = $('<div id="selection-container"/>').appendTo(mxBuilder.layout.container).hide().draggable({
            grid: mxBuilder.properties.gridSize,
            start: function start(){
                var that = $(this);
                that.data("lastOffset",that.position());
            },
            drag: function drag(){
                var that = $(this);
                var currentOffset = that.position();        
                
                var lastOffset = that.data("lastOffset");
                var selection = mxBuilder.selection.getSelection();
                var theOffset = {
                    left: lastOffset.left-currentOffset.left,
                    top: lastOffset.top-currentOffset.top
                }
                        
                selection.each(function(){
                    var that = $(this);
                    var offset = that.position();
                    offset.left = offset.left - theOffset.left;
                    offset.top =  offset.top - theOffset.top;
                    that.css(offset);
                });
                that.data("lastOffset",currentOffset);
            },
            stop: function stop(){
                mxBuilder.selection.revalidateSelectionContainer();
                $(this).data("lastOffset",false);
            }
        });
        
        //Clearing selection on click
        $(mxBuilder.layout.editorArea).on({
            click: function(event){
                var theSrcElement = $(event.srcElement);
                if(!theSrcElement.hasClass("mx-component") && theSrcElement.parents(".mx-component").length == 0){
                    mxBuilder.selection.clearSelection();
                }
            }
        });
        
    });
    
    mxBuilder.selection = {
        __selected: {},
        __selectionCount: 0,
        __corners: {
            x1: 100000,
            x2: 0,
            y1: 100000,
            y2: 0,
            smallestZIndex: 10000000000000
        },
        getSelectionContainer: function getSelectionContainer(){
            return this.__selectionContainer;
        },
        addToSelection: function addToSelection(instance){
            
            if(this.isSelected(instance)){
                return;
            }
            
            instance = $(instance).addClass("ui-selected");
            
            //incrementing selection count
            this.__selectionCount++;
            
            //displaying the resizable handles
            if(this.__selectionCount == 1){
                instance.find(".ui-resizable-handle").show();
            } else {
                this.getSelection().find(".component-resizable-handle").hide();
            }
            
            //updating the selection most outer corners
            this.revalidateSelectionContainer(instance);
            
            //Augmenting the jquery ui selection plugin
            var selectedObj = instance.data("selectableItem");
            if(selectedObj){
                selectedObj.selected = true;
                selectedObj.startselected = true;
                instance.data("selectableItem",selectedObj);
            }
            
            //adding the instance in the selection hash
            this.__selected[mxBuilder.components.getComponent(instance).getID()] = instance;
            
            //adding the instance to the active stack
            mxBuilder.activeStack.push(instance);
            instance.on({
                poppedFromActiveStack: function(){
                    mxBuilder.selection.removeFromSelection(instance);
                }
            })
            
            //triggering the selected event
            instance.trigger("selected");
            
        },
        removeFromSelection: function removeFromSelection(instance,skipSelContainerValidation){
            
            if(!this.isSelected(instance)){
                return;
            }
            
            instance = $(instance).removeClass("ui-selected");
            
            instance.find(".component-resizable-handle").hide();
            
            this.__selectionCount--;
            var selectedObj = instance.data("selectableItem");
            if(selectedObj){
                selectedObj.selected = false;
                selectedObj.startselected = false;
                instance.data("selectableItem",selectedObj);
            }
            delete this.__selected[mxBuilder.components.getComponent(instance).getID()];
            
            if(this.__selectionCount == 1){
                this.getSelection().find(".component-resizable-handle").show();
            }
            
            if(skipSelContainerValidation !== true){
                this.revalidateSelectionContainer();
            }
            instance.trigger("deselected").trigger("blur");
        },
        clearSelection: function clearSelection(exclude){
            var selection = this.getSelection();
            if(exclude){
                selection = selection.not(exclude);
            }
            selection.each(function(){
               mxBuilder.selection.removeFromSelection($(this),true); 
            });
            this.revalidateSelectionContainer();
        },
        getSelection: function getSelection(exclude){
            var out = $();
            for(var item in this.__selected){
                out = out.add(this.__selected[item]);
            }
            return out.not(exclude);
        },
        isAllSelectedSameType: function isAllSelectedSameType(){
            var oldType = false;
            var currentType;
            for(var item in this.__selected){
                currentType = mxBuilder.components.getComponent(this.__selected[item]).type;
                if(currentType != oldType && oldType !== false){
                    return false;
                }
                oldType = currentType;
            }
            return true;
        },
        isSelected: function isSelected(instance){
            instance = $(instance);
            return this.__selected[mxBuilder.components.getComponent(instance).getID()]?true:false;
        },
        toggle: function toggle(instance){
            instance = $(instance);
            if(this.__selected[mxBuilder.components.getComponent(instance).getID()]){
                this.removeFromSelection(instance);
            } else {
                this.addToSelection(instance);
            }
        },
        updateSelectionCorners: function updateSelectionCorners(instance){
            var metrics = instance.position();
            $.extend(metrics,{
                width: instance.outerWidth(),
                height: instance.outerHeight(),
                zIndex: instance.css("zIndex")
            });
            this.updateCornerPoints(metrics);
        },
        revalidateSelectionCorners: function revalidateSelectionCorners(){
            this.__corners = {
                x1: 100000,
                x2: 0,
                y1: 100000,
                y2: 0,
                smallestZIndex: 10000000000000
            };
            for(var item in this.__selected){
                this.updateSelectionCorners(this.__selected[item]);
            }
        },
        revalidateSelectionContainer: function revalidateSelectionContainer(instance){
            if(instance){
                this.updateSelectionCorners(instance);
            } else {
                this.revalidateSelectionCorners();
            }
            if(this.__selectionCount > 0){
                this.__selectionContainer.show().css({
                    position: "absolute",
                    left: this.__corners.x1-2,
                    top: this.__corners.y1-2,
                    width: this.__corners.x2-this.__corners.x1+4,
                    height: this.__corners.y2-this.__corners.y1+4,
                    zIndex: this.__corners.smallestZIndex-1
                });
            } else {
                this.__selectionContainer.hide();
            }
        },
        updateCornerPoints: function updateCornerPoints(obj){
            if(obj.top < this.__corners.y1){
                this.__corners.y1 = obj.top;
            } 
            if (obj.top+obj.height > this.__corners.y2){
                this.__corners.y2 = obj.top+obj.height;
            }
            if(obj.left < this.__corners.x1){
                this.__corners.x1 = obj.left;
            }
            if(obj.left+obj.width > this.__corners.x2){
                this.__corners.x2 = obj.left+obj.width;
            }
            if(obj.zIndex < this.__corners.smallestZIndex){
                this.__corners.smallestZIndex = obj.zIndex;
            }
        },
        getSelectionCount: function getSelectionCount(){
            return this.__selectionCount;
        },
        enableMultiComponentSelect: function enableMultiComponentSelect(enableFlag){
            if(enableFlag){
                $(document.body).selectable({
                    distance: 2,
                    filter: ".mx-selectable-component",
                    selected: function(event,ui){
                        mxBuilder.selection.addToSelection(ui.selected)
                    },
                    unselected: function(event,ui){
                        mxBuilder.selection.removeFromSelection(ui.unselected);
                    }
                });
            } else {
                $(document.body).selectable("destroy");
            }
        },
        each: function each(callback){
            this.getSelection().each(function(){
                callback.call(mxBuilder.components.getComponent($(this)), $(this));
            });
        }
    }
}(jQuery));