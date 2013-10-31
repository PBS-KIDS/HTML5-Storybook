//  ------------------------------------------------------------------
//  view.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.view = function (PBS, element) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		element;
	
	// Element property getter
	that.getElement = function () {
		return element;	
	};
	
	// Destroy the view
	that.destroy = function () {		
		element = null;
		that.removeAllEventListeners();
		that = null;
	};

	return that;
};