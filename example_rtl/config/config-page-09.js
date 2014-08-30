//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	content: [
		{
			type: "TextArea",
			x: 15,
			y: 20,
			width: 70,
			align: "center",
			color: "#222222",
			size: 24,
			font: "Droid Serif",
			text: "Setting the <i>numFrames</i> property of a sprite will turn it into a frame-based animation."
		},
		{
			type: "Sprite",
			x: 20,
			y: 33,
			url: "images/ball-bounce.png"
		},
		{
			type: "TextArea",
			x: 15,
			y: 49,
			width: 70,
			align: "center",
			color: "#222222",
			size: 14,
			font: "Droid Serif",
			text: "The ball bouncing animation is one image split into 14 frames."
		},
		{
			type: "TextArea",
			x: 15,
			y: 62,
			width: 70,
			align: "center",
			color: "#222222",
			size: 24,
			font: "Droid Serif",
			text: "The frame delay is adjustable."
		},
		{
			type: "Sprite",
			x: 25,
			y: 70,
			numFrames: 14,
			frameDelay: 1,
			loop: true,
			url: "images/ball-bounce.png"
		},
		{
			type: "Sprite",
			x: 40,
			y: 70,
			numFrames: 14,
			frameDelay: 2,
			loop: true,
			url: "images/ball-bounce.png"
		},
		{
			type: "Sprite",
			x: 55,
			y: 70,
			numFrames: 14,
			frameDelay: 4,
			loop: true,
			url: "images/ball-bounce.png"
		},
		{
			type: "Sprite",
			x: 70,
			y: 70,
			numFrames: 14,
			frameDelay: 16,
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
			text: "Page 9"
		}
	]
});