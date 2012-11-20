//  ------------------------------------------------------------------
//  sound.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.sound = function (startTime, endTime, options) {
	
	"use strict";
	
	var that = {};
	
	that.loop = (options && options.loop) ? options.loop : false;
	that.name = (options && options.name) ? options.name : null;
	that.startTime = startTime;
	that.endTime = endTime;
	
	return that;
};