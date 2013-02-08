//  ------------------------------------------------------------------
//  
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config.pages.push({
	background: {
		color: "#fdfdfd",
		url: "images/entrance-left.png"
	},
	sound: {
		startTime: 0,
		endTime: 10
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
		},
		{
			type: "TextArea",
			x: 15,
			y: 55,
			width: 60,
			align: "right",
			color: "#333333",
			size: 18,
			font: "Droid Serif",
			text: "Sounds can also be played when touching a page element. Note: this type of sound will not play when another sound with property 'persist' set to true. Page sounds are set to persist by default."
		},
		{
			type: "Sprite",
			x: 59,
			y: 68,
			url: "images/music-note-sign.png",
			sound: {
				startTime: 174.6,
				endTime: 174.7
			},
		},
	]
}, {
	background: {
		color: "#fdfdfd",
		url: "images/entrance-right.png"
	},
	sound: {
		startTime: 31,
		endTime: 74,
		persist: true
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
			sound: {
				startTime: 5,
				endTime: 6,
				loop: false
			},
			x: 5,
			y: 64,
			width: 80,
			align: "left",
			color: "#333333",
			size: 24,
			font: "Droid Serif",
			text: "Different sounds are supported on left and right pages. The right sound page will play after the left sound page is complete (when in two-page layout)."
		},
		{
			type: "TextArea",
			x: 5,
			y: 78,
			width: 60,
			align: "left",
			color: "#333333",
			size: 18,
			font: "Droid Serif",
			text: "Setting the 'persist' property of a page sound will allow it to be interrupted by other sounds."
		},
	]
}, {
	background: {
		color: "#fdfdfd",
		url: "images/carpet-left.jpg"
	},
	content: [
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#eeeeee",
			size: 18,
			font: "Droid Serif",
			text: "Page 23"
		},
		{
			type: "TextArea",
			x: 30,
			y: 65,
			width: 65,
			align: "right",
			color: "#cccccc",
			size: 24,
			font: "Droid Serif",
			text: "A drawing pad can be added where the user can draw inside the drawing area."
		},
		{
			type: "DrawingPad",
			x: "455px",
			y: "81px",
			width: "254px",
			height: "394px",
			defaultColor: "#776699",
			radius: 10,
			overlayUrl: "images/banner-outline.png"
		}
	]
}, {
	background: {
		color: "#fdfdfd",
		url: "images/carpet-right.jpg"
	},
	content: [
		{
			type: "TextArea",
			x: 0,
			y: 95,
			align: "center",
			color: "#eeeeee",
			size: 18,
			font: "Droid Serif",
			text: "Page 24"
		},
		{
			type: "TextArea",
			x: 20,
			y: 65,
			width: 65,
			align: "left",
			color: "#cccccc",
			size: 24,
			font: "Droid Serif",
			text: "A Drawing Pad has additional features such as eraser tool, color and clear drawing buttons."
		},
		{
			type: "DrawingPad",
			x: "177px",
			y: "126px",
			width: "413px",
			height: "345px",
			defaultColor: "#346679",
			radius: 15,
			textureUrl: "images/window-texture.png",
			eraserButtons: [
				{
					x: "680px",
					y: "210px",
					url: "images/eraser-button.png"
				}
			],
			clearButtons: [
				{
					x: "680px",
					y: "120px",
					url: "images/clear-button.png"
				}
			],
			colorButtons: [
				{
					paintColor: "#ffdc00",
					x: "680px",
					y: "400px",
					url: "images/paint-brush-yellow.png"
				},
				{
					paintColor: "#ff0074",
					x: "680px",
					y: "300px",
					url: "images/paint-brush-purple.png"
				}
			]
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
			text: "Page 25"
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