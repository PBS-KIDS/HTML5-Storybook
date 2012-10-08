//  ------------------------------------------------------------------
//  book.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.config = {
	background: {
		color: "#43ff92",
		url: "images/circles-background.png"
		
	},
	book: {
		font: "Georgia",
		startOnPage: 0,
		pageWidth: 768,
		pageHeight: 1024,
		previousPageButton: {
			url: "images/prev-page-button.png",
			x: 1,
			y: 50,
			width: "50px",
			height: "50px"
		},
		nextPageButton: {
			url: "images/next-page-button.png",
			horizontalAlign: "RIGHT",
			x: 1,
			y: 50,
			width: "50px",
			height: "50px"
		},
		pageBackground: {
			color: "#fefefe"
		},
		oddPageBackground: {
			color: "#fdfdfd"
		},
		evenPageBackground: {
			color: "#f9f9f9"
		}
	},
	cover: {
		background: {
			url: "images/cover.jpg"
		},
		content: [
			{
				type: "TextArea",
				x: 0,
				y: 25,
				align: "center",
				color: "#222222",
				size: 48,
				font: "Droid Serif",
				text: "Example Storybook"
			}
		]
	},
	pages: []
};