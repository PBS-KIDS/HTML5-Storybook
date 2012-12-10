//  ------------------------------------------------------------------
//  PBS.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

var PBS;

if (!PBS) {
	PBS = {};
}

if (!PBS.KIDS) {
	PBS.KIDS = {};
}

PBS.KIDS.storybook = (function (GLOBAL) {

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
	// parentElement - the element to append the canvas. This parameter can be null.
	//
	// options - an object to hold options such as dimensions.
	//     id: element id
	//     class: elements class(es)
	//     width: element width
	//     height: element height
	//     
	// Example usage:
	//     ctx = PBS.createCanvas(containerElement, {
	//         id: "stageCanvas",
	//         width: 100,
	//         height: 200
	//     }
	that.createCanvas = function (parentElement, options) {
		
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
		
		// Append the canvas to the parent element (if specified)
		if (parentElement) {
			parentElement.appendChild(canvasElement);
		}
		
		// Return the canvas CONTEXT not the canvas element
		return canvasElement.getContext("2d");
	};
	
	// Returns a position object relative to the viewport representing the element by adding the parent offsets recursively
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
       	   // Recursively get the position of the current element's parent
           parentOffset = that.getElementPosition(element.offsetParent);
           // Adjust the elements position based on the position of the parent element
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
	
	// Remove anything that is not a number (e.g. "px" or "%") from a string
	that.getNumberFromString = function (param) {
	
		// Make sure the string is defined and is a string object
		if (param === undefined) {
			return;
		} else if (typeof param !== "string") {
			param = param.toString();
		}
		// Replace everything that is not a number with empty string
		return param.replace(/[^-\d\.]/g, "")
	};
	
	// Returns true if the parameter has the string "px" (e.g. "100px" returns true)
	that.isInPixelUnits = function (param) {
		
		return (param.toString().toUpperCase().indexOf("PX") !== -1);
	};
	
	// Returns true if the parameter has the character "%" (e.g. "100%" returns true)
	that.isInPercentageUnits = function (param) {
		
		return (param.toString().indexOf("%") !== -1);
	};
	
	// Returns all children of an element
	that.removeAllChildren = function (element) {
		
		var i, numChildren = element.childNodes.length;
	
		for (i = 0; i < numChildren; i += 1) {
			element.removeChild(element.childNodes[element.childNodes.length - 1]);
		}
	};

	return that;
	
}(window));