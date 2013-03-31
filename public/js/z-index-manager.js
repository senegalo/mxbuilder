(function($) {

    mxBuilder.zIndexManager = {
        __componentsArray: [],
        __nextZIndex: 1000,
        addComponent: function addComponent(component) {
            var theZIndex = component.element.css("zIndex");
            if (theZIndex === "auto" || this.getComponentAtZIndex(theZIndex) !== false) {
                theZIndex = this.getNextZIndex();
                component.element.css("zIndex", theZIndex);
            }
            theZIndex = parseInt(theZIndex, 10);
            if (this.__nextZIndex <= theZIndex) {
                this.__nextZIndex = theZIndex + 1;
            }
            this.insertionSort({
                id: component.getID(),
                zIndex: theZIndex
            });
        },
        removeComponent: function removeComponent(component) {
            var index = this.getComponentAtZIndex(component.element.css("zIndex"));
            this.__componentsArray.splice(index, 1);
        },
        insertionSort: function insertionSort(obj) {
            if (this.__componentsArray.length === 0 || obj.zIndex > this.__componentsArray[this.__componentsArray.length - 1].zIndex) {
                this.__componentsArray.push(obj);
            } else if (obj.zIndex < this.__componentsArray[0].zIndex) {
                this.__componentsArray.splice(0, 0, obj);
            } else {
                for (var c in this.__componentsArray) {
                    if (this.__componentsArray[c].zIndex > obj.zIndex) {
                        this.__componentsArray.splice(c, 0, obj);
                        return;
                    }
                }
            }
        },
        getComponentAtZIndex: function getComponentAtZIndex(zIndex) {
            zIndex = parseInt(zIndex, 10);
            var low = 0;
            var high = this.__componentsArray.length - 1;
            while (low <= high) {
                var index = Math.round((low + high) / 2);
                if (zIndex === this.__componentsArray[index].zIndex) {
                    return index;
                } else if (zIndex < this.__componentsArray[index].zIndex) {
                    high = index - 1;
                } else {
                    low = index + 1;
                }
            }
            return false;
        },
        moveUp: function moveUp(component) {
            var index = this.getComponentAtZIndex(component.element.css("zIndex"));
            if (index + 1 < this.__componentsArray.length) {
                this.flip(index, index + 1);
            }
        },
        moveDown: function moveDown(component) {
            var index = this.getComponentAtZIndex(component.element.css("zIndex"));
            if (index > 0) {
                this.flip(index, index - 1);
            }
        },
        moveToTop: function moveToTop(component) {
            var newZIndex = this.getNextZIndex();

            //update the array
            var index = this.getComponentAtZIndex(component.element.css("zIndex"));
            this.__componentsArray.splice(index, 1);
            this.__componentsArray.push({
                id: component.getID(),
                zIndex: parseInt(newZIndex, 10)
            });

            //update the component
            component.element.css("zIndex", newZIndex);
        },
        moveToBottom: function moveToBottom(component) {
            var newZIndex = this.__componentsArray[0].zIndex - 1;

            //updating the array
            var index = this.getComponentAtZIndex(component.element.css("zIndex"));
            this.__componentsArray.splice(index, 1);
            this.__componentsArray.splice(0, 0, {
                id: component.getID(),
                zIndex: newZIndex
            });

            //update the component
            component.element.css("zIndex", newZIndex);
        },
        getNextZIndex: function getNextZIndex() {
            return this.__nextZIndex++;
        },
        flip: function flip(fromIndex, toIndex) {
            //flipping the actual elements zindexs
            mxBuilder.components.getComponent(this.__componentsArray[fromIndex].id).element.css("zIndex", this.__componentsArray[toIndex].zIndex);
            mxBuilder.components.getComponent(this.__componentsArray[toIndex].id).element.css("zIndex", this.__componentsArray[fromIndex].zIndex);

            //flipping them in the array
            var tmp = this.__componentsArray[fromIndex].id;
            this.__componentsArray[fromIndex].id = this.__componentsArray[toIndex].id;
            this.__componentsArray[toIndex].id = tmp;
        }
    };

}(jQuery));