(function($){
    mxBuilder.components.alignment = {
        alignRight: function alignRight(){
            var minLeft = 10000;
            mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                if(position.left < minLeft){
                    minLeft = position.left;
                }
            }).css("left",minLeft);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        alignLeft: function alignLeft(){
            var maxLeft = 0;
            mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                var left = position.left+that.outerWidth();
                if(left > maxLeft){
                    maxLeft = left;
                }
            }).each(function(){
                var that = $(this);
                that.css({
                    left: maxLeft-that.outerWidth()
                })
            });
            mxBuilder.selection.revalidateSelectionContainer();
        },
        alignTop: function alignTop(){
            var minTop = 100000000;
            mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                minTop = minTop > position.top ? position.top : minTop;
            }).css({
                top: minTop
            });
            mxBuilder.selection.revalidateSelectionContainer();
        },
        alignBottom: function alignBottom(){
            var maxTop = 0;
            mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                var height = that.outerHeight()+position.top;
                maxTop = maxTop < height ? height : maxTop;
            }).each(function(){
                var that = $(this);
                that.css({
                    top: maxTop-that.outerHeight()
                })
            });
            mxBuilder.selection.revalidateSelectionContainer();
        },
        centerHorizontally: function centerHorizontally(){
            var maxTop = 0;
            var minTop = 1000000;
            var theSelection = mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                var height = position.top + that.outerHeight();
                
                minTop = position.top < minTop ? position.top : minTop;
                maxTop = height > maxTop ? height : maxTop;
            });
            
            var center = (maxTop+minTop)/2;
            
            theSelection.each(function(){
                var that = $(this);
                that.css({
                    top: center-(0.5*that.outerHeight())
                });
            });
            mxBuilder.selection.revalidateSelectionContainer();
        },
        centerVertically: function centerVertically(){
            var maxLeft = 0;
            var minLeft = 1000000;
            var theSelection = mxBuilder.selection.getSelection().each(function(){
                var that = $(this);
                var position = that.position();
                var width = position.left + that.outerWidth();
                
                minLeft = position.left < minLeft ? position.left : minLeft;
                maxLeft = width > maxLeft ? width : maxLeft;
            });
            
            var center = (maxLeft+minLeft)/2;
            
            theSelection.each(function(){
                var that = $(this);
                that.css({
                    left: center-(0.5*that.outerWidth())
                });
            });
            mxBuilder.selection.revalidateSelectionContainer();
        }
    }
}(jQuery))