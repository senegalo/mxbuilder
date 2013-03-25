(function($) {

    $(function() {
        $(mxBuilder.systemEvents).one({
            systemReady: function() {
                mxBuilder.historyManager.setRestorePoint(mxBuilder.components.getComponents());
            }
        });
        mxBuilder.historyManager = {
            _hashList: [],
            _hash: {},
            _init: false,
            _currentPointer: 0,
            setRestorePoint: function(components, tags) {
                this._init = true;

                var restorePoint = {
                    type: "components",
                    contents: []
                };
                var save;
                for (var c in components) {
                    if (components.hasOwnProperty(c)) {
                        save = components[c].save();
                        save.data._id = components[c].getID();
                        if (typeof tags !== "undefined") {
                            save.tags = tags;
                        }
                        restorePoint.contents.push(save);
                    }
                }

                //Checking if the pointer is in the middle of
                this.fixPointer();

                this._currentPointer = mxBuilder.utils.GUID();
                this._hash[this._currentPointer] = restorePoint;
                this._hashList.push(this._currentPointer);
            },
            setRestorePointFromSelection: function(tags) {
                var components = mxBuilder.components.getComponents(mxBuilder.selection.getSelection());
                this.setRestorePoint(components, tags);
            },
            setLayoutRestorePoint: function() {
                var restorePoint = {
                    type: "layout",
                    layout: {
                        header: mxBuilder.layout.header.height(),
                        body: mxBuilder.layout.body.height(),
                        footer: mxBuilder.layout.footer.height()
                    },
                    contents: []
                };

                var save;
                var components = mxBuilder.components.getComponents();
                for (var c in components) {
                    if (components.hasOwnProperty(c)) {
                        save = components[c].save();
                        save.data._id = components[c].getID();
                        restorePoint.contents.push(save);
                    }
                }

                this.fixPointer();

                this._currentPointer = mxBuilder.utils.GUID();
                this._hash[this._currentPointer] = restorePoint;
                this._hashList.push(this._currentPointer);
            },
            spliceHash: function(id) {
                var index = this.getPointerIndex(id);

                if (index !== null) {
                    var removed = this._hashList.splice(index + 1, this._hashList.length);
                    for (var r = 0, cnt = removed.length; r < cnt; r++) {
                        delete this._hash[removed[r]];
                    }
                }

            },
            isPointingToLast: function() {
                return this._currentPointer === this._hashList[this._hashList.length - 1];
            },
            undo: function() {
                mxBuilder.selection.clearSelection();
                var index = this.getPointerIndex();

                //if we have a valid index proceed with the restoration procedure
                if (index !== null && index > 0) {
                    this._currentPointer = this._hashList[index - 1];
                    this.restorePoint(index);
                }
            },
            redo: function() {
                var index = this.getPointerIndex();
                if (index !== null && index < this._hashList.length - 1) {
                    this._currentPointer = this._hashList[index + 1];
                    this.restorePoint(index + 1);
                }
            },
            restorePoint: function(index) {
                var restorePoint = this._hash[this._hashList[index]];
                switch (restorePoint.type) {
                    case "components":
                        this.restoreComponents(restorePoint);
                        break;
                    case "layout":
                        this.restoreLayout(restorePoint);
                        break;
                }
            },
            restoreComponents: function(restorePoint) {
                for (var c = 0, cnt = restorePoint.contents.length; c < cnt; c++) {
                    var component = mxBuilder.components.getComponent(restorePoint.contents[c].data._id);
                    if (restorePoint.contents[c].tags === "delete" && typeof component !== "undefined") {
                        component.destroy();
                    } else {
                        var restore = {};
                        $.extend(true, restore, restorePoint.contents[c]);
                        if (typeof component !== "undefined") {
                            var wasSelected = mxBuilder.selection.isSelected(component.element);
                            if (wasSelected) {
                                mxBuilder.selection.removeFromSelection(component.element, true, true);
                            }

                            component.destroy();
                            restorePoint.contents[c].fixFooter = true;
                            var newInstance = mxBuilder.components.addComponent(restore);

                            if (wasSelected) {
                                mxBuilder.selection.addToSelection(newInstance.element, true);
                            }
                        } else {
                            mxBuilder.components.addComponent(restore);
                        }
                    }
                }
            },
            restoreLayout: function(restorePoint) {
                mxBuilder.layout.header.height(restorePoint.layout.header);
                mxBuilder.layout.body.height(restorePoint.layout.body);
                mxBuilder.layout.footer.height(restorePoint.layout.footer);
                this.restoreComponents(restorePoint);
                mxBuilder.layout.revalidateLayout(true);
            },
            getPointerIndex: function(pointer) {
                pointer = typeof pointer === "undefined" ? this._currentPointer : pointer;
                for (var r = this._hashList.length - 1; r >= 0; r--) {
                    if (pointer === this._hashList[r]) {
                        return r;
                    }
                }
                return null;
            },
            fixPointer: function() {
                if (!this.isPointingToLast()) {
                    this.spliceHash(this._currentPointer);
                }
            },
            hasUndo: function() {
                return this._currentPointer !== null && this._hashList[0] !== this._currentPointer;
            },
            hasRedo: function() {
                return this._currentPointer !== null && this._hashList[this._hashList.length - 1] !== this._currentPointer;
            },
            isInit: function() {
                return this._init;
            }
        };
    });

}(jQuery));