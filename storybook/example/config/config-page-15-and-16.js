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
			type: "TextArea",
			x: "200px",
			y: "360px",
			width: "350px",
			align: "left",
			color: "#222222",
			size: 20,
			font: "Droid Serif",
			text: 'Object locations and dimensions can be specified as a percentage of page (e.g. "200%" or "200") or as pixel values (e.g. "200px").'
		},
		{
			type: "Sprite",
			x: "200px",
			y: "500px",
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
			x: 0,
			y: 95,
			align: "center",
			color: "#222222",
			size: 18,
			font: "Droid Serif",
			text: "Page 16"
		},
		{
			type: "TextArea",
			x: 20,
			y: 50,
			width: 65,
			align: "center",
			color: "#222222",
			size: 28,
			font: "Droid Serif",
			text: "A page background color can be specified instead of an image."
		}
	]
});
