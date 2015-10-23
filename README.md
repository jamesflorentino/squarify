# Squarify

![Preview](https://raw.githubusercontent.com/jamesflorentino/squarify/master/preview.png)

A widget for cropping images into square photos.

This is a very straightforward and lightweight tool for cropping images and turning them into square photos similar to what you'd find in Instagram.

# Sample Code

Basic Usage

```html
<link rel="stylesheet" href="squarify.css">
<script src="squarify.js"></script>
<div class="squarify"></div>

<script>
  squarify();
</script>
```

Set custom width and height

```javascript
squarify({ width: 500, height: 500 });
```

Catch dataURL

```javascript
squarify({
  save(dataURL) {
   // process and save to S3
  }
});
```

# Options

### width

Set the width of the widget.

### height

Set the height of the widget.

### save

Callback function for catching the dataURL

# Acknowledgement

James Florentino

# License

MIT
