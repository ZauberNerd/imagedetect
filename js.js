var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

// channel: red=0;green=1;blue=2;alpha=3
var getHistogram = function(channel, imageData) {
	var i;
	var hex;
	var width = imageData.width;
	var height = imageData.height;
	var data = imageData.data;

	var histogram = [
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
	];

	for (
		i = (width * height * 4) - 1 - (3 - channel);
		i >= 0;
		i -= 4
	) {
		hex = data[i];
		histogram[hex] += 1;
	}

	return histogram;
};

var drawHistogram = function(channel, imageData) {
	var ca = document.createElement('canvas');
	var cx = ca.getContext('2d');

	var histogram = getHistogram(channel, imageData);

	var maxValue = Math.max.apply(null, histogram);

	var xScale = 3;
	var yScale = 300;
	var topOffset = 20;

	ca.width = 256 * xScale;
	ca.height = yScale + topOffset;

	cx.fillStyle = 'black';

	var channelText = ['red', 'green', 'blue', 'alpha'];

	// render text
	cx.textBaseline = 'top';
	cx.font = '16px Arial';
	cx.fillText('histogram of channel: ' + channelText[channel], 0, 0);

	// render histogram
	var height;
	for (var i = 255; i >= 0; --i) {
		height = histogram[i] / maxValue * yScale;
		cx.fillRect(xScale * i, yScale + topOffset - height, xScale - 1, height);
	}

	document.body.appendChild(ca);
};

var findBall = function() {
	return {
		x: 50,
		y: 50
	};
};


var img = new Image();
img.onload = function() {
	var scale = 0.5;
	var width = this.width * scale;
	var height = this.height * scale;


	canvas.width = width;
	canvas.height = height;

	console.time('image');

	ctx.drawImage(this, 0, 0, width, height);
	var imageData = ctx.getImageData(0, 0, width, height);

	var threshold = 60;

	var diff;
	var value;
	for (
		i = (imageData.width * imageData.height * 4) - 1 - 3;
		i >= 0;
		i -= 4
	) {
		// get red layer and subtract gray layer
		diff = Math.min(Math.max(imageData.data[i] - ((imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3), 0), 255);

		// binary image with threshold
		value = +(diff > threshold) * 255;

		imageData.data[i    ] = value;
		imageData.data[i + 1] = value;
		imageData.data[i + 2] = value;
	}

	ctx.putImageData(imageData, 0, 0);

	var pos = findBall(imageData.data);
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 1;
	ctx.strokeRect(pos.x - 5, pos.y - 5, 10, 10);


	// blob statistics analysis


	// -> You can calculate the centroid, area or bounding box of those blobs.

	// drawHistogram(0, imageData);
	console.timeEnd('image');
};

img.src = 'b.jpg';
