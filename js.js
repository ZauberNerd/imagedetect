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

var histogramThreshold = function(v) {
	return v > 5;
};

var img = new Image();
img.onload = function() {
	var scale = 1;
	var width = Math.round(this.width * scale);
	var height = Math.round(this.height * scale);


	canvas.width = width;
	canvas.height = height;

	console.time('image');

	ctx.drawImage(this, 0, 0, width, height);
	var imageData = ctx.getImageData(0, 0, width, height);


	var threshold = 60;

	var diff;
	var value;

	var x,y,i;
	var histogramX = {};
	var histogramY = {};

	for (y = height -1; y >= 0; --y) {
		for (x = width -1; x >= 0; --x) {
			i = (x + y * width) * 4;

			diff = imageData.data[i] - ((imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3);

			value = +(diff > threshold) * 255;

			if (value) {
				histogramX[x] = (histogramX[x] || 0) + 1;
				histogramY[y] = (histogramY[y] || 0) + 1;
			}
		}
	}

	// ctx.putImageData(imageData, 0, 0);

	var threshold2 = 4;

	var cleanHX = {};
	var cleanHY = {};

	var Xfirst, Xlast;
	var Yfirst, Ylast;

	var p;

	for (p in histogramX) {
		if (histogramX[p] >= threshold2) {
			if (!Xfirst) {
				Xfirst = p;
			}
			Xlast = p;
		}
	}

	for (p in histogramY) {
		if (histogramY[p] >= threshold2) {
			if (!Yfirst) {
				Yfirst = p;
			}
			Ylast = p;
		}
	}

	ctx.strokeStyle = 'blue';
	ctx.lineWidth = 1;

	ctx.strokeRect(Xfirst, Yfirst, Xlast - Xfirst, Ylast - Yfirst);

	// Xfirst /= scale;
	// Xlast /= scale;
	// Yfirst /= scale;
	// Ylast /= scale;




	console.log(Xfirst, Xlast);
	console.log(Yfirst, Ylast);


	// for (y = height -1; y >= 0; --y) {
	// 	for (x = width -1; x >= 0; --x) {
	// 		if (histogramX[x] >= threshold2 && histogramY[y] >= threshold2) {
	// 			i = (x + y * width) * 4;
	// 			newImageData.data[i    ] = 255;
	// 			newImageData.data[i + 1] = 0;
	// 			newImageData.data[i + 2] = 255;
	// 			newImageData.data[i + 3] = 255;
	// 		}
	// 	}
	// }




	// ctx.putImageData(newImageData, 0, 0);

	// blob statistics analysis


	// -> You can calculate the centroid, area or bounding box of those blobs.

	// drawHistogram(0, imageData);
	console.timeEnd('image');
};

img.src = 'b.jpg';
