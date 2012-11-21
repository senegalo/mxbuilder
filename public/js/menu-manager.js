(function($){
    $(function(){
        var theMenuContainer = $(".flexly-main-bar");
        var theMenuTab = theMenuContainer.find(".flexly-tab");
        
        //Creating the transparent border
        //theMenuTab.append('<div class="flexly-tab-content-border"/>');
        var theContentTab = theMenuTab.find(".flexly-tab-content").mCustomScrollbar();
        
//        .find(".mCSB_container")
//        .wrap('<div class="super-mCSB-container"/>').end();
        
        
        theMenuContainer.find(".flexly-button").on({
            click: function click(){
                mxBuilder.menuManager.showTab({
                    title: "Pages",
                    tabID: "pages"
                });
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
            menus: {},
            showTab: function showTab(settings){
                theMenuTab.find(".flexly-tab-title").text(settings.title);
                theMenuContainer.animate({
                    width: 380
                },300,"linear",function(){
                    theMenuTab.fadeIn(300);
                    var theScrollpan = theContentTab.find(".mCSB_container").empty();
                    mxBuilder.menuManager.menus[settings.tabID].init(theScrollpan);
                    mxBuilder.menuManager.revalidate();
                });
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