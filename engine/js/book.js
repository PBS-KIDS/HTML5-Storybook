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
			
				bookContainerElement.style["transition"] = "";
				bookContainerElement.style["-webkit-transition"] = "";
				bookContainerElement.style["-moz-transition"] = "";
				bookContainerElement.style["-ms-transition"] = "";
				bookContainerElement.style["-o-transition"] = "";
					
				// Center the cover
				bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
			} else {
			
				if (curOrientation === "SINGLE-PAGE") {
					
					bookContainerElement.style["transition"] = "margin-left " + pageSlideDuration / 1000 + "s linear";
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
			
				bookContainerElement.style["transition"] = "";
				bookContainerElement.style["-webkit-transition"] = "";
				bookContainerElement.style["-moz-transition"] = "";
				bookContainerElement.style["-ms-transition"] = "";
				bookContainerElement.style["-o-transition"] = "";

				// Center the cover
				bookContainerElement.style.marginLeft = (containerWidth - pagesContainerElement.offsetWidth) / 2 + "px";
			} else {
			
				if (curOrientation === "SINGLE-PAGE") {
					
					bookContainerElement.style["transition"] = "margin-left " + pageTurnDuration / 1000 + "s linear";
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
						audioPlayer.addEventListener("PLAY_COMPLETE", leftPageSoundComplete)
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
			gradientElement.style["transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-webkit-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-moz-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-ms-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			gradientElement.style["-o-transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
			
			GLOBAL.setTimeout(function () {
				gradientElement.style.opacity = 0;
				
				pageTurnContainerElement.style["transform"] = "scale(1, 1)";
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
						gradientElement.style["transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
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
							pageTurnContainerElement.style["transform"] = "scale(0, 1)";
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
						gradientElement.style["transition"] = "opacity " + pageTurnDuration / 2 / 1000 + "s linear";
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
							pageTurnContainerElement.style["transform"] = "scale(0, 1)";
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
				
				pageTurnContainerElement.style["transition"] = "transform " + pageTurnDuration / 2 / 1000 + "s linear";
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
	
	// requestAnimationFrame polyfill by Erik Möller
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