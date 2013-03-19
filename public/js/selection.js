(function($) {

    //when ready
    $(function() {
        mxBuilder.selection.__selectionContainer = $('<div id="selection-container"/>').appendTo(mxBuilder.layout.container)
                .hide().draggable(mxBuilder.Component.prototype.defaultDraggableSettings);

        //Clearing selection on click
        $(mxBuilder.layout.editorArea).on({
            click: function(event) {
                var theSrcElement = $(event.srcElement);
                if (!theSrcElement.hasClass("mx-component") && theSrcElement.parents(".mx-component").length === 0 && mxBuilder.selection.getSelectionCount() !== 0) {
                    mxBuilder.selection.clearSelection();
                }
            }
        });

    });

    mxBuilder.selection = {
        __selected: {},
        __selectionCount: 0,
        __corners: {
            x1: 100000,
            x2: 0,
            y1: 100000,
            y2: 0,
            smallestZIndex: 10000000000000
        },
        getSelectionContainer: function() {
            return this.__selectionContainer;
        },
        addToSelection: function(element, muteGlobalEvent) {

            if (this.isSelected(element)) {
                return;
            }

            element = $(element).addClass("ui-selected");

            //incrementing selection count
            this.__selectionCount++;

            //displaying the resizable handles
            if (this.__selectionCount === 1) {
                element.find(".ui-resizable-handle").show();
            } else {
                this.getSelection().find(".component-resizable-handle").hide();
            }

            //Augmenting the jquery ui selection plugin
            var selectedObj = element.data("selectableItem");
            if (selectedObj) {
                selectedObj.selected = true;
                selectedObj.startselected = true;
                element.data("selectableItem", selectedObj);
            }

            //adding the instance in the selection hash
            this.__selected[mxBuilder.components.getComponent(element).getID()] = element;

            //adding the instance to the active stack
            mxBuilder.activeStack.push(element);

            //triggering the selected event
            element.trigger("selected");
            if (muteGlobalEvent !== true && mxBuilder.systemReady) {
                $(mxBuilder.systemEvents).trigger("selectionChanged");
            }

            //updating the selection most outer corners
            this.revalidateSelectionContainer();
        },
        removeFromSelection: function(element, skipSelContainerValidation, muteGlobalEvent) {

            if (!this.isSelected(element)) {
                return;
            }

            element = $(element).removeClass("ui-selected");

            element.find(".component-resizable-handle").hide();

            this.__selectionCount--;
            var selectedObj = element.data("selectableItem");
            if (selectedObj) {
                selectedObj.selected = false;
                selectedObj.startselected = false;
                element.data("selectableItem", selectedObj);
            }
            delete this.__selected[mxBuilder.components.getComponent(element).getID()];

            if (this.__selectionCount === 1) {
                this.getSelection().find(".component-resizable-handle").show();
            }


            element.trigger("deselected").trigger("blur");

            if (muteGlobalEvent !== true && mxBuilder.systemReady) {
                $(mxBuilder.systemEvents).trigger("selectionChanged");
            }

            if (skipSelContainerValidation !== true) {
                this.revalidateSelectionContainer();
            }
        },
        clearSelection: function(settings) {
            var selection = this.getSelection();
            if (settings && settings.exclude) {
                selection = selection.not(settings.exclude);
            }
            selection.each(function() {
                mxBuilder.selection.removeFromSelection($(this), true, true);
            });

            if ((!settings || settings.muteGlobalEvent !== true) && mxBuilder.systemReady) {
                $(mxBuilder.systemEvents).trigger("selectionChanged");
            }

            this.revalidateSelectionContainer();
        },
        switchSelection: function(element) {
            this.clearSelection({
                muteGlobalEvent: true
            });
            this.addToSelection(element);
        },
        toggle: function(element) {
            element = $(element);
            if (this.__selected[mxBuilder.components.getComponent(element).getID()]) {
                this.removeFromSelection(element);
            } else {
                this.addToSelection(element);
            }
        },
        getSelection: function(exclude) {
            var out = $();
            for (var item in this.__selected) {
                out = out.add(this.__selected[item]);
            }
            return out.not(exclude);
        },
        isAllSelectedSameType: function() {
            var oldType = false;
            var currentType;
            for (var item in this.__selected) {
                currentType = mxBuilder.components.getComponent(this.__selected[item]).type;
                if (currentType !== oldType && oldType !== false) {
                    return false;
                }
                oldType = currentType;
            }
            return currentType;
        },
        isSelected: function(element) {
            var component = mxBuilder.components.getComponent($(element));
            return component && this.__selected[component.getID()] ? true : false;
        },
        updateSelectionCorners: function(instance) {
            var metrics = instance.position();
            $.extend(metrics, {
                width: instance.outerWidth(),
                height: instance.outerHeight(),
                zIndex: instance.css("zIndex")
            });
            this.updateCornerPoints(metrics);
        },
        revalidateSelectionCorners: function() {
            this.__corners = {
                x1: 100000,
                x2: 0,
                y1: 100000,
                y2: 0,
                smallestZIndex: 10000000000000
            };
            for (var item in this.__selected) {
                this.updateSelectionCorners(this.__selected[item]);
            }
        },
        revalidateSelectionContainer: function() {
            this.revalidateSelectionCorners();
            if (this.__selectionCount > 0) {
                this.__selectionContainer.show().css({
                    position: "absolute",
                    left: this.__corners.x1 - 2,
                    top: this.__corners.y1 - 2,
                    width: this.__corners.x2 - this.__corners.x1 + 4,
                    height: this.__corners.y2 - this.__corners.y1 + 4,
                    zIndex: this.__corners.smallestZIndex - 1
                });
            } else {
                this.__selectionContainer.hide();
            }
        },
        updateCornerPoints: function(obj) {
            if (obj.top < this.__corners.y1 || this.__selectionCount === 1) {
                this.__corners.y1 = obj.top;
            }
            if (obj.top + obj.height > this.__corners.y2 || this.__selectionCount === 1) {
                this.__corners.y2 = obj.top + obj.height;
            }
            if (obj.left < this.__corners.x1 || this.__selectionCount === 1) {
                this.__corners.x1 = obj.left;
            }
            if (obj.left + obj.width > this.__corners.x2 || this.__selectionCount === 1) {
                this.__corners.x2 = obj.left + obj.width;
            }
            if (obj.zIndex < this.__corners.smallestZIndex) {
                this.__corners.smallestZIndex = obj.zIndex;
            }
        },
        getSelectionCount: function() {
            return this.__selectionCount;
        },
        enableMultiComponentSelect: function(enableFlag) {
            if (enableFlag) {
                $("#editor-area").selectable({
                    distance: 2,
                    filter: ".mx-selectable-component",
                    start: function() {
                        $(this).data("current-selection", mxBuilder.selection.getSelection());
                    },
                    selected: function(event, ui) {
                        mxBuilder.selection.addToSelection(ui.selected, true);
                    },
                    unselected: function(event, ui) {
                        mxBuilder.selection.removeFromSelection(ui.unselected, false, true);
                    },
                    stop: function() {
                        var oldSelection = $(this).data("current-selection");
                        var currentSelection = mxBuilder.selection.getSelection();
                        var oldSelectionLength = oldSelection.length;
                        var currentSelectionLength = currentSelection.length;


                        if (oldSelectionLength === currentSelectionLength) {
                            var voidEvent;

                            //if both old and new selection are empty .. void the event
                            if (oldSelectionLength === 0) {
                                voidEvent = true;
                            } else {
                                var found = false;
                                var voidEvent = false;
                                for (var i = 0; i < oldSelectionLength; i++) {
                                    for (var y = 0; y < currentSelectionLength; y++) {
                                        found = false;
                                        if (oldSelection[i] === currentSelection[y]) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        break;
                                    } else if (found && i === oldSelectionLength - 1) {
                                        voidEvent = true;
                                    }
                                }
                            }
                        }

                        if (mxBuilder.systemReady && !voidEvent) {
                            $(mxBuilder.systemEvents).trigger("selectionChanged");
                        }
                    }
                });
            } else {
                var editorArea = $("#editor-area");
                if (typeof editorArea.data("selectable") !== "undefined") {
                    editorArea.selectable("destroy");
                }
            }
        },
        each: function(callback, includeSelectionContainerFlag) {
            var selection = this.getSelection();
            if (includeSelectionContainerFlag) {
                selection = selection.add(this.getSelectionContainer());
            }
            selection.each(function() {
                callback.call(mxBuilder.components.getComponent($(this)), $(this));
            });
        }
    };
}(jQuery));