(function($){
    $(function(){
        
        var html = '<div class="context-menu" style="position:fixed;display:none;z-index: 100000010">';
        html += '<div class="context-group">';
        html += '<div class="context-item">';
        html += '<span class="icon">';
        html += '<span class="context-item-checked"></span>';
        html += '</span>';
        html += '<span class="context-item-label"></span>';
        html += '<span class="submenu-arrow" style="display:none;"></span>';
        html += '</div>';
        html += '</div>'
        html += '</div>';
        
        var ctxMenu = $(html);
        var ctxMenuItemStamp = ctxMenu.find(".context-item").remove();
        var ctxMenuGroupStamp = ctxMenu.find(".context-group").remove();
        var itemEvents = {
            "mouseenter": function(){
                var that = $(this);
                var parent = that.parents('.context-menu:first');
                
                parent.find('.context-item').not(that).removeClass("context-selected").trigger("deselection");
                that.addClass("context-selected");
            }
        }
        
        mxBuilder.contextmenu = {
            __mainCtx: null,
            getMainCtx: function(){
                if(this.__mainCtx === null){
                    this.__mainCtx = ctxMenu.clone().on("contextmenu",function(event){
                        event.preventDefault();
                        return false;
                    }).appendTo(document.body);
                }
                return {
                    __groupObj: ctxMenuGroupStamp.clone().appendTo(this.__mainCtx),
                    __parent: this.__mainCtx.append('<hr/>'),
                    __level: 0,
                    addItem: function addItem(obj){
                        
                        //if it's a separator add and hr and get the hell out..
                        if(obj.type == "separator" || obj.type == "sep"){
                            this.__groupObj.append('<hr/>');
                            return this;
                        }
                        
                        var theItem = ctxMenuItemStamp.clone();
                    
                        //Adding classes if found...
                        if(obj.cls){
                            theItem.addClass(obj.cls);
                        }
                            
                        //if checked make the check icon visible
                        if(obj.checked !== true) {
                            theItem.find(".context-item-checked").hide();
                        }
                    
                        //Adding the label...
                        theItem.find(".context-item-label").html(obj.label);
                    
                        //Adding Actions/Callback functions
                        var action = {};
                        if(typeof obj.action == "undefined"){
                            obj.action = "mousedown";
                        }
                        action[obj.action] = function(event){
                            if(obj.callback){
                                obj.callback();
                            }
                            hideCtx($(".context-menu:visible"));
                            return false;
                        }
                    
                        //Adding additional data to the tag...
                        if(obj.data){
                            theItem.data("extra",obj.data);
                        }
                    
                        theItem.on(action).on(itemEvents).on({
                            contextmenu: function contextmenu(event){
                                event.preventDefault();
                                return false;
                            }
                        });
                        
                        this.__groupObj.append(theItem);
                        return this;
                    },
                    addSubgroup: function addSubgroup(itemObj,subgroupName){
                        
                        //cloning the current object
                        var theSub = {}
                        $.extend(theSub,this);
                        
                        //modifing parents and insert points
                        theSub.__groupObj = ctxMenuGroupStamp.clone().addClass(subgroupName);
                        theSub.__parent = this;
                        theSub.__level = this.__level + 1;
                        
                        //Adding the item that will lead to the subitems
                        var theItem = ctxMenuItemStamp.clone()
                        .find(".context-item-label").html(itemObj.label)
                        .end()
                        .find(".submenu-arrow").show()
                        .end()
                        .find(".context-item-checked").hide()
                        .end()
                        .appendTo(this.__groupObj);
                        
                        //Creating the new sub-context menu
                        var theNewCtx = ctxMenu.clone().addClass("sub-context-menu level"+theSub.__level)
                        .css("position","fixed").appendTo(document.body)
                        .append(theSub.__groupObj);
                        
                        //hooking up events so when we hover on the item the subgroup is properly shown
                        theItem.on({
                            "mouseenter": function(){
                                //Hiding any other submenu on the same level
                                $(".sub-context-men.level"+theSub.__level).hide();
                                
                                //Displaying the ctx menu in the appropriate location
                                var loc = theItem.offset();
                                var theParent = theItem.parents(".context-menu");
                                var parentLoc = theParent.offset();
                                theNewCtx.css({
                                    position: "absolute",
                                    top: (parentLoc.top + (loc.top-parentLoc.top))+"px",
                                    left: (parentLoc.left+theParent.outerWidth())+"px"
                                }).show();
                            },
                            "deselection": function(){
                                theNewCtx.find('.context-selected').removeClass("context-selected").trigger("deselection")
                                .end()
                                .hide();
                            }
                        }).on(itemEvents);
                        return theSub;
                    },
                    end: function end(){
                        if(this.__parent !== null){
                            return this.__parent;
                        } else {
                            return this;
                        }
                    },
                    addGroup: mxBuilder.contextmenu.addGroup
                };
            },
            reset: function(){
                $(".context-menu").remove();
                this.__mainCtx = null;
            }
        }
        
        
        var hideCtx = function(visible){
            var visibleCtxMenus = typeof visible == "undefined"?$(".context-menu:visible"):visible;
            if(visibleCtxMenus.length > 0){
                visibleCtxMenus.each(function(){
                    var that = $(this);
                    if(that.data("processed") !== true){
                        that.data("processed",true)
                        that.fadeTo(300,0,function(){
                            $(this).hide().trigger("close").data("processed",false);
                        });
                    }
                });
                $(".mx-editable-highlight").removeClass("mx-editable-highlight");
            }
            mxBuilder.contextmenu.reset();
        }
        
        $(document).on({
            "scroll keyup":function(event){
                if(event.type == "keyup" && event.keyCode != 27){
                    return true;
                }
                hideCtx();
            },
            mousedown: function mousedown(event){               
                var visible;
                if(event.which == 3 && !(visible = $(".context-menu:visible")).length > 0){
                    $(".context-menu:not(.sub-context-menu)").css({
                        top: event.clientY,
                        left: event.clientX
                    }).find("hr:last").remove()
                    .end()
                    .fadeTo(300,1);
                } else {
                    hideCtx(visible);
                }
            },
            contextmenu: function contextmenu(event){                
                //if(ctxMenu.is(":visible")){
//                    event.preventDefault();
//                    return false;
                //}
            }
        });
    
    });
}(jQuery));