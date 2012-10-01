(function($){   
    $(function(){
        mxBuilder.TextComponent = function TextComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "TextComponent",
                draggable: {},
                resizable: {},
                ctxZIndex: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                resize: function resize(){
                    var content  = properties.element.find(".content");
                    var height = content.height();
                    var instHeight = properties.element.height();
                    var out = true;
                    if(height > instHeight){
                        properties.element.height(height);
                        out = false;
                    }
                    properties.element.resizable("option","minHeight",height).data("minheight",instHeight);
                    return out;
                },
                dblclick: function dblclick(){
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    if(theComponent.editor === null || typeof theComponent.editor == "undefined"){
                        var theContent = properties.element.draggable("disable").on({
                            "click.editor-consume": function(event){
                                return false;
                            }
                        }).find(".content")
                        .attr("contenteditable","true")
                        .focus()
                        .get(0);
                
                        var refreshInterval = setInterval(function(){
                            var metrics = theComponent.getMetrics();
                            if(typeof metrics.offsetWidth != "undefined"){
                                mxBuilder.components.pushComponentsBelow(metrics);
                                mxBuilder.selection.revalidateSelectionContainer();
                                mxBuilder.layout.revalidateLayout();
                            }
                        },100);
                
                        mxBuilder.selection.enableMultiComponentSelect(false);
                        mxBuilder.activeStack.push(properties.element);
                
                        //                $(document.body).on({
                        //                    "mousedown.text-component": function(event){
                        //                        var component = $(event.srcElement).parents(".mx-component, .cke, .prevents-editor-close");
                        //                        if(component.length == 0 && !$(event.srcElement).hasClass("mx-component")){
                        //                            console.log("clearing the selection...");
                        //                            mxBuilder.selection.clearSelection();
                        //                        }
                        //                    }
                        //                });
                
                        var height = properties.element.height();
                
                        properties.element.css({
                            minHeight: height+"px",
                            height: "auto"
                        }).data("refreshinterval",refreshInterval).data("minheight",height);
                
                        theComponent.editor = CKEDITOR.inline(theContent, {  
                            on :{
                                instanceReady : function ( evt ){
                                    $(theContent).focus();
                                }
                            }
                        });
                    }
                
                    properties.element.on({
                        "click.focus-editor": function click(){
                            theComponent.editor.focus();
                        }
                    });
                
                },
                deselected: function deselected(){
                    console.log("Editor: deselected...");
                    var component = mxBuilder.components.getComponent($(this));
                //                if(component.editor){
                //                    mxBuilder.activeStack.popTo(this);
                //                }
                },
                poppedFromActiveStack: function poppedFromActiveStack(){
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    if(theComponent.editor !== null && typeof theComponent.editor != "undefined"){
                        console.log("Editor popped from stack...");
                        clearInterval(properties.element.data("refreshinterval"));
                
                        theComponent.editor.destroy();
                        theComponent.editor = null;
                        mxBuilder.selection.enableMultiComponentSelect(true);
                
                        var cachedMinHeight = properties.element.data("minheight");
                        var content = properties.element.find(".content");
                        var contentHeight = content.height();
                
                        var height;
                        if(cachedMinHeight > contentHeight){
                            content.height(height);
                            height = cachedMinHeight;
                        } else {
                            height = contentHeight;
                        }

                        properties.element.draggable("enable").css({
                            minHeight: "",
                            height: height
                        }).off(".focus-editor").off(".editor-consume").find(".content").removeAttr("contenteditable");
                    }
                }
            });
        }
        $.extend(mxBuilder.TextComponent.prototype, new mxBuilder.Component(), {
            destroy: function destroy(){
                var theComponent = mxBuilder.components.getComponent($(this.instance));
                if(theComponent.editor){
                    theComponent.editor.destroy();
                }
                mxBuilder.Component.prototype.destroy.call(this);
            },
            template: mxBuilder.layout.templates.find(".text-component-instance").remove()
        });
        $('<div class="text-component menu-item" style="cursor:move;">Text Box</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.TextComponent.prototype.template.clone().data("component","TextComponent");
                theContent.appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
}(jQuery));