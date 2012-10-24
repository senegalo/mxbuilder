(function($){
    mxBuilder.Component = function Component(obj){
        if(obj){
            
            //storing the size and position
            this.size = {
                width: obj.element.width(),
                height: obj.element.height()
            }
            
            this.position = obj.element.position();
                
            //Context Menus
            obj.element.on({
                mousedown: function mousedown(event){
                    
                    var ctx = mxBuilder.contextmenu.getMainCtx();
                    
                    if(mxBuilder.selection.getSelectionCount() < 2 || mxBuilder.selection.isAllSelectedSameType()){
                        if(event.which == 3){
                            var theComponent = mxBuilder.components.getComponent(obj.element);
                            if(mxBuilder.selection.getSelectionCount() == 0){
                                mxBuilder.selection.addToSelection(obj.element);
                            } else if(mxBuilder.selection.getSelectionCount() == 1 && !mxBuilder.selection.isSelected(obj.element)){
                                mxBuilder.selection.clearSelection();
                                mxBuilder.selection.addToSelection(obj.element);
                            }
                            
                            //The Background manipulation context
                            if(obj.ctxEditableBackground){
                                ctx.addItem({
                                    label: "Background Style...",
                                    callback: function(){
                                        mxBuilder.dialogs.componentsBackground.show(mxBuilder.selection.getSelection());
                                    }
                                });
                            }
                            
                            //The Border manipulation context
                            if(obj.ctxEditableBorder){
                                ctx.addItem({
                                    label: "Border Style...",
                                    callback: function(){
                                        mxBuilder.dialogs.componentsBorder.show(mxBuilder.selection.getSelection());
                                    }
                                });
                            }
                            //Activating Z-Index Manipulation context
                            if(obj.ctxZIndex && mxBuilder.selection.getSelectionCount() < 2){                       
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
                                    label: "Bring to top",
                                    callback: function(){
                                        theComponent.bringToTop();
                                    }
                                }).addItem({
                                    label: "Bring to bottom",
                                    callback: function(){
                                        theComponent.bringToBottom();
                                    }
                                }).end().addItem({
                                    type: "sep"
                                });
                            }
                        }
                    } 
                    if(mxBuilder.selection.getSelectionCount() > 1){
                        //Alignment Menu
                        ctx.addSubgroup({
                            label: "Alignment"
                        }).addItem({
                            label: "Align Left",
                            callback: function(){
                                mxBuilder.components.alignment.alignLeft();
                            }
                        }).addItem({
                            label: "Align Right",
                            callback: function(){
                                mxBuilder.components.alignment.alignRight();
                            }
                        }).addItem({
                            label: "Align Top",
                            callback: function(){
                                mxBuilder.components.alignment.alignTop();
                            }
                        }).addItem({
                            label: "Align Bottom",
                            callback: function(){
                                mxBuilder.components.alignment.alignBottom();
                            }
                        }).addItem({
                            label: "Center Vertically",
                            callback: function(){
                                mxBuilder.components.alignment.centerVertically();
                            }
                        }).addItem({
                            label: "Center Horizontally",
                            callback: function(){
                                mxBuilder.components.alignment.centerHorizontally();
                            }
                        });
                    }
                    
                    if(obj.pinnable !== false){
                        var pinned = true;
                        mxBuilder.selection.getSelection().each(function(){
                            if(!mxBuilder.components.getComponent($(this)).isPinned()){
                                pinned = false;
                            }
                        });
                        ctx.addItem({
                            label: "Pin",
                            checked: pinned,
                            callback: function(){
                                mxBuilder.selection.getSelection().each(function(){
                                    var theComponent = mxBuilder.components.getComponent($(this));
                                    if(pinned){
                                        theComponent.unpin();
                                    } else {
                                        theComponent.pin();
                                    }
                                });
                            }
                        });
                    }
                    
                    //Adding Delete ctx menu
                    if(obj.deletable !== false){
                        ctx.addItem({
                            label: "Delete",
                            callback: function(){
                                mxBuilder.dialogs.deleteDialog({
                                    msg: "Are you sure you want to delete the selected component(s) ?",
                                    callback: function(){
                                        mxBuilder.selection.getSelection().trigger("destroy"); 
                                    }
                                });
                            }
                        });
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
                obj.element.draggable(obj.draggable);
            }
            
            //Making it resizable
            if(typeof obj.resizable != "undefined"){
                var handle = $('<div class="component-resizable-handle"/>');
                var orientation = obj.resizable.orientation?obj.resizable.orientation:"hv";
                var handles = {};
                
                if(orientation.match(/h/i)){
                    $.extend(handles,{
                        e: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-e"),
                        w: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-w")
                    });
                } 
                if(orientation.match(/v/i)){
                    $.extend(handles,{
                        s: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-s"), 
                        n: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-n")
                    });
                }
                if(orientation.match(/(hv|vh)/i)){
                    $.extend(handles,{
                        ne: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-ne"), 
                        se: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-se"), 
                        sw: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-sw"), 
                        nw: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-nw")
                    })
                }
                
                $.extend(obj.resizable,{
                    grid: mxBuilder.properties.gridSize,
                    handles: handles,
                    start: function start(event,ui){
                        mxBuilder.selection.clearSelection($(this));
                        mxBuilder.layout.outline(mxBuilder.components.getComponent($(this)).container);
                    },
                    resize: function resize(event,ui){
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    stop: function(){
                        var that = $(this);
                        var theComponent = mxBuilder.components.getComponent(that);
                        mxBuilder.layout.clearOutline(theComponent.container);
                        theComponent.setPosition(that.position());
                        theComponent.setSize({
                            width: that.width(),
                            height: that.height()
                        });
                        mxBuilder.layout.revalidateLayout();
                    }
                });
                obj.element.resizable(obj.resizable);
            }
            
            //Making is selectable
            if(obj.selectable){
                obj.element.addClass("mx-selectable-component").on({
                    click: function click(event){
                        if(event.which == 1){
                            if(event.ctrlKey){
                                mxBuilder.selection.toggle(obj.element);
                            } else {
                                if(!mxBuilder.selection.isSelected(obj.element)){
                                    mxBuilder.selection.clearSelection();
                                    mxBuilder.selection.addToSelection(obj.element); 
                                } else if(mxBuilder.selection.getSelectionCount() > 1){
                                    mxBuilder.selection.clearSelection(obj.element);
                                }
                            
                            }
                        }
                    }
                });
            }
            
            //Making it deletable
            obj.element.on({
                destroy: function destroy(){
                    mxBuilder.pages.detachComponentFromPage(mxBuilder.components.getComponent(obj.element));
                    mxBuilder.selection.removeFromSelection(obj.element);
                    mxBuilder.components.getComponent(obj.element).destroy();
                }
            });
            
            //enforce styles
            obj.element.addClass("mx-component").css({
                position: "absolute" 
            });
            
            //Storring the settings internally
            $.extend(this,obj);
            
        //mxBuilder.layout.revalidateLayout();
        }
    }
    mxBuilder.Component.prototype = {
        setContainer: function setContainer(container){
            this.container = container;
            this.element.appendTo(mxBuilder.layout[container]);
        },
        getID: function getID(){
            return mxBuilder.utils.getElementGUID(this.element);
        },
        bringToFront: function bringToFront(){
            mxBuilder.zIndexManager.moveUp(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBack: function bringToBack(){
            mxBuilder.zIndexManager.moveDown(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToTop: function bringToTop(){
            mxBuilder.zIndexManager.moveToTop(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBottom: function bringToBottom(){
            mxBuilder.zIndexManager.moveToBottom(this);
            mxBuilder.selection.revalidateSelectionContainer(this.element);
        },
        setPosition: function setPosition(position,applyFlag){
            this.position = position;
            if(applyFlag){
                this.element.css({
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
                width: this.element.width(),
                height: this.element.height(),
                container: this.container
            };
            $.extend(size,this.element.position());
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
            mxBuilder.dialogs.componentsBackground.show(this.element);
        },
        openBorderStyleDialog: function openBorderStyleDialog(){
            mxBuilder.dialogs.componentsBorder.show(this.element);
        },
        openDeleteComponentDialog: function openDeleteComponentDialog(){
            var that = this.element;
            mxBuilder.dialogs.deleteComponents(function(){
                that.trigger("destroy"); 
            });
        },
        pin: function pin(){
            mxBuilder.pages.pinComponent(this);
            this.pinned = true;
        },
        unpin: function unpin(){
            mxBuilder.pages.unpinComponent(this);
            this.pinned = false;
        },
        isPinned: function isPinned(){
            return this.pinned;
        },
        save: function save(){
            var out = {
                css: {},
                data: {}
            };
            var position = this.element.position();
            out.css.left = position.left;
            out.css.top = position.top;
            out.css.height = this.element.height();
            out.css.width = this.element.width();
            if(this.ctxZIndex){
                out.css.zIndex = this.element.css("zIndex");
            }
            if(this.ctxEditableBorder){
                out.css.border = this.element.css("border");
            }
            if(this.ctxEditableBackground){
                out.css.background = this.element.css("background");
            }
            out.data.container = this.container;
            out.data.type = this.type;
            out.data.page = this.page;
            return out;
        },
        publish: function publish(){
            return this.element.clone().find(".component-resizable-handle")
            .remove()
            .end()
            .removeClass("ui-draggable ui-resizable mx-selectable-component");
        },
        init: function init(properties){
            if(typeof properties.element == "undefined"){
                properties.element = this.template.clone().css(properties.css).appendTo(mxBuilder.layout[properties.data.container]);
            }
            $.extend(this,properties.data);
        },
        destroy: function destroy(){
            this.unpin();
            mxBuilder.components.removeComponent(this.element);
            this.element.remove();
        }
    }
    
    $(function(){
        var dropOnContainer = function dropOnContainer(container){
            return function(event, ui){
                var className =  ui.helper.data("component");
                if(className){
                    
                    var theComponent = mxBuilder.components.addComponent({
                        css: {
                            left: ui.position.left,
                            top: ui.position.top
                        },
                        data:{ 
                            container: container,
                            type: className,
                            extra: ui.helper.data("extra")
                        }
                    });
                    if(container == "header" || container == "footer"){
                        theComponent.pin();
                    }
                    
                    theComponent.setContainer(container);
                    mxBuilder.selection.clearSelection();
                    mxBuilder.selection.addToSelection(theComponent.element);
                    theComponent.element.trigger('componentDropped');
                } else {
                    mxBuilder.selection.getSelection().each(function(){
                        mxBuilder.components.getComponent($(this)).setContainer(container);
                    });
                }
                mxBuilder.layout.revalidateLayout();
                mxBuilder.layout.clearOutline(container);
            }
        }
        
        /**
         * @todo guess all 3 layouts are similar could be a lot more shorter... double check
         */
        var layoutSections = ["header","body","footer"];
        
        for(var i in layoutSections){
            (function(section){
                mxBuilder.layout["layout"+section.uppercaseFirst()].droppable({
                    accept: ".mx-helper,.mx-component",
                    drop: dropOnContainer(section),
                    over: function over(){
                        mxBuilder.layout.outline(section)
                    },
                    out: function out(){
                        mxBuilder.layout.clearOutline(section)
                    }
                });
            }(layoutSections[i]));
        }
        
        mxBuilder.selection.enableMultiComponentSelect(true);
        
        $(document).on({
            keyup: function keyup(event){
                if(event.keyCode == 46){
                    if(mxBuilder.selection.getSelectionCount() == 1){
                        var theSelectedComponent =  mxBuilder.components.getComponent(mxBuilder.selection.getSelection());
                        if(theSelectedComponent.type == "TextComponent" && theSelectedComponent.isEditMode()){
                            return;
                        }
                    }
                    mxBuilder.dialogs.deleteDialog({
                        msg: "Are you sure you want to delete the selected component(s) ?",
                        callback: function callback(){
                            mxBuilder.selection.each(function(){  
                                mxBuilder.pages.detachComponentFromPage(this);
                                this.element.trigger("destroy");
                            }); 
                        }
                    });
                }
            }
        });
        
    });
    
}(jQuery));