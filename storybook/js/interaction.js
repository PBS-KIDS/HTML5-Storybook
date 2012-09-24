//  ------------------------------------------------------------------
//  interactionObject.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.interactionObject = function (GLOBAL, PBS, element) {
	
	"use strict";
	
	return PBS.makeInteractionObject(GLOBAL, PBS, PBS.view(PBS, element));
};

PBS.makeInteractionObject = function (GLOBAL, PBS, view) {

	"use strict";
	
	var pressed = false,
		element = view.getElement(),
		dragStartLoc,
		
		press = function (e) {
		
			var loc = {},
				elementPos = PBS.getElementPosition(element),
				interaction = e.changedTouches ? e.changedTouches[0] : e;
				
			loc.x = interaction.clientX - elementPos.x;
			loc.y = interaction.clientY - elementPos.y;
			
			pressed = true;
			
			// Save the press location
			dragStartLoc = {
				x: loc.x, 
				y: loc.y
			};
			
			//PBS.log("touch -> (loc.x: " + loc.x + ", loc.y: "+ loc.y + ") (" + elementPos.x + ", " + elementPos.y + ")");
			
			// Dispatch the press event
			view.dispatchEvent("PRESS", {
				x: loc.x, 
				y: loc.y
			});
			
			e.preventDefault();
		},
		
		drag = function (e) {
		
			var loc = {},
				elementPos = PBS.getElementPosition(element),
				interaction = e.changedTouches ? e.changedTouches[0] : e;
			
			loc.x = interaction.clientX - elementPos.x;
			loc.y = interaction.clientY - elementPos.y;
			
			if (pressed) {
				//PBS.log("drag -> (loc.x: " + loc.x + ", loc.y: "+ loc.y + ")");
				
				// Dispatch the drag event
				view.dispatchEvent("DRAG", {
					x: loc.x, 
					y: loc.y,
					startX: dragStartLoc.x,
					startY: dragStartLoc.y,
					distanceX: GLOBAL.Math.abs(loc.x - dragStartLoc.x),
					distanceY: GLOBAL.Math.abs(loc.y - dragStartLoc.y),
					distance: PBS.distance({
						x: loc.x,
						y: loc.y
					}, {
						x: dragStartLoc.x,
						y: dragStartLoc.y
					})
				});
			}
		},
		
		release = function (e) {
			pressed = false;
			
			view.dispatchEvent("RELEASE");
		},
		
		cancel = function (e) {
			pressed = false;
			
			view.dispatchEvent("CANCEL");
		};
		
	view.cancelInteraction = function () {
		cancel();
	};

	// Add mouse event listeners to specified element
	element.addEventListener("mousedown", press);
	element.addEventListener("mousemove", drag);
	element.addEventListener("mouseup", release);
	element.addEventListener("mouseout", cancel);

	// Add touch event listeners to specified element
	element.addEventListener("touchstart", press);
	element.addEventListener("touchmove", drag);
	element.addEventListener("touchend", release);
	element.addEventListener("touchcancel", cancel);
	
	return view;
};