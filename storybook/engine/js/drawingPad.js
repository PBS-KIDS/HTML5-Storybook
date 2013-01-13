//  ------------------------------------------------------------------
//  textArea.js
//
//  REQUIRES: WM and WM.drawingApp
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.drawingPad = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		sb = PBS.KIDS.storybook,
		element,
		initialized = false,
		parentElement = options && options.parentElement,
		pad,
		colorButtons = [],
		clearButtons = [],
		eraserButtons = [],
		
		resourceLoaded = function () {
			that.dirty = true;
		},
		
		changeColor = function (paintColor) {
		
			pad.setTool("MARKER");	
			pad.setColor(paintColor);
		},
		
		clearPad = function () {
		
			pad.clear();
		},
		
		setEraserTool = function () {

			pad.setTool("ERASER");	
		},
		
		init = function () {
	
			var i, width, height, key, key2;
			
			if (!initialized) {
				initialized = true;
			
				that.initView();
			
				// Create the drawing pad element
				element.className = "pbsDrawingPad";
				if (options.className) {
					element.className += " " + options.className;
				}
				
				// e.g. 90px
				if (sb.isInPixelUnits(that.width)) {
					width = sb.getNumberFromString(that.width);
				// e.g. 90%
				} else if (sb.isInPercentageUnits(that.width)) {
					width = sb.getNumberFromString(that.width) * that.parentWidth / 100;
				// e.g 90
				} else {
					width = that.width * that.parentWidth / 100;
				}
				
				// e.g. 90px
				if (sb.isInPixelUnits(that.height)) {
					height = sb.getNumberFromString(that.height);
				// e.g. 90%
				} else if (sb.isInPercentageUnits(that.height)) {
					height = sb.getNumberFromString(that.height) * that.parentHeight / 100;
				// e.g 90
				} else {
					height = that.height * that.parentHeight / 100;
				}
			
				// Create drawing canvas
				pad = WM.drawingCanvas(element, {
					width: width,
					height: height,
					defaultColor: options.defaultColor,
					radius: options.radius,
					overlayUrl: options.overlayUrl,
					textureUrl: options.textureUrl
				});
				
				for (key in options) {
					if (key === "colorButtons") {
						for (i = 0; i < options.colorButtons.length; i += 1) {
							for (key2 in options.colorButtons[i]) {
								if (key2 === "url") {
								
									// Set the paint color to the first color button
									if (i === 0) {
										changeColor(options.colorButtons[i].paintColor);
									}

									options.colorButtons[i].parentElement = parentElement;
									options.colorButtons[i].parentWidth = that.parentWidth;
									options.colorButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.colorButtons[i].className = options.className + "ColorButton" + (i + 1);
									}
									
									// Listen for image load
									options.colorButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									colorButtons.push(sb.sprite(GLOBAL, PBS, options.colorButtons[i]));
									colorButtons[colorButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, colorButtons[colorButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									colorButtons[colorButtons.length - 1].addEventListener("PRESS", (function (color) {
										return function () {
											changeColor(color);
										};
									}(options.colorButtons[i].paintColor)));
								}
							}
						}
					} else if (key === "clearButtons") {
						for (i = 0; i < options.clearButtons.length; i += 1) {
							for (key2 in options.clearButtons[i]) {
								if (key2 === "url") {

									options.clearButtons[i].parentElement = parentElement;
									options.clearButtons[i].parentWidth = that.parentWidth;
									options.clearButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.clearButtons[i].className = options.className + "ClearButton" + (i + 1);
									}
									
									// Listen for image load
									options.clearButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									clearButtons.push(sb.sprite(GLOBAL, PBS, options.clearButtons[i]));
									clearButtons[clearButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, clearButtons[clearButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									clearButtons[clearButtons.length - 1].addEventListener("PRESS", clearPad);
								}
							}
						}
					} else if (key === "eraserButtons") {
						for (i = 0; i < options.eraserButtons.length; i += 1) {
							for (key2 in options.eraserButtons[i]) {
								if (key2 === "url") {

									options.eraserButtons[i].parentElement = parentElement;
									options.eraserButtons[i].parentWidth = that.parentWidth;
									options.eraserButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.eraserButtons[i].className = options.className + "EraserButton" + (i + 1);
									}
									
									// Listen for image load
									options.eraserButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									eraserButtons.push(sb.sprite(GLOBAL, PBS, options.eraserButtons[i]));
									eraserButtons[eraserButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, eraserButtons[eraserButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									eraserButtons[eraserButtons.length - 1].addEventListener("PRESS", setEraserTool);
								}
							}
						}
					}				
				}
			}
		};
	
	// Create the drawing pad element
	element = GLOBAL.document.createElement("div");
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, element);
	if (parentElement) {
		parentElement.appendChild(element);
	}
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 100 - that.x + "%";
	that.height = options && (options.height !== undefined) ? options.height : 100 - that.y + "%";
	that.dirty = true;
	
	that.parentWidth = options && (options.parentWidth !== undefined) ? options.parentWidth : 100;
	that.parentHeight = options && (options.parentHeight !== undefined) ? options.parentHeight : 100;

	// Update the text area
	that.update = function () {

	};
	
	// Draw the text area
	that.render = function () {
	
		var i;
		 
		 if (that.dirty) {
		 	that.dirty = false;
		 	
		 	//pad.render(); 	
		 	for (i = 0; i < colorButtons.length; i += 1) {
			 	colorButtons[i].render();
		 	}
		 	
		 	for (i = 0; i < eraserButtons.length; i += 1) {
			 	eraserButtons[i].render();
		 	}
		 	
		 	for (i = 0; i < clearButtons.length; i += 1) {
			 	clearButtons[i].render();
		 	}
		 }
	};
	
	init();

	return that;
};