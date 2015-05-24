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