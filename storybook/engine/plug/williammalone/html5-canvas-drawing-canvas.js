// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*jslint browser: true */
/*global G_vmlCanvasManager */

var WM;

if (!WM) {
	WM = {};
}

WM.drawingCanvas = function (parentElement, options) {

	"use strict";

	var that = {},
		context,
		canvasWidth = (options && options.width) ? options.width : 200,
		canvasHeight = (options && options.height) ? options.height : 100,
		curColor = (options && options.defaultColor) ? options.defaultColor : "#993333",
		curSize = (options && options.radius) ? options.radius : 5,
		curTool = "MARKER",
		textureImage = new Image(),
		overlayImage = new Image(),
		clickX = [],
		clickY = [],
		clickColor = [],
		clickTool = [],
		clickSize = [],
		clickDrag = [],
		paint = false,
		totalLoadResources = 1,
		curLoadResNum = 0,

		// Clears the canvas.
		clearCanvas = function () {

			//context.canvas.width = context.canvas.width;
			context.clearRect(0, 0, canvasWidth, canvasHeight);
		},

		// Redraws the canvas.
		redraw = function () {

			var locX,
				locY,
				radius,
				i,
				selected;

			// Make sure required resources are loaded before redrawing
			if (curLoadResNum < totalLoadResources) {
				return;
			}

			clearCanvas();

			// For each point drawn
			for (i = 0; i < clickX.length; i += 1) {

				radius = clickSize[i];

				// Set the drawing path
				context.beginPath();
				// If dragging then draw a line between the two points
				if (clickDrag[i] && i) {
					context.moveTo(clickX[i - 1], clickY[i - 1]);
				} else {
					// The x position is moved over one pixel so a circle even if not dragging
					context.moveTo(clickX[i] - 1, clickY[i]);
				}
				context.lineTo(clickX[i], clickY[i]);
				
				// Set the drawing color
				if (clickTool[i].toUpperCase() === "ERASER") {
					context.globalCompositeOperation = "destination-out"; // To erase 
				} else {
					context.globalCompositeOperation = "source-over";
					context.strokeStyle = clickColor[i];
				}
				context.lineCap = "round";
				context.lineJoin = "round";
				context.lineWidth = radius;
				context.stroke();
			}
			context.closePath();
			
			context.globalCompositeOperation = "source-over";

			// Draw the texture image
			if (options.textureUrl) {
				context.drawImage(textureImage, 0, 0);
			}

			// Draw the outline image
			if (options.overlayUrl) {
				context.drawImage(overlayImage, 0, 0);
			}
		},

		// Adds a point to the drawing array.
		// @param x
		// @param y
		// @param dragging
		addClick = function (x, y, dragging) {

			clickX.push(x);
			clickY.push(y);
			clickTool.push(curTool);
			clickColor.push(curColor);
			clickSize.push(curSize);
			clickDrag.push(dragging);
		},

		 getElementPosition = function (element) {
           var parentOffset,
           	   pos = {
	               x: element.offsetLeft,
	               y: element.offsetTop 
	           };
	           
           if (element.offsetParent) {
               parentOffset = getElementPosition(element.offsetParent);
               pos.x += parentOffset.x;
               pos.y += parentOffset.y;
           }
           return pos;
        },

		// Add mouse and touch event listeners to the canvas
		createUserEvents = function () {

			var press = function (e) {
					
				var pos = getElementPosition(this),
					mouseX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
					mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
					drawX,
					drawY;
				
				drawX = (mouseX - pos.x) * canvasWidth / this.offsetWidth;
				drawY = (mouseY - pos.y) * canvasHeight / this.offsetHeight;

				paint = true;
				addClick(drawX, drawY, false);
				redraw();
			},

			drag = function (e) {
				
				var pos = getElementPosition(this),
					mouseX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
					mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
					drawX,
					drawY;
				
				drawX = (mouseX - pos.x) * canvasWidth / this.offsetWidth;
				drawY = (mouseY - pos.y) * canvasHeight / this.offsetHeight;
					
				if (paint) {
					addClick(drawX, drawY, true);
					redraw();
				}
				
				// Prevent the event from bubbling to parent elements
				e.stopPropagation();
				// Prevent the whole page from dragging if on mobile
				e.preventDefault();
			},

			release = function () {

				paint = false;
				redraw();
			},

			cancel = function () {

				paint = false;
			};

			// Add mouse event listeners to canvas element
			that.canvas.addEventListener("mousedown", press, false);
			that.canvas.addEventListener("mousemove", drag, false);
			that.canvas.addEventListener("mouseup", release, false);
			that.canvas.addEventListener("mouseout", cancel, false);

			// Add touch event listeners to canvas element
			that.canvas.addEventListener("touchstart", press, false);
			that.canvas.addEventListener("touchmove", drag, false);
			that.canvas.addEventListener("touchend", release, false);
			that.canvas.addEventListener("touchcancel", cancel, false);
		},

		// Calls the redraw function after all neccessary resources are loaded.
		resourceLoaded = function () {

			curLoadResNum += 1;
			if (curLoadResNum === totalLoadResources) {
				redraw();
				createUserEvents();
			}
		},

		// Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
		init = function () {
		
			if (options.width !== undefined) {
				canvasWidth = options.width;
			}
			if (options.height !== undefined) {
				canvasHeight = options.height;
			}

			// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
			that.canvas = document.createElement('canvas');
			that.canvas.setAttribute('width', canvasWidth);
			that.canvas.setAttribute('height', canvasHeight);
			that.canvas.setAttribute('class', 'drawingCanvas');
			//canvas.setAttribute('id', 'canvas');
			parentElement.appendChild(that.canvas);
			if (typeof G_vmlCanvasManager !== "undefined") {
				that.canvas = G_vmlCanvasManager.initElement(that.canvas);
			}
			context = that.canvas.getContext("2d"); // Grab the 2d canvas context
			// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
			//     context = document.getElementById('canvas').getContext("2d");

			if (options.overlayUrl) {
				totalLoadResources += 1;
				overlayImage.onload = resourceLoaded;
				overlayImage.src = options.overlayUrl;
			}
			
			if (options.textureUrl) {
				totalLoadResources += 1;
				textureImage.onload = resourceLoaded;
				textureImage.src = options.textureUrl;
			}
			
			// 
			resourceLoaded();
		};
		
	that.canvas;
		
	that.render = function () {
		redraw();
	};
	
	that.setColor = function (color) {
		curColor = color;
	};
	
	that.setSize = function (size) {
		curSize = size;
	};
	
	that.setTool = function (tool) {
		if (tool.toUpperCase() === "MARKER") {
			curTool = "MARKER";
		} else if (tool.toUpperCase() === "ERASER") {
			curTool = "ERASER";
		}
	};
	
	that.clear = function () {
	
		clickX = [];
		clickY = [];
		clickColor = [];
		clickTool = [];
		clickSize = [];
		clickDrag = [];
		
		clearCanvas();
		
		redraw();
	};

	init();
	
	return that;
};