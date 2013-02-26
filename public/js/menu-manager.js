(function($){
    $(function(){
        var theMenuContainer = $(".flexly-main-bar");
        var theMenuTab = theMenuContainer.find(".flexly-tab");
        var theMenuTabButtons = theMenuContainer.find(".flexly-tab-buttons");
        
        //Scroll settings
        var theContentTab = theMenuTab.find(".flexly-tab-content");
        
        theContentTab.jqueryScrollbar({
            contentClass: "flexly-main-menu-content",
            totalScollMargin: 60
        });        
        
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
                } else if(element.hasClass("flexly-icon-settings")){
                    mxBuilder.menuManager.showTab("settings");
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
            contentTab: theContentTab.find(".flexly-main-menu-content"),
            menuTab: theMenuTab,
            scrollContainer: theContentTab,
            tabTitle: theMenuTab.find(".flexly-tab-title"),
            tabButtons: theMenuTabButtons,
            tabButtonsMain: theMenuTabButtons.find(".flexly-tab-buttons-main"),
            tabButtonsAux: theMenuTabButtons.find(".flexly-tab-buttons-aux"),
            tabFooterWrapper: theMenuTab.find(".flexly-tab-footer"),
            tabFooter: theMenuTab.find(".flexly-tab-footer-container"),
            menus: {},
            currentTab: "",
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
                this.currentTab = tabID;
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
                this.currentTab = "";
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
                    width:276-16-width
                },300,"linear",function(){
                    theAuxChilds.fadeIn(100);
                });
                this.tabButtonsMain.animate({
                    width: width+16
                },300,"linear",function(){
                    theMainChilds.fadeIn(100);
                });
                
                //updating the containers height
                var theMenuContainerHeight = theContentTab.css("height","").height();
                var totalHeight = 0;
                if(this.tabButtons.is(":visible")){
                    totalHeight += this.tabButtons.height();
                }
                if(this.tabFooterWrapper.is(":visible")){
                    totalHeight += this.tabFooterWrapper.height();
                    this.contentTab.css({
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px"
                    });
                } else {
                    this.contentTab.css({
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px"
                    });
                }
                theContentTab.height(theMenuContainerHeight-totalHeight);
                
                this.revalidateScrollbar();
            },
            revalidateScrollbar: function(){
                  theContentTab.jqueryScrollbar("update");
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