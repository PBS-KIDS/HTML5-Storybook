//  ------------------------------------------------------------------
//  page.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.page = function (GLOBAL, PBS, config, pageNum, options) {
	
	"use strict";
	
	var that = PBS.eventDispatcher(),
		width = options.bookConfig.pageWidth || 768,
		height = options.bookConfig.pageHeight || 1024,
		backgroundSprite,
		ctx,
		element,
		textAreaArray = [],
		spriteArray = [],
		contentArray = [],
		dirty = true,
		pageView,
		
		resourcesLoaded = function () {

			loaded = true;
			that.dispatchEvent("LOAD_COMPLETE");
		},
		
		resourceLoaded = function () {
			
			numResourcesLoaded += 1;
			
			if (numResourcesLoaded === totalResources && !loaded) {
				resourcesLoaded();
			}
		};
	
	that.init = function () {
	
		var spec, i, curTextArea, curSprite;
	
		if (config === undefined) {
			PBS.error("Configuration missing for page " + pageNum);
			return;
		}
		
		if (pageNum === undefined) {
			PBS.error("Missing page number parameter");
			return;
		}
		
		element = GLOBAL.document.createElement("section");
		element.className = "pbsPage";
		pageView = PBS.interactionObject(GLOBAL, PBS, element);
		pageView.addEventListener("DRAG", function (e) {

			// If dragged enough
			if (e.distanceX > 50) {
				// Stop drag
				pageView.cancelInteraction();
				// Dispatch drag events
				if (e.x > e.startX) {
					that.dispatchEvent("DRAG_RIGHT", that);
				} else {
					that.dispatchEvent("DRAG_LEFT", that);
				}
			}
		});
		
		// Set the page background color
		if (config.backgroundColor !== undefined) {
			element.style.backgroundColor = config.backgroundColor;
		}
		if (config.background === undefined) {
			config.background = {};
		}
		config.background.parentElement = element;
		config.background.width = width;
		config.background.height = height;
		config.background.className = "pbsPageCanvas";
		config.background.resource = (config.background.resource) || options.bookConfig.background.resource;
		
		// Create page background
		backgroundSprite = PBS.sprite(GLOBAL, PBS, config.background);
		backgroundSprite.addEventListener("LOAD_COMPLETE", resourceLoaded);
		backgroundSprite = PBS.makeInteractionObject(GLOBAL, PBS, backgroundSprite);

		// For each item on the page
		for (i = 0; i < config.content.length; i += 1) {
			switch (config.content[i].type) {
			
			case "TextArea":

				curTextArea = PBS.textArea(GLOBAL, PBS, config.content[i]);
				
				element.appendChild(curTextArea.getElement());
				//curTextArea = PBS.makeInteractionObject(GLOBAL, PBS, curTextArea);
				textAreaArray.push(curTextArea);
				contentArray.push(curTextArea);
				break;
				
			case "Sprite":

				config.content[i].parentElement = element;
				config.content[i].parentWidth = width;
				config.content[i].parentHeight = height;
				curSprite = PBS.sprite(GLOBAL, PBS, config.content[i]);
				curSprite = PBS.makeInteractionObject(GLOBAL, PBS, curSprite);
				spriteArray.push(curSprite);
				contentArray.push(curSprite);
				break;
			}
		}
	};
	
	that.getElement = function () {
		return element;	
	};
	
	that.navigationToBegin = function () {
		
		
	};
	
	that.navigationToComplete = function () {
		
		var i;
		 
		// If a page background
		if (backgroundSprite) {
			// Draw the background
			backgroundSprite.play();
		}
		 
		// For each item on the page
		for (i = 0; i < spriteArray.length; i += 1) {
		
			if (spriteArray[i].autoStart === true) {
				spriteArray[i].play();
			} else {
				spriteArray[i].reset();
			}
		}
	};
	
	that.navigationFromBegin = function () {

	};
	
	that.navigationFromComplete = function () {
		
		
	};
	
	that.destroy = function () {
		
		var i;
		 
		// If a page background
		if (backgroundSprite) {
			// Draw the background
			backgroundSprite.destroy();
		}
		 
		// For each item on the page
		for (i = 0; i < contentArray.length; i += 1) {
			contentArray[i].destroy();
		}
		
		that = null;
	};

	that.update = function () {
	
		var i;
		
		// If a page background
		if (backgroundSprite) {
			// Update the background
			backgroundSprite.update();
		}
		
		// For each item on the page
		for (i = 0; i < contentArray.length; i += 1) {
			contentArray[i].update();
		}
	};
	
	that.render = function () {
	
		var i;
		 
		// If a page background
		if (backgroundSprite) {
			// Draw the background
			backgroundSprite.render();
		}
		 
		// For each item on the page
		for (i = 0; i < contentArray.length; i += 1) {
			contentArray[i].render();
		}
	};
	
	that.init();

	return that;
};