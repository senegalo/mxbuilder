(function($){   
    $(function(){
        mxBuilder.TextComponent = function TextComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "TextComponent",
                draggable: {},
                resizable: {
                    orientation: "h"
                },
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
                    properties.element.height(height);
                    properties.element.resizable("option","minHeight",height).data("minheight",instHeight);
                    return out;
                },
                resizestop: function resizestop(){
                    properties.element.css("height","auto");
                },
                dblclick: function dblclick(){
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    if(theComponent.editMode !== true){
                        if(theComponent.editor === null || typeof theComponent.editor == "undefined"){
                            var theContent = properties.element.draggable("disable").on({
                                "click.editor-consume": function(event){
                                    return false;
                                }
                            }).find(".content")
                            .attr("contenteditable","true")
                            .focus()
                            .get(0);
                        
                            var originalHeight = properties.element.height();
                            var cachedHeight = originalHeight;
                            var refreshInterval = setInterval(function(){
                                var metrics = theComponent.getMetrics();
                                if(metrics.height != cachedHeight){
                                    if(theComponent.editor){
                                        (new CKEDITOR.dom.window(window)).fire("resize");
                                    }
                                    if(metrics.height >= originalHeight){
                                        var displacment = metrics.height - cachedHeight;
                                        var components = mxBuilder.components.detectCollision([theComponent],displacment<0?-1*displacment+40:20);
                                        for(var c in components){
                                            var element = components[c].element
                                            var position = element.position();
                                            element.css({
                                                top: position.top + displacment + "px",
                                                left: position.left
                                            });
                                        }
                                    }
                                    mxBuilder.selection.revalidateSelectionContainer();
                                    mxBuilder.layout.revalidateLayout();
                                    cachedHeight = metrics.height;
                                }
                            },100);
                
                            mxBuilder.selection.enableMultiComponentSelect(false);
                            //mxBuilder.activeStack.push(properties.element);
                
                            properties.element.css({
                                //minHeight: height+"px",
                                height: "auto"
                            }).data("refreshinterval",refreshInterval).data("minheight",originalHeight);
                
                        
                            var position = properties.element.position();
                
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
                    
                        theComponent.editMode = true;
                    }
                },
                deselected: function deselected(){
                    mxBuilder.activeStack.popTo(properties.element);
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
                            height: theComponent.element.find(".content").height()
                        }).off(".focus-editor").off(".editor-consume").find(".content").removeAttr("contenteditable");
                        
                        theComponent.editMode = false;
                        
                        if(content.text().replace(/(\s\n|\n\s|\s\n\r|\n\r\s)/,"") == ""){
                            theComponent.destroy();
                        }
                    }
                }
            });
        }
        $.extend(mxBuilder.TextComponent.prototype, new mxBuilder.Component(), {
            destroy: function destroy(){
                var theComponent = mxBuilder.components.getComponent($(this.element));
                if(theComponent.editor){
                    theComponent.editor.destroy();
                }
                mxBuilder.Component.prototype.destroy.call(this);
            },
            template: mxBuilder.layout.templates.find(".text-component-instance").remove(),
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.text = this.element.find(".content").html();
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                if(properties.data.text){
                    properties.element.find(".content").html(properties.data.text);
                }
            },
            isEditMode: function isEditMode(){
                return this.editMode ? true : false;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.find(".inline-links").each(function(){
                    var that = $(this), url;
                    switch(that.data("type")){
                        case "external":
                            url = that.data("url");
                            break;
                        case "page":
                            var pageObj = mxBuilder.pages.getPageObj(that.data("url"));
                            url = pageObj.address+".html";
                            break;
                    }
                    that.attr({
                        href: url,
                        target: "_blank"
                    });
                });
                return out;
            }
        });
        $('<div class="text-component menu-item mx-helper" style="cursor:move;">Text Box</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.TextComponent.prototype.template.clone()
                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","TextComponent");
                theContent.appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
}(jQuery));