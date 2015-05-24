//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		numFrames: 5,
		frameDelay: 10,
		loop: false,
		url: "images/sunrise.jpg",
		playOnPress: true
	},
	content: [
		{
			type: "TextArea",
			x: 15,
			y: 60,
			width: 70,
			align: "center",
			color: "#222222",
			size: 32,
			font: "Droid Serif",
			text: "Page backgrounds are sprites so they can be animated too."
		},
		{
			type: "TextArea",
			x: 5,
			y: 80,
			width: 90,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Since backgrounds are large animating them should be used sparingly."
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 10"
		}
	]
});