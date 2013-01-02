//  ------------------------------------------------------------------
//  cycler.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.cycler = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		initialized = false,
		itemArray = [],
		activeIndex = 0, // Index of the item that is currently shown
		
		init = function () {
		
			var i, curItem, config;

			if (!initialized) {
				initialized = true;
				
				// For each item on the page
				if (options && options.content) {
					for (i = 0; i < options.content.length; i += 1) {
						
						config = options.content[i];
						config.parentElement = options.parentElement;
						config.parentWidth = options.parentWidth;
						config.parentHeight = options.parentHeight;

						curItem = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config);
						curItem = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, curItem);
						curItem.addEventListener("PRESS", function(e) {
							that.dispatchEvent("PRESS", {
								x: e.x, 
								y: e.y
							});
							that.cycle();
						});
						itemArray.push(curItem);
					}
				} else {
					PBS.KIDS.storybook.error("Cycler missing content array.");
				}
			}
		};
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 0;
	that.height = options && (options.height !== undefined) ? options.height : 0;
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
	
	// Display the next item in list
	that.cycle = function () {
	
		var i;
	
		// Increment the item index
		if (activeIndex < itemArray.length - 1) {
			activeIndex += 1;
		} else {
			activeIndex = 0;
		}
		
		// Hide all items and show the active item
		for (i = 0; i < itemArray.length; i += 1) {
			if (i === activeIndex) {
				itemArray[i].visible = true;
				itemArray[i].play();
			} else {
				itemArray[i].visible = false;
				itemArray[i].reset();
				itemArray[i].render();
			}
		}
		
	};
	
	// Play the active item
	that.play = function () {
	
		itemArray[activeIndex].play();
	};
	
	// Resume the active item
	that.resume = function () {
	
		itemArray[activeIndex].resume();
	};
	
	// Stop the active item
	that.stop = function () {
	
		itemArray[activeIndex].stop();	
	};
	
	// Reset the active item
	that.reset = function () {
	
		itemArray[activeIndex].reset();
	};
	
	// Update the active item
	that.update = function () {
	
		itemArray[activeIndex].update();
	};
	
	// Render the active item
	that.render = function () {
	
		itemArray[activeIndex].render();
	};
	
	that.destroy = function () {
	
		var i;
	
		for (i = 0; i < itemArray.length; i += 1) {
			itemArray[i].destroy();
		}
		itemArray = null;
		that = null;
	};
	
	init();
	
	return that;
};