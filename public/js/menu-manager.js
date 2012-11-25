(function($){
    $(function(){
        var theMenuContainer = $(".flexly-main-bar");
        var theMenuTab = theMenuContainer.find(".flexly-tab");
        var theMenuTabFooter = theMenuContainer.find(".flexly-tab-footer");
        
        //Creating the transparent border
        //theMenuTab.append('<div class="flexly-tab-content-border"/>');
        var theContentTab = theMenuTab.find(".flexly-tab-content").mCustomScrollbar();
        
        //        .find(".mCSB_container")
        //        .wrap('<div class="super-mCSB-container"/>').end();
        
        
        theMenuContainer.find(".flexly-button").on({
            click: function click(){
                mxBuilder.menuManager.showTab("pages");
            }
        });
        
        theMenuTab.find(".flexly-tab-close").on({
            click: function click(event){
                mxBuilder.menuManager.closeTab();
                event.stopPropagation();
                return false;
            }
        })
        
        mxBuilder.menuManager = {
            contentTab: theContentTab.find(".mCSB_container"),
            menuTab: theMenuTab,
            tabTitle: theMenuTab.find(".flexly-tab-title"),
            tabFooter: theMenuTabFooter,
            menus: {},
            showTab: function showTab(tabID,extraData){
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
            displayTabContent: function displayTabContent(tabID,extraData){
                this.contentTab.empty();
                this.tabFooter.empty();
                this.menus[tabID].init(extraData);
                this.revalidate();
            },
            closeTab: function closeTab(){
                theMenuTab.fadeOut(300,function(){
                    theMenuContainer.animate({
                        width: 68
                    },300,"linear");
                });
            },
            revalidate: function revalidate(){
                theContentTab.mCustomScrollbar("update");
            }
        }
        
    });
}(jQuery))