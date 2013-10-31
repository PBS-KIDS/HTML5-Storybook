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
		
		var key;
		
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