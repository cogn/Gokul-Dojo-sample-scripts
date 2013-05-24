//userid is your picasa user id
//album id is the id of the album you wish to draw from
//targetid is the id of the node where you want to insert the slideshow
//showcaption (true/false)
//hascontrol (true/false) - does the slideshow autoflip, or do we give control
//thumbsize - (144c) the size of the image to display from allowable picasa sizes
//interval - 2000 (milliseconds to display each slide
	//allowed sizes:
// cropped 32c, 48c, 64c, 72c, 104c, 144c, 150c, 160c
// uncropped 32u, 48u, 64u, 72u, 94u, 104u, 110u, 128u, 144u, 
//150u, 160u, 200u, 220u, 288u, 320u, 400u, 512u, 576u, 640u, 
//720u, 800u, 912u, 1024u, 1152u, 1280u, 1440u, 1600u

//createPicasaSlideshow(userid, albumid, targetid, showcaption, hascontrol, thumbsize, interval);

function createPicasaControls(carousel, targetid) {
	require(["dojo/dom-construct", "dojo/dom-class"], function(domConstruct, domClass) {
		var atag = domConstruct.create("a", {innerHTML: "&lsaquo;", href: "#"+targetid, "data-slide":"prev"}, carousel, "last");
		domClass.add(atag, "left");
		domClass.add(atag, "carousel-control");
				
		atag = domConstruct.create("a", {innerHTML: "&rsaquo;", href: "#"+targetid, "data-slide": "next"}, carousel, "last");
		domClass.add(atag, "right");
		domClass.add(atag, "carousel-control");	
	});	
}

function createPicasaCaption(slidenode, item) {
	//given a slidenode and the item, will create the apprpriate caption
	require(["dojo/dom-construct", "dojo/dom-class"], function(domConstruct, domClass) {
		var caption = domConstruct.create("div", null, slidenode, "last");
		domClass.add(caption, "carousel-caption");
					
		domConstruct.create("h4",{innerHTML: item.title["$t"]}, caption, "last");
		//domConstruct.create("p",{innerHTML: "some description"}, caption, "last");
	});
}

function createPicasaSlide(innernode, item, showcaption, active) {
	//create carousel item
	require(["dojo/dom-construct", "dojo/dom-class"], function(domConstruct, domClass) {


		var slidenode = domConstruct.create("div", null, innernode, "last");
		domClass.add(slidenode, "item");
		if(active) {
			domClass.add(slidenode, "active");
		}
					
		//add outer link
		var atag = domConstruct.create("a", {innerHTML: " ", href: item.content.src, title: item.title["$t"], target: "_blank"}, slidenode, "last");
					
		//add image
		domConstruct.create("img", {src: item.media$group.media$thumbnail[0].url}, atag, "last");
					
		if (showcaption) {
			createPicasaCaption(slidenode, item);
		}
	});
}

function createPicasaSlideshow(userid, albumid, targetid, showcaption, hascontrol, thumbsize, interval) {
	
	var url = "https://picasaweb.google.com/data/feed/api/user/" + userid + "/albumid/" + albumid + "?alt=json-in-script&thumbsize=" + thumbsize;
	
	require(["dojo/request/script","dojo/dom-construct", "dojo/dom-class"], function(script, domConstruct, domClass) {
 		script.get(url, {
    			jsonp: "callback"
  		}).then(function(data){
   			// create the outer carousel container   		
			var carousel = domConstruct.create("div", null, targetid, "last");
			domClass.add(carousel, "carousel");
			domClass.add(carousel, "slide");

			//carousel inner
			var innernode = domConstruct.create("div", null, carousel, "last");	
			domClass.add(innernode, "carousel-inner");		

   			var albumtitle = data.feed.title["$t"];

   			var images = data.feed.entry;
   			require(["dojo/_base/array"], function(array){
				array.forEach(images, function(item, i){
					if(i > 0) {
						var active = false;
					} else {
						var active = true;
					}
					//create slide
					createPicasaSlide(innernode, item, showcaption, active);
				});
				
				//create the controls, if needed
				if (hascontrol) {
					createPicasaControls(carousel, targetid);
				}
				
				//initialise the carousel
				$('.carousel').carousel({
    					interval: interval
				})
				
			});
		}, function(err){
    			// Handle the error condition
    			//alert("unable to get photo album");
		});
	});
}
