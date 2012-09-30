(function($){
    mxBuilder.Component = function Component(obj){
        if(obj){
            
            //storing the size and position
            this.size = {
                width: obj.instance.width(),
                height: obj.instance.height()
            }
            
            this.position = obj.instance.position();
                
            //Context Menus
            obj.instance.on({
                mousedown: function mousedown(event){
                    if(mxBuilder.selection.getSelectionCount() < 2){
                        if(event.which == 3){
                            var theComponent = mxBuilder.components.getComponent(obj.instance);
                            if(mxBuilder.selection.getSelectionCount() == 0){
                                mxBuilder.selection.addToSelection(obj.instance);
                            } else if(mxBuilder.selection.getSelectionCount() == 1 && !mxBuilder.selection.isSelected(obj.instance)){
                                mxBuilder.selection.clearSelection();
                                mxBuilder.selection.addToSelection(obj.instance);
                            }
                        
                            var ctx = mxBuilder.contextmenu.getMainCtx();
                            
                            //The Background manipulation context
                            if(obj.ctxEditableBackground){
                                ctx.addItem({
                                    label: "Background Style...",
                                    callback: function(){
                                        mxBuilder.dialogs.componentsBackground.show(theComponent.instance);
                                    }
                                });
                            }
                            
                            //The Border manipulation context
                            if(obj.ctxEditableBorder){
                                ctx.addItem({
                                    label: "Border Style...",
                                    callback: function(){
                                        mxBuilder.dialogs.componentsBorder.show(theComponent.instance);
                                    }
                                });
                            }
                            //Activating Z-Index Manipulation context
                            if(obj.ctxZIndex){                       
                                ctx.addSubgroup({ 
                                    label:"Z Position" 
                                }).addItem({
                                    label: "Bring to front",
                                    callback: function(){
                                        theComponent.bringToFront();
                                    }
                                }).addItem({
                                    label: "Bring to back",
                                    callback: function(){
                                        theComponent.bringToBack();
                                    }
                                }).addItem({
                                    label: "Bront to top",
                                    callback: function(){
                                        theComponent.bringToTop();
                                    }
                                }).addItem({
                                    label: "Bront to bottom",
                                    callback: function(){
                                        theComponent.bringToBottom();
                                    }
                                }).end().addItem({
                                    type: "sep"
                                });
                            }
                        
                            //Adding Delete ctx menu
                            ctx.addItem({
                                label: "Delete",
                                callback: function(){
                                    mxBuilder.dialogs.deleteComponents(function(){
                                        theComponent.instance.trigger("destroy"); 
                                    });
                                }
                            });
                        }
                    }
                }
                
            });
                
            //Making it draggable
            if(typeof obj.draggable != "undefined"){
                $.extend(obj.draggable,{
                    start: function start(){
                        var that = $(this);
                        if(mxBuilder.selection.getSelectionCount() == 0){
                            mxBuilder.selection.addToSelection(that);
                        } else {
                            if(!mxBuilder.selection.isSelected(that)){
                                mxBuilder.selection.clearSelection();
                                mxBuilder.selection.addToSelection(that);
                            }
                        }
                        that.css("cursor","move").data("lastOffset",that.position());
                    },
                    drag: function drag(){
                        var that = $(this);
                        var currentOffset = that.position();
                        
                        if(!mxBuilder.selection.isSelected(that)){
                            mxBuilder.selection.clearSelection();
                        }
                        
                        var lastOffset = that.data("lastOffset");
                        
                        var theOffset = {
                            left: lastOffset.left-currentOffset.left,
                            top: lastOffset.top-currentOffset.top
                        }
                        
                        var selection = mxBuilder.selection.getSelection(that);
                        selection = selection.add(mxBuilder.selection.getSelectionContainer());
                        
                        
                        
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
                        var that = $(this);
                        mxBuilder.selection.revalidateSelectionContainer();
                        that.data("lastOffset",false).css("cursor","default");
                        mxBuilder.components.getComponent(that).setPosition(that.position());
                    },
                    scroll: false
                });
                obj.instance.draggable(obj.draggable);
            }
            
            //Making it resizable
            if(typeof obj.resizable != "undefined"){
                var handle = $('<div class="component-resizable-handle"/>');
                var orientation = obj.resizable.orientation?obj.resizable.orientation:"hv";
                var handles = {};
                
                if(orientation.match(/h/i)){
                    $.extend(handles,{
                        e: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-e"),
                        w: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-w")
                    });
                } 
                if(orientation.match(/v/i)){
                    $.extend(handles,{
                        s: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-s"), 
                        n: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-n")
                    });
                }
                if(orientation.match(/(hv|vh)/i)){
                    $.extend(handles,{
                        ne: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-ne"), 
                        se: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-se"), 
                        sw: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-sw"), 
                        nw: handle.clone().appendTo(obj.instance).addClass("ui-resizable-handle ui-resizable-nw")
                    })
                }
                
                $.extend(obj.resizable,{
                    grid: mxBuilder.properties.gridSize,
                    handles: handles,
                    start: function start(event,ui){
                        mxBuilder.selection.clearSelection($(this));
                    },
                    resize: function resize(event,ui){
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    stop: function(){
                        var that = $(this);
                        var theComponent = mxBuilder.components.getComponent(that)
                        theComponent.setPosition(that.position());
                        theComponent.setSize({
                            width: that.width(),
                            height: that.height()
                        });
                    }
                });
                obj.instance.resizable(obj.resizable);
            }
            
            //Making is selectable
            if(obj.selectable){
                obj.instance.addClass("mx-selectable-component").on({
                    click: function click(event){
                        if(event.which == 1){
                            if(event.ctrlKey){
                                mxBuilder.selection.toggle(obj.instance);
                            } else {
                                if(!mxBuilder.selection.isSelected(obj.instance)){
                                    mxBuilder.selection.clearSelection();
                                    mxBuilder.selection.addToSelection(obj.instance); 
                                } else if(mxBuilder.selection.getSelectionCount() > 1){
                                    mxBuilder.selection.clearSelection(obj.instance);
                                }
                            
                            }
                        }
                    }
                });
            }
            
            //Making it deletable
            obj.instance.on({
                destroy: function destroy(){
                    mxBuilder.selection.removeFromSelection(obj.instance);
                    mxBuilder.components.getComponent(obj.instance).destroy();
                }
            });
            
            //enforce styles
            obj.instance.addClass("mx-component").css({
                position: "absolute" 
            });
            
            //Storring the settings internally
            $.extend(this,obj);
            
            mxBuilder.layout.revalidateLayout();
        }
    }
    mxBuilder.Component.prototype = {
        setContainer: function setContainer(container){
            this.container = container;
            this.instance.appendTo(mxBuilder.layout[container]);
        },
        getID: function getID(){
            return mxBuilder.utils.getElementGUID(this.instance);
        },
        bringToFront: function bringToFront(){
            this.instance.css("zIndex",this.instance.zIndex()+1);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBack: function bringToBack(){
            var zIndex = this.instance.zIndex();
            if(zIndex > 1000){
                this.instance.css("zIndex",zIndex-1);
                mxBuilder.selection.revalidateSelectionContainer();
            }
        },
        bringToTop: function bringToTop(){
            this.instance.css("zIndex",mxBuilder.components.getNextZIndex());
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBottom: function brintToBottom(){
            this.instance.css("zIndex", 1000);
            mxBuilder.selection.revalidateSelectionContainer(this.instance);
        },
        setPosition: function setPosition(position,applyFlag){
            this.position = position;
            if(applyFlag){
                this.instance.css({
                    left: position.left,
                    top: position.top
                });
            }
        },
        setSize: function setSize(size){
            this.size = size;
        },
        getMetrics: function getMetrics(dontUpdateFlag){
            var size = {
                width: this.instance.width(),
                height: this.instance.height(),
                container: this.container
            };
            $.extend(size,this.instance.position());
            if(this.size.width !== size.width || this.size.height !== size.height){
                $.extend(size,{
                    offsetWidth: size.width-this.size.width,
                    offsetHeight: size.height-this.size.height,
                    oldWidth: this.size.width,
                    oldHeight: this.size.height
                });
                
                if(dontUpdateFlag !== true){
                    this.size = size;
                }
            }
            return size;
        },
        openBackgroundStyleDialog: function openBackgroundStyleDialog(){
            mxBuilder.dialogs.componentsBackground.show(this.instance);
        },
        openBorderStyleDialog: function openBorderStyleDialog(){
            mxBuilder.dialogs.componentsBorder.show(this.instance);
        },
        openDeleteComponentDialog: function openDeleteComponentDialog(){
            var that = this.instance;
            mxBuilder.dialogs.deleteComponents(function(){
                that.trigger("destroy"); 
            });
        },
        destroy: function destroy(){
            mxBuilder.components.removeComponent(this.instance);
            this.instance.remove();
        }
    }
    
    $(function(){
        var clearOutline = function clearOutline(){
            $(this).css("outline","");
        }
        var setOutline = function setOutline(color){
            return function(){
                $(this).css("outline","1px solid "+color);
            }
        }
        var dropOnContainer = function dropOnContainer(container){
            return function(event, ui){
                var theClass =  ui.helper.data("component");
                if(theClass){
                    var instance = ui.helper.clone();
                    instance.data("extra",ui.helper.data("extra"));
                    /**
                     * @todo: check this part elements should be added to their appropriate layout part
                     */
                    instance.appendTo(mxBuilder.layout[container]).position(ui.position);
                    
                    var theComponent = mxBuilder.components.addComponent(instance,theClass);
                    theComponent.setContainer(container);
                    mxBuilder.selection.clearSelection();
                    mxBuilder.selection.addToSelection(instance);
                    instance.trigger('componentDropped');
                } else {
                    mxBuilder.selection.getSelection().each(function(){
                        mxBuilder.components.getComponent($(this)).setContainer(container);
                    });
                }
                clearOutline.apply(this);
            }
        }
        
        /**
         * @todo guess all 3 layouts are similar could be a lot more shorter... double check
         */
        mxBuilder.layout.header.droppable({
            over: setOutline("orange"),
            drop: dropOnContainer("header"),
            out: clearOutline
        })//.disableSelection();
        
        mxBuilder.layout.body.droppable({
            drop: dropOnContainer("body"),
            over: setOutline("red"),
            out: clearOutline
        })//.disableSelection();
        mxBuilder.layout.footer.droppable({
            drop: dropOnContainer("footer"),
            over: setOutline("orange"),
            out: clearOutline
        })//.disableSelection();
        
        mxBuilder.selection.enableMultiComponentSelect(true);
        
        $(document).on({
            keyup: function keyup(event){
                if(event.keyCode == 46){
                    mxBuilder.dialogs.deleteComponents(function(){
                        mxBuilder.selection.getSelection().trigger("destroy"); 
                    });
                }
            }
        });
        
    });
    
}(jQuery));