//  ------------------------------------------------------------------
//  eventDispatcher.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.eventDispatcher = function () {
	
	"use strict";
	
	var that = {},
		eventListeners = {};
		
	that.addEventListener = function (eventName, listener) {
		
		// If there are no listeners to the current event then create a new array
		if (eventListeners[eventName] === undefined) {
			eventListeners[eventName] = [];	
		}
		// Add the listener 
		eventListeners[eventName].push(listener);
	};
	
	that.removeEventListener = function (eventName, listener) {
		
		var i;
		
		// If a listener array that matches the name exists
		if (listeners[eventName]) {
			for (i = 0; i < listeners[eventName].length; i += 1) {
				// Remove all listeners that match
				if (eventListeners[eventName][i] === listener) {
					eventListeners[eventName].splice(i, 1);
				}
			}
		}
	};
	
	that.dispatchEvent = function (eventName, args) {
		
		var i;
		
		if (eventListeners[eventName] !== undefined) {
			for (i = 0; i < eventListeners[eventName].length; i += 1) {
				eventListeners[eventName][i](args);
			}
		}
	};

	return that;
};