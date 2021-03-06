'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Squarify = (function () {
  function Squarify(params) {
    _classCallCheck(this, Squarify);

    var width = params.width;
    var height = params.height;
    var saved = params.saved;

    this.width = width || 250;
    this.height = height || 250;
    this.el = document.querySelector('.squarify');
    this.lastPos = { x: 0, y: 0 };
    this.saved = saved;
    this.initializeCanvas();
    this.initializeEvents();
  }

  _createClass(Squarify, [{
    key: 'initializeCanvas',
    value: function initializeCanvas() {
      var width = this.width;
      var height = this.height;
      var el = this.el;

      var pxWidth = width + 'px';
      var pxHeight = height + 'px';

      el.style.width = pxWidth;
      el.style.height = pxHeight;

      var imageContainerEl = this.imageContainerEl = document.createElement('div');
      imageContainerEl.className = 'squarify-img-container -cropped';
      imageContainerEl.style.width = pxWidth;
      imageContainerEl.style.height = pxHeight;
      el.appendChild(imageContainerEl);

      var imageContainerFadedEl = this.imageContainerFadedEl = document.createElement('div');
      imageContainerFadedEl.className = 'squarify-img-container -faded';
      imageContainerFadedEl.style.width = pxWidth;
      imageContainerFadedEl.style.height = pxHeight;
      el.appendChild(imageContainerFadedEl);

      var canvasEl = this.canvasEl = document.createElement('canvas');
      canvasEl.width = width;
      canvasEl.height = height;
      el.appendChild(canvasEl);
    }
  }, {
    key: 'initializeEvents',
    value: function initializeEvents() {
      var _this = this;

      var el = this.el;

      el.addEventListener('mousedown', function (e) {
        if (!_this.hasImage) {
          return false;
        }
        e.preventDefault();
        _this.isDragging = true;
        _this.lastPos = { x: e.clientX - _this.image.offsetLeft, y: e.clientY - _this.image.offsetTop };
        _this.stopDrag = function () {
          _this.isDragging = false;
          _this.capture();
          document.body.onmouseup = false;
          document.body.removeEventListener('mouseup', _this.stopDrag);
          return false;
        };
        document.body.addEventListener('mouseup', _this.stopDrag);
      });

      el.addEventListener('mousemove', function (e) {
        var image = _this.image;
        var imageFaded = _this.imageFaded;

        if (!_this.hasImage || !_this.isDragging) {
          return false;
        }

        if (_this.isLandscape) {
          var posY = e.clientY;
          posY -= _this.lastPos.y;
          if (posY > 0) {
            posY = 0;
          } else if (posY < _this.height - image.height) {
            posY = _this.height - image.height;
          }
          image.style.top = imageFaded.style.top = posY + 'px';
        } else {
          var posX = e.clientX;
          posX -= _this.lastPos.x;
          if (posX > 0) {
            posX = 0;
          } else if (posX < _this.width - image.width) {
            posX = _this.width - image.width;
          }
          image.style.left = imageFaded.style.left = posX + 'px';
        }
      });

      el.addEventListener('dragover', function (e) {
        e.preventDefault();
      }, false);

      el.addEventListener('dragend', function (e) {
        e.preventDefault();
      }, false);

      el.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
          _this.fileDropped(e.dataTransfer.files[0]);
        }
      }, false);
    }
  }, {
    key: 'fileDropped',
    value: function fileDropped(dataFile) {
      var _this2 = this;

      var file = dataFile;
      var reader = new FileReader();
      var imageContainerFadedEl = this.imageContainerFadedEl;
      var imageContainerEl = this.imageContainerEl;

      reader.onload = function (e) {
        _this2.hasImage = true;
        var url = e.target.result;
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          _this2.isLandscape = img.width < img.height;
          var append = _this2.isLandscape ? 'width="' + _this2.width + '"' : 'height="' + _this2.height + '"';
          imageContainerEl.innerHTML = '<img src="' + url + '" ' + append + '>';
          imageContainerFadedEl.innerHTML = '<img src="' + url + '" ' + append + '>';
          _this2.image = imageContainerEl.querySelector('img');
          _this2.imageFaded = imageContainerFadedEl.querySelector('img');
          _this2.capture();
        };
      };

      reader.readAsDataURL(file);
    }
  }, {
    key: 'capture',
    value: function capture() {
      var canvasEl = this.canvasEl;
      var image = this.image;

      var ctx = canvasEl.getContext('2d');
      ctx.drawImage(image, image.offsetLeft, image.offsetTop, image.width, image.height);
      if ('function' === typeof this.saved) {
        this.saved(canvasEl.toDataURL());
      }
    }
  }, {
    key: 'hasImage',
    get: function get() {
      return this._hasImage;
    },
    set: function set(val) {
      this._hasImage = val;
      this.el.classList.add('-has-image');
    }
  }]);

  return Squarify;
})();

window.squarify = function (params) {
  return new Squarify(params || {});
};
