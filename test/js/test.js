/**
 * init the application
 */
var tagit = null;
var imageName;
var contentHeight = 800;
var pageHeight = document.documentElement.clientHeight;
var scrollPosition;
var n = 0;
var n2 = 0;
var n3 = 0;
var xmlhttp;
$(document).ready( function() {
	
	$("input[type=text], textarea").tooltip({

		// place tooltip on the right edge
		position: "center right",

		// a little tweaking of the position
		offset: [-2, 10],

		// use the built-in fadeIn/fadeOut effect
		effect: "fade",

		// custom opacity setting
		opacity: 0.7

	});

	$('.num').numeric();
	$('.cust').alphanumeric({
		ichars:'"\''
	});
	$('.custtag').alphanumeric({
		ichars:'"\''
	});
	tagContent();

	$("a#single_image").fancybox();

});

function submitNewInfo(sub) {
	
	var retnew= new Array();
	$('.newtagList span').each( function(index, el) {
		retnew.push($(el).html());
	});
	newImageArray = {
		rating: document.testform.new_rating.value,
		title: document.testform.new_title.value,
		author: document.testform.new_author.value,
		type: document.testform.new_type.value,
		asin: document.testform.new_asin.value,
		tags: retnew.toString(),
		newImage: $("#new_image_name_holder").html(),
	};
	imageName = newImageArray['newImage'];
	
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"new_value": newImageArray
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {
			
			tagContent();
			imageContent(tagit);
			$('.jqmDialog').jqmHide(); 
			imageInformation(imageName);

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}



function tagContent() {
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"tag_value": "tags"
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {
			var str_array = data_from_php.tag_value;
			data = str_array;

			// The one line processing call...
			var result = TrimPath.processDOMTemplate("tag_value_jst", data);
			// Voila!  That's it -- the result variable now holds

			// Setting an innerHTML with the result is a common last step...
			dummie = str_array.length
			if(dummie < "25") {

				data2 = "There are " + (str_array.length - "1") + " results"
			} else {
					data2 = "There are " + (str_array.length - "1") + " results"
				//data2 = "There are " + (str_array.length - "24")  + " more results..."
			}

			$('#tags_holder').html(result);
			$('#tag_count').html(data2);
			searchTags();

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}

function imageContent(cv) {
	tagit = cv;
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"image_value": cv
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			var str_array = data_from_php.image_value;

			dummie = str_array['imname'].length;

			if(dummie == "1") {

				data2 = "<p>" + dummie + " image</p>"
			} else {

				data2 = "<p>" + dummie + " images</p>"
			}

			var imageshowArray = [];
			$.each(str_array['imname'], function(index, image) {
				imageshowArray.push({
					image: image,
					title: str_array['titles'][index]
				})
			});
			var result = TrimPath.processDOMTemplate("images_value_jst", {
				"imageshowArray":imageshowArray
			});

			$('#images_holder').html(result);
			$('#imagesCount').html(data2);
			$("a.single_image").fancybox();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}

function imageInfo(picname) {

	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"imageInfo_value": picname
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			var str_array = data_from_php.imageInfo_value;

			imageInfoArray = {
				rating: str_array[0],
				title: str_array[1],
				author: str_array[2],
				type: str_array[3],
				asin: str_array[4],
				tags: str_array[5],
				image: str_array[6]
			};

			imageName = str_array[6];

			var result = TrimPath.processDOMTemplate("imageInfo_value_jst", {
				"imageInfoArray":imageInfoArray
			});

			$('#imageInfo_holder').html(result);

			document.testform.style.display = "";
			$('.num').numeric();
			$('.cust').alphanumeric({
				ichars:'"\''
			});
			$('#file_upload2').uploadify({
				'uploader'  : 'uploadify/uploadify.swf',
				'script'    : 'uploadify/uploadify.php',
				'cancelImg' : 'uploadify/cancel.png',
				'folder'    : 'pictures',
				'displayData' : 'speed',
				'fileDataName' : 'Filedata',
				'auto'      : true,
				'multi': false,
				'height' : 35,
				'width' : 145,
				'removeCompleted' : true,
				'buttonText'  : 'Select image',
				'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
				'fileDesc'    : 'Image Files',
				'onComplete' : function(event, queueID, fileObj, reponse, data) {

					$("#image_name_holder").html(reponse);
					$("#img_change").attr('src',"pictures/thumbs/" + reponse);
				}
			});
			$("#image_name_holder").html(imageName);
			
				tags_array = str_array[5].split(",");
		
			for(var i = 0; i < tags_array.length; i++) {
			
				var content = $('#add_tags_holder').html();

				$("#add_tags_holder").html(content +"<div class=\"tagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");

			}
			$('#ex3a').jqm({
				trigger: '#ex3aTrigger',
				overlay: 40, /* 0-100 (int) : 0 is off/transparent, 100 is opaque */
				overlayClass: 'whiteOverlay'

			})
			.jqDrag('.jqDrag'); /* make dialog draggable, assign handle to title */

			// Close Button Highlighting. IE doesn't support :hover. Surprise?
			$('input.jqmdX')
			.hover( function() {
				$(this).addClass('jqmdXFocus');
			}, function() {
				$(this).removeClass('jqmdXFocus');

			})
			.focus( function() {
				this.hideFocus=true;
				$(this).addClass('jqmdXFocus');

			})
			.blur( function() {
				$(this).removeClass('jqmdXFocus');

			});
		

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});

}


function newImage() {


			var result = TrimPath.processDOMTemplate("new_image_value_jst", {
				
			});
		
			$('#newImage_holder').html(result);
			$('.num').numeric();
			$('.cust').alphanumeric({
				ichars:'"\''
			});
			$('#file_upload').uploadify({
				'uploader'  : 'uploadify/uploadify.swf',
				'script'    : 'uploadify/uploadify.php',
				'cancelImg' : 'uploadify/cancel.png',
				'folder'    : 'pictures',
				'displayData' : 'speed',
				'fileDataName' : 'Filedata',
				'auto'      : true,
				'multi': false,
				'height' : 35,
				'width' : 145,
				'removeCompleted' : true,
				'buttonText'  : 'Select image',
				'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
				'fileDesc'    : 'Image Files',
				'onComplete' : function(event, queueID, fileObj, reponse, data) {

					$("#new_image_name_holder").html(reponse);
					
					$("#new_img_change").attr('src',"pictures/thumbs/" + reponse);
					
				}
			});
		
			
			$('#ex3a2').jqm({
				trigger: '#ex3aTrigger2',
				overlay: 40, /* 0-100 (int) : 0 is off/transparent, 100 is opaque */
				overlayClass: 'whiteOverlay'

			})
			.jqDrag('.jqDrag'); /* make dialog draggable, assign handle to title */

			// Close Button Highlighting. IE doesn't support :hover. Surprise?
			$('input.jqmdX')
			.hover( function() {
				$(this).addClass('jqmdXFocus');
			}, function() {
				$(this).removeClass('jqmdXFocus');

			})
			.focus( function() {
				this.hideFocus=true;
				$(this).addClass('jqmdXFocus');

			})
			.blur( function() {
				$(this).removeClass('jqmdXFocus');

			});
}


function submitInfo(sub) {

	var ret= new Array();
		
	$('.tagList span').each( function(index, el) {
		ret.push($(el).html());
	});
	
	editArray = {
		rating: document.testform.rating.value,
		title: document.testform.title.value,
		author: document.testform.author.value,
		type: document.testform.type.value,
		asin: document.testform.asin.value,
		tags: ret.toString(),
		newImage: $("#image_name_holder").html(),
		oldImage: imageName

	};
	imageName = editArray['newImage'];
	
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"edit_value": editArray
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			tagContent();
			imageContent(tagit);
			$('.jqmDialog').jqmHide(); 
			imageInformation(imageName);

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}

function imageInformation(picname) {

	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"imageInfo_value": picname
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			var str_array = data_from_php.imageInfo_value;

			tags = str_array[5];
			//alert(tags);
			var tags_array = tags.split(",");

			imageInfoArray = {
				rating: str_array[0],
				title: str_array[1],
				author: str_array[2],
				type: str_array[3],
				asin: str_array[4],
				tags: tags_array,
				image: str_array[6]
			};

			imageName = str_array[6];

			//The one line processing call...
			var result = TrimPath.processDOMTemplate("imageInformation_value_jst", {
				"imageInfoArray":imageInfoArray
			});

			$('#imageInformation_holder').html(result);

			$("a.single_image").fancybox();

		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert("There was some error with the PHP service: " + textStatus);
		}
	});

}

function addTags(tagger) {

	var tags = "";
	
	if(tagger == "newtag"){
		tags = document.testform.newtag.value;
		tags_array = tags.split(",");
		document.testform.newtag.value = "";
		for(var i = 0; i < tags_array.length; i++) {
		
		var content = $('#new_add_tags_holder').html();

		$("#new_add_tags_holder").html(content +"<div class=\"newtagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");
		
	}

	}else{
		
		tags = document.testform.tag.value;
		tags_array = tags.split(",");
		document.testform.tag.value = "";
		for(var i = 0; i < tags_array.length; i++) {
		
		var content = $('#add_tags_holder').html();

		$("#add_tags_holder").html(content +"<div class=\"tagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");
		
	}

	}
	
	



}

function deleteItem(e) {

	$(e).parent().remove()

}

function searchTags() {

	$("#id_search").quicksearch("table tbody tr", {
		noResults: '#noresults',
		stripeRows: ['odd', 'even'],
		loader: 'span.loading'
	});

}

function ChangeColor(tableRow, highLight) {
	if (highLight) {

		tableRow.style.backgroundColor = "#d84320";

	} else {
		tableRow.style.backgroundColor = "#fdfdfd";

	}
}




	
		
function scroll(){
	

	
	if(navigator.appName == "Microsoft Internet Explorer")
		scrollPosition = document.documentElement.scrollTop;
	else
		scrollPosition = window.pageYOffset;		
	
	if((contentHeight - pageHeight - scrollPosition) < 640){
			
	n = n3;
	n2 = n3 + 15;
		
		
		$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"infinite_value": "infinite"
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {
			var str_array = data_from_php.infinite_value;
			
			
			var imageshowArray = [];
			
			
				for(var i = n; i < n2; i++) {
				if(str_array['imname'].length > i || i < n){
					n3++;
				imageshowArray.push({
					image: str_array['imname'][i],
					title: str_array['titles'][i]
					
				})
				}
				}
				
			
			var result = TrimPath.processDOMTemplate("images_value_jst", {
				"imageshowArray":imageshowArray
			});
			
			dummie = str_array['imname'].length;

			if(dummie == "1") {

				var imageCount = "<p>" + dummie + " image</p>"
			} else {

				var imageCount = "<p>" + dummie + " images</p>"
			}
			var content = $('#images_holder').html();
			$('#images_holder').html(content + result);
			$('#imagesCount').html(imageCount);
			$("a.single_image").fancybox();
			contentHeight += 750;
			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});		
		
	
	}
	
}

	
	
	