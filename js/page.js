//  ------------------------------------------------------------------
//  page.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.page = function (GLOBAL, PBS, config, pageNum, options) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
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

		// When a resource has loaded
		resourceLoaded = function () {
			
			numResourcesLoaded += 1;
			
			if (numResourcesLoaded === totalResources && !loaded) {
				loaded = true;
				that.dispatchEvent("LOAD_COMPLETE");
			}
		};
	
	// Initialize the page
	that.init = function () {
	
		var spec, i, curTextArea, curSprite;
	
		// A configuration object is required
		if (config === undefined) {
			PBS.KIDS.storybook.error("Configuration missing for page " + pageNum);
			return;
		}
		
		// A page number is required
		if (pageNum === undefined) {
			PBS.KIDS.storybook.error("Missing page number parameter");
			return;
		}
		
		// Create the page container
		element = GLOBAL.document.createElement("section");
		element.className = "pbsPage";
		
		// Create the page
		pageView = PBS.KIDS.storybook.interactionObject(GLOBAL, PBS, element);
		
		// A assign a drag event listener on the page
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
		
		// Create a background property if it is not specified
		if (config.background === undefined) {
			config.background = {};
		}
		config.background.parentElement = element;
		//config.background.width = width + "px";
		//config.background.height = height + "px";
		config.background.className = "pbsPageCanvas";
		
		// Read the page background properties from the config
		// If a background image or color is specified for this page
		if (config.background.resource || config.background.color) {
			// Use the specific page resource or color
		// If odd default page background is specified and the page is odd
		} else if (options.bookConfig.oddPageBackground && pageNum % 2 && options.bookConfig.oddPageBackground.resource) {
			config.background.resource = options.bookConfig.oddPageBackground.resource;
		// If odd default page background color is specified and the page is odd
		} else if (options.bookConfig.oddPageBackground && pageNum % 2 && options.bookConfig.oddPageBackground.color) {
			config.background.color = options.bookConfig.oddPageBackground.color;
		// if even default page background is specified and the page is even
		} else if (options.bookConfig.evenPageBackground && pageNum % 2 === 0 && options.bookConfig.evenPageBackground.resource) {
			config.background.resource = options.bookConfig.evenPageBackground.resource;
		// if even default page background color is specified and the page is even
		} else if (options.bookConfig.evenPageBackground && pageNum % 2 === 0 && options.bookConfig.evenPageBackground.color) {
			config.background.color = options.bookConfig.evenPageBackground.color;
		// if default background is specified
		} else if (options.bookConfig.pageBackground && options.bookConfig.pageBackground.resource) {
			config.background.resource = options.bookConfig.pageBackground.resource;
		// if default background color is specified
		} else if (options.bookConfig.pageBackground && options.bookConfig.pageBackground.color) {
			config.background.color = options.bookConfig.pageBackground.color;
		}
		
		// Create page background
		backgroundSprite = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config.background);
		backgroundSprite.addEventListener("LOAD_COMPLETE", resourceLoaded);
		backgroundSprite = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, backgroundSprite);

		// For each item on the page
		if (config && config.content) {
			for (i = 0; i < config.content.length; i += 1) {
				switch (config.content[i].type) {
				
				case "TextArea":
	
					curTextArea = PBS.KIDS.storybook.textArea(GLOBAL, PBS, config.content[i]);
					
					element.appendChild(curTextArea.getElement());
					//curTextArea = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, curTextArea);
					textAreaArray.push(curTextArea);
					contentArray.push(curTextArea);
					break;
					
				case "Sprite":
	
					config.content[i].parentElement = element;
					config.content[i].parentWidth = width;
					config.content[i].parentHeight = height;
					curSprite = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config.content[i]);
					curSprite = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, curSprite);
					spriteArray.push(curSprite);
					contentArray.push(curSprite);
					break;
				}
			}
		}
	};
	
	// Element property getter
	that.getElement = function () {
		return element;	
	};
	
	// When the page starts turning to this page
	that.navigationToBegin = function () {
		
	};
	
	// When the page is finished turning to this page
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
	
	// When the page starts turning away from the page
	that.navigationFromBegin = function () {

	};
	
	// When the page is finished turning away from the page
	that.navigationFromComplete = function () {
		
		
	};
	
	// Destroy the page and its contents
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

	// Update the page and its contents
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
	
	// Draw the page and its contents
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