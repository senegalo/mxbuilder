(function($){
    mxBuilder.Component = function Component(obj){
        if(obj){
            
            //storing the size and position
            this.size = {
                width: obj.element.width(),
                height: obj.element.height()
            }
            
            this.position = obj.element.position();
            
            
            //applying the popped from the active stack behavior
            if(!obj.poppedFromActiveStack){
                obj.poppedFromActiveStack = function(){
                    mxBuilder.selection.removeFromSelection(obj.element);
                }
            }
            obj.element.on({
                poppedFromActiveStack: obj.poppedFromActiveStack
            });
            
            
                
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
                            
                            ctx.addItem({
                                label: "Settings...",
                                callback: function(){
                                    mxBuilder.menuManager.showTab("componentSettings");
                                }
                            });
                            
                            //Activating Z-Index Manipulation context
                            if(obj.editableZIndex && mxBuilder.selection.getSelectionCount() < 2){              
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
                $.extend(obj.draggable,mxBuilder.Component.prototype.defaultDraggableSettings);
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
                    },
                    selected: function selected(){
                        $(this).css("cursor","move");
                    },
                    deselected: function deselected(){
                        $(this).css("cursor","auto");
                    }
                });
            }
            
            //Making it deletable
            obj.element.on({
                destroy: function destroy(){
                    var theComponent = mxBuilder.components.getComponent(obj.element);
                    theComponent.unpin();
                    mxBuilder.pages.detachComponentFromPage(theComponent);
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
        getMetrics: function getMetrics(){
            var size = {
                width: this.element.width(),
                height: this.element.height(),
                container: this.container
            };
            $.extend(size,this.element.position());
            size.bottom = size.height+size.top;
            size.right = size.width+size.left;
            return size;
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
            
            out.css.top = this.container == "footer" ? position.top - mxBuilder.layout.footer.position().top : position.top;
            out.css.left = position.left;
            out.css.height = this.element.height();
            out.css.width = this.element.width();
            if(this.ctxZIndex){
                out.css.zIndex = this.element.css("zIndex");
            }
            if(this.editableBorder){
                out.css.border = this.element.css("border");
                var corners = ["TopLeft","BottomLeft","BottomRight","TopRight"];
                for(var c in corners){
                    out.css['border'+corners[c]+'Radius'] = this.element.css("border"+corners[c]+"Radius");
                }
            }
            if(this.editableBackground){
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
            .removeClass("ui-draggable ui-resizable ui-selected mx-selectable-component");
        },
        init: function init(properties){
            if(typeof properties.element == "undefined"){
                if(properties.data.container == "footer"){
                    properties.css.top = mxBuilder.layout.footer.position().top+properties.css.top;
                    delete properties.css.relativeTop;
                }
                properties.element = this.template.clone().css(properties.css).appendTo(mxBuilder.layout[properties.data.container]);
            }
            $.extend(this,properties.data);
        },
        destroy: function destroy(){
            mxBuilder.components.removeComponent(this.element);
            this.element.remove();
        },
        getBorderElement: function getBorderElement(){
            return this.element;
        },
        getBackgroundElement: function getBackgroundElement(){
            return this.element;
        },
        defaultDraggableSettings: {
            start: function start(){
                var element = $(this);
                
                //if this is the selection container skip this part
                if(mxBuilder.selection.getSelectionContainer().get(0) !== this){
                    if(mxBuilder.selection.getSelectionCount() == 0){
                        mxBuilder.selection.addToSelection(element);
                    } else {
                        if(!mxBuilder.selection.isSelected(element)){
                            mxBuilder.selection.clearSelection();
                            mxBuilder.selection.addToSelection(element);
                        }
                    }
                }
                
                var hasStripComponent = false;
                mxBuilder.selection.each(function(that){
                    that.data("initial-position",that.position());
                    var theComponent = mxBuilder.components.getComponent(that);
                    if(theComponent && theComponent.type == "StripComponent"){
                        hasStripComponent =  true;
                    } 
                },true);
                
                if(hasStripComponent){
                    element.data("movement-axis","y").draggable("option","axis","y");
                } else {
                    element.data("movement-axis",false).draggable("option","axis",false);
                }
                
                element.css("cursor","move");
            },
            drag: function drag(event,ui){
                var element = $(this);
                var currentPosition = ui.position;           
                        
                var initialPosition = element.data("initial-position");
                        
                var theOffset = {
                    left: initialPosition.left-currentPosition.left,
                    top: initialPosition.top-currentPosition.top
                }
                
                if(element.data("movement-axis") == "y"){
                    element.css("left",initialPosition.left);
                    mxBuilder.selection.revalidateSelectionContainer();
                }
                        
                mxBuilder.selection.each(function(currentSelectionComponent){
                    if(element.get(0) === currentSelectionComponent.get(0)){
                        return;
                    }
                    var initialPosition = currentSelectionComponent.data("initial-position");
                    var newPosition = {};
                    if(element.data("movement-axis") != "y"){ 
                        newPosition.left = initialPosition.left - theOffset.left;
                    }
                    newPosition.top =  initialPosition.top - theOffset.top;
                    currentSelectionComponent.css(newPosition);
                },true);
            },
            stop: function stop(){
                $(this).css("cursor","default");
                mxBuilder.layout.revalidateLayoutWidth();
            },
            scroll: false
        }
    }
    
    $(function(){
        var dropOnContainer = function dropOnContainer(container){
            return function(event, ui){
                //if we are dropping while on top of the menu cancel
                if(ui.helper.data("deny-drop") === true){
                    mxBuilder.layout.clearOutline(container);
                    return ;
                }
                
                var className =  ui.helper.data("component");
                if(className){
                    if(container == "footer"){
                        ui.position.top = ui.position.top- mxBuilder.layout.footer.position().top;
                    }
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
                    accept: ".mx-helper,.mx-component, #selection-container",
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
                    var selectionCount = mxBuilder.selection.getSelectionCount();
                    if(selectionCount == 1){
                        var theSelectedComponent =  mxBuilder.components.getComponent(mxBuilder.selection.getSelection());
                        if(theSelectedComponent.type == "TextComponent" && theSelectedComponent.isEditMode()){
                            return;
                        }
                    }
                    if(selectionCount > 0){
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
            },
            keydown: function keydown(event){
                if(event.keyCode >= 37 && event.keyCode <=40){
                    var selectionCount = mxBuilder.selection.getSelectionCount();
                    if(selectionCount == 1){
                        var theSelectedComponent =  mxBuilder.components.getComponent(mxBuilder.selection.getSelection());
                        if(theSelectedComponent.type == "TextComponent" && theSelectedComponent.isEditMode()){
                            return;
                        }
                    }
                    mxBuilder.selection.each(function(){
                        var that = this.element;
                        var step = event.shiftKey ? 10 : 1;
                        var position = that.position();
                        var headerThreshold = mxBuilder.layout.header.height();
                        var bodyThreshold = headerThreshold+mxBuilder.layout.body.height();
                        
                        var direction = event.keyCode%2 !=0 ?"left":"top";
                        position[direction] = position[direction] + (event.keyCode-38 > 0 ?1:-1)*step; 
                            
                        var threshold = that.height()/2 + position.top;
                        
                        that.css(position);
                        
                        if(this.container == "header" && headerThreshold < threshold){
                            this.setContainer("body");
                        } else if (this.container == "body"){
                            if(bodyThreshold < threshold){
                                this.setContainer("footer");
                            } else if(headerThreshold > threshold){
                                this.setContainer("header");
                            }
                        }
                        
                    });
                    mxBuilder.layout.revalidateLayout();
                    mxBuilder.selection.revalidateSelectionContainer();
                    event.preventDefault();
                }
            }
        });
        
    });
    
}(jQuery));