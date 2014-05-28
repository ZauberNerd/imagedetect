/* jshint node:true */
'use strict';

var Canvas  = require('canvas'),
    fs      = require('fs'),
    ImgStub = Canvas.Image,
    canvas  = new Canvas(),
    ctx     = canvas.getContext('2d');


fs.readFile(__dirname + '/b.jpg', function (err, buffer) {
    if (err) throw err;
    var img = new ImgStub();
    img.src = buffer;


    var scale  = 0.5;
    var width  = Math.round(img.width * scale);
    var height = Math.round(img.height * scale);


    canvas.width  = width;
    canvas.height = height;

    console.time('image');

    ctx.drawImage(img, 0, 0, width, height);
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

    var threshold2 = 4;

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

    Xfirst /= scale;
    Xlast  /= scale;
    Yfirst /= scale;
    Ylast  /= scale;


    console.log(Xfirst, Xlast);
    console.log(Yfirst, Ylast);


    console.timeEnd('image');
});
