'use strict';

var self;
var _pixels;
var _grayArray = [];
var _w;
var _h;
var _position = [0,0];
function Edge(){
    self = this;
}
Edge.prototype.edge = function () {
  
}
Edge.prototype.draw = function (pixels,width,height) {
    self._pixels = pixels;
    self._w = width;
    self._h = height;
    self.grayImage();
    //self.convolution();
    //self.blur();
    return self._pixels;
}
Edge.prototype.grayImage = function () {
    var w = self._w,
      h = self._h,
      i = 0,
      l = w * h,
      v = 0;
    var r,g,b;
    self._grayArray = [];
    for (i; i < l; i++) {
        r = self._pixels[i * 4];
        g = self._pixels[i * 4+1];
        b = self._pixels[i * 4+2];
        if(Math.abs(r-b)<40&&Math.abs(g-b)<40){
            v = 0;
        }else if(Math.abs(r-b)>90&&Math.abs(r-g)>90){
            v = 255;
        }else{
            v = 0;
        }
        //v = v>100?0:(v>40?v*2:0);
        self._pixels[i * 4] = v;
        self._pixels[i * 4 + 1] = v;
        self._pixels[i * 4 + 2] = v;
        self._grayArray[i] = v;
    }
}
Edge.prototype.blur = function() {
    var w = self._w;
    var h = self._h;
    var r = 0, g = 1, b = 2, alpha = 3;
    var temp = [];
    var r_max = 15.5/2;
    var r_min = r_max-1;
    var radiusNum = 9;
    var pi = 3.14159*2/radiusNum;
    var x,y,r_an,r_x,r_y,r_cur,convpixel,pixel,ang;
    var max_c = 0;
    for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
            pixel = (y*w + x);
            temp[pixel] = 0;
        }
    }
    for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
            pixel = (y*w + x);
            if(self._grayArray[pixel]<250){
                continue;
            }
            for(r_cur=r_min;r_cur<r_max;r_cur++) {
                for(ang=0;ang<radiusNum;ang++) {
                    r_an = ang*pi;
                    r_x = Math.floor(r_cur*Math.sin(r_an));
                    r_y = Math.floor(r_cur*Math.cos(r_an));
                    convpixel = ((y+r_x) * w + (x+r_y));
                    temp[convpixel]+=(self._grayArray[pixel]>200?1:0);
                }
            }
        }
    }
    for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
            pixel = (y*w + x);
            if(max_c < temp[pixel]){
                max_c = temp[pixel];
            }
        }
    }
    var scaleLight = 255/max_c;
    for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
            pixel = (y*w + x);
            temp[pixel] = temp[pixel]*scaleLight;
            /*if(temp[pixel]<120){
                //temp[pixel] = 0;
            }else{
                
            }*/
            if(temp[pixel]>=254){
                self._position = [x,y];
            }
            self._pixels[pixel*4+r] = 0;//temp[pixel];
            self._pixels[pixel*4+g] = temp[pixel];
            self._pixels[pixel*4+b] = 0;//temp[pixel];
            //self._pixels[pixel*4+3] = temp[pixel];
        }
    }
}
Edge.prototype.position = function(){
    return self._position;
}
Edge.prototype.convolution = function() {
    var mask = [[ 0, 1, 0],
                [ 1,-4, 1],
                [ 0, 1, 0]];
    var maskhalf = Math.floor(mask.length / 2);
    var w = self._w;
    var h = self._h;
    var r = 0, g = 1, b = 2, alpha = 3;
    var temp = [];
    for(var y = 0; y < h; y++) {
        for(var x = 0; x < w; x++) {
            temp[y*w + x] = 0;
        }
    }
    for( y = 0; y < h; y++) {
        for( x = 0; x < w; x++) {
            var pixel = (y*w + x);
            var sumr = 0, sumg = 0, sumb = 0;
            for(var masky in mask) {
                for(var maskx in mask[masky]) {
                    var convpixel = ((y+(masky-maskhalf)) * w + (x+(maskx-maskhalf)));
                    sumr += self._grayArray[convpixel] * mask[masky][maskx];
                }
            }
            temp[pixel] = sumr; 
            self._pixels[pixel*4+r] = temp[pixel];
            self._pixels[pixel*4+g] = temp[pixel];
            self._pixels[pixel*4+b] = temp[pixel];
        }
    }
    for( y = 0; y < h; y++) {
        for( x = 0; x < w; x++) {
            var pixel = (y*w + x);
            self._grayArray[pixel] = temp[pixel];
        }
    }
}
exports.Edge = Edge;