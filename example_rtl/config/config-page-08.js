//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/bounce-page.jpg"
	},
	content: [
		{
			type: "TextArea",
			x: 15,
			y: 40,
			width: 70,
			align: "center",
			color: "#222222",
			size: 32,
			font: "Droid Serif",
			text: "<strong>Sprites can be animated.</strong>"
		},
		{
			type: "Sprite",
			x: 48,
			y: 66,
			numFrames: 14,
			frameDelay: 4,
			loop: true,
			url: "images/ball-bounce.png"
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 8"
		}
	]
});