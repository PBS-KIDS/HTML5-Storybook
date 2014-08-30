//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/tundra-left.png"
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
			text: "Page 17"
		},
		{
			type: "TextArea",
			x: 10,
			y: 20,
			width: 80,
			align: "left",
			color: "#222222",
			size: 24,
			font: "Droid Serif",
			text: "Sprites support an <i>easing</i> property which slow the frame delay at the beginning or end of the animation."
		},
		{
			type: "TextArea",
			x: 25,
			y: 45,
			width: 70,
			align: "left",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: 'Sprite with <i>easing</i> property set to "EaseIn".'
		},
		{
			type: "Sprite",
			x: 25,
			y: 50,
			numFrames: 10,
			easing: "easeIn",
			frameDelay: 10,
			loop: true,
			url: "images/ball-roll.png"
		},
		{
			type: "TextArea",
			x: 25,
			y: 60,
			width: 70,
			align: "left",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Sprite without <i>easing</i> property."
		},
		{
			type: "Sprite",
			x: 25,
			y: 65,
			numFrames: 10,
			frameDelay: 10,
			loop: true,
			url: "images/ball-roll.png"
		},
		{
			type: "TextArea",
			x: 25,
			y: 75,
			width: 70,
			align: "left",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: 'Sprite with <i>easing</i> property set to "EaseOut".'
		},
		{
			type: "Sprite",
			x: 25,
			y: 80,
			numFrames: 10,
			easing: "easeOut",
			frameDelay: 10,
			loop: true,
			url: "images/ball-roll.png"
		}
	]
});

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/tundra-right.png"
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
			text: "Page 18"
		},
		{
			type: "TextArea",
			x: 10,
			y: 55,
			width: 80,
			align: "left",
			color: "#222222",
			size: 24,
			font: "Droid Serif",
			text: "Sprites support an <i>playAfterDelay</i> property which will play the animation after a specified amount from when the page is shown."
		},
		{
			type: "Sprite",
			x: 25,
			y: 70,
			numFrames: 10,
			frameDelay: 10,
			playAfterDelay: 2,
			autoStart: false,
			url: "images/ball-roll.png"
		}
	]
});
