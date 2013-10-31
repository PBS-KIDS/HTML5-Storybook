//  ------------------------------------------------------------------
//  sprite.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.sprite = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		element,
		resource = (options && options.resource !== undefined) ? options.resource : undefined,
		ctx,
		initialized = false,
		spec = {},
		curFrame = 0,
		frameWidth,
		frameHeight,
		frameDelay = options.frameDelay || 1,
		loop = options.loop,
		parentElement = options && options.parentElement,
		paused = false,
		parentWidthRatio = 1,
		parentHeightRatio = 1,
		backgroundColor = options.color,
		horizontalAlign = (options && options.horizontalAlign !== undefined) ? options.horizontalAlign.toUpperCase() : "LEFT",
		verticalAlign = (options && options.verticalAlign !== undefined) ? options.verticalAlign.toUpperCase() : "TOP",
		
		resourcesReady = function () {

			var width;
			
			if (!initialized) {
			
				initialized = true;
				
				// Set the position of the sprite relative to the left or right
				if (horizontalAlign === "RIGHT") {
					element.style.right = that.x + "%";
				} else {
					element.style.left = that.x + "%";
				}
				
				// Set the position of the sprite relative to the top or bottom
				if (verticalAlign === "BOTTOM") {
					element.style.bottom = that.y + "%"; 
				} else {
					element.style.top = that.y + "%";
				}
	
				// If the sprite has an image
				if (resource && resource.image) {
					that.width = resource.image.width;
					that.height = resource.image.height;
				} else {
					that.width = 100;
					that.height = 100;
				}
				
				// Determine the dimensions of the frame. It may be different from the image dimensions if more than one frame
				frameWidth = options.numFrames ? (that.width / options.numFrames) : that.width;
				frameHeight = that.height;
				
				// Set the dimensions of the element
				element.width = frameWidth;
				element.height = frameHeight;
				
				// If the width was specified
				if (options.width) {
					// If px is in the width (e.g. 100px)
					if (options.width.toString().indexOf("px") !== -1) {
						element.style.width = options.width;
					} else {
						element.style.width = options.width + "%";
					}
				// Scale sprite if the parent is scaled
				} else if (options.parentWidth) {
					parentWidthRatio = (element.width / options.parentWidth);
					element.style.width = (parentWidthRatio * 100) + "%";
				}
				
				// If the width was specified
				if (options.height) {
					// If px is in the width (e.g. 100px)
					if (options.height.toString().indexOf("px") !== -1) {
						element.style.height = options.height;
					} else {
						element.style.height = options.height + "%";
					}
				// Scale sprite if the parent is scaled
				} else if (options.parentHeight) {
					parentHeightRatio = (element.height / options.parentHeight);
					element.style.height = (parentHeightRatio * 100) + "%";
				}

				that.dirty = true;
			}
		};
		
	spec.width = 100 + "px";
	spec.height = 100 + "px";
	spec.className = "pbsCanvas pbsSprite";
	if (options && options.className) {	
		spec.className += " " + options.className
	}
	ctx = PBS.KIDS.storybook.createCanvas(parentElement, spec);
	
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, ctx.canvas);
	element = that.getElement();
	
	that.dirty = false;
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 0;
	that.height = options && (options.height !== undefined) ? options.height : 0;
	that.visible = true;
	that.alpha;
	that.destroyed = false;
	that.url = options && options.url;
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
		
	that.update = function () {
		
		var previousCurFrame;
		
// TODO: Move the height assignment so it updates only when the parent height changes
//element.style.height = element.offsetWidth / element.width + "%";
		
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
	
				// If the sprite is visible
				if (that.visible) {

				
					curAlpha = ctx.globalAlpha;
					ctx.globalAlpha = that.alpha;
					
					// If page background color
					if (backgroundColor) {

						// Draw the background color
						ctx.fillStyle = backgroundColor;
						ctx.fillRect(0, 0, frameWidth, frameHeight);
					}
					
					// If the sprite has an image
					if (resource && resource.image) {
	
						// If the sprite is an animation
						if (options.numFrames) {
							ctx.clearRect(0, 0, frameWidth, frameHeight);
							ctx.drawImage(
								resource.image,
								Math.floor(curFrame / frameDelay) * frameWidth,
								0,
								frameWidth, 
								frameHeight,
								0,
								0, 
								frameWidth,
								frameHeight
							);
						} else {
							ctx.drawImage(resource.image, 0, 0, frameWidth, frameHeight);
						}
						ctx.globalAlpha = curAlpha;
					}
					
				} else {
					ctx.clearRect(0, 0, frameWidth, frameHeight);
				}
				// Don't render again until set to dirty
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

	// If the sprite has an image
	if (resource && resource.image) {
		// Listen to when the image is loaded
		resource.image.addEventListener("load", resourcesReady);
	} else {
		resourcesReady();
	}
	
	// Listen to when the sprite is touched or clicked
	that.addEventListener("PRESS", that.press);
	
	if (that.autoStart === false) {
		paused = true;
	}

	return that;
};