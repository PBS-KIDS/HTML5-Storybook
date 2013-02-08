//  ------------------------------------------------------------------
//  page.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.page = function (GLOBAL, PBS, config, pageNum, options) {
	
	"use strict";
	
	var sb = PBS.KIDS.storybook,
		that = sb.eventDispatcher(),
		width = options.bookConfig.pageWidth || 768,
		height = options.bookConfig.pageHeight || 1024,
		audioPlayer = options.audioPlayer,
		backgroundSprite,
		ctx,
		element,
		textAreaArray = [],
		spriteArray = [],
		cyclerArray = [],
		drawingPadArray = [],
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
	
	// Public Properties
	that.pageSound;
	
	// Initialize the page
	that.init = function () {
	
		var spec, i, curTextArea, curSprite, curCycler, curDrawingPad, pageSoundPersistence;
	
		// A configuration object is required
		if (config === undefined) {
			sb.error("Configuration missing for page " + pageNum);
			return;
		}
		
		// A page number is required
		if (pageNum === undefined) {
			sb.error("Missing page number parameter");
			return;
		}
		
		// Create the page container
		element = GLOBAL.document.createElement("section");
		element.id = "pbsPage" + pageNum;
		element.className = "pbsPage";
		
		// Create the page
		pageView = sb.interactionObject(GLOBAL, PBS, element);
		
		// A assign a drag event listener on the page
		pageView.addEventListener("DRAG", function (e) {

			// If dragged enough
			if (e.distanceX > width / 20) {
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
		backgroundSprite = sb.sprite(GLOBAL, PBS, config.background);
		backgroundSprite.addEventListener("LOAD_COMPLETE", resourceLoaded);
		backgroundSprite = sb.makeInteractionObject(GLOBAL, PBS, backgroundSprite);
		
		pageSoundPersistence = (config && config.sound && config.sound.persist !== undefined) ? config.sound.persist : true;
		// If a page sound is specified
		if (audioPlayer && config && config.sound) {
			that.pageSound = sb.sound(config.sound.startTime, config.sound.endTime, {
				loop: config.sound.loop,
				persist: pageSoundPersistence
			});
		}
		
		// For each item on the page
		if (config && config.content) {
			for (i = 0; i < config.content.length; i += 1) {
				switch (config.content[i].type) {
				
				case "TextArea":
	
					config.content[i].parentElement = element;
					config.content[i].parentWidth = width;
					config.content[i].parentHeight = height;
					config.content[i].className = "pbsPage" + pageNum + "TextArea" + (textAreaArray.length + 1);
					
					curTextArea = sb.textArea(GLOBAL, PBS, config.content[i]);
					
					// If a sound is specified
					if (config.content[i].sound) {
						curTextArea = sb.makeInteractionObject(GLOBAL, PBS, curTextArea);
						curTextArea = sb.makeAudible(GLOBAL, PBS,  audioPlayer, curTextArea, config.content[i].sound);
					}
					
					textAreaArray.push(curTextArea);
					contentArray.push(curTextArea);
					break;
					
				case "Sprite":
	
					config.content[i].parentElement = element;
					config.content[i].parentWidth = width;
					config.content[i].parentHeight = height;
					config.content[i].className = "pbsPage" + pageNum + "Sprite" + (spriteArray.length + 1);
					
					curSprite = sb.sprite(GLOBAL, PBS, config.content[i]);
					curSprite = sb.makeInteractionObject(GLOBAL, PBS, curSprite);
					
					// If a sound is specified
					if (config.content[i].sound) {
						curSprite = sb.makeAudible(GLOBAL, PBS, audioPlayer, curSprite, config.content[i].sound);
					}
					
					spriteArray.push(curSprite);
					contentArray.push(curSprite);
					
					// Set the play after delay property if its set
					if (config.content[i].playAfterDelay > 0) {
						curSprite.playAfterDelay = config.content[i].playAfterDelay;
					}
					break;
					
				case "Cycler":
	
					config.content[i].parentElement = element;
					config.content[i].parentWidth = width;
					config.content[i].parentHeight = height;
					config.content[i].className = "pbsPage" + pageNum + "Cycler" + (cyclerArray.length + 1);
					
					curCycler = sb.cycler(GLOBAL, PBS, config.content[i]);
					
					// If a sound is specified
					if (config.content[i].sound) {
						curCycler = sb.makeAudible(GLOBAL, PBS, audioPlayer, curCycler, config.content[i].sound);
					}
					
					contentArray.push(curCycler);
					cyclerArray.push(curCycler);
					
					// Set the play after delay property if its set
					if (config.content[i].playAfterDelay > 0) {
						curCycler.playAfterDelay = config.content[i].playAfterDelay;
					}
					break;
				
				case "DrawingPad":
	
					config.content[i].parentElement = element;
					config.content[i].parentWidth = width;
					config.content[i].parentHeight = height;
					config.content[i].className = "pbsPage" + pageNum + "DrawingPad" + (cyclerArray.length + 1);
							
					curDrawingPad = sb.drawingPad(GLOBAL, PBS, config.content[i]);
					curDrawingPad = sb.makeInteractionObject(GLOBAL, PBS, curDrawingPad);
					
					// If a sound is specified
					if (config.content[i].sound) {
						curDrawingPad = sb.makeAudible(GLOBAL, PBS, audioPlayer, curDrawingPad, config.content[i].sound);
					}
					
					drawingPadArray.push(curDrawingPad);
					contentArray.push(curDrawingPad);
					break;
					
				default:
				
					sb.error("Object Type Unknown: " + config.content[i].type);
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
		
		var i;
		
		// For each cycler on the page
		for (i = 0; i < cyclerArray.length; i += 1) {	
			cyclerArray[i].reset();
		}
	};
	
	// When the page is finished turning to this page
	that.navigationToComplete = function () {
			
		var i;
		 
		// If a page background
		if (backgroundSprite) {
			// Draw the background
			backgroundSprite.play();
		}
		 
		// For each sprite on the page
		for (i = 0; i < spriteArray.length; i += 1) {
		
			if (spriteArray[i].autoStart === true) {
				spriteArray[i].play();
			} else {
				spriteArray[i].reset();
			}
			
			if (spriteArray[i].playAfterDelay > 0) {
				GLOBAL.setTimeout(spriteArray[i].play, GLOBAL.parseInt(spriteArray[i].playAfterDelay, 10) * 1000);
			}
		}
		
		// For each cycler on the page
		for (i = 0; i < cyclerArray.length; i += 1) {	
			if (cyclerArray[i].autoStart === true) {
				cyclerArray[i].play();
			} else {
				cyclerArray[i].reset();
			}
			
			if (cyclerArray[i].playAfterDelay > 0) {
				GLOBAL.setTimeout(cyclerArray[i].play, GLOBAL.parseInt(cyclerArray[i].playAfterDelay, 10) * 1000);
			}
		}
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
	
	that.quiet = function () {
	
		element.className = element.className.replace(" loud", "");
		element.className = element.className.replace(" quiet", "");
		element.className += " quiet";
	};
	
	that.loud = function () {
	
		element.className = element.className.replace(" loud", "");
		element.className = element.className.replace(" quiet", "");
		element.className += " loud";
	};
	
	that.init();

	return that;
};