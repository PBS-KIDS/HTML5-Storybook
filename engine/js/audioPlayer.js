//  ------------------------------------------------------------------
//  audioElement.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.audioPlayer = function (GLOBAL, PBS, src, options) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.eventDispatcher(),
		initialized = false,
		loadStarted = false,
		loadComplete = false,
		playable = false,
		loadPercentage = 0,
		audioElement,
		currentSound = null,
		loadInterval,
		completeInterval,

		onPlay = function () {	

		},
		
		onPause = function () {	

		},
		
		onCanPlay = function () {	
			
			if (!playable) {
				playable = true;
				//PBS.KIDS.storybook.debug("Audio Load Started.");
				that.dispatchEvent("LOAD_STARTED");
			}
		},
		
		onCanPlayThrough = function () {	
			
			if (!playable) {
				playable = true;
				//PBS.KIDS.storybook.debug("Audio Load Started.");
				that.dispatchEvent("LOAD_STARTED");
			}
		},
		
		onLoadedData = function () {	

		},
		
		onLoadedMetadata = function () {	

		},
		
		onProgress = function () {	

		},
		
		onEnded = function () {	

		},
		
		onStalled = function () {	

		},
		
		onError = function (e) {	
			PBS.KIDS.storybook.debug("audioPlayer.onError: " + e.message);
		},
		
		init = function () {
		
			if (!initialized) {
				initialized = true;
				
				// Create the audio element
				audioElement = GLOBAL.document.createElement("audio");

				// Add listeners
				audioElement.addEventListener("pause", onPause);
				audioElement.addEventListener("play", onPlay);
				audioElement.addEventListener("canplay", onCanPlay);
				audioElement.addEventListener("canplaythrough", onCanPlayThrough);
				audioElement.addEventListener("loadeddata", onLoadedData);
				audioElement.addEventListener("loadedmetadata", onLoadedMetadata);
				audioElement.addEventListener("progress", onProgress);
				audioElement.addEventListener("ended", onEnded);
				audioElement.addEventListener("stalled", onStalled);
				audioElement.addEventListener("error", onError);
				
				// Default file extension to mpg
				if (audioElement.canPlayType("audio/mpeg")) {
					src += ".mp3";
				} else if (audioElement.canPlayType("audio/ogg")) {
					src += ".ogg";
				} else {
					return false;
				}
				
				// Initialization was successful
				return true;
			}
		},
		
		load = function () {

			loadInterval = GLOBAL.setInterval(function () {
			
				var curLoadTime, curLoadPercentage;
				
				// If sound isn't buffered then no need to update
				if (!audioElement.buffered.length) {
					return;
				}
				
				// Set the current load time to the last buffered item
				curLoadTime = audioElement.buffered.end(audioElement.buffered.length - 1);
		
				// Set the current load percentage    
				curLoadPercentage = curLoadTime / audioElement.duration * 100;
				
				// If a change in the load percentage then dispatch an event
				if (curLoadTime && !isNaN(curLoadPercentage) && loadPercentage !== curLoadPercentage) {
					loadPercentage = curLoadPercentage;
					that.dispatchEvent("LOAD_PERCENTAGE_CHANGE");
					//PBS.KIDS.storybook.debug("Audio Load Percentage: " + curLoadPercentage.toFixed(2) + "%");
				}
				
				// Dispatch a load complete event if the difference between the current load time and the audio duration is very small                                                  
				if (GLOBAL.Math.abs(curLoadTime - audioElement.duration) < 0.1) {
			
					GLOBAL.clearInterval(loadInterval);
					that.dispatchEvent("LOAD_COMPLETE");
				}
			}, 1000);
			
			audioElement.src = src;
			
			// Play and then pause immediately after to initiate a load but not hear the audio
			audioElement.play();
			audioElement.pause();
		},
		
		endSound = function () {
		
			// Clear the sound complete timer
			GLOBAL.clearInterval(completeInterval);
			completeInterval = null;
			currentSound = null;
			audioElement.pause();
		},
		
		checkIfComplete = function () {
		
			if (!currentSound) {
				//PBS.KIDS.storybook.debug("Current sound variable is not defined and the complete timer is still running.");
				GLOBAL.clearInterval(completeInterval);
				return;
			}

			//PBS.KIDS.storybook.debug("checkIfComplete: " + audioElement.currentTime + " >= " + currentSound.endTime);

			// If the scrubber position is greater or equal to the end time
			if (audioElement.currentTime >= currentSound.endTime) {
				//PBS.KIDS.storybook.log("Sound Complete");

				if (currentSound.loop === true) {
					PBS.KIDS.storybook.log("Loop Sound");
					audioElement.currentTime = currentSound.startTime;
				} else {
					endSound();
				}
				
				that.dispatchEvent("PLAY_COMPLETE");
			}
		};
	
	// Public properties
	that.autoStart = options && (options.autoStart !== undefined) ? options.autoStart : true;
	that.autoReset = options && (options.autoReset !== undefined) ? options.autoReset : false;
	
	// Play the sound specified by a sound parameter
	//
	// Sound Properties
	//    startTime
	//    endTime
	//    loop
	that.play = function (soundObj) {
	
		// Validate the sound object
		if (!soundObj) {
			PBS.KIDS.storybook.warning("Trying to play invalid sound.");
			return;
		}
		
		if (soundObj.startTime === undefined || soundObj.startTime < 0) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. Start time invalid.");
			return;
		}
		
		if (soundObj.endTime === undefined || soundObj.endTime < 0) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. End time invalid.");
			return;
		}
		
		if (soundObj.startTime >= soundObj.endTime) {
			PBS.KIDS.storybook.warning("Trying to play sound with invalid sound property. Duration is zero or negative.");
			return;
		}
		
		// If a sound is already playing see if it can be interrupted
		if (currentSound && currentSound.persist) {
			//PBS.KIDS.storybook.debug("Current sound cannot be interrupted. This sound will not play.");
			return;
		}
		
		// Save the sound properties
		currentSound = soundObj;
		
		// Set the scrubber to the sound start time
		audioElement.currentTime = currentSound.startTime;
		
		PBS.KIDS.storybook.log("Play Sound: " + currentSound.startTime + " -> " + currentSound.endTime + " (loop: " + currentSound.loop + ", audioElement.currentTime: " + audioElement.currentTime);

		// Play the audio from the current scrubber location
		audioElement.play();

		// Set a timer to check if the sound is complete
		if (!completeInterval) {
			completeInterval = GLOBAL.setInterval(checkIfComplete, 100);
		}
	};
	
	// Pause the audio element and clear the current sound
	that.stop = function () {
	
		endSound();
	};
	
	// Load the audio element
	that.load = function () {
	
		if (!loadStarted) {
			loadStarted = true;
			
			load();
		}
	},
	
	// Remove the audio element from memory
	that.destroy = function () {
		audioElement = null;
	};

	// Methods for test player
	that.getElement = function () {
		
		return audioElement;
	}
	
	that.getLoadPercentage = function () {
		return loadPercentage;
	};
	
	that.getSound = function () {
	
		return currentSound;
	};
	
	if (init()) {
		return that;
	} else {
		return false;
	}
};