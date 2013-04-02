(function($) {

    $(function() {
        mxBuilder.clipboard = {
            _heap: [],
            _refPoints: {
                top: 0,
                left: 0
            },
            copySelected: function() {
                var heap = this._heap = [];
                var refPoints = this._refPoints = {
                    top: 20000,
                    left: 20000
                };
                mxBuilder.selection.each(function() {
                    var saveObj = this.save();

                    if (saveObj.css.top < refPoints.top && saveObj.css.left < refPoints.left) {
                        refPoints.top = saveObj.css.top;
                        refPoints.left = saveObj.css.left;
                    }
                    heap.push(saveObj);
                });
            },
            paste: function(container, x, y) {

                if (typeof x === "undefined" || typeof y === "undefined") {
                    var selContainer = mxBuilder.selection.getSelectionContainer();
                    x =  this._refPoints.left+ mxBuilder.layout.header.offset().left + selContainer.width() * 0.1;
                    y =  this._refPoints.top + selContainer.height() * 0.1;
                }

                var currentPage = mxBuilder.pages.getPageObj();
                mxBuilder.selection.clearSelection();
                var history = [];
                for (var c in this._heap) {
                    var cmpObj = {};
                    $.extend(true, cmpObj, this._heap[c]);
                    if (this._heap[c].data.page === currentPage.id) {
                        cmpObj.css.top = cmpObj.css.top - this._refPoints.top + y;
                        cmpObj.css.left = cmpObj.css.left - this._refPoints.left - mxBuilder.layout.header.offset().left + x;
                    }
                    delete cmpObj.data.page;
                    var theComponent = mxBuilder.components.addComponent(cmpObj);
                    theComponent.setContainer(typeof container === "undefined" ? cmpObj.data.container : container);
                    mxBuilder.selection.addToSelection(theComponent.element);
                    history.push(theComponent);
                }
                mxBuilder.historyManager.setRestorePoint(history, "delete");
                mxBuilder.layout.revalidateLayout();
            },
            isEmpty: function() {
                return this._heap.length === 0;
            }
        };
    });

}(jQuery));