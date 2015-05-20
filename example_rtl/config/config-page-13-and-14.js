//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/orchard-left.png"
	},
	content: [
		{
			type: "TextArea",
			x: 20,
			y: 77,
			width: 65,
			align: "left",
			color: "#222222",
			size: 24,
			font: "Droid Serif",
			text: "Non-looping sprites without the <i>autoReset</i> property will stay on the last frame after the animation is complete."
		},
		{
			type: "Sprite",
			x: -6,
			y: 30,
			numFrames: 20,
			frameDelay: 6,
			toggleOnPress: true,
			autoStart: true,
			loop: true,
			url: "images/bee-circle.png"
		},
		{
			type: "Sprite",
			x: 37,
			y: 55,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 65,
			y: 38,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: true,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 86,
			y: 27,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 76,
			y: 59,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 13"
		},
		{
			type: "Sprite",
			x: 5,
			y: 92,
			numFrames: 12,
			frameDelay: 5,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/water-creature-hide-animation.png"
		},
		{
			type: "Sprite",
			x: 27,
			y: 64,
			url: "images/apple-cart.png"
		}
	]
});

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/orchard-right.png"
	},
	content: [
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 14"
		},
		{
			type: "Sprite",
			x: 5,
			y: 28,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 55,
			y: 34,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 15,
			y: 61,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 25,
			y: 62,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		},
		{
			type: "Sprite",
			x: 35,
			y: 60,
			numFrames: 8,
			frameDelay: 4,
			playOnPress: true,
			autoStart: false,
			autoReset: false,
			url: "images/apple-drop.png"
		}
	]
});
