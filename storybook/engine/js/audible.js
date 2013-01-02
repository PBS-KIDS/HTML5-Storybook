//  ------------------------------------------------------------------
//  audible.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.makeAudible = function (GLOBAL, PBS, audioPlayer, view, sound) {

	"use strict";
	
	var sb = PBS.KIDS.storybook,
		playing = false,
		
		press = function (e) {

			audioPlayer.play(sound);
		};
		
	view.silent = function () {
		audioPlayer.stop();
	};
	
	// Listen to when the sprite is touched or clicked
	view.addEventListener("PRESS", press);

	return view;
};