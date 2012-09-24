//  ------------------------------------------------------------------
//  storybook.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.storybook = function (GLOBAL, PBS, storybookContainerElement, config, options) {
	
	"use strict";
	
	var that = PBS.eventDispatcher(),
		resourceLoader = PBS.resourceLoader(GLOBAL, PBS),
		paused = false,
		loadStarted = false,
		destroyed = false,
		initialized = false,
		numPagesLoaded = 0,
		curPageIndex = 0,
		pages = [],
		curOrientation,
		bookConfig = config.book,
		leftPageIndex,
		rightPageIndex,
		pageElementWidth,
		pageElementHeight,
		// Elements
		bookWrapperElement,
		bookContainerElement,
		pagesContainerElement,
		leftPageElement,
		rightPageElement,
		navElement,
		prevPageButtonElement,
		nextPageButtonElement,
	
		// Main loop that calls render and update to allow for interactive elements
		loop = function () {
		
			if (!destroyed) {

				if (!paused) {
	
// TODO: don't update if page is not fully visible in single-page layout
				
					// Update visible pages
					pages[leftPageIndex].update();
					pages[rightPageIndex].update();
				}
				// Loop again on next animation frame
				requestAnimFrame(loop);
				
				if (!paused) {
					render();
				}
			}
		},
		
		render = function () {
			
			// Render visible pages
			pages[leftPageIndex].render();
			pages[rightPageIndex].render();
		},
		
		requestAnimFrame = (function() {
			
			// Return requestAnimationFrame function
			return GLOBAL.requestAnimationFrame || GLOBAL.webkitRequestAnimationFrame || GLOBAL.mozRequestAnimationFrame || GLOBAL.oRequestAnimationFrame || GLOBAL.msRequestAnimationFrame || function (callback) {
				GLOBAL.setTimeout(callback, 1000 / 60);
			};
		})(),
		
		// Handles changes to the layout
		windowSizeChange = function () {

			var viewportWidth = window.innerWidth,
				viewportHeight = window.innerHeight,
				i;
				
			console.log("windowSizeChange");
			
			// Update the current orientation
			curOrientation = (viewportHeight > viewportWidth) ? "PORTRAIT" : "LANDSCAPE";

			bookContainerElement.style.margin = "2%";
			// Singe-Page layout
			if (curOrientation === "PORTRAIT") {
				// Scale the container element to zoom on one page
				bookContainerElement.style.width = "180%";
			// Two-Page layout
			} else {
				// Scale the container element to 100% minus the margin (which will be two times the margin)
				bookContainerElement.style.width = "100" - bookContainerElement.style.margin.replace(/\%|pt/gi, "") * 2 + "%";
			}
			
			// Determine the page dimensions based on the actual width of one of the page elements
			pageElementWidth = leftPageElement.scrollWidth;
			pageElementHeight = pageElementWidth / bookConfig.pageWidth * bookConfig.pageHeight;
			
			// Set the height of the pages container
			pagesContainerElement.style.height = pageElementHeight + "px";

			// Set the overall font by setting the body font size
			GLOBAL.document.body.style.fontSize = (pageElementWidth / bookConfig.pageWidth) + "px";
			
			navigateToPage(curPageIndex);
		},
		
		pageDraggedLeft = function (page) {
		
			if (page === pages[rightPageIndex]) {
				that.nextPage();
			} else {
				if (curOrientation === "PORTRAIT") {
					that.nextPage();
				}
			}
		},
		
		pageDraggedRight = function (page) {
				
			if (page === pages[leftPageIndex]) {	
				that.previousPage();
			} else {
				if (curOrientation === "PORTRAIT") {
					that.previousPage();
				}
			}
		},
		
		navigateToPage = function (pageIndex) {
		
			var i;
		
			curPageIndex = pageIndex;

			// If an current page index is an odd (left page)
			if (curPageIndex % 2) {
				
				if (curOrientation === "PORTRAIT") {
					// Zoom on right page
					bookContainerElement.style.marginLeft = "-82%";
				}
				
				leftPageIndex = curPageIndex - 1;
				rightPageIndex = curPageIndex;
				
			} else {
				
				if (curOrientation === "PORTRAIT") {
					// Zoom on left page
					bookContainerElement.style.marginLeft = "2%";
				}
				
				leftPageIndex = curPageIndex;
				rightPageIndex = curPageIndex + 1;
			}
			
			// Hide page navigation buttons when at the beginning and end
			if (curOrientation === "PORTRAIT") {
				prevPageButtonElement.style.display = (curPageIndex === 0) ? "none" : "block";
				nextPageButtonElement.style.display = (curPageIndex === pages.length - 1) ? "none" : "block";
			} else {
				prevPageButtonElement.style.display = (leftPageIndex === 0) ? "none" : "block";
				nextPageButtonElement.style.display = (rightPageIndex === pages.length - 1) ? "none" : "block";
			}
			
			// Clear the page containers
			// This does not work in IE9 to clear containers
			//leftPageElement.innerHTML = "";
			//rightPageElement.innerHTML = "";
			
			// Clear page containers
			for (i = 0; i < leftPageElement.childNodes.length; i += 1) {
				leftPageElement.removeChild(leftPageElement.childNodes[i]);
			}
			
			for (i = 0; i < rightPageElement.childNodes.length; i += 1) {
				rightPageElement.removeChild(rightPageElement.childNodes[i]);
			}
			
			// Insert page elements of two pages that should be visible into the page containers
			leftPageElement.appendChild(pages[leftPageIndex].getElement());
			rightPageElement.appendChild(pages[rightPageIndex].getElement());
			
			// TODO: Call navigationToBegin then when page turn is complete call navigationToComplete
			pages[leftPageIndex].navigationToComplete();
			pages[rightPageIndex].navigationToComplete();
			
			hideBrowserUi();
		},
		
		hideBrowserUi = function () {
			GLOBAL.setTimeout(function() {
				GLOBAL.scrollTo(0, 1);
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
			GLOBAL.addEventListener("resize", windowSizeChange);
			
			// TODO: determine why two setTimeouts is needed to immediately update after all pages load
			windowSizeChange();
			GLOBAL.setTimeout(windowSizeChange, 0);
			GLOBAL.setTimeout(windowSizeChange, 1);
			
			// Goto the first page
			if (bookConfig.startOnPage > 0) {
				navigateToPage(bookConfig.startOnPage - 1);
			} else {
				navigateToPage(0);
			}
			
			storybookContainerElement.addEventListener("touchstart", hideBrowserUi);
			storybookContainerElement.addEventListener("touchmove", function (e) {
				hideBrowserUi();
				// Prevent default swipe behavior
				e.preventDefault();
			});
			
			nextPageButtonElement.addEventListener("touchstart", function (e) {
				that.nextPage();
				e.preventDefault();
			});
			nextPageButtonElement.addEventListener("mousedown", that.nextPage);
			
			prevPageButtonElement.addEventListener("touchstart", function (e) {
				that.previousPage();
				e.preventDefault();
			});
			prevPageButtonElement.addEventListener("mousedown", that.previousPage);
			
			loop();
		},
		
		// Initialize the storybook
		init = function () {
		
			var i, j, pageContainerElement, key;
			
			if (!initialized) {
			
				initialized = true;
				
				// Create the following markup and inject into the storybook container element
				//
				//  <div id="pbsStorybookContainer">
	            //      <div class="pbsPagesContainer">
	            //          <div class="pbsPageContainer">
	            //              <section id="pbsLeftPage" class="pbsPage"></section>
	            //          </div>
	            //          <div class="pbsPageContainer">
	            //              <section id="pbsRightPage" class="pbsPage"></section>
	            //          </div>
	            //      </div>        
	            //  </div>
				
				bookWrapperElement = GLOBAL.document.createElement("div");
				bookWrapperElement.id = "pbsBookWrapper";
				// Don't add to DOM until loaded
				//storybookContainerElement.appendChild(bookWrapperElement);
				
				bookContainerElement = GLOBAL.document.createElement("div");
				bookContainerElement.id = "pbsBookContainer";
				bookWrapperElement.appendChild(bookContainerElement);
				
				pagesContainerElement = GLOBAL.document.createElement("div");
				pagesContainerElement.className = "pbsPagesContainer";
				bookContainerElement.appendChild(pagesContainerElement);
				
				pageContainerElement = GLOBAL.document.createElement("div");
				pageContainerElement.className = "pbsPageContainer";
				pagesContainerElement.appendChild(pageContainerElement);
				
				leftPageElement = GLOBAL.document.createElement("div");
				leftPageElement.id = "pbsLeftPage";
				leftPageElement.className = "pbsPage";
				if (bookConfig.pageBackgroundColor !== undefined) {
					leftPageElement.style.backgroundColor = bookConfig.pageBackgroundColor;
				}
				pageContainerElement.appendChild(leftPageElement);
				
				pageContainerElement = GLOBAL.document.createElement("div");
				pageContainerElement.className = "pbsPageContainer";
				pagesContainerElement.appendChild(pageContainerElement);
				
				rightPageElement = GLOBAL.document.createElement("div");
				rightPageElement.id = "pbsRightPage";
				rightPageElement.className = "pbsPage";
				if (bookConfig.pageBackgroundColor !== undefined) {
					rightPageElement.style.backgroundColor = bookConfig.pageBackgroundColor;
				}
				pageContainerElement.appendChild(rightPageElement);
				
				// Add the markup for page navigation buttons
				//
				//  <nav>
				//      <div id="pbsPrevPageButton" class="pbsPageButton"></div>
	            //      <div id="pbsNextPageButton" class="pbsPageButton"></div>
	            //  </nav>
	            
	            navElement = GLOBAL.document.createElement("nav");
	            // Don't add to DOM until loaded
				//storybookContainerElement.appendChild(navElement);
	            
	            prevPageButtonElement = GLOBAL.document.createElement("div");
	            prevPageButtonElement.id = "pbsPrevPageButton";
				prevPageButtonElement.className = "pbsPageButton";
				navElement.appendChild(prevPageButtonElement);
				
				nextPageButtonElement = GLOBAL.document.createElement("div");
	            nextPageButtonElement.id = "pbsNextPageButton";
				nextPageButtonElement.className = "pbsPageButton";
				navElement.appendChild(nextPageButtonElement);
				
				// TODO: search the whole configuration file via DFS, BFS or similar
				// Create resource objects but don't load them yet.
				for (key in config.book.background) {
					if (config.book.background.hasOwnProperty(key)) {
						if (key === "url") {
							// Add a new resource object with the url
							config.book.background.resource = resourceLoader.addToQueue(config.book.background.url);
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
							}
						}
					}
				}
				
				// Create the storybook pages
				for (i = 0; i < config.pages.length; i += 1) {
					pages[i] = PBS.page(GLOBAL, PBS, config.pages[i], i + 1, {
						bookConfig: bookConfig
					});
				}
				
				// Add page listeners
				for (i = 0; i < pages.length; i += 1) {
					pages[i].addEventListener("DRAG_LEFT", pageDraggedLeft);
					pages[i].addEventListener("DRAG_RIGHT", pageDraggedRight);
				}

				hideBrowserUi();
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
		
		console.log("that.onOrientationChange");
		windowSizeChange();
	};
	
	// Destroy the storybook
	that.destroy = function () {
	
		var i;
		
		if (!destroyed) {
			destroyed = true;

			storybookContainerElement.innerHTML = "";
			
			for (i = 0; i < pages.length; i += 1) {
				pages[i].init();
			}
			
			that = null;
		}
	};
	
	that.nextPage = function () {
	
		var targetPage;

		if (curOrientation === "PORTRAIT") {
			// Go forward one page
			targetPage = curPageIndex + 1;
		} else if (curOrientation === "LANDSCAPE") {
			// If current page is on the right
			if (curPageIndex % 2) {
				// Go forward one page
				targetPage = curPageIndex + 1;
			// If current page is on the left
			} else {
				// Go forward two pages
				targetPage = curPageIndex + 2;
			}
		}
		
		// If the target page is valid
		if (targetPage < pages.length) {
			navigateToPage(targetPage);
		}
	};
	
	that.previousPage = function () {
		
		var targetPage;
		
		if (curOrientation === "PORTRAIT") {
			// Go back one page
			targetPage = curPageIndex - 1;
		} else if (curOrientation === "LANDSCAPE") {
			// If current page is on the right
			if (curPageIndex % 2) {
				// Go back one page
				targetPage = curPageIndex - 1;
			} else {
				// Go back two pages
				targetPage = curPageIndex - 2;
			}
		}
		
		// If target page is valid
		if (targetPage >= 0) {
			navigateToPage(targetPage);
		}
	};
	
	that.gotoPage = function (pageIndex) {
		
		// If target page is not valid
		if (curPageIndex - 1 < 0 || curPageIndex + 1 > pages.length) {
			
			return;
		}
		navigateToPage(pageIndex);
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
	
	init();

	return that;
};