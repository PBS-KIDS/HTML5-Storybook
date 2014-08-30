//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	content: [
		{
			type: "TextArea",
			x: 14,
			y: 40,
			width: 72,
			align: "left",
			color: "#222222",
			size: 24,
			paragraphSpacing: "40px",
			font: "Droid Serif",
			text: [
				"Text in a Text Area supports HTML elements including: <b>bold</b>, <i>italics</i> and <em>emphasis</em>.",
				"Additional supported tags are: <color=#22aa22>color</color>, <size=2>size</size> and <font='Reenie Beanie'>font</font>."
			]
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 4"
		}
	]
});

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/character-page-2.jpg"
	},
	content: [
		{
			type: "TextArea",
			x: 10,
			y: 25,
			width: 80,
			align: "left",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "<size=1.4>A background image can be assigned for a page.</size> If an background image is not found in the page configuration the engine will implement the default background image in the book configuration."
		},
		{
			type: "TextArea",
			x: 10,
			y: 75,
			width: 70,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "If a background image is not specified the page container will display the background color in the page or book config."
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 5"
		}
	]
});
