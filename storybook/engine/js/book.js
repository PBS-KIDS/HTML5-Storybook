//  ------------------------------------------------------------------
//  storybook.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.book = function (GLOBAL, PBS, storybookContainerElement, config) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		resourceLoader = PBS.KIDS.storybook.resourceLoader(GLOBAL, PBS),
		paused = false,
		loadStarted = false,
		destroyed = false,
		initialized = false,
		numPagesLoaded = 0,
		curPageIndex,
		curOrientation,
		bookConfig = config.book,
		leftPageIndex,
		rightPageIndex,
		pageElementWidth,
		pageElementHeight,
		prevPageButtonSprite,
		nextPageButtonSprite,
		cover,
		pages = [],
		bookMargin,
		bookWidth,
		minBookMargin = 0.02,
		// Elements
		bookWrapperElement,
		bookContainerElement,
		pagesContainerElement,
		leftPageContainerElement,
		rightPageContainerElement,
		navElement,
		prevPageButtonElement,
		nextPageButtonElement,
	
		// Main loop that calls render and update to allow for interactive elements
		loop = function () {
		
			if (!destroyed) {
				// Not the main loop if paused
				if (!paused) {
					if (curPageIndex === -1) {
						// Update cover
						cover.update()
					} else {
// TODO: possibly don't update if page is not fully visible in single-page layout (if page config option) Update on both pages by default
						// Update visible pages
						pages[leftPageIndex].update();
						pages[rightPageIndex].update();
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
				pages[leftPageIndex].render();
				pages[rightPageIndex].render();
			}
		},
		
		fitWidth = function (containerWidth) {
console.log("fitWidth: " + containerWidth);		
	
			// Singe-Page layout
			if (curOrientation === "PORTRAIT") {
				// Scale the container element to zoom on one page
				containerWidth *= 1.8;
				bookContainerElement.style.width = containerWidth + "px";

			// Two-Page layout
			} else {
				// Set the book to the container width
				bookContainerElement.style.width = containerWidth + "px";
			}
			
			bookMargin = containerWidth * minBookMargin;
			
			pagesContainerElement.style.width = (containerWidth - bookMargin * 2) + "px";
			
			// Determine the page dimensions based on the actual width of one of the page elements
			pageElementWidth = rightPageContainerElement.offsetWidth;
			// Calculate the page height to be proportional to the actual page width
			pageElementHeight = pageElementWidth / bookConfig.pageWidth * bookConfig.pageHeight;
			
			// Set the height of the book
			bookContainerElement.style.margin = bookMargin + "px";
			bookContainerElement.style.height = pageElementHeight - bookMargin * 2 + "px";
			pagesContainerElement.style.height = pageElementHeight - bookMargin * 2 + "px";
		},
		
		fitHeight = function (storybookContainerHeight) {
console.log("fitHeight: " + storybookContainerHeight);		
		
			pagesContainerElement.style.height = storybookContainerHeight - bookMargin * 2 + "px";
			bookContainerElement.style.height = storybookContainerHeight - bookMargin * 2 + "px";		
			
			pageElementWidth = pagesContainerElement.offsetHeight / bookConfig.pageHeight * bookConfig.pageWidth;

			// If the current page is not the cover then the width is times two (pages)
			bookWidth = (curPageIndex === -1) ? pageElementWidth : pageElementWidth * 2;

			// Set the width of the book
			pagesContainerElement.style.width = bookWidth - bookMargin * 2 + "px";
			bookContainerElement.style.width = bookWidth - bookMargin * 2 + "px";
		},
			
		// Handles changes to the layout
		updateLayout = function () {
		
			// Update the current orientation
			curOrientation = (storybookContainerElement.scrollHeight > storybookContainerElement.scrollWidth) ? "PORTRAIT" : "LANDSCAPE";
			
			fitWidth(storybookContainerElement.offsetWidth);
			
			// If the book is larger than the container
			if (bookContainerElement.offsetHeight > storybookContainerElement.offsetHeight) {	
				fitHeight(storybookContainerElement.offsetHeight);
				
				if (pagesContainerElement.offsetWidth > storybookContainerElement.offsetWidth) {	
					fitWidth(storybookContainerElement.offsetWidth);
				}
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
				// Center the cover
				bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
			} else {
			
				if (curOrientation === "PORTRAIT") {
					// If an current page index is an odd (left page)
					if (curPageIndex % 2) {
				
						// Zoom on right page
						bookContainerElement.style.marginLeft = -(bookMargin + pageElementWidth * 2 - containerWidth) + "px";
					} else {
						// Zoom on left page
						bookContainerElement.style.marginLeft = bookMargin + "px";
					}

				} else {
					// Center the book horizontally
					bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
				}
			}
		},
		
		// Handle drag on a page to the left
		pageDraggedLeft = function (page) {
		
			// If the page dragged is the right page or the cover
			if (page === pages[rightPageIndex] || page === cover) {
				that.nextPage();
			} else {
				if (curOrientation === "PORTRAIT") {
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
				if (curOrientation === "PORTRAIT") {
					that.previousPage();
				}
				// If the right page is dragged right in two-page layout then do nothing
				//     because it would do nothing on a real book
			}
		},

		// Sets the current page index and updates pages if neccessary
		navigateToPageIndex = function (pageIndex) {
		
			var i;

			curPageIndex = pageIndex;
			
			// Clear page containers
			for (i = 0; i < leftPageContainerElement.childNodes.length; i += 1) {
				leftPageContainerElement.removeChild(leftPageContainerElement.childNodes[i]);
			}
			
			for (i = 0; i < rightPageContainerElement.childNodes.length; i += 1) {
				rightPageContainerElement.removeChild(rightPageContainerElement.childNodes[i]);
			}
			
			// If the current page is the cover
			if (curPageIndex === -1) {
				// Turn off the previous page button
				prevPageButtonElement.style.display = "none";
				nextPageButtonElement.style.display = "block";
				
				// If the book is closed
				// The pages container is the width of a page
				pagesContainerElement.style.width = "50%";
				// The left page will be hidden 
				leftPageContainerElement.style.display = "none";
				// The right page will be full width 
				rightPageContainerElement.style.width = "100%";
				
				// Update the size of the book
				updateLayout();
				
				// Position the book
				updatePosition();
				
				// Add the cover to the right page container
				rightPageContainerElement.appendChild(cover.getElement());
					
			// If a page
			} else {

				// If an current page index is an odd (right page)
				if (curPageIndex % 2) {	
					leftPageIndex = curPageIndex - 1;
					rightPageIndex = curPageIndex;
				// If an current page index is an even (left page)	
				} else {
					leftPageIndex = curPageIndex;
					rightPageIndex = curPageIndex + 1;
				}

				// Hide page navigation buttons when at the beginning and end
				if (curOrientation === "PORTRAIT") {
					prevPageButtonElement.style.display = (curPageIndex === -1) ? "none" : "block";
					nextPageButtonElement.style.display = (curPageIndex === pages.length - 1) ? "none" : "block";
				} else {
// TODO: Comment this better
					prevPageButtonElement.style.display = (leftPageIndex === -1) ? "none" : "block";
					nextPageButtonElement.style.display = (rightPageIndex === pages.length - 1) ? "none" : "block";
				}
				
				// If the book is open
				// The pages container will be full width
				pagesContainerElement.style.width = "100%";
				// Show both pages
				leftPageContainerElement.style.display = "block";
				rightPageContainerElement.style.display = "block";
				// The page containers will be half width so both pages will fit
				leftPageContainerElement.style.width = "50%";
				rightPageContainerElement.style.width = "50%";
				
				// Update the size of the book
				updateLayout();
				
				// Position the book
				updatePosition();
					
				// Insert page elements of two pages that should be visible into the page containers
				leftPageContainerElement.appendChild(pages[leftPageIndex].getElement());
				rightPageContainerElement.appendChild(pages[rightPageIndex].getElement());
				
// TODO: Call navigationToBegin then when page turn is complete call navigationToComplete
				pages[leftPageIndex].navigationToComplete();
				pages[rightPageIndex].navigationToComplete();
			}
			
			hideBrowserUi();
		},
		
		// Hide ui elements on devices
		hideBrowserUi = function () {
		
			// Scroll to url bar up out of the viewport
			GLOBAL.setTimeout(function() {
				/*GLOBAL.document.body.style.minHeight = "200%";
				storybookContainerElement.style.height = GLOBAL.document.body.scrollHeight + "px";
				bookContainerElement.style.height = GLOBAL.document.body.scrollHeight + "px";
				updateLayout();
				GLOBAL.scrollTo(0, 1);
				updateLayout();
				GLOBAL.setTimeout(function() {
					GLOBAL.document.body.style.minHeight = "100%";
					storybookContainerElement.style.height = window.innerHeight + "px";
				bookContainerElement.style.height = "100%";
					//updateLayout();
				}, 1000);*/
				
				//GLOBAL.document.body.style.minHeight = "200%";
				//storybookContainerElement.style.height = GLOBAL.document.body.scrollHeight + "px";
				GLOBAL.scrollTo(0, 1);
				//GLOBAL.setTimeout(function() {
				//GLOBAL.document.body.style.minHeight = "100%";
				//storybookContainerElement.style.height = window.innerHeight + "px";
				//}, 0);
				
			}, 0);
		},
		
		// When all pages have loaded all resources
		start = function () {
		
			storybookContainerElement.innerHTML = "";
			// Add elements to book elements
			storybookContainerElement.appendChild(bookWrapperElement);
			storybookContainerElement.appendChild(navElement);

			// Listen for changes to layout
			GLOBAL.onorientationchange = that.onOrientationChange;
			GLOBAL.addEventListener("resize", updateLayout);
			
			updateLayout();
			
			// Set the current page index to the cover or a starting page in the config
			curPageIndex = (config.book.startOnPage !== undefined) ? (config.book.startOnPage - 1) : -1;
			
			// Goto the current page index
			navigateToPageIndex(curPageIndex);

// TODO: determine why updateLayout needs to be called again here	
			updateLayout();
			
			storybookContainerElement.addEventListener("touchstart", hideBrowserUi);
			storybookContainerElement.addEventListener("touchmove", function (e) {
				hideBrowserUi();
				// Prevent default swipe behavior
				e.preventDefault();
			});
			
			// Draw previous page button and add event listener
			prevPageButtonSprite.update();
			prevPageButtonSprite.render();
			prevPageButtonSprite.addEventListener("PRESS", that.previousPage);
			
			// Draw next page button and add event listener
			nextPageButtonSprite.update();
			nextPageButtonSprite.render();
			nextPageButtonSprite.addEventListener("PRESS", that.nextPage);
			
			loop();
		},
		
		// Initialize the storybook
		init = function () {
		
			var i, j, k, pageContainerElement, key, key2;
			
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
				pagesContainerElement.appendChild(leftPageContainerElement);
				
				rightPageContainerElement = GLOBAL.document.createElement("div");
				rightPageContainerElement.className = "pbsPageContainer";
				rightPageContainerElement.id = "pbsRightPage";
				pagesContainerElement.appendChild(rightPageContainerElement);
				
				// Add the markup for page navigation buttons
				//
				//  <nav class="pbsStorybookNav">
				//      <div id="pbsPrevPageButton" class="pbsPageButton"></div>
	            //      <div id="pbsNextPageButton" class="pbsPageButton"></div>
	            //  </nav>
	            
	            navElement = GLOBAL.document.createElement("nav");
	            navElement.className = "pbsStorybookNav";
	            // Don't add to DOM until loaded
	            
	            prevPageButtonElement = GLOBAL.document.createElement("div");
	            prevPageButtonElement.id = "pbsPrevPageButton";
				prevPageButtonElement.className = "pbsPageButton";
				// Create previous button sprite
				config.book.previousPageButton.parentElement = prevPageButtonElement;
				config.book.previousPageButton.resource = resourceLoader.addToQueue(config.book.previousPageButton.url);
				prevPageButtonSprite = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config.book.previousPageButton);
				prevPageButtonSprite = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, prevPageButtonSprite);
				navElement.appendChild(prevPageButtonElement);
				
				nextPageButtonElement = GLOBAL.document.createElement("div");
	            nextPageButtonElement.id = "pbsNextPageButton";
				nextPageButtonElement.className = "pbsPageButton";
				// Create next button sprite
				config.book.nextPageButton.parentElement = nextPageButtonElement;
				config.book.nextPageButton.resource = resourceLoader.addToQueue(config.book.nextPageButton.url);
				nextPageButtonSprite = PBS.KIDS.storybook.sprite(GLOBAL, PBS, config.book.nextPageButton);
				nextPageButtonSprite = PBS.KIDS.storybook.makeInteractionObject(GLOBAL, PBS, nextPageButtonSprite);
				navElement.appendChild(nextPageButtonElement);
				
// TODO: possibly search the whole configuration file via DFS, BFS or similar
				// Create resource objects but don't load them yet.
				for (key in config.book.pageBackground) {
					if (config.book.pageBackground.hasOwnProperty(key)) {
						if (key === "url") {
							// Add a new resource object with the url
							config.book.pageBackground.resource = resourceLoader.addToQueue(config.book.pageBackground.url);
						}
					}
				}
				
				for (key in config.book.oddPageBackground) {
					if (config.book.oddPageBackground.hasOwnProperty(key)) {
						if (key === "url") {
							// Add a new resource object with the url
							config.book.oddPageBackground.resource = resourceLoader.addToQueue(config.book.oddPageBackground.url);
						}
					}
				}
				
				for (key in config.book.evenPageBackground) {
					if (config.book.evenPageBackground.hasOwnProperty(key)) {
						if (key === "url") {
							// Add a new resource object with the url
							config.book.evenPageBackground.resource = resourceLoader.addToQueue(config.book.evenPageBackground.url);
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
					}
				}
				
				// Create cover
				cover = PBS.KIDS.storybook.page(GLOBAL, PBS, config.cover, 0, {
					bookConfig: bookConfig
				});
				
				// Add cover listeners
				cover.addEventListener("DRAG_LEFT", pageDraggedLeft);
				cover.addEventListener("DRAG_RIGHT", pageDraggedRight);
		
				// Create the storybook pages
				for (i = 0; i < config.pages.length; i += 1) {
					pages[i] = PBS.KIDS.storybook.page(GLOBAL, PBS, config.pages[i], i + 1, {
						bookConfig: bookConfig
					});
				}
				
				// If an odd number of pages are specified, place a blank page at the end
				if (config.pages.length % 2) {
					pages[config.pages.length] = PBS.KIDS.storybook.page(GLOBAL, PBS, {}, config.pages.length + 1, {
						bookConfig: bookConfig
					});
				}
				
				// Add page listeners
				for (i = 0; i < pages.length; i += 1) {
					pages[i].addEventListener("DRAG_LEFT", pageDraggedLeft);
					pages[i].addEventListener("DRAG_RIGHT", pageDraggedRight);
				}

				hideBrowserUi();
			} else {
				PBS.KIDS.storybook.error("Cannot initialize storybook more than once.");
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
		hideBrowserUi();
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

		if (curOrientation === "PORTRAIT") {
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
		
		if (curOrientation === "PORTRAIT") {
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
			resourceLoader.addEventListener("QUEUE_UPDATE", function (e) {
				storybookContainerElement.innerHTML = '<p class="loadingText">Loading ' + e.progress + " of " + e.total + "</p>";
			});
			resourceLoader.addEventListener("QUEUE_LOADED", start);
			// Load all the resources
			resourceLoader.loadQueue();
		}
	};
	
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	
	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());
	
	init();

	return that;
};