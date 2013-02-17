(function($){
    
    //when ready
    $(function(){
        mxBuilder.selection.__selectionContainer = $('<div id="selection-container"/>').appendTo(mxBuilder.layout.container)
        .hide().draggable(mxBuilder.Component.prototype.defaultDraggableSettings);
        
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
        getSelectionContainer: function(){
            return this.__selectionContainer;
        },
        addToSelection: function(instance){
            
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
            
            //triggering the selected event
            instance.trigger("selected");
            
            //updating the selection most outer corners
            this.revalidateSelectionContainer(instance);
        },
        removeFromSelection: function(element,skipSelContainerValidation){
            
            if(!this.isSelected(element)){
                return;
            }
            
            element = $(element).removeClass("ui-selected");
            
            element.find(".component-resizable-handle").hide();
            
            this.__selectionCount--;
            var selectedObj = element.data("selectableItem");
            if(selectedObj){
                selectedObj.selected = false;
                selectedObj.startselected = false;
                element.data("selectableItem",selectedObj);
            }
            delete this.__selected[mxBuilder.components.getComponent(element).getID()];
            
            if(this.__selectionCount == 1){
                this.getSelection().find(".component-resizable-handle").show();
            }
            
            if(skipSelContainerValidation !== true){
                this.revalidateSelectionContainer();
            }
            element.trigger("deselected").trigger("blur");
        },
        clearSelection: function(exclude){
            var selection = this.getSelection();
            if(exclude){
                selection = selection.not(exclude);
            }
            selection.each(function(){
                mxBuilder.selection.removeFromSelection($(this),true); 
            });
            this.revalidateSelectionContainer();
        },
        getSelection: function(exclude){
            var out = $();
            for(var item in this.__selected){
                out = out.add(this.__selected[item]);
            }
            return out.not(exclude);
        },
        isAllSelectedSameType: function(){
            var oldType = false;
            var currentType;
            for(var item in this.__selected){
                currentType = mxBuilder.components.getComponent(this.__selected[item]).type;
                if(currentType != oldType && oldType !== false){
                    return false;
                }
                oldType = currentType;
            }
            return currentType;
        },
        isSelected: function(element){
            var component = mxBuilder.components.getComponent($(element));
            return component && this.__selected[component.getID()]?true:false;
        },
        toggle: function(instance){
            instance = $(instance);
            if(this.__selected[mxBuilder.components.getComponent(instance).getID()]){
                this.removeFromSelection(instance);
            } else {
                this.addToSelection(instance);
            }
        },
        updateSelectionCorners: function(instance){
            var metrics = instance.position();
            $.extend(metrics,{
                width: instance.outerWidth(),
                height: instance.outerHeight(),
                zIndex: instance.css("zIndex")
            });
            this.updateCornerPoints(metrics);
        },
        revalidateSelectionCorners: function(){
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
        revalidateSelectionContainer: function(){
            this.revalidateSelectionCorners();
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
        updateCornerPoints: function(obj){
            if(obj.top < this.__corners.y1 || this.__selectionCount == 1){
                this.__corners.y1 = obj.top;
            } 
            if (obj.top+obj.height > this.__corners.y2 || this.__selectionCount == 1){
                this.__corners.y2 = obj.top+obj.height;
            }
            if(obj.left < this.__corners.x1 || this.__selectionCount == 1){
                this.__corners.x1 = obj.left;
            }
            if(obj.left+obj.width > this.__corners.x2 || this.__selectionCount == 1){
                this.__corners.x2 = obj.left+obj.width;
            }
            if(obj.zIndex < this.__corners.smallestZIndex){
                this.__corners.smallestZIndex = obj.zIndex;
            }
        },
        getSelectionCount: function(){
            return this.__selectionCount;
        },
        enableMultiComponentSelect: function(enableFlag){
            if(enableFlag){
                $("#editor-area").selectable({
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
                $("#editor-area").selectable("destroy");
            }
        },
        each: function(callback,includeSelectionContainerFlag){
            var selection = this.getSelection();
            if(includeSelectionContainerFlag){
                selection = selection.add(this.getSelectionContainer());
            }
            selection.each(function(){
                callback.call(mxBuilder.components.getComponent($(this)), $(this));
            });
        }
    }
}(jQuery));