(function($){
    mxBuilder.TextComponent = function TextComponent(instance){
        mxBuilder.Component.apply(this,[{
            ID: "text-component",
            title: "Text Component",
            draggable: {},
            resizable: {},
            ctxZIndex: true,
            selectable: true,
            instance: instance
        }]);
    
        instance.addClass("text-component-instance");
        instance.on({
            resize: function resize(){
                var content  = instance.find(".content");
                var height = content.height();
                var instHeight = instance.height();
                var out = true;
                if(height > instHeight){
                    instance.height(height);
                    out = false;
                }
                instance.resizable("option","minHeight",height).data("minheight",instHeight);
                return out;
            },
            dblclick: function dblclick(){
                var theComponent = mxBuilder.components.getComponent(instance);
                if(theComponent.editor === null || typeof theComponent.editor == "undefined"){
                    var theContent = instance.draggable("disable").on({
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
                    mxBuilder.activeStack.push(instance);
                
                    //                $(document.body).on({
                    //                    "mousedown.text-component": function(event){
                    //                        var component = $(event.srcElement).parents(".mx-component, .cke, .prevents-editor-close");
                    //                        if(component.length == 0 && !$(event.srcElement).hasClass("mx-component")){
                    //                            console.log("clearing the selection...");
                    //                            mxBuilder.selection.clearSelection();
                    //                        }
                    //                    }
                    //                });
                
                    var height = instance.height();
                
                    instance.css({
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
                
                instance.on({
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
                var theComponent = mxBuilder.components.getComponent(instance);
                if(theComponent.editor !== null && typeof theComponent.editor != "undefined"){
                    console.log("Editor popped from stack...");
                    clearInterval(instance.data("refreshinterval"));
                
                    theComponent.editor.destroy();
                    theComponent.editor = null;
                    mxBuilder.selection.enableMultiComponentSelect(true);
                
                    var cachedMinHeight = instance.data("minheight");
                    var content = instance.find(".content");
                    var contentHeight = content.height();
                
                    var height;
                    if(cachedMinHeight > contentHeight){
                        content.height(height);
                        height = cachedMinHeight;
                    } else {
                        height = contentHeight;
                    }

                    instance.draggable("enable").css({
                        minHeight: "",
                        height: height
                    }).off(".focus-editor").off(".editor-consume").find(".content").removeAttr("contenteditable");
                }
            }
        });
    }
    mxBuilder.TextComponent.prototype = new mxBuilder.Component();
    mxBuilder.TextComponent.prototype.destroy = function destroy(){
        var theComponent = mxBuilder.components.getComponent($(this.instance));
        if(theComponent.editor){
            theComponent.editor.destroy();
        }
        mxBuilder.Component.prototype.destroy.call(this);
    }
    
    $(function(){
        $('<div class="text-component menu-item" style="cursor:move;">Text Box</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="width:300px;padding:5px;z-index:10000;"></div>').data("component",mxBuilder.TextComponent);
                theContent.append('<div class="content" style="word-wrap: break-word;">I’ve had to work with jQuery UI’s Resizable plugin on a recent project.  I wanted to use custom handles to drag the element for resize, but the documentation page is a bit sparse when it comes to specifying a DOM Element to use for your custom handle.  For the sanity of others, here is the correct syntax to use when trying to add a custom handle to the jQuery UI Resize plugin.</div>');
                theContent.appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
}(jQuery));