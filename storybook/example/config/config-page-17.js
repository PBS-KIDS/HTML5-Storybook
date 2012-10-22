//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#313d6b",
		url: "images/cloud-page.png"
	},
	content: [
		{
			type: "TextArea",
			x: 10,
			y: 22,
			width: 70,
			align: "left",
			color: "#313d6b",
			size: 24,
			font: "Droid Serif",
			text: "A page background image can be partially transparent with a background color showing through."
		},
		{
			type: "TextArea",
			x: 20,
			y: 50,
			width: 65,
			align: "right",
			color: "#dddddd",
			size: 40,
			font: "Droid Serif",
			text: "This is a last page specified in the config."
		},
		{
			type: "TextArea",
			x: 10,
			y: 70,
			width: 80,
			align: "center",
			color: "#dddddd",
			size: 18,
			font: "Droid Serif",
			text: "A blank page will be inserted on the right for the missing <i>even</i> page."
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#dddddd",
			size: 18,
			font: "Droid Serif",
			text: "Page 17"
		}
	]
});