//  ------------------------------------------------------------------
//  resourceLoader.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.resourceLoader = function (GLOBAL, PBS) {
	
	"use strict";
	
	var that = PBS.eventDispatcher(),
		resources = {},
		queue = [],
		numResourcesLoaded = 0,
		
		onResourceLoaded = function () {
			
			numResourcesLoaded += 1;
			
			console.log("loaded " + numResourcesLoaded + " of " + queue.length);
			that.dispatchEvent("QUEUE_UPDATE", {
				progress: numResourcesLoaded, 
				total: queue.length
			});

			if (numResourcesLoaded === queue.length) {
				that.dispatchEvent("QUEUE_LOADED");
			}
		},
		
		onResourceLoadError = function () {
			
			PBS.error("Resource load error.");
		};
	
	that.addToQueue = function (url, callback) {
		
		// If the resource is already in the list
		if (resources[url] !== undefined) {
		
			// If a callback then add the callback to the resource callback array
			if (callback !== undefined) {
				resources[url].callbacks.push(callback);
			}

		} else {

			// Create a new resource object
			resources[url] = {
				image: new Image(),
				url: url,
				loaded: false,
				callbacks: []
			};
			
			// Add it to the queue
			queue.push(resources[url]);
			
			if (callback !== undefined) {
				resources[url].callbacks.push(callback);
			}
		}
		
		return resources[url];
	};
	
	that.loadQueue = function () {
		
		var key;
		
		for (key in resources) {
			if (resources.hasOwnProperty(key)) {
				/*resources[key].image.onload = function () {
					
					var i;
					for (i = 0; i < resources[key].callbacks.length; i += 1) {
						resources[key].callbacks[i]();
					}
					
					onResourceLoaded();
				};
				resources[key].image.onerror = function () {
					
				};*/
				
				resources[key].image.addEventListener("load", onResourceLoaded);
			}
		}
		
		// Set the resource's image source to the url
		for (key in resources) {
			if (resources.hasOwnProperty(key)) {
				resources[key].image.src = resources[key].url;
			}
		}
	};

	return that;
};