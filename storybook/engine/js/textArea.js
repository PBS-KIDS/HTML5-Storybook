//  ------------------------------------------------------------------
//  textArea.js
//
//  Copyright 2012 PBS KIDS Interactive. All Rights Reserved.

PBS.KIDS.storybook.textArea = function (GLOBAL, PBS, options) {
	
	"use strict";
	
	var that,
		element,
		initialized = false,
		parentElement = options && options.parentElement,
		paragraphContent = [],
		paragraphElements = [],
		dirty = true,
		textArr,
		
		// Convert the html tags of a string from a <htmlTag> to [newTagName]
		//
		// Parameters
		//    text: string to be replaced
		//    htmlTag: tag name enclosed by chevrons
		//    newTagName: new tag name enclosed by square brackets
		//    allowAttr: If not true then strip out anything out of the first
		convertTag = function (text, htmlTag, newTagName, allowAttr) {
	
			var regExp,
				regExpStr,
				replaceStr;
			
			// Create the regular expression string
			// Match the first open chevron and the htmlTag
			regExpStr = "\<" + htmlTag;
			// Match anything until closing chevron (e.g <div class="container">)
			if (allowAttr) {
				regExpStr += "(.*?)";
			}
			regExpStr += "\>(.*?)\<\/" + htmlTag + "\>";

			// Create regular expression
			regExp = new RegExp(regExpStr, "gi");
			
			if (allowAttr) {
				replaceStr = "[" + newTagName + "$1]$2[/" + newTagName + "]";
			} else {
				replaceStr = "[" + newTagName + "]$1[/" + newTagName + "]";
			}
			
			return text.replace(regExp, replaceStr);
		},
		
		// Returns a string with all html tags removed string provided in the parameter
		removeHtmlTags = function (text) {
		
			var tmpElement;
			
			// Remove all HTML tags
			tmpElement = GLOBAL.document.createElement("div")
			tmpElement.innerHTML = text;
			return tmpElement.textContent || tmpElement.innerText || "";
		},
		
		init = function () {
	
			var i;
			
			if (!initialized) {
				initialized = true;
			
				that.initView();
			
				// Create the text area element
				element.className = "pbsTextArea";
				if (options.className) {
					element.className += " " + options.className;
				}
				element.style.textAlign = (options.align !== undefined) ? options.align : "center";
				element.style.fontFamily = (options.font !== undefined) ? options.font : "";
				element.style.fontSize = (options.size !== undefined) ? options.size + "em" : "1em";
				// Set the line height to the options font size to normalize inline font sizes
				element.style.lineHeight = "120%";
				
				// Set text color if specified
				if (options.color !== undefined) {
					element.style.color = options.color;
				}
		
				// For each paragraph in the options
				for (i = 0; i < textArr.length; i += 1) {
					// Set the text from the options
					paragraphContent[i] = textArr[i];
			
					// If the clean tags property is not turned off
					if (options.cleanTags !== "false") {
						
						// Convert supported HTML tags to square brackets
						//paragraphContent[i] = paragraphContent[i].replace(/\<br.*?\>/gi, "[newline]");
						paragraphContent[i] = convertTag(paragraphContent[i], "b", "bold");
						paragraphContent[i] = convertTag(paragraphContent[i], "i", "italic");
						paragraphContent[i] = convertTag(paragraphContent[i], "em", "emphasis");
						paragraphContent[i] = convertTag(paragraphContent[i], "color", "color", true);
						paragraphContent[i] = convertTag(paragraphContent[i], "size", "size", true);
						paragraphContent[i] = convertTag(paragraphContent[i], "font", "font", true);
						
						// Strip out HTML tags
						paragraphContent[i] = removeHtmlTags(paragraphContent[i]);
					}
					
					// Convert square brackets back to HTML tags
					//paragraphContent[i] = paragraphContent[i].replace(/\[newline\]/gi, "<br />");
					paragraphContent[i] = paragraphContent[i].replace(/\[bold\](.*?)\[\/bold\]/gi, "<b>$1</b>");
					paragraphContent[i] = paragraphContent[i].replace(/\[italic\](.*?)\[\/italic\]/gi, "<i>$1</i>");
					paragraphContent[i] = paragraphContent[i].replace(/\[emphasis\](.*?)\[\/emphasis\]/gi, "<em>$1</em>");
					paragraphContent[i] = paragraphContent[i].replace(/\[color=(.*?)\](.*)\[\/color\]/gi, "<span style=\"color:$1\">$2</span>");
					paragraphContent[i] = paragraphContent[i].replace(/\[size=(.*?)\](.*?)\[\/size\]/gi, "<span style=\"font-size:$1em\">$2</span>");
					paragraphContent[i] = paragraphContent[i].replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, "<span style=\"font-family:$1\">$2</span>");
		
					if (textArr.length === 1) {

						// Set the contents of the paragraph
						element.innerHTML = paragraphContent[i];
					} else {
						// Create the paragraph element
						paragraphElements[i] = GLOBAL.document.createElement("p");
						
						// Set paragraph margin if specified
						if (that.paragraphSpacing !== null) {
							paragraphElements[i].style.marginBottom = (that.paragraphSpacing.toString().toUpperCase().indexOf("PX") !== -1) ? that.paragraphSpacing : that.paragraphSpacing + "%";
						}
						
						// Add the paragraph element to the text area
						element.appendChild(paragraphElements[i]);
						// Set the contents of the paragraph
						paragraphElements[i].innerHTML = paragraphContent[i];
					}
					
				}
				
				// Listen to when the sprite is touched or clicked
				that.addEventListener("PRESS", that.press);
			}
		};
	
	// The text in the options can be an array or a string
	if (typeof options.text === "string") {
		textArr = [options.text];
	} else {
		textArr = options.text;
	}
	// Set the element to a paragraph element if only one text item, otherwise create a container div
	element = (textArr.length === 1) ? GLOBAL.document.createElement("p") : GLOBAL.document.createElement("div");
	// Inherit the view
	that = PBS.KIDS.storybook.view(PBS, element);
	if (parentElement) {
		parentElement.appendChild(element);
	}
	
	// Public properties
	that.x = options && (options.x !== undefined) ? options.x : 0;
	that.y = options && (options.y !== undefined) ? options.y : 0;
	that.width = options && (options.width !== undefined) ? options.width : 100;
	that.horizontalAlign = (options && options.horizontalAlign !== undefined) ? options.horizontalAlign.toUpperCase() : "LEFT";
	that.verticalAlign = (options && options.verticalAlign !== undefined) ? options.verticalAlign.toUpperCase() : "TOP";
	that.parentWidth = options.parentWidth;
	that.parentHeight = options.parentHeight;
	that.paragraphSpacing = (options.paragraphSpacing !== undefined) ? options.paragraphSpacing : null;

	// Update the text area
	that.update = function () {

	};
	
	// Draw the text area
	that.render = function () {
		 
		 if (that.dirty) {
		 	that.dirty = false;
		 }
	};
	
	that.press = function (e) {
console.log("PRESS");
	};
	
	init();

	return that;
};