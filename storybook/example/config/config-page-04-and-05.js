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
			font: "Droid Serif",
			text: "Text in a Text Area support HTML elements including: <b>bold</b> &lt;b&gt;, <i>italics</i> &lt;i&gt;, <u>underline</u> &lt;u&gt; line... <br /><br />breaks &lt;br /&gt;, <em>emphasis</em> &lt;em&gt;, <strong>strong</strong> &lt;strong&gt;, and <small>small</small> &lt;small&gt;."
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
			size: 24,
			font: "Droid Serif",
			text: "A background image can be assigned for a page. <small>If an background image is not found in the page configuration the engine will implement the default background image in the book configuration</small>."
		},
		{
			type: "TextArea",
			x: 20,
			y: 75,
			width: 60,
			align: "center",
			color: "#222222",
			size: 14,
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
