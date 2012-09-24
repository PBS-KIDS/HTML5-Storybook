//  ------------------------------------------------------------------
//  sprite.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.sprite = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		element,
		resource = options && options.resource,
		ctx,
		initialized = false,
		spec = {},
		curFrame = 0,
		frameDelay = options.frameDelay || 1,
		loop = options.loop,
		parentElement = options && options.parentElement,
		paused = false,
		parentWidthRatio = 1,
		
		onImageloaded = function () {

			var width;
			
			if (!initialized) {
			
				initialized = true;
	
				that.width = resource.image.width;
				that.height = resource.image.height;
				
				element.style.left = that.x + "%";
				element.style.top = that.y + "%";
				
				element.width = options.numFrames ? (that.width / options.numFrames) : that.width;
				element.height = that.height;
				
				// Scale sprite if the parent is scaled
				if (options.parentWidth) {
					parentWidthRatio = (element.width / options.parentWidth);
					element.style.width = (parentWidthRatio * 100) + "%";
					element.style.height = "auto";
					//element.style.height = that.height * element.offsetWidth / element.width + "px";
				}
				
				that.dirty = true;
			}
		};
		
	spec.width = 100 + "px";
	spec.height = 100 + "px";
	spec.parentElement = parentElement;
	spec.className = "pbsCanvas pbsSprite";
	if (options && options.className) {	
		spec.className += " " + options.className
	}
	ctx = PBS.createCanvas(spec);
	
	// Inherit the view
	that = PBS.view(PBS, ctx.canvas);
	element = that.getElement();
	
	that.dirty = false;
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width;
	that.height;
	that.visible = true;
	that.alpha;
	that.destroyed = false;
	that.url = options && options.url;
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
		
	that.update = function () {
		
		var previousCurFrame;
		
		if (options.numFrames && !paused) {
		
			previousCurFrame = Math.floor(curFrame / frameDelay) ;

			// If the next frame is greater than the number of frame times the delay
			if (curFrame + 1 >= options.numFrames * frameDelay) {
				if (loop) {
					curFrame = 0;
				} else if (that.autoReset) {
					if (curFrame + 1 >= (options.numFrames + 1) * frameDelay) {
						curFrame += 1;
					} else {
						curFrame = 0;
						that.stop();
					}
				}
			} else {
				curFrame += 1;
			}
			
			if (previousCurFrame !== Math.floor(curFrame / frameDelay)) {
				
				that.dirty = true;
			} 
		}
	};
	
	that.render = function () {
	
		var curAlpha;
		
		if (initialized) {
	
			if (that.dirty) {
	
				if (that.visible) {
				
					curAlpha = ctx.globalAlpha;
					ctx.globalAlpha = that.alpha;
	
					if (options.numFrames) {
						ctx.clearRect(0, 0, that.width / options.numFrames, that.height);
						ctx.drawImage(
							resource.image,
							Math.floor(curFrame / frameDelay) * that.width / options.numFrames,
							0,
							that.width / options.numFrames, 
							that.height,
							0,
							0, 
							that.width / options.numFrames,
							that.height
						);
					} else {
						ctx.drawImage(resource.image, 0, 0);
						
					}
					ctx.globalAlpha = curAlpha;
				} else {
					
					if (options.numFrames) {
						ctx.clearRect(0, 0, that.width / options.numFrames, that.height);
					} else {
						ctx.clearRect(0, 0, that.width, that.height);
					}
				}
				that.dirty = false;
			}
		}
	};
	
	that.destroy = function () {
	
		that.destroyed = true;
		
		element = null;
		that = null;
	};
	
	that.play = function () {
	
		that.reset();
		
		paused = false;
	};
	
	that.resume = function () {
	
		paused = false;
		that.dirty = true;
	};
	
	that.stop = function () {
	
		paused = true;	
	};
	
	that.reset = function () {
	
		if (curFrame !== 0) {
			curFrame = 0;
			that.dirty = true;
			
			that.stop();
		}
	};
	
	that.press = function () {
	
		if (options.playOnPress) {
			that.play();
		} else if (options.stopOnPress) {
			that.stop();
		} else if (options.toggleOnPress) {
			if (paused) {
				that.resume();
			} else {
				that.stop();
			}
		}
	};
	
	// Listen to when the image is loaded
	resource.image.addEventListener("load", onImageloaded);
	
	// Listen to when the sprite is touched or clicked
	that.addEventListener("PRESS", that.press);
	
	if (that.autoStart === false) {
		paused = true;
	}

	return that;
};