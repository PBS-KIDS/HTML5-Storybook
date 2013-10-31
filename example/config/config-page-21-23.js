//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#fdfdfd"
	},
	sound: {
		startTime: 0,
		endTime: 27,
		loop: false
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
		}, {
			type: "TextArea",
			x: 5,
			y: 20,
			width: 80,
			align: "center",
			color: "#333333",
			size: 24,
			font: "Droid Serif",
			text: "A sound can be played when a page is shown."
		}
	]
}, {
	background: {
		color: "#fdfdfd"
	},
	sound: {
		startTime: 31,
		endTime: 74,
		loop: false
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
			text: "Page 22"
		}, {
			type: "TextArea",
			x: 5,
			y: 60,
			width: 80,
			align: "left",
			color: "#333333",
			size: 24,
			font: "Droid Serif",
			text: "Different sounds are supported on left and right pages. The right sound page will play after the left sound page is complete (when in two-page layout)."
		}
	]
}, {
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
			text: "Page 23"
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