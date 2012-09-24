//  ------------------------------------------------------------------
//  view.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.view = function (PBS, element) {
	
	"use strict";
	
	var that = PBS.eventDispatcher(),
		element;
	
	that.getElement = function () {
		return element;	
	};
	
	that.destroy = function () {		
		element = null;
	};

	return that;
};