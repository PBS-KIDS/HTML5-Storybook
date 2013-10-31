//  ------------------------------------------------------------------
//  textArea.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.textArea = function (GLOBAL, PBS, config) {
	
	"use strict";
	
	var that = PBS.KIDS.storybook.view(PBS, GLOBAL.document.createElement("p")),
		element = that.getElement(),
		dirty = true;
	
	that.init = function () {
	
		var width;

		element.className = "pbsTextArea";
		element.style.textAlign = (config.align !== undefined) ? config.align : "center";
		element.style.fontFamily = (config.font !== undefined) ? config.font : "";
		element.style.fontSize = (config.size !== undefined) ? config.size + "em" : "1em";
		element.style.left = (config.x !== undefined) ? config.x + "%" : 0;
		element.style.top = (config.y !== undefined) ? config.y + "%" : 0;
		if (config.color !== undefined) {
			element.style.color = config.color;
		}
		width = (config.width !== undefined) ? config.width : 100;
		element.style.width = width + "%";
		element.innerHTML = config.text;
	};

	that.update = function () {
		
	};
	
	that.render = function () {
		 
		 if (dirty) {
		 	
		 	dirty = false;
		 }
	};
	
	that.destroy = function () {
		 
		 element.innerHTML = "";
		 element = null;
		 that = null;
	};
	
	that.init();

	return that;
};