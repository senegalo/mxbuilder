(function($){
    $(function(){
        var theMenuContainer = $(".flexly-main-bar");
        var theMenuTab = theMenuContainer.find(".flexly-tab");
        var theMenuTabButtons = theMenuContainer.find(".flexly-tab-buttons");
        var theContentBorder = theMenuContainer.find(".flexly-tab-content-border");
        
        //Scroll settings
        var theContentTab = theMenuTab.find(".flexly-tab-content");
        var maxTop,theContent;
        
        theContentTab.mCustomScrollbar({
            scrollInertia: 550,
            callbacks: {
                onScrollStart: function onScrollStart(){
                    if(theContent){
                        theContent = theContentTab.find(".mCSB_container");
                        maxTop = -1*(theContent.outerHeight()-theContentTab.height());
                    }
                },
                whileScrolling: function whileScrolling(){
                    if(theContent){
                        var theTop = parseInt(theContent.css("top").replace("px",""),10);
                        if(theTop < maxTop){
                            theContent.css("top",maxTop);
                        }
                    }
                },
                whileScrollingInterval: 20
            }
        });
        
        //revalidating the content border...
        var theMenuContainerHeight = theMenuContainer.height();
        theContentBorder.height(theMenuContainerHeight-61);
        
        
        theMenuContainer.find(".flexly-button").on({
            click: function click(){
                var element = $(this);
                if(element.hasClass("flexly-icon-page")){
                    mxBuilder.menuManager.showTab("pages");
                } else if(element.hasClass("flexly-icon-photos")){
                    mxBuilder.menuManager.showTab("photos");
                } else if(element.hasClass("flexly-icon-widgets")){
                    mxBuilder.menuManager.showTab("widgets");
                } else if(element.hasClass("flexly-icon-publish")){
                    mxBuilder.publishManager.publish();
                }
            }
        })
        .end()
        .droppable({
            over: function(event,ui){
                ui.helper.data("deny-drop",true);
            },
            out: function(event,ui){
                ui.helper.data("deny-drop",false);
            }
        });
        
        theMenuTab.find(".flexly-tab-close").on({
            click: function click(event){
                mxBuilder.menuManager.closeTab();
                event.stopPropagation();
                return false;
            }
        });
        
        mxBuilder.menuManager = {
            contentTab: theContentTab.find(".mCSB_container"),
            menuTab: theMenuTab,
            tabTitle: theMenuTab.find(".flexly-tab-title"),
            tabButtons: theMenuTabButtons,
            tabButtonsMain: theMenuTabButtons.find(".flexly-tab-buttons-main"),
            tabButtonsAux: theMenuTabButtons.find(".flexly-tab-buttons-aux"),
            tabFooterWrapper: theMenuTab.find(".flexly-tab-footer"),
            tabFooter: theMenuTab.find(".flexly-tab-footer-container"),
            menus: {},
            showTab: function(tabID,extraData){
                if(theMenuContainer.width() < 70){
                    theMenuContainer.animate({
                        width: 380
                    },300,"linear",function(){
                        theMenuTab.fadeIn(300);
                        mxBuilder.menuManager.displayTabContent(tabID,extraData);
                    });
                } else {
                    mxBuilder.menuManager.displayTabContent(tabID,extraData);
                }
            },
            displayTabContent: function(tabID,extraData){
                this.contentTab.empty();
                this.tabButtonsAux.empty();
                this.tabButtonsMain.empty();
                this.tabButtons.show();
                this.tabFooter.empty();
                this.tabFooterWrapper.hide();
                this.menus[tabID].init(extraData);
                this.revalidate();
            },
            hideFooter: function(){
                this.tabFooterWrapper.hide();
            },
            hideTabButtons: function(){
                this.tabButtons.hide();
            },
            closeTab: function(){
                theMenuTab.fadeOut(300,function(){
                    theMenuContainer.animate({
                        width: 68
                    },300,"linear");
                });
            },
            revalidate: function(){
                //hiding everything
                var theAuxChilds = this.tabButtonsAux.children().hide();
                var theMainChilds = this.tabButtonsMain.children().hide();
                //updating the buttons tab
                var width = 0;
                this.tabButtonsMain.children().each(function(){
                    width += $(this).outerWidth(true);
                });
                this.tabButtonsAux.animate({
                    width:275-16-width
                },300,"linear",function(){
                    theAuxChilds.fadeIn(100);
                });
                this.tabButtonsMain.animate({
                    width: width+16
                },300,"linear",function(){
                    theMainChilds.fadeIn(100);
                });
                
                //updating the containers height
                var totalHeight = 0;
                if(this.tabButtons.is(":visible")){
                    totalHeight += this.tabButtons.outerHeight();
                }
                if(this.tabFooterWrapper.is(":visible")){
                    totalHeight += this.tabFooterWrapper.outerHeight();
                }
                
                theContentTab.height(theMenuContainerHeight-63-totalHeight);
                
                this.revalidateScrollbar();
            },
            revalidateScrollbar: function(){
                var theCSB = theContentTab.find(".mCSB_container");
                theCSB.css("height","");
                theCSB.height(theCSB.children().height());
                theContentTab.mCustomScrollbar("update");
            },
            addButtonTo: function(button,where,css){
                where = where == "main" ? mxBuilder.menuManager.tabButtonsMain : mxBuilder.menuManager.tabButtonsAux;
                return $('<div class="'+button+' flexly-icon"/>').appendTo(where);
            },
            addFooterCancelButton : function(){
                return $('<div class="flexly-icon flexly-icon-cancel-button" style="position:absolute;top: 11px;right: 55px;opacity:0.5"/>')
                .appendTo(this.tabFooter);
            },
            addFooterSaveButton: function(){
                return $('<div class="flexly-icon flexly-icon-save-button" style="position:absolute;top:5px;right:20px;"/>')
                .appendTo(this.tabFooter);
            }
        }
        
    });
}(jQuery))