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
		destroyed = false,
		initialized = false,
		spec = {},
		previousFrame = 0,
		curFrame = 0,
		updateIndex = 0,
		frameWidth,
		frameHeight,
		frameDelay = options.frameDelay || 1,
		loop = options.loop,
		parentElement = options && options.parentElement,
		paused = false,
		parentWidthRatio = 1,
		parentHeightRatio = 1,
		backgroundColor = options.color,
		numFrames = options.numFrames,
		
		init = function () {

			if (!initialized) {
				initialized = true;
				
				that.initView();
	
				// If the sprite has an image
				if (resource && resource.image) {
					that.width = resource.image.width;
					that.height = resource.image.height;
				} else {
					that.width = 100;
					that.height = 100;
				}
				
				// Determine the dimensions of the frame. It may be different from the image dimensions if more than one frame
				frameWidth = numFrames ? (that.width / numFrames) : that.width;
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
				} else if (that.parentWidth) {
					parentWidthRatio = (element.width / that.parentWidth);
					element.style.width = (parentWidthRatio * 100) + "%";
				}
				
				// If the height was specified
				if (options.height) {
					// If px is in the height (e.g. 100px)
					if (options.height.toString().indexOf("px") !== -1) {
						element.style.height = options.height;
					} else {
						element.style.height = options.height + "%";
					}
				// Scale sprite if the parent is scaled
				} else if (that.parentHeight) {
					parentHeightRatio = (element.height / that.parentHeight);
					element.style.height = (parentHeightRatio * 100) + "%";
				}
				
				// Listen to when the sprite is touched or clicked
				that.addEventListener("PRESS", that.press);
				
				// If auto start is turned off (it is on by default)
				if (that.autoStart === false) {
					paused = true;
				}

				that.dirty = true;
			}
		},
		
		// Call when all resources for the sprite are loaded
		resourcesReady = function () {
		
			init();
		},
		
		// Returns the animation frame to be displayed
		applyEasing = function (curTick, totalTicks, totalNumFrames) {
			
			var currentFrame;
			
			// If no easeIn option then go slow at the beginning of an animation
			if (options.easing && options.easing.toUpperCase() === "EASEIN") {
				currentFrame = totalNumFrames * (1 - GLOBAL.Math.cos(curTick / totalTicks * GLOBAL.Math.PI / 2));
			// If no easeOut option then go slow at the end of an animation
			} else if (options.easing && options.easing.toUpperCase() === "EASEOUT") {
				currentFrame = totalNumFrames * (GLOBAL.Math.sin(curTick / totalTicks * GLOBAL.Math.PI / 2));
			// If no easing then the animation frames advance linearly
			} else {

				currentFrame = totalNumFrames * curTick / totalTicks;
				
//console.log(totalNumFrames + " * " + curTick + "/" + totalTicks + " = " + currentFrame);
			}
			
			return GLOBAL.Math.floor(currentFrame);
		};
	
	// Create the sprite's canvas
	spec.width = 99 + "px";
	spec.height = 99 + "px";
	spec.className = "pbsCanvas pbsSprite";
	if (options && options.className) {	
		spec.className += " " + options.className
	}
	ctx = PBS.KIDS.storybook.createCanvas(parentElement, spec);
	
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, ctx.canvas);
	element = that.getElement();
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 0;
	that.height = options && (options.height !== undefined) ? options.height : 0;
	that.parentWidth = options.parentWidth;
	that.parentHeight = options.parentHeight;
	that.horizontalAlign =  (options && options.horizontalAlign !== undefined) ? options.horizontalAlign.toUpperCase() : "LEFT",
	that.verticalAlign = (options && options.verticalAlign !== undefined) ? options.verticalAlign.toUpperCase() : "TOP",
	that.visible = true;
	that.alpha;
	that.destroyed = false;
	that.url = options && options.url;
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
		
	that.update = function () {
		
		// If the sprite is a non-paused animation
		if (numFrames && !paused) {
		
			// If the last frame
			if (updateIndex + 1 >= numFrames * frameDelay) {
			
				// If the animation is set to loop
				if (loop) {
					curFrame = 0;
					updateIndex = 0;
					
				// If the animation is set to automatically reset
				} else if (that.autoReset) {
					
					curFrame = 0;
					updateIndex = 0;
					that.stop();
				} // Else the animation is complete so stay on the final frame
			// If the animation is not complete
			} else {
				updateIndex += 1;
				curFrame = applyEasing(updateIndex, numFrames * frameDelay, numFrames);
			}
			
			// If the current and previous frame is different then redraw
			if (previousFrame !== curFrame) {
				that.dirty = true;
				
				// Save the frame that was just drawn
				previousFrame = curFrame;
			}
		}
	};
	
	that.render = function () {
	
		var curAlpha, frameXPos;
		
		if (initialized) {
	
			if (that.dirty) {
	
				// If the sprite is visible
				if (that.visible) {
				
					curAlpha = ctx.globalAlpha;
					ctx.globalAlpha = that.alpha;
					
					// If background color
					if (backgroundColor) {

						// Draw the background color
						ctx.fillStyle = backgroundColor;
						ctx.fillRect(0, 0, frameWidth, frameHeight);
					}
					
					// If the sprite has an image
					if (resource && resource.image) {
	
						// If the sprite is an animation
						if (numFrames) {
							// Clear rect approach crashes native browser in Droid Samsung Gt-P3113
							//ctx.clearRect(0, 0, frameWidth, frameHeight);
							ctx.canvas.width = ctx.canvas.width;
							ctx.drawImage(
								resource.image,
								GLOBAL.Math.floor(curFrame * frameWidth),
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
	
	// Element property getter
	that.getElement = function () {
	
		return element;	
	};
	
	that.play = function () {
	
		that.reset();
		
		paused = false;
	};
	
	that.isAnimation = function () {
	
		return (numFrames > 1);
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
			updateIndex = 0;
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

	return that;
};