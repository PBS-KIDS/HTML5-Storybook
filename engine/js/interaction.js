//  ------------------------------------------------------------------
//  interactionObject.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.interactionObject = function (GLOBAL, PBS, element) {
	
	"use strict";
	
	return PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, PBS.KIDS.storybook.view(PBS, element));
};

PBS.KIDS.storybook.makeInteractionObject = function (GLOBAL, PBS, view) {

	"use strict";
	
	var pressed = false,
		element = view.getElement(),
		dragStartLoc,
		
		press = function (e) {
		
			var loc = {},
				// Get the position of the element relative to the viewport
				elementPos = PBS.KIDS.storybook.getElementPosition(element),
				// Get the position of the touch/click relative to the viewport
				interaction = e.changedTouches ? e.changedTouches[0] : e;
				
			// Set the location of the press relative to the element's registration point
			loc.x = interaction.clientX - elementPos.x;
			loc.y = interaction.clientY - elementPos.y;
			
			// A press has started
			pressed = true;
			
			// Save the press location to be used as the start position of a drag
			dragStartLoc = {
				x: loc.x, 
				y: loc.y
			};
			
			//PBS.KIDS.storybook.log("Press loc -> (" + loc.x + ", "+ loc.y + "). Element loc -> (" + elementPos.x + ", " + elementPos.y + ")", element);
			//if (console && console.dir) {
			//	console.dir(element);
			//}
			
			// Dispatch the press event with the position
			view.dispatchEvent("PRESS", {
				x: loc.x, 
				y: loc.y
			});
			
			// Stop iOS from dragging the viewport
			e.preventDefault();
		},
		
		drag = function (e) {
		
			var loc = {},
				// Get the position of the element relative to the viewport
				elementPos = PBS.KIDS.storybook.getElementPosition(element),
				// Get the position of the touch/click relative to the viewport
				interaction = e.changedTouches ? e.changedTouches[0] : e;
			
			// Set the location of the press relative to the element's registration point
			loc.x = interaction.clientX - elementPos.x;
			loc.y = interaction.clientY - elementPos.y;
			
			// If a press has started and not cancelled
			if (pressed) {

				// Dispatch the drag event with the position, start position, and length of the drag
				view.dispatchEvent("DRAG", {
					x: loc.x, 
					y: loc.y,
					startX: dragStartLoc.x,
					startY: dragStartLoc.y,
					distanceX: GLOBAL.Math.abs(loc.x - dragStartLoc.x),
					distanceY: GLOBAL.Math.abs(loc.y - dragStartLoc.y),
					distance: PBS.KIDS.storybook.distance({
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
		
			// End the press
			pressed = false;
			
			view.dispatchEvent("RELEASE");
		},
		
		cancel = function (e) {
		
			// End the press
			pressed = false;
			
			view.dispatchEvent("CANCEL");
		};
		
	// Make cancelling the press public
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