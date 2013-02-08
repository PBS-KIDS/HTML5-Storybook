//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#fdfdfd",
		url: "images/frozen-left.png"
	},
	content: [
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#333333",
			size: 18,
			font: "Droid Serif",
			text: "Page 19"
		},
		{
			type: "TextArea",
			x: 10,
			y: 35,
			width: 70,
			align: "left",
			color: "#333333",
			size: 24,
			font: "Droid Serif",
			text: "A page background image can be partially transparent with a background color showing through."
		}
	]
},
{
	background: {
		color: "#fdfdfd",
		url: "images/frozen-right.png"
	},
	content: [
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#333333",
			size: 18,
			font: "Droid Serif",
			text: "Page 20"
		},
		{
			type: "TextArea",
			x: 10,
			y: 21,
			width: 50,
			align: "left",
			color: "#333333",
			size: 24,
			font: "Droid Serif",
			text: "Cyclers rotate through sprites on touch or click.",
			sound: {
				startTime: 0.4,
				endTime: 0.45,
				loop: false
			},
		},
		{
			type: "Cycler",
			autoStart: false,
			sound: {
				startTime: 1,
				endTime: 1.1,
				loop: false
			},
			content: [
				{
					type: "Sprite",
					id: "tower2",
					x: "178px",
					y: "316px",
					numFrames: 12,
					frameDelay: 6,
					autoStart: false,
					url: "images/tower-top-2.png"
				},
				{
					type: "Sprite",
					id: "tower3",
					x: "178px",
					y: "316px",
					numFrames: 14,
					frameDelay: 2,
					url: "images/tower-top-3.png"
				}
			]
		}
	]
});