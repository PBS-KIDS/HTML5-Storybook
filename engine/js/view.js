//  ------------------------------------------------------------------
//  view.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.view = function (PBS, element) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		sb = PBS.KIDS.storybook,
		element;
	
	// Public properties
	that.parentWidth;
	that.parentHeight;
	that.x;
	that.y;
	that.width;
	that.height;
	that.horizontalAlign;
	that.verticalAlign;
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