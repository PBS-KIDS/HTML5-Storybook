//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/green-hill.jpg"
	},
	content: [
		{
			type: "TextArea",
			x: 15,
			y: 50,
			width: 70,
			align: "center",
			color: "#222222",
			size: 32,
			font: "Droid Serif",
			text: "Sprites are drawn on top of the page background."
		},
		{
			type: "TextArea",
			x: 15,
			y: 65,
			width: 70,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Use Sprites instead of including on the page background for improved performance when using the same sprite or page background on multiple pages."
		},
		{
			type: "Sprite",
			x: 40,
			y: 13,
			url: "images/char-jump.png"
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 7"
		}
	]
});
