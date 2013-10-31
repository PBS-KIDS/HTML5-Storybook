//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#fdfdfd"
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
			text: "Page 21"
		},
		{
			type: "TextArea",
			x: 20,
			y: 42,
			width: 65,
			align: "right",
			color: "#333333",
			size: 40,
			font: "Droid Serif",
			text: "This is a last page specified in the config"
		},
		{
			type: "TextArea",
			x: 5,
			y: 55,
			width: 80,
			align: "right",
			color: "#333333",
			size: 18,
			font: "Droid Serif",
			text: "A blank page will be inserted on the right for the missing <i>even</i> page."
		}
	]
});