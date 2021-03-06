/**
 * Gile v1.1.0
 * Usage: http://ttacon.github.io/gile
 * GitHub: http://github.com/ttacon/gile
 */

;(function($, window, document, undefined) {
  var defaults = {
    defaultButtonLabel: 'Choose file',
    buttonClass: 'gile-btn-default',
    buttonSelectedClass: 'gile-btn-selected',
    onChange: function() {},
    onClick: function() {},
    onCancel: function() {
      this.reset();
    }
  };

  /**
   * @constructor
   */
  var Gile = function(elem, options) {
    this.elem = elem;
    this.$elem = $(elem);

    this.options = $.extend({}, defaults, options);

    this._init();
  };

  /**
   * Build out our Gile prototype and methods.
   */
  Gile.prototype = {
    constructor: Gile,

    /**
     * Initialize the Gile html that will wrap our file input.
     */
    _init: function() {
      this._createButton();
      this._bindButton();
    },

    /**
     * Create the html we need and position it appropriately.
     */
    _createButton: function() {
      this.$parent = $('<div/>');
      this.$parent.addClass('gile-parent');
      this.$label = $('<span/>');
      this.$label.addClass(this.options.buttonClass);

      this.fileInput = this.$elem.wrap(this.$parent);
      this.$parent = this.$elem.parent();
      this.$parent.before(this.$label);
      this.$label = this.$parent.siblings().filter('.' + this.options.buttonClass);
      this.$label.text(this.$elem.val());

      this.lastFileName = this.options.defaultButtonLabel;
      this.lastFile = {};
    },


    /**
     * Bind our label to our file input.
     */
    _bindButton: function() {
      // Bind our label so that any click on it triggers the file input.
      this.$label.click(function() {
        $(this).next().children().filter('input[type="file"]').click();
      }).show();

      // When the file input changes, remove the 'fakepath' modern browsers prepend.
      this.fileInput.change(function() {
        $(this).data('gile').updateVal(this);
      });

      this.$label.text(this.options.defaultButtonLabel);
    },

    /**
     * Do the click action!
     */
    doClick: function() {
      this.onClick();
    },

    /**
     * Updates the value gile knows of.
     */
    updateVal: function(fileInput) {
      var fileName = fileInput.value;
      if (!fileName) {
        this.options.onCancel.call(this);
        return;
      }

      this.$label.text(fileName.replace('C:\\fakepath\\', ''))
        .removeClass(this.options.buttonClass)
        .addClass(this.options.buttonSelectedClass);
      this.lastFileName = this.$label.text();
      this.lastFile = fileInput.files[0];
      this.options.onChange(fileName, this.lastFile);
    },

    /**
     * Reset the value on the label/button.
     */
    reset: function() {
      this.$label.text(this.lastFileName);
    },

    /**
     * Retreive the value of the file input. If a user hit cancel on the
     * choose file dialogue, the input's value will be "" but this function
     * will return the last chosen file, if any.
     */
    val: function() {
      return this.lastFileName;
	},

    /**
     * Retrieves the last selected file object.
     */
    file: function() {
      return this.lastFile;
    }
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