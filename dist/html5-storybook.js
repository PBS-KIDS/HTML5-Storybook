/*! HTML5-Storybook 1.0.0 */
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
	};
	
	// Write an error message to the console	
	that.error = function (message) {
		
		if (GLOBAL.console) {
			GLOBAL.console.log("ERROR: " + message);
		}
	};
	
	// Write a debug message to the console
	that.debug = function (message) {
		
		if (GLOBAL.console) {
			GLOBAL.console.log("true: " + message);
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
		return param.replace(/[^-\d\.]/g, "");
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
//  ------------------------------------------------------------------
//  eventDispatcher.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.eventDispatcher = function () {
	
	"use strict";
	
	var that = {},
		eventListeners = {};
	
	// Store the "listener" function in an object with property name "eventName"
	that.addEventListener = function (eventName, listener) {
		
		// If there are no listeners to the current event then create a new array
		if (eventListeners[eventName] === undefined) {
			eventListeners[eventName] = [];	
		}
		// Add the listener 
		eventListeners[eventName].push(listener);
	};
	
	// Remove the "listener" function from the object with property name "eventName"
	that.removeEventListener = function (eventName, listener) {
		
		var i;
		
		// If a listener array that matches the name exists
		if (eventListeners[eventName]) {
			for (i = 0; i < eventListeners[eventName].length; i += 1) {
				// Remove all listeners that match
				if (eventListeners[eventName][i] === listener) {
					eventListeners[eventName].splice(i, 1);
				}
			}
		}
	};
	
	// Clears the eventlistener object
	that.removeAllEventListeners = function () {
				
		for (var key in eventListeners) {
	        if (eventListeners.hasOwnProperty(key)) {
	            delete eventListeners[key];
	        }
	    }
	};
	
	// Call all "listener" functions in the object with property name "eventName"
	that.dispatchEvent = function (eventName, args) {
		
		var i;
		
		// If the event name is valid
		if (eventListeners[eventName] !== undefined) {
			// Invoke all listeners
			for (i = 0; i < eventListeners[eventName].length; i += 1) {
				eventListeners[eventName][i](args);
			}
		}
	};

	return that;
};
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
			
			view.dispatchEvent("false");
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
//  ------------------------------------------------------------------
//  resourceLoader.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.resourceLoader = function (GLOBAL, PBS) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		resources = {},
		queue = [],
		numResourcesLoaded = 0,
		loadStarted = false,
		
		// When a resource is loaded
		onResourceLoaded = function () {
			
			numResourcesLoaded += 1;
			
			// Dispatch an event with the current load progress
			that.dispatchEvent("QUEUE_UPDATE", {
				progress: numResourcesLoaded, 
				total: queue.length
			});

			// Dispatch a complete event all the resources are loaded
			if (numResourcesLoaded === queue.length) {
				that.dispatchEvent("QUEUE_LOADED");
			}
		},
		
		// When an error occurs when loading a resource
		onResourceLoadError = function () {
			
			PBS.KIDS.storybook.error("Resource load error.");
		};
	
	// Add a resource to the queue if it is not already there
	that.addToQueue = function (url) {
		
		// If the resource is already in the list
		if (resources[url] === undefined) {

			// Create a new resource object
			resources[url] = {
				image: new Image(),
				url: url,
				loaded: false
			};
			
			// Add it to the queue
			queue.push(resources[url]);
		}
		
		return resources[url];
	};
	
	// Load all resources in the queue
	that.loadQueue = function () {
		
		var key;
		
		if (!loadStarted) {
			loadStarted = true;
		
			// Add a load event listener to each resource
			for (key in resources) {
				if (resources.hasOwnProperty(key)) {
					resources[key].image.addEventListener("load", onResourceLoaded);
				}
			}
			
			// Set the resource's image source to the url
			for (key in resources) {
				if (resources.hasOwnProperty(key)) {
					resources[key].image.src = resources[key].url;
				}
			}
		}
	};
	
	that.getProgress = function () {
		
		return numResourcesLoaded;
	};
	
	that.getTotal = function () {
		
		return queue.length;
	};

	return that;
};
//  ------------------------------------------------------------------
//  storybook.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.book = function (GLOBAL, PBS, storybookContainerElement, config) {
	
	"use strict";
	
	var sb = PBS.KIDS.storybook,
		that = sb.eventDispatcher(),
		resourceLoader = sb.resourceLoader(GLOBAL, PBS),
		audioPlayer,
		paused = false,
		loadStarted = false,
		destroyed = false,
		initialized = false,
		numPagesLoaded = 0,
		curPageIndex,
		targetPageIndex,
		curOrientation,
		bookConfig = config.book,
		leftPageIndex,
		rightPageIndex,
		pageElementWidth,
		pageElementHeight,
		prevPageButtonSprite,
		nextPageButtonSprite,
		pageTurnDuration,
		pageSlideDuration,
		navigating = false,
		cover,
		pages = [],
		bookMargin,
		minBookMargin = config.book.margin !== undefined ? config.book.margin : 2,
		audioLoadInitiated = false,
		audioLoadedEnough = false,
		resourceLoadComplete = false,
		// Elements
		bookWrapperElement,
		bookContainerElement,
		pagesContainerElement,
		leftPageContainerElement,
		rightPageContainerElement,
		navElement,
		prevPageButtonElement,
		nextPageButtonElement,
		pageTurnContainerElement,
		// Loading
		loadingContainerElement, 
		loadingView,
		loadEvent,
	
		// Main loop that calls render and update to allow for interactive elements
		loop = function () {
		
			if (!destroyed) {
				// Not the main loop if paused
				if (!paused) {
					if (curPageIndex === targetPageIndex) {
						if (curPageIndex === -1) {
							// Update cover
							cover.update();
						} else {
							// Update visible pages
							if (pages[leftPageIndex]) {
								pages[leftPageIndex].update();
							}
							if (pages[rightPageIndex]) {
								pages[rightPageIndex].update();
							}
						}
					}
				}
				// Loop again on next animation frame
				GLOBAL.requestAnimationFrame(loop);
				
				if (!paused) {
					render();
				}
			}
		},
		
		// Draw each visible page
		render = function () {
			
			if (curPageIndex === -1) {
				// Render cover
				cover.render();
			} else {
				// Render visible pages
				if (pages[leftPageIndex]) {
					pages[leftPageIndex].render();
				}
				if (pages[rightPageIndex]) {
					pages[rightPageIndex].render();
				}
			}
		},
		
		// Handle drag on a page to the left
		pageDraggedLeft = function (page) {
		
			// If the page dragged is the right page or the cover
			if (page === pages[rightPageIndex] || page === cover) {
				that.nextPage();
			} else {
				if (curOrientation === "SINGLE-PAGE") {
					that.nextPage();
				}
				// If the left page is dragged left in two-page layout then do nothing
				//     because it would do nothing on a real book
			}
		},
		
		// Handle drag on a page to the right
		pageDraggedRight = function (page) {
			
			// If the page dragged is the left page
			if (page === pages[leftPageIndex]) {	
				that.previousPage();
			} else {
				if (curOrientation === "SINGLE-PAGE") {
					that.previousPage();
				}
				// If the right page is dragged right in two-page layout then do nothing
				//     because it would do nothing on a real book
			}
		},
		
		// When the left page sound is done playing
		leftPageSoundComplete = function () {
		
			audioPlayer.removeEventListener("PLAY_COMPLETE", leftPageSoundComplete);
			
			// Play the right page sound if it exists
			if (pages[rightPageIndex].pageSound) {
				loud();
				audioPlayer.play(pages[rightPageIndex].pageSound);
				audioPlayer.addEventListener("PLAY_COMPLETE", rightPageSoundComplete);
			} else {
				silent();
			}
		},
		
		// When the left page sound is done playing
		rightPageSoundComplete = function () {
			audioPlayer.removeEventListener("PLAY_COMPLETE", rightPageSoundComplete);
			silent();
		},
		
		// Hide ui elements on devices
		hideBrowserUi = function () {
		
			// Scroll to url bar up out of the viewport
			GLOBAL.document.body.style.height = "200%";
				
			GLOBAL.scrollTo(0, 1);

			GLOBAL.document.body.style.height = GLOBAL.innerHeight + "px";
		},
		
		fitWidth = function (containerWidth) {		

			// Singe-Page layout
			if (curOrientation === "SINGLE-PAGE") {
				// Scale the container element to zoom on one page
				if (curPageIndex !== -1) {
					containerWidth *= 1.8;
				}
			}
			
			// Calculate the book margin from the minimum book margin percentage
			bookMargin = containerWidth * (minBookMargin / 100);

			// Set the book to the container width minus the margin
			bookContainerElement.style.width = GLOBAL.parseInt(containerWidth - bookMargin * 2, 10) + "px";		
			pagesContainerElement.style.width = GLOBAL.parseInt(containerWidth - bookMargin * 2, 10) + "px";

			// Determine the page dimensions based on the actual width of one of the page elements
			pageElementWidth = rightPageContainerElement.offsetWidth;
			// Calculate the page height to be proportional to the actual page width
			pageElementHeight = pageElementWidth / bookConfig.pageWidth * bookConfig.pageHeight;
			
			// Set the height of the book
			bookContainerElement.style.margin = bookMargin + "px";
			bookContainerElement.style.height = GLOBAL.parseInt(pageElementHeight) + "px";
			pagesContainerElement.style.height = GLOBAL.parseInt(pageElementHeight) + "px";
			
			// Set the page turn dimensions (add a pixel to width to ensure its larger)
			pageTurnContainerElement.style.width = GLOBAL.parseInt(pageElementWidth, 10) + 1 + "px";
			pageTurnContainerElement.style.height = GLOBAL.parseInt(pageElementHeight, 10) + "px";
		},
		
		fitHeight = function (containerHeight) {

			// Calculate the book margin from the minimum book margin percentage
			bookMargin = containerHeight * (minBookMargin / 100);
		
			pagesContainerElement.style.height = (containerHeight - bookMargin * 2) + "px";
			bookContainerElement.style.height = (containerHeight - bookMargin * 2) + "px";
			
			// Determine the page dimensions based on the actual width of one of the page elements
			pageElementHeight = rightPageContainerElement.offsetHeight;
			// Calculate the page width to be proportional to the actual page height
			pageElementWidth = pagesContainerElement.offsetHeight / bookConfig.pageHeight * bookConfig.pageWidth;

			// If the current page is the cover then the width is the width of a page minus margin
			if (curPageIndex === -1) {
				// Set the width of the book
				pagesContainerElement.style.width = GLOBAL.parseInt(pageElementWidth, 10)  + "px";
				bookContainerElement.style.width = GLOBAL.parseInt(pageElementWidth, 10) + "px";
			// If the current page is not the cover then the width is times two (pages)
			} else {
				// Set the width of the book
				pagesContainerElement.style.width = GLOBAL.parseInt(pageElementWidth * 2, 10)  + "px";
				bookContainerElement.style.width = GLOBAL.parseInt(pageElementWidth * 2, 10) + "px";
			}
			
			// Set the page turn dimensions (add a pixel to width to ensure its larger)
			pageTurnContainerElement.style.width = GLOBAL.parseInt(pageElementWidth, 10) + 1 + "px";
			pageTurnContainerElement.style.height = pageElementHeight + "px";
		},
		
		// Add a class of "loud" to the pages container
		loud = function () {
			pagesContainerElement.className = pagesContainerElement.className.replace(" loud", "");
			pagesContainerElement.className = pagesContainerElement.className.replace(" silent", "");
			pagesContainerElement.className += " loud";	
		},
		
		// Add a class of "silent" to the pages container
		silent = function () {
			pagesContainerElement.className = pagesContainerElement.className.replace(" loud", "");
			pagesContainerElement.className = pagesContainerElement.className.replace(" silent", "");
			pagesContainerElement.className += " silent";	
		},
			
		// Handles changes to the layout
		updateLayout = function () {
		
			var orientation;

			hideBrowserUi();		
			// Update the current orientation
			orientation = (storybookContainerElement.clientHeight > storybookContainerElement.clientWidth) ? "SINGLE-PAGE" : "TWO-PAGE";
			
			// If the orientation has changed dispatch an event with the current orientation
			if (curOrientation !== orientation) {
				that.dispatchEvent("LAYOUT_CHANGE", orientation);
				curOrientation = orientation;
			}
			
			fitWidth(storybookContainerElement.offsetWidth);
							
			// If the book is larger than the container
			if (bookContainerElement.offsetHeight > storybookContainerElement.offsetHeight * (1 - (minBookMargin / 100) * 2)) {	
				fitHeight(storybookContainerElement.offsetHeight);
			}

			// Set the overall font size by setting the storybook element font size
			storybookContainerElement.style.fontSize = (pageElementWidth / bookConfig.pageWidth) + "px";
			
			// Position the book
			updatePosition();
		},
		
		// Position the book in the viewport
		updatePosition = function () {
		
			var containerWidth = storybookContainerElement.offsetWidth;

			// Center the book vertically
			bookContainerElement.style.marginTop = (storybookContainerElement.offsetHeight - bookContainerElement.offsetHeight) / 2 + "px";

			// If the book is closed and the cover is displayed
			if (curPageIndex === -1) {
			
				bookContainerElement.style.transition = "";
				bookContainerElement.style["-webkit-transition"] = "";
				bookContainerElement.style["-moz-transition"] = "";
				bookContainerElement.style["-ms-transition"] = "";
				bookContainerElement.style["-o-transition"] = "";
					
				// Center the cover
				bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
			} else {
			
				if (curOrientation === "SINGLE-PAGE") {
					
					bookContainerElement.style.transition = "margin-left " + pageSlideDuration / 1000 + "s linear";
					bookContainerElement.style["-webkit-transition"] = "margin-left " + pageSlideDuration / 1000 + "s linear";
					bookContainerElement.style["-moz-transition"] = "margin-left " + pageSlideDuration / 1000 + "s linear";
					bookContainerElement.style["-ms-transition"] = "margin-left " + pageSlideDuration / 1000 + "s linear";
					bookContainerElement.style["-o-transition"] = "margin-left " + pageSlideDuration / 1000 + "s linear";
					
					// If an current page index is an odd (left page)
					if (curPageIndex % 2) {
						
						// Zoom on right page
						bookContainerElement.style.marginLeft = -(bookMargin + pageElementWidth * 2 - containerWidth) + "px";
					} else {
						// Zoom on left page
						bookContainerElement.style.marginLeft = bookMargin + "px";
					}

				} else {
					bookContainerElement.className = "";
					// Center the book horizontally
					bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
				}
			}
		},
		
		// Position the book in the viewport
		updatePosition2 = function () {
	
			var containerWidth = storybookContainerElement.offsetWidth;

			// Center the book vertically
			bookContainerElement.style.marginTop = (storybookContainerElement.offsetHeight - bookContainerElement.offsetHeight) / 2 + "px";

			// If the book is closed and the cover is displayed
			if (curPageIndex === -1) {
			
				bookContainerElement.style.transition = "";
				bookContainerElement.style["-webkit-transition"] = "";
				bookContainerElement.style["-moz-transition"] = "";
				bookContainerElement.style["-ms-transition"] = "";
				bookContainerElement.style["-o-transition"] = "";

				// Center the cover
				bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
			} else {
			
				if (curOrientation === "SINGLE-PAGE") {
					
					bookContainerElement.style.transition = "margin-left " + pageTurnDuration / 1000 + "s linear";
					bookContainerElement.style["-webkit-transition"] = "margin-left " + pageTurnDuration / 1000 + "s linear";
					bookContainerElement.style["-moz-transition"] = "margin-left " + pageTurnDuration / 1000 + "s linear";
					bookContainerElement.style["-ms-transition"] = "margin-left " + pageTurnDuration / 1000 + "s linear";
					bookContainerElement.style["-o-transition"] = "margin-left " + pageTurnDuration / 1000 + "s linear";
					
					// If an current page index is an odd (left page)
					if (targetPageIndex % 2) {
						
						// Zoom on right page
						bookContainerElement.style.marginLeft = -(bookMargin + pageElementWidth * 2 - containerWidth) + "px";
					} else {
						// Zoom on left page
						bookContainerElement.style.marginLeft = bookMargin + "px";
					}

				} else {
					bookContainerElement.className = "";
					// Center the book horizontally
					bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
				}
			}
		},
		
		// After page turning is complete
		onNavigateComplete = function () {

			if (targetPageIndex !== curPageIndex) {
				// If turning forward
				if (targetPageIndex > curPageIndex) {
				
					// Position the non-turning pages
					pagesContainerElement.style.marginLeft = "0";

					// If the book is open
					// The pages container is the width of a page
					pagesContainerElement.style.width = "100%";
					// The left page will be hidden 
					leftPageContainerElement.style.display = "block";
					// The right page will be full width 
					rightPageContainerElement.style.width = "50%";
					
					sb.removeAllChildren(leftPageContainerElement);
					leftPageContainerElement.appendChild(pages[leftPageIndex].getElement());
					
					sb.removeAllChildren(rightPageContainerElement);
					rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
				// If turning back
				} else {
					sb.removeAllChildren(rightPageContainerElement);
					// If the current page is the cover
					if (targetPageIndex === -1) {
						// Position the non-turning pages
						pagesContainerElement.style.marginLeft = "0";
						
						// If the book is closed
						// The pages container is the width of a page
						pagesContainerElement.style.width = "50%";
						// The left page will be hidden 
						leftPageContainerElement.style.display = "none";
						// The right page will be full width 
						rightPageContainerElement.style.width = "100%";
					
						rightPageContainerElement.appendChild(cover.getElement());
					} else {
						rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
					}
				}
			}
					
			// Clear page turn container
			sb.removeAllChildren(pageTurnContainerElement);
			
			// Hide the turning page
			pageTurnContainerElement.style.display = "none";
			
			curPageIndex = targetPageIndex;
			
			// Update the size of the book
			updateLayout();
		
			// If the current page is the cover
			if (targetPageIndex === -1) {
				
				cover.navigationToComplete();
				
				// If the cover has sound
				if (cover.pageSound) {
					// Play the page sound
					audioPlayer.play(cover.pageSound);
				}
			} else {
				pages[leftPageIndex].navigationToComplete();
				pages[rightPageIndex].navigationToComplete();
			
				// If single page layout
				if (curOrientation === "SINGLE-PAGE") {
					// If the page is the left page
					if (leftPageIndex === curPageIndex) {
						if (pages[leftPageIndex].pageSound) {
							// Play the page sound
							audioPlayer.play(pages[leftPageIndex].pageSound);
						}
					// If the page is the right page
					} else {
						if (pages[rightPageIndex].pageSound) {
							// Play the page sound
							audioPlayer.play(pages[rightPageIndex].pageSound);
						}
					}
				// if two-page layout
				} else {
					// If the left page has sound
					if (pages[leftPageIndex].pageSound) {
						// Play the page sound
						loud();
						audioPlayer.play(pages[leftPageIndex].pageSound);
						audioPlayer.addEventListener("PLAY_COMPLETE", leftPageSoundComplete);
					// If the right page has sound
					} else if (pages[rightPageIndex].pageSound) {
						// Play the page sound
						loud();
						audioPlayer.play(pages[leftPageIndex].pageSound);
						audioPlayer.addEventListener("PLAY_COMPLETE", rightPageSoundComplete);
					}
				}
			}
			
			// If the current page is the cover
			if (targetPageIndex === -1) {
				// Turn off the previous page button
				if (prevPageButtonElement) {
					prevPageButtonElement.style.display = "none";
				}
				if (nextPageButtonElement) {
					nextPageButtonElement.style.display = "block";	
				}
			} else {
				// Hide page navigation buttons when at the beginning and end
				if (curOrientation === "SINGLE-PAGE") {
					if (prevPageButtonElement) {
						prevPageButtonElement.style.display = (targetPageIndex === -1) ? "none" : "block";
					}
					if (nextPageButtonElement) {
						nextPageButtonElement.style.display = (targetPageIndex === pages.length - 1) ? "none" : "block";
					}
				} else {
					if (prevPageButtonElement) {
						prevPageButtonElement.style.display = (leftPageIndex === -1) ? "none" : "block";
					}
					if (nextPageButtonElement) {
						nextPageButtonElement.style.display = (rightPageIndex === pages.length - 1) ? "none" : "block";
					}
				}
			}
			
			that.dispatchEvent("PAGE_CHANGE");
			
			navigating = false;
		},
		
		// After page that is turning is perpendicular to the book
		onNavigateMiddle = function () {
		
			var pageContainerElement,
				gradientElement;

			// Clear page turn container
			sb.removeAllChildren(pageTurnContainerElement);
			
			// If turning forward
			if (targetPageIndex > curPageIndex) {
				
				// Create a container for the turning page
				pageContainerElement = GLOBAL.document.createElement("div");
				pageContainerElement.className = "pbsPageTurnPageContainer";
				pageTurnContainerElement.appendChild(pageContainerElement);
				
				// If the current page is the cover
				if (curPageIndex === -1) {
					// Position the turning page
					pageTurnContainerElement.style.marginLeft = -pageElementWidth / 2 + "px";
				} else {
					// Position the turning page
					pageTurnContainerElement.style.marginLeft = "0";
				}
				
				// Add the turning page to the turning page container
				pageContainerElement.appendChild(pages[leftPageIndex].getElement());
				
				// Create and add a gradient on top of the page	
				gradientElement = GLOBAL.document.createElement("div");
				gradientElement.className = "pbsLeftPageTurnGradient";
				pageTurnContainerElement.appendChild(gradientElement);
				
				pageTurnContainerElement.style.transformOrigin = "right top";
				pageTurnContainerElement.style.webkitTransformOrigin = "right top";
				pageTurnContainerElement.style.mozTransformOrigin = "right top";
				pageTurnContainerElement.style.msTransformOrigin = "right top";
				pageTurnContainerElement.style.oTransformOrigin = "right top";

			// If turning back
			} else {

				// Create a container for the turning page
				pageContainerElement = GLOBAL.document.createElement("div");
				pageContainerElement.className = "pbsPageTurnPageContainer";
				pageTurnContainerElement.appendChild(pageContainerElement);
				
				// If the target page is the cover
				if (targetPageIndex === -1) {
					pageTurnContainerElement.style.marginLeft = pageElementWidth + "px";
					
					// Add the cover to the turning page container
					pageContainerElement.appendChild(cover.getElement());
					cover.update();
					cover.render();
				} else {
					pageTurnContainerElement.style.marginLeft = pageElementWidth + "px";
					
					// Add the turning page to the turning page container
					pageContainerElement.appendChild(pages[rightPageIndex].getElement());
				}
				
				// Create and add a gradient on top of the page	
				gradientElement = GLOBAL.document.createElement("div");
				gradientElement.className = "pbsRightPageTurnGradient";
				pageTurnContainerElement.appendChild(gradientElement);
				
				pageTurnContainerElement.style.transformOrigin = "left top";
				pageTurnContainerElement.style.webkitTransformOrigin = "left top";
				pageTurnContainerElement.style.mozTransformOrigin = "left top";
				pageTurnContainerElement.style.msTransformOrigin = "left top";
				pageTurnContainerElement.style.oTransformOrigin = "left top";
			}
			
			gradientElement.style.opacity = 1;
			gradientElement.style.transition = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-webkit-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-moz-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-ms-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-o-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			
			GLOBAL.setTimeout(function () {
				gradientElement.style.opacity = 0;
				
				pageTurnContainerElement.style.transform = "scale(1, 1)";
				pageTurnContainerElement.style["-webkit-transform"] = "scale(1, 1)";
				pageTurnContainerElement.style["-moz-transform"] = "scale(1, 1)";
				pageTurnContainerElement.style["-ms-transform"] = "scale(1, 1)";
				pageTurnContainerElement.style["-o-transform"] = "scale(1, 1)";
			}, 0);
			
			GLOBAL.setTimeout(onNavigateComplete, pageTurnDuration / 2);
		},

		// Sets the current page index and updates pages if neccessary
		navigateToPageIndex = function (pageIndex, doNotAnimate) {
		
			var curLeftPageIndex = leftPageIndex, 
				curRightPageIndex = rightPageIndex,
				pageContainerElement,
				gradientElement,
				leftMargin;
				
			if (navigating) {
				return;
			}
			
			sb.log("Navigate to page " + (pageIndex + 1));
				
			// If no previous page indices or duration is zero then do not animate
			if (curLeftPageIndex === undefined || curRightPageIndex === undefined || pageTurnDuration === 0) {
				doNotAnimate = true;
			}

			targetPageIndex = pageIndex;
			
			// Stop any sound that may be playing
			if (audioPlayer) {
				audioPlayer.stop();
			}
			
			// Clear page turn container
			sb.removeAllChildren(pageTurnContainerElement);

			// If an target page index is an odd (right page) i.e. index 2 is page 3
			if (targetPageIndex % 2) {
				leftPageIndex = targetPageIndex - 1;
				rightPageIndex = targetPageIndex;
			// If an target page index is an even (left page)	
			} else {
				leftPageIndex = targetPageIndex;
				rightPageIndex = targetPageIndex + 1;
			}

			// Turn off the page buttons
			if (prevPageButtonElement) {
				prevPageButtonElement.style.display = "none";
			}
			if (nextPageButtonElement) {
				nextPageButtonElement.style.display = "none";
			}

			// Insert page elements of two pages that should be visible into the page containers
			// If the page is not changing (happens first time)
			if (targetPageIndex === curPageIndex) {
				// If the cover
				if (curPageIndex === -1) {
					rightPageContainerElement.appendChild(cover.getElement());
				} else {
					sb.removeAllChildren(leftPageContainerElement);
					leftPageContainerElement.appendChild(pages[leftPageIndex].getElement());	
					sb.removeAllChildren(rightPageContainerElement);
					rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
				}
			// If turning forward
			} else if (targetPageIndex > curPageIndex) {
				if (!doNotAnimate) {
					sb.removeAllChildren(leftPageContainerElement);
					// If not the cover
					if (curPageIndex !== -1) {
						leftPageContainerElement.appendChild(pages[curLeftPageIndex].getElement());
					}
				}
				sb.removeAllChildren(rightPageContainerElement);
				rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
			// If turning back
			} else {
				sb.removeAllChildren(leftPageContainerElement);
				
				// If not the cover
				if (targetPageIndex !== -1) {
					leftPageContainerElement.appendChild(pages[leftPageIndex].getElement());
				}
				
				if (!doNotAnimate) {
					sb.removeAllChildren(rightPageContainerElement);
					rightPageContainerElement.appendChild(pages[curRightPageIndex].getElement());
				}
			}

			// Call navigation start methods
			if (pages[leftPageIndex]) {
				pages[leftPageIndex].navigationToBegin();
			}
			if (pages[rightPageIndex]) {
				pages[rightPageIndex].navigationToBegin();
			}
			
			if (doNotAnimate) {
				// If the current page is the cover
				if (targetPageIndex === -1) {
					// If the book is closed
					// The pages container is the width of a page
					pagesContainerElement.style.width = "50%";
					// The left page will be hidden 
					leftPageContainerElement.style.display = "none";
					// The right page will be full width 
					rightPageContainerElement.style.width = "100%";
				} else {
					// If the book is open
					// Show both pages
					leftPageContainerElement.style.display = "block";
					rightPageContainerElement.style.display = "block";
					// The page containers will be half width so both pages will fit
					leftPageContainerElement.style.width = "50%";
					rightPageContainerElement.style.width = "50%";
				}
				
				onNavigateComplete();
			} else {
				// If turning forward
				if (targetPageIndex > curPageIndex) {
					// If in two-page layout or in single page layout and the right page
					if (curOrientation === "TWO-PAGE" || curPageIndex % 2) {
	
						// Create a container for the turning page
						pageContainerElement = GLOBAL.document.createElement("div");
						pageContainerElement.className = "pbsPageTurnPageContainer";
						pageTurnContainerElement.appendChild(pageContainerElement);
	
						// If the current page is the cover
						if (curPageIndex === -1) {
						
							// Position the turning pages
							pageTurnContainerElement.style.marginLeft = pageElementWidth / 2 + "px";
							// Position the non-turning pages
							pagesContainerElement.style.marginLeft = pageElementWidth / 2 + "px";
							
							// The pages container is the width of a page
							pagesContainerElement.style.width = pageElementWidth + "px";
							// The left page will be hidden 
							leftPageContainerElement.style.display = "none";
							// The right page will be full width 
							rightPageContainerElement.style.width = pageElementWidth + "px";
							
							// Add the cover to the turning container
							pageContainerElement.appendChild(cover.getElement());
							
							// Add the first and second page to the right page container
							sb.removeAllChildren(leftPageContainerElement);
							leftPageContainerElement.appendChild(pages[leftPageIndex].getElement());
					
							sb.removeAllChildren(rightPageContainerElement);
							rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
						} else {
							// Position the turning pages
							pageTurnContainerElement.style.marginLeft = pageElementWidth + "px";
							
							pageContainerElement.appendChild(pages[curRightPageIndex].getElement());
						}
						
						// Create and add a gradient on top of the page	
						gradientElement = GLOBAL.document.createElement("div");
						gradientElement.className = "pbsRightPageTurnGradient";
						pageTurnContainerElement.appendChild(gradientElement);
						
						gradientElement.style.opacity = 0;
						gradientElement.style.transition = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-webkit-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-moz-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-ms-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-o-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";

						pageTurnContainerElement.style.transformOrigin = "left top";
						pageTurnContainerElement.style.webkitTransformOrigin = "left top";
						pageTurnContainerElement.style.mozTransformOrigin = "left top";
						pageTurnContainerElement.style.msTransformOrigin = "left top";
						pageTurnContainerElement.style.oTransformOrigin = "left top";
						
						GLOBAL.setTimeout(function () {
							pageTurnContainerElement.style.transform = "scale(0, 1)";
							pageTurnContainerElement.style["-webkit-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-moz-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-ms-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-o-transform"] = "scale(0, 1)";
							
							gradientElement.style.opacity = 1;
						}, 0);
						
						pageTurnContainerElement.style.display = "block";
						
						GLOBAL.setTimeout(updatePosition2, 500);
						
						navigating = true;
						GLOBAL.setTimeout(onNavigateMiddle, pageTurnDuration / 2);
					} else {
						onNavigateComplete();
					}
				// If turning back
				} else {
					// If in two-page layout or in single page layout and the current page is left page
					if (curOrientation === "TWO-PAGE" || curPageIndex % 2 === 0) {
						
						// Create a container for the turning page
						pageContainerElement = GLOBAL.document.createElement("div");
						pageContainerElement.className = "pbsPageTurnPageContainer";
						pageTurnContainerElement.appendChild(pageContainerElement);
						
						// Add the turning page to the turning page container
						pageContainerElement.appendChild(pages[curLeftPageIndex].getElement());
						
						// Position the turning page container
						pageTurnContainerElement.style.marginLeft = 0;
						
						// If the target page is the cover
						if (targetPageIndex === -1) {
						
							// Position the non-turning pages
							pagesContainerElement.style.marginLeft = pageElementWidth + "px";
							
							// The pages container is the width of a page
							pagesContainerElement.style.width = pageElementWidth + "px";
							// The left page will be hidden 
							leftPageContainerElement.style.display = "none";
							// The right page will be full width 
							rightPageContainerElement.style.width = pageElementWidth + "px";
						}
						
						// Create and add a gradient on top of the page	
						gradientElement = GLOBAL.document.createElement("div");
						gradientElement.className = "pbsLeftPageTurnGradient";
						pageTurnContainerElement.appendChild(gradientElement);
						
						gradientElement.style.opacity = 0;
						gradientElement.style.transition = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-webkit-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-moz-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-ms-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
						gradientElement.style["-o-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";

						pageTurnContainerElement.style.transformOrigin = "right top";
						pageTurnContainerElement.style.webkitTransformOrigin = "right top";
						pageTurnContainerElement.style.mozTransformOrigin = "right top";
						pageTurnContainerElement.style.msTransformOrigin = "right top";
						pageTurnContainerElement.style.oTransformOrigin = "right top";
						
						GLOBAL.setTimeout(function () {
							pageTurnContainerElement.style.transform = "scale(0, 1)";
							pageTurnContainerElement.style["-webkit-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-moz-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-ms-transform"] = "scale(0, 1)";
							pageTurnContainerElement.style["-o-transform"] = "scale(0, 1)";
							
							gradientElement.style.opacity = 1;
						}, 0);
						
						pageTurnContainerElement.style.display = "block";
						
						GLOBAL.setTimeout(updatePosition2, 500);
						
						navigating = true;
						GLOBAL.setTimeout(onNavigateMiddle, pageTurnDuration / 2);
					} else {
						onNavigateComplete();
					}
				}
			}
		},
		
		// When all pages have loaded all resources
		start = function () {
		
			var i;
			
			// Initially render all the pages so they are ready to be displayed
			for (i = 0; i < pages.length; i += 1) {
				cover.render();
				pages[i].render();
			}
		
			storybookContainerElement.innerHTML = "";
			// Add elements to book elements
			storybookContainerElement.appendChild(bookWrapperElement);
			storybookContainerElement.appendChild(navElement);
			
			

			// Listen for changes to layout
			GLOBAL.onorientationchange = that.onOrientationChange;
			GLOBAL.addEventListener("resize", updateLayout);
			
			updateLayout();
			
			// Set the current page index to the cover or a starting page in the config
			curPageIndex = (bookConfig.startOnPage !== undefined) ? (bookConfig.startOnPage - 1) : -1;
			
			// Goto the current page index
			navigateToPageIndex(curPageIndex, true);

			updateLayout();
			
			//storybookContainerElement.addEventListener("touchstart", updateLayout);
			storybookContainerElement.addEventListener("touchmove", function (e) {
				// Prevent default swipe behavior
				e.preventDefault();
			});
			
			// Draw previous page button and add event listener
			if (prevPageButtonSprite) {
				prevPageButtonSprite.update();
				prevPageButtonSprite.render();
				prevPageButtonSprite.addEventListener("PRESS", that.previousPage);
			}
			
			// Draw next page button and add event listener
			if (nextPageButtonSprite) {
				nextPageButtonSprite.update();
				nextPageButtonSprite.render();
				nextPageButtonSprite.addEventListener("PRESS", that.nextPage);
			}
			
			that.dispatchEvent("STARTED");
			
			loop();
		},
		
		// Create resource objects for url keys in the configuration file
		createResources = function () {
		
			var i, j, k, key, key2;
			
			// TODO: possibly search the whole configuration file via DFS, BFS or similar
			// Create resource objects but don't load them yet.
			for (key in bookConfig.pageBackground) {
				if (bookConfig.pageBackground.hasOwnProperty(key)) {
					if (key === "url") {
						// Add a new resource object with the url
						bookConfig.pageBackground.resource = resourceLoader.addToQueue(bookConfig.pageBackground.url);
					}
				}
			}
			
			for (key in bookConfig.oddPageBackground) {
				if (bookConfig.oddPageBackground.hasOwnProperty(key)) {
					if (key === "url") {
						// Add a new resource object with the url
						bookConfig.oddPageBackground.resource = resourceLoader.addToQueue(bookConfig.oddPageBackground.url);
					}
				}
			}
			
			for (key in bookConfig.evenPageBackground) {
				if (bookConfig.evenPageBackground.hasOwnProperty(key)) {
					if (key === "url") {
						// Add a new resource object with the url
						bookConfig.evenPageBackground.resource = resourceLoader.addToQueue(bookConfig.evenPageBackground.url);
					}
				}
			}
			
			for (key in config.cover.background) {
				if (config.cover.background.hasOwnProperty(key)) {
					if (key === "url") {
						// Add a new resource object with the url
						config.cover.background.resource = resourceLoader.addToQueue(config.cover.background.url);
					}
				}
			}
			
			for (j = 0; j < config.cover.content.length; j += 1) {
				for (key in config.cover.content[j]) {
					if (key === "url") {
						// Add a new resource object with the url
						config.cover.content[j].resource = resourceLoader.addToQueue(config.cover.content[j].url);
					} else if (key === "content") {
						for (k = 0; k < config.cover.content[j].content.length; k += 1) {
							for (key2 in config.cover.content[j].content[k]) {
								if (key2 === "url") {
									// Add a new resource object with the url
									config.cover.content[j].content[k].resource = resourceLoader.addToQueue(config.cover.content[j].content[k].url);
								}
							}
						}
					}
				}
			}
			
			for (i = 0; i < config.pages.length; i += 1) {
				for (key in config.pages[i].background) {
					if (config.pages[i].background.hasOwnProperty(key)) {
						if (key === "url") {
							// Add a new resource object with the url
							config.pages[i].background.resource = resourceLoader.addToQueue(config.pages[i].background.url);
						}
					}
				}
				
				for (j = 0; j < config.pages[i].content.length; j += 1) {
					for (key in config.pages[i].content[j]) {
						if (key === "url") {
							// Add a new resource object with the url
							config.pages[i].content[j].resource = resourceLoader.addToQueue(config.pages[i].content[j].url);
						} else if (key === "content") {
							for (k = 0; k < config.pages[i].content[j].content.length; k += 1) {
								for (key2 in config.pages[i].content[j].content[k]) {
									if (key2 === "url") {
										// Add a new resource object with the url
										config.pages[i].content[j].content[k].resource = resourceLoader.addToQueue(config.pages[i].content[j].content[k].url);
									}
								}
							}
						}
						
						
					}
					// If the type is Drawing Pad
					if (config.pages[i].content[j].type.toUpperCase() === "DRAWINGPAD") {
						
						if (config.pages[i].content[j].overlayUrl) {
							config.pages[i].content[j].overlayResource = resourceLoader.addToQueue(config.pages[i].content[j].overlayUrl);
						}
						if (config.pages[i].content[j].textureUrl) {
							config.pages[i].content[j].textureResource = resourceLoader.addToQueue(config.pages[i].content[j].textureUrl);
						}
						
						for (key in config.pages[i].content[j]) {
							if (key === "colorButtons") {
								for (k = 0; k < config.pages[i].content[j].colorButtons.length; k += 1) {
									for (key2 in config.pages[i].content[j].colorButtons[k]) {
										if (key2 === "url") {
											// Add a new resource object with the url
											config.pages[i].content[j].colorButtons[k].resource = resourceLoader.addToQueue(config.pages[i].content[j].colorButtons[k].url);
										}
									}
								}
							} else if (key === "clearButtons") {
								for (k = 0; k < config.pages[i].content[j].clearButtons.length; k += 1) {
									for (key2 in config.pages[i].content[j].clearButtons[k]) {
										if (key2 === "url") {
											// Add a new resource object with the url
											config.pages[i].content[j].clearButtons[k].resource = resourceLoader.addToQueue(config.pages[i].content[j].clearButtons[k].url);
										}
									}
								}
							} else if (key === "eraserButtons") {
								for (k = 0; k < config.pages[i].content[j].eraserButtons.length; k += 1) {
									for (key2 in config.pages[i].content[j].eraserButtons[k]) {
										if (key2 === "url") {
											// Add a new resource object with the url
											config.pages[i].content[j].eraserButtons[k].resource = resourceLoader.addToQueue(config.pages[i].content[j].eraserButtons[k].url);
										}
									}
								}
							}					
						}
					}
				}				
			}
		},
		
		updateLoadMessage = function (e) {
		
			if (e) {
				loadEvent = e;
			} else {
				loadEvent = {};
				loadEvent.progress = resourceLoader.getProgress();
				loadEvent.total = resourceLoader.getTotal();
			}
		
			if (audioPlayer) {
				if (audioLoadInitiated) {
					if (audioLoadedEnough) {
						loadingContainerElement.innerHTML = '<p id="loadingText">Loading ' + (loadEvent.progress + 1) + " of " + (loadEvent.total) + "</p>";
					} else {
						loadingContainerElement.innerHTML = '<p id="loadingText">Loading ' + loadEvent.progress + " of " + (loadEvent.total + 1) + "</p>";
					}
				} else {
					loadingContainerElement.innerHTML = '<p id="loadingText">Loading ' + loadEvent.progress + " of " + (loadEvent.total + 1) + "<br />Press to load sound.</p>";
				}
			} else {
				loadingContainerElement.innerHTML = '<p id="loadingText">Loading ' + loadEvent.progress + " of " + loadEvent.total + "</p>";
			}
		},
		
		audioLoaded = function () {

			if (!audioLoadedEnough) {
				storybookContainerElement.removeEventListener("LOAD_STARTED", audioLoaded);
			
				audioLoadedEnough = true;
				
				if (resourceLoadComplete) {
					start();
				}
			}
		},
		
		resourcesLoaded = function () {
			
			resourceLoadComplete = true;
			
			that.dispatchEvent("LOADED");
			
			if (!audioPlayer || audioLoadedEnough === true) {
				start();
			}
		},
		
		loadAudio = function () {

			storybookContainerElement.removeEventListener("PRESS", loadAudio);
			
			audioPlayer.addEventListener("LOAD_STARTED", audioLoaded);
			audioPlayer.load();
			
			audioLoadInitiated = true;
			
			updateLoadMessage();
		},
		
		// Initialize the storybook
		init = function () {
		
			var i, pageContainerElement, audioFilename;
			
			if (!initialized) {
			
				initialized = true;
				
				// Create the following markup and inject into the storybook container element
				//
				//  <div id="pbsStorybookContainer">
	            //      <div class="pbsPagesContainer">
	            //          <div id="pbsLeftPage" class="pbsPageContainer"></div>
	            //          <div id="pbsRightPage" class="pbsPageContainer"></div>
	            //      </div>        
	            //  </div>
				
				bookWrapperElement = GLOBAL.document.createElement("div");
				bookWrapperElement.id = "pbsBookWrapper";
				if (config.background && config.background.color) {
					bookWrapperElement.style.backgroundColor = config.background.color;
				}
				if (config.background && config.background.url) {
					bookWrapperElement.style.backgroundImage = "url(" + config.background.url + ")";
				}
				// Don't add to DOM until loaded
				
				bookContainerElement = GLOBAL.document.createElement("div");
				bookContainerElement.id = "pbsBookContainer";
				bookWrapperElement.appendChild(bookContainerElement);
				
				pagesContainerElement = GLOBAL.document.createElement("div");
				pagesContainerElement.className = "pbsPagesContainer";
				bookContainerElement.appendChild(pagesContainerElement);
				
				leftPageContainerElement = GLOBAL.document.createElement("div");
				leftPageContainerElement.className = "pbsPageContainer";
				leftPageContainerElement.id = "pbsLeftPage";
				leftPageContainerElement.style.width = "50%";
				pagesContainerElement.appendChild(leftPageContainerElement);
				
				rightPageContainerElement = GLOBAL.document.createElement("div");
				rightPageContainerElement.className = "pbsPageContainer";
				rightPageContainerElement.id = "pbsRightPage";
				pagesContainerElement.appendChild(rightPageContainerElement);
				
				pageTurnContainerElement = GLOBAL.document.createElement("div");
				pageTurnContainerElement.className = "pbsPageTurnContainer";
				bookContainerElement.appendChild(pageTurnContainerElement);
				
				// Add the markup for page navigation buttons
				//
				//  <nav class="pbsStorybookNav">
				//      <div id="pbsPrevPageButton" class="pbsPageButton"></div>
	            //      <div id="pbsNextPageButton" class="pbsPageButton"></div>
	            //  </nav>
	            
	            navElement = GLOBAL.document.createElement("nav");
	            navElement.className = "pbsStorybookNav";
	            // Don't add to DOM until loaded
	            
	            if (bookConfig.previousPageButton) {
		            prevPageButtonElement = GLOBAL.document.createElement("div");
		            prevPageButtonElement.id = "pbsPrevPageButton";
					prevPageButtonElement.className = "pbsPageButton";
					// Create previous button sprite
					bookConfig.previousPageButton.parentElement = prevPageButtonElement;
					bookConfig.previousPageButton.resource = resourceLoader.addToQueue(bookConfig.previousPageButton.url);
					prevPageButtonSprite = sb.sprite(GLOBAL, PBS, bookConfig.previousPageButton);
					prevPageButtonSprite = sb.makeInteractionObject(GLOBAL, PBS, prevPageButtonSprite);
					navElement.appendChild(prevPageButtonElement);
				}
				
				if (bookConfig.nextPageButton) {
					nextPageButtonElement = GLOBAL.document.createElement("div");
		            nextPageButtonElement.id = "pbsNextPageButton";
					nextPageButtonElement.className = "pbsPageButton";
					// Create next button sprite
					bookConfig.nextPageButton.parentElement = nextPageButtonElement;
					bookConfig.nextPageButton.resource = resourceLoader.addToQueue(bookConfig.nextPageButton.url);
					nextPageButtonSprite = sb.sprite(GLOBAL, PBS, bookConfig.nextPageButton);
					nextPageButtonSprite = sb.makeInteractionObject(GLOBAL, PBS, nextPageButtonSprite);
					navElement.appendChild(nextPageButtonElement);
				}
				
				createResources();
				
				pageTurnDuration = (bookConfig && bookConfig.pageTurnDuration !== undefined) ? bookConfig.pageTurnDuration : 1000;
				pageSlideDuration = (bookConfig && bookConfig.pageSlideDuration !== undefined) ? bookConfig.pageSlideDuration : 250;
				
				pageTurnContainerElement.style.transition = "transform " + pageTurnDuration / 2 / 1000 + "s linear";
				pageTurnContainerElement.style["-webkit-transition"] = "-webkit-transform " + pageTurnDuration / 2 / 1000 + "s linear";
				pageTurnContainerElement.style["-moz-transition"] = "-moz-transform " + pageTurnDuration / 2 / 1000 + "s linear";
				pageTurnContainerElement.style["-ms-transition"] = "-ms-transform " + pageTurnDuration / 2 / 1000 + "s linear";
				pageTurnContainerElement.style["-o-transition"] = "-o-transform " + pageTurnDuration / 2 / 1000 + "s linear";
				
				if (config.audio && config.audio && config.audio.name && config.audio.enabled !== false) {
					audioPlayer = sb.audioPlayer(GLOBAL, PBS, config.audio.path + config.audio.name);
				}
				
				// Create cover
				cover = sb.page(GLOBAL, PBS, config.cover, 0, {
					bookConfig: bookConfig,
					audioPlayer: audioPlayer
				});
				
				// Add cover listeners
				cover.addEventListener("DRAG_LEFT", pageDraggedLeft);
				cover.addEventListener("DRAG_RIGHT", pageDraggedRight);
		
				// Create the storybook pages
				for (i = 0; i < config.pages.length; i += 1) {
					pages[i] = sb.page(GLOBAL, PBS, config.pages[i], i + 1, {
						bookConfig: bookConfig,
						audioPlayer: audioPlayer
					});
					pages[i].update();
					pages[i].render();
				}
				
				// If an odd number of pages are specified, place a blank page at the end
				if (config.pages.length % 2) {
					pages[config.pages.length] = sb.page(GLOBAL, PBS, {}, config.pages.length + 1, {
						bookConfig: bookConfig,
						audioPlayer: audioPlayer
					});
				}
				
				// Add page listeners
				for (i = 0; i < pages.length; i += 1) {
					pages[i].addEventListener("DRAG_LEFT", pageDraggedLeft);
					pages[i].addEventListener("DRAG_RIGHT", pageDraggedRight);
				}

				updateLayout();
			} else {
				sb.error("Cannot initialize storybook more than once.");
			}
		};
		
	// Public methods
	
	// Pause
	that.pause = function () {
	
		if (!paused) {
			paused = true;
		}
	};
	
	// Unpause
	that.unpause = function () {
	
		if (paused) {
			paused = false;
		}
		
	};
		
	that.onOrientationChange = function () {
		
// TODO: Check if window.resize gets called on orientation change. If it is the following is unneccessary.
		updateLayout();
	};
	
	// Destroy the storybook
	that.destroy = function () {
	
		var i;
		
		if (!destroyed) {
			destroyed = true;

			storybookContainerElement.innerHTML = "";
			
			for (i = 0; i < pages.length; i += 1) {
				pages[i].destroy();
			}
			cover.destroy();
			
			that = null;
		}
	};
	
	that.nextPage = function () {
	
		var targetPageIndex;

		if (curOrientation === "SINGLE-PAGE") {
			// Go forward one page
			targetPageIndex = curPageIndex + 1;
		} else {
			// If current page is on the right
			if (curPageIndex % 2) {
				// Go forward one page
				targetPageIndex = curPageIndex + 1;
			// If current page is on the left
			} else {
				// Go forward two pages
				targetPageIndex = curPageIndex + 2;
			}
		}
		
		// If the target page is valid
		if (targetPageIndex < pages.length) {
			navigateToPageIndex(targetPageIndex);
		}
	};
	
	that.previousPage = function () {
		
		var targetPageIndex;
		
		if (curOrientation === "SINGLE-PAGE") {
			// Go back one page
			targetPageIndex = curPageIndex - 1;
		} else {
			// If current page is on the right
			if (curPageIndex % 2) {
				// Go back two pages
				targetPageIndex = curPageIndex - 2;
			} else {
				// Go back one page
				targetPageIndex = curPageIndex - 1;
			}
		}
	
		// If target page is valid
		if (targetPageIndex >= -1) {
			navigateToPageIndex(targetPageIndex);
		}
	};
	
	that.gotoPage = function (pageIndex) {
		
		// If target page is not valid
		if (curPageIndex - 1 < -1 || curPageIndex + 1 > pages.length) {
			
			return;
		}
		navigateToPageIndex(pageIndex);
	};
	
	that.load = function () {
		
		if (!loadStarted) {
			loadStarted = true;
			
			// Create a simple loading screen to display the loading progess
			storybookContainerElement.innerHTML = "";
			
			// Create the page container
			loadingContainerElement = GLOBAL.document.createElement("section");
			loadingContainerElement.className = "loadingContainer";
			storybookContainerElement.appendChild(loadingContainerElement);
			
			if (audioPlayer) {
				loadingView = sb.interactionObject(GLOBAL, PBS, loadingContainerElement);
				loadingView.addEventListener("PRESS", loadAudio);
			}
			
			resourceLoader.addEventListener("QUEUE_UPDATE", updateLoadMessage);

			resourceLoader.addEventListener("QUEUE_LOADED", resourcesLoaded);
			// Load all the resources
			resourceLoader.loadQueue();
		}
	};
	
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	// requestAnimationFrame polyfill by Erik Moller
	// fixes from Paul Irish and Tino Zijdel
	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { 
	            	callback(currTime + timeToCall); 
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	 
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	    }
	}());
	
	init();

	return that;
};
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
	that.pageSound = null;
	
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
//  ------------------------------------------------------------------
//  textArea.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.textArea = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		element,
		initialized = false,
		parentElement = options && options.parentElement,
		paragraphContent = [],
		paragraphElements = [],
		dirty = true,
		textArr,
		
		// Convert the html tags of a string from a <htmlTag> to [newTagName]
		//
		// Parameters
		//    text: string to be replaced
		//    htmlTag: tag name enclosed by chevrons
		//    newTagName: new tag name enclosed by square brackets
		//    allowAttr: If not true then strip out anything out of the first
		convertTag = function (text, htmlTag, newTagName, allowAttr) {
	
			var regExp,
				regExpStr,
				replaceStr;
			
			// Create the regular expression string
			// Match the first open chevron and the htmlTag
			regExpStr = "\<" + htmlTag;
			// Match anything until closing chevron (e.g <div class="container">)
			if (allowAttr) {
				regExpStr += "(.*?)";
			}
			regExpStr += "\>(.*?)\<\/" + htmlTag + "\>";

			// Create regular expression
			regExp = new RegExp(regExpStr, "gi");
			
			if (allowAttr) {
				replaceStr = "[" + newTagName + "$1]$2[/" + newTagName + "]";
			} else {
				replaceStr = "[" + newTagName + "]$1[/" + newTagName + "]";
			}
			
			return text.replace(regExp, replaceStr);
		},
		
		// Returns a string with all html tags removed string provided in the parameter
		removeHtmlTags = function (text) {
		
			var tmpElement;
			
			// Remove all HTML tags
			tmpElement = GLOBAL.document.createElement("div");
			tmpElement.innerHTML = text;
			return tmpElement.textContent || tmpElement.innerText || "";
		},
		
		init = function () {
	
			var i;
			
			if (!initialized) {
				initialized = true;
			
				that.initView();
			
				// Create the text area element
				element.className = "pbsTextArea";
				if (options.className) {
					element.className += " " + options.className;
				}
				element.style.textAlign = (options.align !== undefined) ? options.align : "center";
				element.style.fontFamily = (options.font !== undefined) ? options.font : "";
				element.style.fontSize = (options.size !== undefined) ? options.size + "em" : "1em";
				// Set the line height to the options font size to normalize inline font sizes
				element.style.lineHeight = "120%";
				
				// Set text color if specified
				if (options.color !== undefined) {
					element.style.color = options.color;
				}
		
				// For each paragraph in the options
				for (i = 0; i < textArr.length; i += 1) {
					// Set the text from the options
					paragraphContent[i] = textArr[i];
			
					// If the clean tags property is not turned off
					if (options.cleanTags !== "false") {
						
						// Convert supported HTML tags to square brackets
						//paragraphContent[i] = paragraphContent[i].replace(/\<br.*?\>/gi, "[newline]");
						paragraphContent[i] = convertTag(paragraphContent[i], "b", "bold");
						paragraphContent[i] = convertTag(paragraphContent[i], "i", "italic");
						paragraphContent[i] = convertTag(paragraphContent[i], "em", "emphasis");
						paragraphContent[i] = convertTag(paragraphContent[i], "color", "color", true);
						paragraphContent[i] = convertTag(paragraphContent[i], "size", "size", true);
						paragraphContent[i] = convertTag(paragraphContent[i], "font", "font", true);
						
						// Strip out HTML tags
						paragraphContent[i] = removeHtmlTags(paragraphContent[i]);
					}
					
					// Convert square brackets back to HTML tags
					//paragraphContent[i] = paragraphContent[i].replace(/\[newline\]/gi, "<br />");
					paragraphContent[i] = paragraphContent[i].replace(/\[bold\](.*?)\[\/bold\]/gi, "<b>$1</b>");
					paragraphContent[i] = paragraphContent[i].replace(/\[italic\](.*?)\[\/italic\]/gi, "<i>$1</i>");
					paragraphContent[i] = paragraphContent[i].replace(/\[emphasis\](.*?)\[\/emphasis\]/gi, "<em>$1</em>");
					paragraphContent[i] = paragraphContent[i].replace(/\[color=(.*?)\](.*)\[\/color\]/gi, "<span style=\"color:$1\">$2</span>");
					paragraphContent[i] = paragraphContent[i].replace(/\[size=(.*?)\](.*?)\[\/size\]/gi, "<span style=\"font-size:$1em\">$2</span>");
					paragraphContent[i] = paragraphContent[i].replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, "<span style=\"font-family:$1\">$2</span>");
		
					if (textArr.length === 1) {

						// Set the contents of the paragraph
						element.innerHTML = paragraphContent[i];
					} else {
						// Create the paragraph element
						paragraphElements[i] = GLOBAL.document.createElement("p");
						
						// Set paragraph margin if specified
						if (that.paragraphSpacing !== null) {
							paragraphElements[i].style.marginBottom = (that.paragraphSpacing.toString().toUpperCase().indexOf("PX") !== -1) ? that.paragraphSpacing : that.paragraphSpacing + "%";
						}
						
						// Add the paragraph element to the text area
						element.appendChild(paragraphElements[i]);
						// Set the contents of the paragraph
						paragraphElements[i].innerHTML = paragraphContent[i];
					}
					
				}
				
				// Listen to when the sprite is touched or clicked
				that.addEventListener("PRESS", that.press);
			}
		};
	
	// The text in the options can be an array or a string
	if (typeof options.text === "string") {
		textArr = [options.text];
	} else {
		textArr = options.text;
	}
	// Set the element to a paragraph element if only one text item, otherwise create a container div
	element = (textArr.length === 1) ? GLOBAL.document.createElement("p") : GLOBAL.document.createElement("div");
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, element);
	if (parentElement) {
		parentElement.appendChild(element);
	}
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 100;
	that.horizontalAlign = (options && options.horizontalAlign !== undefined) ? options.horizontalAlign.toUpperCase() : "LEFT";
	that.verticalAlign = (options && options.verticalAlign !== undefined) ? options.verticalAlign.toUpperCase() : "TOP";
	that.parentWidth = options.parentWidth;
	that.parentHeight = options.parentHeight;
	that.paragraphSpacing = (options.paragraphSpacing !== undefined) ? options.paragraphSpacing : null;

	// Update the text area
	that.update = function () {

	};
	
	// Draw the text area
	that.render = function () {
		 
		 if (that.dirty) {
		 	that.dirty = false;
		 }
	};
	
	that.press = function (e) {
console.log("PRESS");
	};
	
	init();

	return that;
};
//  ------------------------------------------------------------------
//  view.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.view = function (PBS, element) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		sb = PBS.KIDS.storybook;
	
	// Public properties
	that.parentWidth = 0;
	that.parentHeight = 0;
	that.x = 0;
	that.y = 0;
	that.width = 0;
	that.height = 0;
	that.horizontalAlign = "LEFT";
	that.verticalAlign = "TOP";
	that.dirty = false;
	
	// Element property getter
	that.getElement = function () {
		return element;	
	};
	
	// Initialization sets the CSS position and size of the view's element. Should be called by the object that inherits the view after its position and size are set.
	that.initView = function () {
	
		// Set the position of the element relative to the left or right
		if (that.horizontalAlign === "RIGHT") {
			// If position set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.x)) {
				if (that.parentWidth) {
					element.style.right = (sb.getNumberFromString(that.x) / that.parentWidth) * 100 + "%";
				} else {
					element.style.right = that.x;
				}
			} else {
				element.style.right = sb.getNumberFromString(that.x) + "%";
			}
		} else {
			// If position set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.x)) {
				if (that.parentWidth) {
					element.style.left = (sb.getNumberFromString(that.x) / that.parentWidth) * 100 + "%";
				} else {
					element.style.left = that.x;
				}
			} else {
				element.style.left = sb.getNumberFromString(that.x) + "%";
			}
		}
		
		// Set the position of the element relative to the top or bottom
		if (that.verticalAlign === "BOTTOM") {
			// If position set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.y)) {
				if (that.parentHeight) {
					element.style.bottom = (sb.getNumberFromString(that.y) / that.parentHeight) * 100 + "%";
				} else {
					element.style.bottom = that.y;
				}
			} else {
				element.style.bottom = sb.getNumberFromString(that.y) + "%";
			}
		} else {
			// If position set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.y)) {
				if (that.parentHeight) {
					element.style.top = (sb.getNumberFromString(that.y) / that.parentHeight) * 100 + "%";
				} else {
					element.style.top = that.y;
				}
			} else {
				element.style.top = sb.getNumberFromString(that.y) + "%";
			}
		}
		
		// Set the width of the element
		if (that.width) {
			// If width set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.width)) {
				if (that.parentWidth) {
					element.style.width = (sb.getNumberFromString(that.width) / that.parentWidth) * 100 + "%";
				} else {
					element.style.width = that.width;
				}
			} else {
				element.style.width = sb.getNumberFromString(that.width) + "%";
			}
		}
		
		// Set the height of the element
		if (that.height) {
			// If height set in pixels (e.g "99px")
			if (sb.isInPixelUnits(that.height)) {
				if (that.parentHeight) {
					element.style.height = (sb.getNumberFromString(that.height) / that.parentHeight) * 100 + "%";
				} else {
					element.style.height = that.height;
				}
			} else {
				element.style.height = sb.getNumberFromString(that.height) + "%";
			}
		}
	};
	
	// Remove the view from memory
	that.destroy = function () {		
		element = null;
		that.removeAllEventListeners();
		that = null;
	};

	return that;
};
//  ------------------------------------------------------------------
//  sprite.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.sprite = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		element,
		resource = (options && options.resource !== undefined) ? options.resource : undefined,
		ctx,
		destroyed = false,
		initialized = false,
		spec = {},
		previousFrame = 0,
		curFrame = 0,
		updateIndex = 0,
		frameWidth,
		frameHeight,
		frameDelay = options.frameDelay || 1,
		loop = options.loop,
		parentElement = options && options.parentElement,
		paused = false,
		parentWidthRatio = 1,
		parentHeightRatio = 1,
		backgroundColor = options.color,
		numFrames = options.numFrames,
		
		init = function () {

			if (!initialized) {
				initialized = true;
				
				that.initView();
	
				// If the sprite has an image
				if (resource && resource.image) {
					that.width = resource.image.width;
					that.height = resource.image.height;
				} else {
					that.width = 100;
					that.height = 100;
				}
				
				// Determine the dimensions of the frame. It may be different from the image dimensions if more than one frame
				frameWidth = numFrames ? (that.width / numFrames) : that.width;
				frameHeight = that.height;
				
				// Set the dimensions of the element
				element.width = frameWidth;
				element.height = frameHeight;
				
				// If the width was specified
				if (options.width) {
					// If px is in the width (e.g. 100px)
					if (options.width.toString().indexOf("px") !== -1) {
						element.style.width = options.width;
					} else {
						element.style.width = options.width + "%";
					}
				// Scale sprite if the parent is scaled
				} else if (that.parentWidth) {
					parentWidthRatio = (element.width / that.parentWidth);
					element.style.width = (parentWidthRatio * 100) + "%";
				}
				
				// If the height was specified
				if (options.height) {
					// If px is in the height (e.g. 100px)
					if (options.height.toString().indexOf("px") !== -1) {
						element.style.height = options.height;
					} else {
						element.style.height = options.height + "%";
					}
				// Scale sprite if the parent is scaled
				} else if (that.parentHeight) {
					parentHeightRatio = (element.height / that.parentHeight);
					element.style.height = (parentHeightRatio * 100) + "%";
				}
				
				// Listen to when the sprite is touched or clicked
				that.addEventListener("PRESS", that.press);
				
				// If auto start is turned off (it is on by default)
				if (that.autoStart === false) {
					paused = true;
				}

				that.dirty = true;
			}
		},
		
		// Call when all resources for the sprite are loaded
		resourcesReady = function () {
		
			init();
		},
		
		// Returns the animation frame to be displayed
		applyEasing = function (curTick, totalTicks, totalNumFrames) {
			
			var currentFrame;
			
			// If no easeIn option then go slow at the beginning of an animation
			if (options.easing && options.easing.toUpperCase() === "EASEIN") {
				currentFrame = totalNumFrames * (1 - GLOBAL.Math.cos(curTick / totalTicks * GLOBAL.Math.PI / 2));
			// If no easeOut option then go slow at the end of an animation
			} else if (options.easing && options.easing.toUpperCase() === "EASEOUT") {
				currentFrame = totalNumFrames * (GLOBAL.Math.sin(curTick / totalTicks * GLOBAL.Math.PI / 2));
			// If no easing then the animation frames advance linearly
			} else {

				currentFrame = totalNumFrames * curTick / totalTicks;
				
//console.log(totalNumFrames + " * " + curTick + "/" + totalTicks + " = " + currentFrame);
			}
			
			return GLOBAL.Math.floor(currentFrame);
		};
	
	// Create the sprite's canvas
	spec.width = 99 + "px";
	spec.height = 99 + "px";
	spec.className = "pbsCanvas pbsSprite";
	if (options && options.className) {	
		spec.className += " " + options.className;
	}
	ctx = PBS.KIDS.storybook.createCanvas(parentElement, spec);
	
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, ctx.canvas);
	element = that.getElement();
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 0;
	that.height = options && (options.height !== undefined) ? options.height : 0;
	that.parentWidth = options.parentWidth;
	that.parentHeight = options.parentHeight;
	that.horizontalAlign =  (options && options.horizontalAlign !== undefined) ? options.horizontalAlign.toUpperCase() : "LEFT";
	that.verticalAlign = (options && options.verticalAlign !== undefined) ? options.verticalAlign.toUpperCase() : "TOP";
	that.visible = true;
	that.alpha = 0;
	that.destroyed = false;
	that.url = options && options.url;
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
		
	that.update = function () {
		
		// If the sprite is a non-paused animation
		if (numFrames && !paused) {
		
			// If the last frame
			if (updateIndex + 1 >= numFrames * frameDelay) {
			
				// If the animation is set to loop
				if (loop) {
					curFrame = 0;
					updateIndex = 0;
					
				// If the animation is set to automatically reset
				} else if (that.autoReset) {
					
					curFrame = 0;
					updateIndex = 0;
					that.stop();
				} // Else the animation is complete so stay on the final frame
			// If the animation is not complete
			} else {
				updateIndex += 1;
				curFrame = applyEasing(updateIndex, numFrames * frameDelay, numFrames);
			}
			
			// If the current and previous frame is different then redraw
			if (previousFrame !== curFrame) {
				that.dirty = true;
				
				// Save the frame that was just drawn
				previousFrame = curFrame;
			}
		}
	};
	
	that.render = function () {
	
		var curAlpha, frameXPos;
		
		if (initialized) {
	
			if (that.dirty) {
	
				// If the sprite is visible
				if (that.visible) {
				
					curAlpha = ctx.globalAlpha;
					ctx.globalAlpha = that.alpha;
					
					// If background color
					if (backgroundColor) {

						// Draw the background color
						ctx.fillStyle = backgroundColor;
						ctx.fillRect(0, 0, frameWidth, frameHeight);
					}
					
					// If the sprite has an image
					if (resource && resource.image) {
	
						// If the sprite is an animation
						if (numFrames) {
							// Clear rect approach crashes native browser in Droid Samsung Gt-P3113
							//ctx.clearRect(0, 0, frameWidth, frameHeight);
							ctx.canvas.width = ctx.canvas.width;
							ctx.drawImage(
								resource.image,
								GLOBAL.Math.floor(curFrame * frameWidth),
								0,
								frameWidth, 
								frameHeight,
								0,
								0, 
								frameWidth,
								frameHeight
							);
						} else {
							ctx.drawImage(resource.image, 0, 0, frameWidth, frameHeight);
						}
						ctx.globalAlpha = curAlpha;
					}
					
				} else {
					ctx.clearRect(0, 0, frameWidth, frameHeight);
				}
				// Don't render again until set to dirty
				that.dirty = false;
			}
		}
	};
	
	// Element property getter
	that.getElement = function () {
	
		return element;	
	};
	
	that.play = function () {
	
		that.reset();
		
		paused = false;
	};
	
	that.isAnimation = function () {
	
		return (numFrames > 1);
	};
	
	that.resume = function () {
	
		paused = false;
		that.dirty = true;
	};
	
	that.stop = function () {
	
		paused = true;	
	};
	
	that.reset = function () {
		
		if (curFrame !== 0) {
			curFrame = 0;
			updateIndex = 0;
			that.dirty = true;
			
			that.stop();
		}
	};
	
	that.press = function () {
	
		if (options.playOnPress) {
			that.play();
		} else if (options.stopOnPress) {
			that.stop();
		} else if (options.toggleOnPress) {
			if (paused) {
				that.resume();
			} else {
				that.stop();
			}
		}
	};

	// If the sprite has an image
	if (resource && resource.image) {
		// Listen to when the image is loaded
		resource.image.addEventListener("load", resourcesReady);
	} else {
		resourcesReady();
	}

	return that;
};
//  ------------------------------------------------------------------
//  cycler.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.cycler = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		initialized = false,
		itemArray = [],
		started = false,
		activeIndex = 0, // Index of the item that is currently shown
		
		init = function () {
		
			var i, curItem, config;

			if (!initialized) {
				initialized = true;
				
				// For each item on the page
				if (options && options.content) {
					var onItemPressed = function(e) {
						
							that.dispatchEvent("PRESS", {
							x: e.x, 
							y: e.y
						});

						if (started || !itemArray[0].isAnimation() || that.autoStart) {
							that.cycle();
						}
						
						updateAnimation();
						updateVisibility();
						
						started = true;
					};

					for (i = 0; i < options.content.length; i += 1) {
						
						config = options.content[i];
						config.parentElement = options.parentElement;
						config.parentWidth = options.parentWidth;
						config.parentHeight = options.parentHeight;
						if (options.className) {
							config.className = options.className + "Sprite" + (i + 1);
						}

						curItem = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config);
						curItem = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, curItem);
						curItem.addEventListener("PRESS", onItemPressed);
						
						itemArray.push(curItem);
					}
				} else {
					PBS.KIDS.storybook.error("Cycler missing content array.");
				}
			}
		},
		
		updateVisibility = function () {
		
			var i;
		
			// Hide all items and show the active item
			for (i = 0; i < itemArray.length; i += 1) {
				itemArray[i].visible = (i === activeIndex);
				itemArray[i].dirty = true;
				itemArray[i].render();
			}
		},
		
		updateAnimation = function () {
		
			var i;
		
			// Reset all items and play the active item
			for (i = 0; i < itemArray.length; i += 1) {
				if (i === activeIndex) {
					itemArray[i].play();
				} else {	
					itemArray[i].reset();
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
		
		updateAnimation();
		updateVisibility();
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
	
		started = false;
		activeIndex = 0;
		itemArray[activeIndex].reset();
		updateVisibility();
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
		pad,
		colorButtons = [],
		clearButtons = [],
		eraserButtons = [],
		
		resourceLoaded = function () {
			that.dirty = true;
		},
		
		changeColor = function (paintColor) {
		
			pad.setTool("MARKER");	
			pad.setColor(paintColor);
		},
		
		clearPad = function () {
		
			pad.clear();
		},
		
		setEraserTool = function () {

			pad.setTool("ERASER");	
		},
		
		init = function () {
	
			var i, width, height, key, key2;
			
			if (!initialized) {
				initialized = true;
			
				that.initView();
			
				// Create the drawing pad element
				element.className = "pbsDrawingPad";
				if (options.className) {
					element.className += " " + options.className;
				}
				
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
					radius: options.radius,
					overlayUrl: options.overlayUrl,
					textureUrl: options.textureUrl
				});
				
				for (key in options) {
					if (key === "colorButtons") {
						for (i = 0; i < options.colorButtons.length; i += 1) {
							for (key2 in options.colorButtons[i]) {
								if (key2 === "url") {
								
									// Set the paint color to the first color button
									if (i === 0) {
										changeColor(options.colorButtons[i].paintColor);
									}

									options.colorButtons[i].parentElement = parentElement;
									options.colorButtons[i].parentWidth = that.parentWidth;
									options.colorButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.colorButtons[i].className = options.className + "ColorButton" + (i + 1);
									}
									
									// Listen for image load
									options.colorButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									colorButtons.push(sb.sprite(GLOBAL, PBS, options.colorButtons[i]));
									colorButtons[colorButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, colorButtons[colorButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									colorButtons[colorButtons.length - 1].addEventListener(
										"PRESS", 
										changeColor.bind(null, options.colorButtons[i].paintColor)
									);
								}
							}
						}
					} else if (key === "clearButtons") {
						for (i = 0; i < options.clearButtons.length; i += 1) {
							for (key2 in options.clearButtons[i]) {
								if (key2 === "url") {

									options.clearButtons[i].parentElement = parentElement;
									options.clearButtons[i].parentWidth = that.parentWidth;
									options.clearButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.clearButtons[i].className = options.className + "ClearButton" + (i + 1);
									}
									
									// Listen for image load
									options.clearButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									clearButtons.push(sb.sprite(GLOBAL, PBS, options.clearButtons[i]));
									clearButtons[clearButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, clearButtons[clearButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									clearButtons[clearButtons.length - 1].addEventListener("PRESS", clearPad);
								}
							}
						}
					} else if (key === "eraserButtons") {
						for (i = 0; i < options.eraserButtons.length; i += 1) {
							for (key2 in options.eraserButtons[i]) {
								if (key2 === "url") {

									options.eraserButtons[i].parentElement = parentElement;
									options.eraserButtons[i].parentWidth = that.parentWidth;
									options.eraserButtons[i].parentHeight = that.parentHeight;
									if (options.className) {
										options.eraserButtons[i].className = options.className + "EraserButton" + (i + 1);
									}
									
									// Listen for image load
									options.eraserButtons[i].resource.image.addEventListener("load", resourceLoaded);
					
									eraserButtons.push(sb.sprite(GLOBAL, PBS, options.eraserButtons[i]));
									eraserButtons[eraserButtons.length - 1] = sb.makeInteractionObject(GLOBAL, PBS, eraserButtons[eraserButtons.length - 1]);
									
									// Change paint color of the drawing pad on press
									eraserButtons[eraserButtons.length - 1].addEventListener("PRESS", setEraserTool);
								}
							}
						}
					}				
				}
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
	that.dirty = true;
	
	that.parentWidth = options && (options.parentWidth !== undefined) ? options.parentWidth : 100;
	that.parentHeight = options && (options.parentHeight !== undefined) ? options.parentHeight : 100;

	// Update the text area
	that.update = function () {

	};
	
	// Draw the text area
	that.render = function () {
	
		var i;
		 
		 if (that.dirty) {
		 	that.dirty = false;
		 	
		 	//pad.render(); 	
		 	for (i = 0; i < colorButtons.length; i += 1) {
			 	colorButtons[i].render();
		 	}
		 	
		 	for (i = 0; i < eraserButtons.length; i += 1) {
			 	eraserButtons[i].render();
		 	}
		 	
		 	for (i = 0; i < clearButtons.length; i += 1) {
			 	clearButtons[i].render();
		 	}
		 }
	};
	
	init();

	return that;
};
//  ------------------------------------------------------------------
//  audioElement.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.audioPlayer = function (GLOBAL, PBS, src, options) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		initialized = false,
		loadStarted = false,
		loadComplete = false,
		playable = false,
		loadPercentage = 0,
		audioElement,
		currentSound = null,
		loadInterval,
		completeInterval,

		onPlay = function () {	

		},
		
		onPause = function () {	

		},
		
		onCanPlay = function () {	
			
			if (!playable) {
				playable = true;
				//PBS.KIDS.storybook.debug("Audio Load Started.");
				that.dispatchEvent("LOAD_STARTED");
			}
		},
		
		onCanPlayThrough = function () {	
			
			if (!playable) {
				playable = true;
				//PBS.KIDS.storybook.debug("Audio Load Started.");
				that.dispatchEvent("LOAD_STARTED");
			}
		},
		
		onLoadedData = function () {	

		},
		
		onLoadedMetadata = function () {	

		},
		
		onProgress = function () {	

		},
		
		onEnded = function () {	

		},
		
		onStalled = function () {	

		},
		
		onError = function (e) {	
			PBS.KIDS.storybook.debug("audioPlayer.onError: " + e.message);
		},
		
		init = function () {
		
			if (!initialized) {
				initialized = true;
				
				// Create the audio element
				audioElement = GLOBAL.document.createElement("audio");

				// Add listeners
				audioElement.addEventListener("pause", onPause);
				audioElement.addEventListener("play", onPlay);
				audioElement.addEventListener("canplay", onCanPlay);
				audioElement.addEventListener("canplaythrough", onCanPlayThrough);
				audioElement.addEventListener("loadeddata", onLoadedData);
				audioElement.addEventListener("loadedmetadata", onLoadedMetadata);
				audioElement.addEventListener("progress", onProgress);
				audioElement.addEventListener("ended", onEnded);
				audioElement.addEventListener("stalled", onStalled);
				audioElement.addEventListener("error", onError);
				
				// Default file extension to mpg
				if (audioElement.canPlayType("audio/mpeg")) {
					src += ".mp3";
				} else if (audioElement.canPlayType("audio/ogg")) {
					src += ".ogg";
				} else {
					return false;
				}
				
				// Initialization was successful
				return true;
			}
		},
		
		load = function () {

			loadInterval = GLOBAL.setInterval(function () {
			
				var curLoadTime, curLoadPercentage;
				
				// If sound isn't buffered then no need to update
				if (!audioElement.buffered.length) {
					return;
				}
				
				// Set the current load time to the last buffered item
				curLoadTime = audioElement.buffered.end(audioElement.buffered.length - 1);
		
				// Set the current load percentage    
				curLoadPercentage = curLoadTime / audioElement.duration * 100;
				
				// If a change in the load percentage then dispatch an event
				if (curLoadTime && !isNaN(curLoadPercentage) && loadPercentage !== curLoadPercentage) {
					loadPercentage = curLoadPercentage;
					that.dispatchEvent("LOAD_PERCENTAGE_CHANGE");
					//PBS.KIDS.storybook.debug("Audio Load Percentage: " + curLoadPercentage.toFixed(2) + "%");
				}
				
				// Dispatch a load complete event if the difference between the current load time and the audio duration is very small                                                  
				if (GLOBAL.Math.abs(curLoadTime - audioElement.duration) < 0.1) {
			
					GLOBAL.clearInterval(loadInterval);
					that.dispatchEvent("LOAD_COMPLETE");
				}
			}, 1000);
			
			audioElement.src = src;
			
			// Play and then pause immediately after to initiate a load but not hear the audio
			audioElement.play();
			audioElement.pause();
		},
		
		endSound = function () {
		
			// Clear the sound complete timer
			GLOBAL.clearInterval(completeInterval);
			completeInterval = null;
			currentSound = null;
			audioElement.pause();
		},
		
		checkIfComplete = function () {
		
			if (!currentSound) {
				//PBS.KIDS.storybook.debug("Current sound variable is not defined and the complete timer is still running.");
				GLOBAL.clearInterval(completeInterval);
				return;
			}

			//PBS.KIDS.storybook.debug("checkIfComplete: " + audioElement.currentTime + " >= " + currentSound.endTime);

			// If the scrubber position is greater or equal to the end time
			if (audioElement.currentTime >= currentSound.endTime) {
				//PBS.KIDS.storybook.log("Sound Complete");

				if (currentSound.loop === true) {
					PBS.KIDS.storybook.log("Loop Sound");
					audioElement.currentTime = currentSound.startTime;
				} else {
					endSound();
				}
				
				that.dispatchEvent("PLAY_COMPLETE");
			}
		};
	
	// Public properties
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
	
	// Play the sound specified by a sound parameter
	//
	// Sound Properties
	//    startTime
	//    endTime
	//    loop
	that.play = function (soundObj) {
	
		// Validate the sound object
		if (!soundObj) {
			PBS.KIDS.storybook.warning("Trying to play invalid sound.");
			return;
		}
		
		if (soundObj.startTime === undefined || soundObj.startTime < 0) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. Start time invalid.");
			return;
		}
		
		if (soundObj.endTime === undefined || soundObj.endTime < 0) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. End time invalid.");
			return;
		}
		
		if (soundObj.startTime >= soundObj.endTime) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. Duration is zero or negative.");
			return;
		}
		
		// If a sound is already playing see if it can be interrupted
		if (currentSound && currentSound.persist) {
			//PBS.KIDS.storybook.debug("Current sound cannot be interrupted. This sound will not play.");
			return;
		}
		
		// Save the sound properties
		currentSound = soundObj;
		
		// Set the scrubber to the sound start time
		audioElement.currentTime = currentSound.startTime;
		
		PBS.KIDS.storybook.log("Play Sound: " + currentSound.startTime + " -> " + currentSound.endTime + " (loop: " + currentSound.loop + ", audioElement.currentTime: " + audioElement.currentTime);

		// Play the audio from the current scrubber location
		audioElement.play();

		// Set a timer to check if the sound is complete
		if (!completeInterval) {
			completeInterval = GLOBAL.setInterval(checkIfComplete, 100);
		}
	};
	
	// Pause the audio element and clear the current sound
	that.stop = function () {
	
		endSound();
	};
	
	// Load the audio element
	that.load = function () {
	
		if (!loadStarted) {
			loadStarted = true;
			
			load();
		}
	};
	
	// Remove the audio element from memory
	that.destroy = function () {
		audioElement = null;
	};

	// Methods for test player
	that.getElement = function () {
		
		return audioElement;
	};
	
	that.getLoadPercentage = function () {
		return loadPercentage;
	};
	
	that.getSound = function () {
	
		return currentSound;
	};
	
	if (init()) {
		return that;
	} else {
		return false;
	}
};
//  ------------------------------------------------------------------
//  sound.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.sound = function (startTime, endTime, options) {
	
	"use strict";
	
	var that = {};
	
	that.loop = (options && options.loop) ? options.loop : false;
	that.name = (options && options.name) ? options.name : null;
	that.persist = (options && options.persist) ? options.persist : false;
	that.startTime = startTime;
	that.endTime = endTime;
	
	return that;
};
//  ------------------------------------------------------------------
//  audible.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.makeAudible = function (GLOBAL, PBS, audioPlayer, view, sound) {

	"use strict";
	
	var sb = PBS.KIDS.storybook,
		playing = false,
		
		press = function (e) {

			audioPlayer.play(sound);
		};
		
	view.silent = function () {
		audioPlayer.stop();
	};
	
	// Listen to when the sprite is touched or clicked
	view.addEventListener("PRESS", press);

	return view;
};