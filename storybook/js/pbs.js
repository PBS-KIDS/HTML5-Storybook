//  ------------------------------------------------------------------
//  PBS.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

var PBS = (function (GLOBAL) {

	"use strict";
	
	var that = {};
	
	// Write a message to the console
	that.log = function (message) {
		
		if (GLOBAL.console) {
			GLOBAL.console.log(message);
		}
	},
	
	// Write an error message to the console	
	that.error = function (message) {
		
		if (GLOBAL.console) {
			GLOBAL.console.log("ERROR: " + message);
		}
	};
	
	// Write a debug message to the console
	that.debug = function (message) {
		
		if (GLOBAL.console) {
			GLOBAL.console.log("DEBUG: " + message);
		}
	};
	
	// Creates a new canvas element and returns its context
	//
	// Options:
	//     id: element id
	//     class: elements class(es)
	//     width: element width
	//     height: element height
	//     parentElement: canvas will be appended to this element
	//     
	// Example usage:
	//     ctx = PBS.createCanvas({
	//         id: "stageCanvas",
	//         parentElement: containerElement
	//     }
	that.createCanvas = function (options) {
		
		var canvasElement = GLOBAL.document.createElement('canvas');
		
		if (options.id) {
			canvasElement.id = options.id;
		}
		
		if (options.className) {	
			canvasElement.className = options.className;
		}
		
		if (options.width) {
			canvasElement.width = options.width;
		}
		
		if (options.height) {
			canvasElement.height = options.height;
		}
		
		if (options.parentElement) {
			options.parentElement.appendChild(canvasElement);
		}
		
		// Return the canvas CONTEXT not the canvas element
		return canvasElement.getContext("2d");
	};
	
	// Returns a position object representing the element by adding the parent offsets recursively
	//
	// Example usage:
	//     elementPos = getElementPosition(div);
	//     console.log(elementPos.x + ", " elementPos.y);
	that.getElementPosition = function (element) {
       var parentOffset,
       	   pos = {
               x: element.offsetLeft,
               y: element.offsetTop 
           };
           
       if (element.offsetParent) {
           parentOffset = that.getElementPosition(element.offsetParent);
           pos.x += parentOffset.x;
           pos.y += parentOffset.y;
       }
       return pos;
    };
    
    // Return the distance between two points
    that.distance = function(p1, p2) {
		var dx = p1.x - p2.x,
			dy = p1.y - p2.y;
			
		return Math.sqrt(dx * dx + dy * dy);
	};

	return that;
	
}(window));