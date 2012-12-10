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
		dirty = true,
		pad,
		
		init = function () {
	
			var i, width, height;
			
			if (!initialized) {
				initialized = true;
			
				that.initView();
			
				// Create the drawing pad element
				element.className = "pbsDrawingPad";
				
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
					radius: options.radius
				});
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
	
	that.parentWidth = options && (options.parentWidth !== undefined) ? options.parentWidth : 100;
	that.parentHeight = options && (options.parentHeight !== undefined) ? options.parentHeight : 100;

	// Update the text area
	that.update = function () {

	};
	
	// Draw the text area
	that.render = function () {
		 
		 if (that.dirty) {
		 	that.dirty = false;
		 	
		 	app.render();
		 }
	};
	
	init();

	return that;
};