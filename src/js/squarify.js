class Squarify {
  constructor(params) {
    let { width, height, saved} = params;
    this.width = width || 250;
    this.height = height || 250;
    this.el = document.querySelector('.squarify');
    this.lastPos = { x: 0, y: 0 };
    this.saved = saved;
    this.initializeCanvas();
    this.initializeEvents();
  }

  initializeCanvas() {
    const { width, height, el } = this;
    const pxWidth = `${width}px`;
    const pxHeight = `${height}px`;
    el.style.width = pxWidth;
    el.style.height = pxHeight;

    const imageContainerEl = this.imageContainerEl = document.createElement('div');
    imageContainerEl.className = 'squarify-img-container';
    imageContainerEl.style.width = pxWidth;
    imageContainerEl.style.height = pxHeight;
    el.appendChild(imageContainerEl);

    const imageContainerFadedEl= this.imageContainerFadedEl = document.createElement('div');
    imageContainerFadedEl.className = 'squarify-img-container -faded';
    imageContainerFadedEl.style.width = pxWidth;
    imageContainerFadedEl.style.height = pxHeight;
    el.appendChild(imageContainerFadedEl);

    const canvasEl = this.canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    el.appendChild(canvasEl);
  }

  initializeEvents() {
    const { el } = this;

    el.addEventListener('mousedown', e => {
      e.preventDefault();
      this.isDragging = true;
      this.lastPos = { x: e.clientX - this.image.offsetLeft, y: e.clientY - this.image.offsetTop };
      this.stopDrag = (e) => {
        this.isDragging = false;
        this.capture();
        document.body.onmouseup = false;
        document.body.removeEventListener('mouseup', this.stopDrag);
        return false;
      };
      document.body.addEventListener('mouseup', this.stopDrag);
    });

    el.addEventListener('mousemove', e => {
      const { image, imageFaded } = this;
      if (!this.isDragging) { return false; }

      if (this.isLandscape) {
        let posY = e.clientY;
        posY -= this.lastPos.y;
        if (posY > 0) {
          posY = 0;
        } else if (posY < this.height - image.height) {
          posY = this.height - image.height;
        }
        image.style.top = imageFaded.style.top = posY;
      } else {
        let posX = e.clientX;
        posX -= this.lastPos.x;
        if (posX > 0) {
          posX = 0;
        } else if (posX < this.width - image.width) {
          posX = this.width - image.width;
        }
        image.style.left = imageFaded.style.left = posX;
      }
    });

    el.addEventListener('dragover', e => {
      e.preventDefault();
    }, false);

    el.addEventListener('dragend', e => {
      e.preventDefault();
    }, false);

    el.addEventListener('drop', e => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        this.fileDropped(e.dataTransfer.files[0]);
      }
    }, false);
  }

  fileDropped(dataFile) {
    const file = dataFile;
    const reader = new FileReader();
    const { imageContainerFadedEl, imageContainerEl } = this;
    reader.onload = (e) => {
      this.hasImage = true;
      let url = e.target.result;
      const img = new Image();
      img.src = e.target.result;
      img.onload = (e) => {
        this.isLandscape = img.width < img.height;
        let append = this.isLandscape ? `width="${this.width}"` : `height="${this.height}"`;
        imageContainerEl.innerHTML = `<img src="${url}" ${append}>`;
        imageContainerFadedEl.innerHTML = `<img src="${url}" ${append}>`;
        this.image = imageContainerEl.querySelector('img');
        this.imageFaded = imageContainerFadedEl.querySelector('img');
        this.capture();
      };

    };

    reader.readAsDataURL(file);
  }

  capture() {
    const { canvasEl, image } = this;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(image, image.offsetLeft, image.offsetTop, image.width, image.height);
    if ('function' === typeof this.saved) {
      this.saved(canvasEl.toDataURL());
    }
  }
}

window.squarify = (params) => {
  return new Squarify(params || {});
};
