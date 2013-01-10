(function($){
    
    $(function(){
        mxBuilder.clipboard = {
            _heap: [],
            _refPoints: {
                top: 0,
                left: 0
            },
            copySelected: function(){
                var heap = this._heap = [];
                var refPoints = this._refPoints = {
                    top: 20000,
                    left: 20000
                };
                mxBuilder.selection.each(function(){
                    var saveObj = this.save();
                    
                    if(saveObj.css.top < refPoints.top && saveObj.css.left < refPoints.left){
                        refPoints.top = saveObj.css.top;
                        refPoints.left = saveObj.css.left;
                    }
                    heap.push(saveObj);
                });
            },
            paste: function(container, x, y){
                mxBuilder.selection.clearSelection();
                for(var c in this._heap){
                    var cmpObj = {};
                    $.extend(true,cmpObj,this._heap[c]);
                    cmpObj.css.top = cmpObj.css.top-this._refPoints.top+y;
                    cmpObj.css.left = cmpObj.css.left-this._refPoints.left-mxBuilder.layout.header.offset().left+x;
                    var theComponent = mxBuilder.components.addComponent(cmpObj);
                    theComponent.setContainer(container);
                    mxBuilder.selection.addToSelection(theComponent.element);
                }
                mxBuilder.layout.revalidateLayout();
            },
            isEmpty: function(){
                return this._heap.length == 0;
            }
        }
    });
    
}(jQuery));