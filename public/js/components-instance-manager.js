(function($) {
    mxBuilder.components = {
        _components: {},
        addComponent: function(properties) {
            //fix footer if required
            if (properties.fixFooter && properties.data.container === "footer") {
                properties.css.top = properties.css.top - mxBuilder.layout.footer.position().top;
            }

            var component = new mxBuilder[properties.data.type](properties);
            var guid = component.getID();

            mxBuilder.zIndexManager.addComponent(component);

            mxBuilder.pages.attachComponentToPage(component);
            this._components[guid] = component;
            if (typeof properties.data.container !== "undefined") {
                component.setContainer(properties.data.container);
            }
            //adding a component on this same page !? if not cache it on the specified page if it's available
            var page = properties.data.page;
            var pageObj = mxBuilder.pages.getPageObj(page);
            if (page && pageObj && !mxBuilder.pages.isCurrentPage(page) && (typeof properties.forceKeep === "undefined" || !properties.forceKeep)) {
                pageObj.components[component.getID()] = component.save();
                component.archive();
            } else {
                delete properties.forceKeep;
                this._components[guid].element.trigger("componentInit");
                return this._components[guid];
            }
        },
        getComponent: function(obj) {
            if (typeof obj === "string") {
                return this._components[obj];
            } else if (typeof obj === "object") {
                obj = $(obj);
                return this._components[mxBuilder.utils.getElementGUID(obj)];
            }
        },
        getComponentsByAssetID: function(assetID) {
            var out = {};
            for (var c in this._components) {
                if (this._components[c].type === "ImageComponent" && this._components[c].extra.originalAssetID == assetID) {
                    out[c] = this._components[c];
                }
            }
            return out;
        },
        getComponentsByType: function(type) {
            var out = {};
            for (var c in this._components) {
                if (this._components[c].type === type) {
                    out[c] = this._components[c];
                }
            }
            return out;
        },
        getComponents: function(jQueryObj) {
            if (typeof jQueryObj !== "undefined" && jQueryObj.length !== 0) {
                var out = {};
                jQueryObj.each(function() {
                    var cmp = mxBuilder.components.getComponent(this);
                    if (typeof cmp !== "undefined") {
                        out[cmp.getID()] = cmp;
                    }
                });
            } else {
                out = this._components;
            }
            return out;
        },
        removeComponent: function(instance) {
            var id = mxBuilder.utils.getElementGUID(instance);
            mxBuilder.zIndexManager.removeComponent(this._components[id]);
            delete this._components[id];
        },
        getNextZIndex: function() {
            return this.__zIndex++;
        },
        swapZIndexs: function(cp1, cp2) {
            var zIndex1 = cp1.element.css("zIndex");
            var zIndex2 = cp2.element.css("zIndex");
            cp1.element.css("zIndex", zIndex2);
            cp2.element.css("zIndex", zIndex1);
        },
        moveZ: function(id, moveUpFlag) {
            var component = this._components[id];
            var currentZIndex = component.element.css("zIndex");
            var factor = moveUpFlag ? 1 : -1;
            var adjacentComponent = this.getComponentAtZIndex(currentZIndex + factor);
            if (adjacentComponent) {
                this.swapComponentZIndex(adjacentComponent, component);
            } else {
                component.element.css("zIndex", currentZIndex + factor);
            }
        },
        moveZTop: function(id) {
            this._components[id].element.css("zIndex", this.getNextZIndex());
        },
        moveZBottom: function(id) {
            this._components[id].element.css("zIndex", --this.__lowestZIndex);
        },
        detectCollision: function(components, collisionMargin, list) {
            //preping the list if we do not have it already
            if (!list) {
                list = {};
                $.extend(list, this._components);
                for (var c in components) {
                    delete list[components[c].getID()];
                }
            }

            var out = {};
            //looping through the components
            var foundOne = false;
            for (c in components) {
                //checking for collisions
                var metrics = components[c].getMetrics();
                for (var i in list) {
                    var listMetrics = list[i].getMetrics();

                    //Calculating collisions
                    //checking same container
                    var sameContainer = metrics.container === listMetrics.container;
                    //checking vertical collision
                    var verticalCollision = metrics.bottom + collisionMargin >= listMetrics.top && metrics.bottom < listMetrics.top;
                    //collides from the left only
                    //      ____ metrics
                    //    ____   listMetrics
                    var horizontalCollision = metrics.left <= listMetrics.right && metrics.left > listMetrics.left;
                    //collides from the right only
                    //    _____    metrics
                    //       _____ listMetrics
                    horizontalCollision = horizontalCollision || (metrics.right >= listMetrics.left && metrics.right < listMetrics.right);
                    //metrics contains the list
                    //    ________ metrics
                    //      ____   listMetrics
                    horizontalCollision = horizontalCollision || (metrics.right >= listMetrics.right && metrics.left <= listMetrics.left);
                    //list contains the metrics
                    //    ________ listMetrics
                    //      ____   metrics
                    horizontalCollision = horizontalCollision || (metrics.right <= listMetrics.right && metrics.left >= listMetrics.left);

                    if (sameContainer && verticalCollision && horizontalCollision) {
                        out[i] = list[i];
                        delete list[i];
                        foundOne = true;
                    }
                }
            }
            //if we found a single other collision we recurse !            
            if (foundOne) {
                var detected = this.detectCollision(out, 20, list);
                if (detected) {
                    $.extend(out, detected);
                }
                return out;
            } else {
                return false;
            }
        },
        saveAll: function() {
            var out = [];
            for (var c in this._components) {
                out.push(this._components[c].save());
            }
            return out;
        },
        clearAndRestore: function(components) {
            //clearing unwanted components
            for (var i in this._components) {
                if (components[i]) {
                    continue;
                }
                this._components[i].archive();
            }

            //restoring components
            for (i in components) {
                if (components[i].data.trashed || typeof this._components[i] !== "undefined") {
                    continue;
                }
                this.addComponent(components[i]);
            }
        },
        each: function(callback) {
            for (var c in this._components) {
                if (this._components.hasOwnProperty(c)) {
                    callback.call(this._components[c]);
                }
            }
        }
    };
}(jQuery));