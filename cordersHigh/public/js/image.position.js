(function() {
    'use strict';



    /**
     *
     *  This is image position set class
     *  @config.listContainerId = list's Container block.
     *  @config.listTag = list tagName
     *
     */
    var Position = (function() {

        function Position(config) {
            this.$items = $('#' + config.listContainerId);
            this.$item = this.$items.find(config.listTag);
        }

        Position.prototype.init = function() {
            var self = this;

            $(window).on('resize load', function() {
                self.setEvent();
            });
        };

        Position.prototype.setEvent = function() {
            var self = this;

            this.$item.each(function() {
                self.setPosition(this);
            });
        };

        Position.prototype.setPosition = function(self) {
            var $this = $(self),
                $img = $this.find('img'),
                $imgParent = $img.parent(),
                imgH = $img.height(),
                imgRatio = $img.width() / imgH,
                parentW = $imgParent.width(),
                parentH = $imgParent.height(),
                parentRatio = parentW / parentH;

            if (imgRatio > parentRatio) {
                $img
                    .width('auto')
                    .height('100%');
                $img.css({
                    'margin-left': (parentW - $img.width()) / 2
                })
            } else {
                $img
                    .width('100%')
                    .height('auto');
                $img.css({
                    'margin-top': (parentH - $img.height()) / 2
                })
            }

            if (!$this.hasClass('is-visible')) {
                $this.addClass('is-visible');
            }

        };

        return Position;
    })();


    /**
     *
     * This is DOMContentLoaded event on jQuery
     * Created Position instance
     *
     */
    $(function() {

        var eventListPosition = new Position({
            listContainerId: 'jsEventItems',
            listTag: 'li'
        });
        eventListPosition.init();
    })
})();