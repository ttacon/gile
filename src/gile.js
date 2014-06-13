/**
 * Gile v1.1.0
 * Usage: http://ttacon.github.io/gile
 * GitHub: http://github.com/ttacon/gile
 */

;(function($, window, document, undefined) {
  /**
   * @constructor
   */
  var Gile = function(elem, options) {
    this.elem = elem;
    this.$elem = $(elem);
	this.$parent = $('<div/>');
	this.$parent.addClass('gile-parent');
	this.$label = $('<span/>');
	this.$label.addClass('gile-label');

	this.fileInput = this.$elem.wrap(this.$parent);
	this.$parent = this.$elem.parent();
	this.$parent.before(this.$label);
	this.$label = this.$parent.siblings().filter('.gile-label');
	this.$label.text(this.$elem.val());
	this.$label.click(function() {
		$(this).next().children().filter('input[type="file"]').click();
	}).show();
	this.fileInput.change(function() {
			$(this).parent().prev().text(this.value.replace('C:\\fakepath\\', ''));
	});
	this.$label.text('Choose file');
  };


  /**
   * Simple jQuery API for Gile
   */
  $.fn.gile = function(options) {
    var args = arguments,
        that = this;

    return this.each(function(index) {
      // Tries to get the instance of gile that is referenced by the node
      var gile = $.data(this, 'gile');

      // If there's no gile instance, assume we're initializing
      if (!gile) {
        $.data(this, 'gile', new Gile(this, options));

        // Broadcast a "we're finished loading" event
        if (index === that.length - 1) {
          $(this).trigger('ready.Gile');
        }
      } else {
        // Otherwise, access our public API (if viable)
        if (typeof options === 'string' &&
            typeof gile[options] === 'function') {
          gile[options].apply(gile, Array.prototype.slice.call(args, 1));
        }
      }
    });
  };
})(jQuery, window, document);