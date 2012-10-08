//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		url: "images/desert-left.png"
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
			text: "Page 15"
		},
		{
			type: "Sprite",
			x: 20,
			y: 50,
			url: "images/apple-cart.png"
		}
	]
});

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#f1fd6b"
	},
	content: [
		{
			type: "TextArea",
			x: 20,
			y: 45,
			width: 65,
			align: "center",
			color: "#222222",
			size: 32,
			font: "Droid Serif",
			text: "A page background color can be specified instead of an image."
		},
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 16"
		}
	]
});
