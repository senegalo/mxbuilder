(function($) {
    mxBuilder.recorder = {
        _lastState: null,
        _forceSave: false,
        _saving: false,
        _queue: [],
        saveIfRequired: function() {
            var savedObj = mxBuilder.pages.saveAll();
            var currentState = JSON.stringify(savedObj);
            if (this._forceSave || (this._lastState !== null && this._lastState !== currentState)) {
                this.save(currentState);
            }
            this._forceSave = false;
            this._lastState = currentState;
        },
        save: function save(str) {
            if (!this._saving) {
                this._saving = true;
                this.tooltip.text("Saving...").show();
                var that = this;
                mxBuilder.api.website.save({
                    websiteData: str,
                    success: function(data) {
                        mxBuilder.recorder.tooltip.text("Saved Successfully...");
                        setTimeout(function() {
                            mxBuilder.recorder.tooltip.hide();
                        }, 2000);
                    },
                    complete: function() {
                        that._saving = false;
                        if (that._queue.length > 0) {
                            that.save(that._queue.splice(0, 1)[0]);
                        }
                    }
                });
            } else {
                this._queue.push(str);
            }
        },
        setLastState: function setLastState(lastState) {
            this._lastState = JSON.stringify(lastState);
        },
        forceSave: function forceSave() {
            this._forceSave = true;
        }
    };

    $(function() {
        mxBuilder.recorder.tooltip = mxBuilder.layout.templates.find(".save-tooltip").remove().appendTo(mxBuilder.layout.selectionSafe);
    });
}(jQuery));