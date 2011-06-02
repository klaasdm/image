/**
 * init the application
 */
var tagit = null;


var imageName = "";

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
	$('#file_upload').uploadify({
		'uploader'  : 'uploadify/uploadify.swf',
		'script'    : 'uploadify/uploadify.php',
		'cancelImg' : 'uploadify/cancel.png',
		'folder'    : 'pictures',
		'displayData' : 'speed',
		'fileDataName' : 'Filedata',
		'auto'      : false,
		'multi': false,
		'height' : 40,
		'width' : 145,
		'removeCompleted' : false,
		'buttonText'  : 'Add image',
		'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
		'fileDesc'    : 'Image Files',
		'onComplete' : function(event, queueID, fileObj, reponse, data) {
			var newArray = new Array();
			var str = reponse;
			var rating = document.new_image_form.rating.value ;
			var title = document.new_image_form.title.value ;
			var author = document.new_image_form.author.value;
			var type = document.new_image_form.type.value;
			var asin = document.new_image_form.asin.value;
			var tag = document.new_image_form.tag.value;

			var element = {
				rating: rating,
				title: title,
				author: author,
				type: type,
				asin: asin,
				tags: tag,
				image: str

			}
			newArray.push(element);
			$.ajax({
				url: "php/dataretriever.php",
				type: "GET",
				data: {
					"new_value": newArray
				},
				// This executes when the PHP service finisged sending data to the client side
				success: function(data_from_php, textStatus, jqXHR) {
					tagContent();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//alert("There was some error with the PHP service: " + textStatus);
				}
			});
		}
	});

	tagContent();

	$("a#single_image").fancybox();

});
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

				data2 = "There are " + (str_array.length - "1") + " tags"
			} else {

				data2 = "There are " + (str_array.length - "24")  + " more tags"
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
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"image_value": cv
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			var str_array = data_from_php.image_value;
			data = str_array;
			dummie = str_array.length
			if(dummie == "1") {

				data2 = "<p>" + str_array.length + " image</p>"
			} else {

				data2 = "<p>" + str_array.length + " images</p>"
			}
			// The one line processing call...
			var result = TrimPath.processDOMTemplate("images_value_jst", data);
			//var result2 = TrimPath.processDOMTemplate("images_value_jst", data2);
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

			
$("#imageInformation").animate({width:250},"slow");
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
			
			var result = TrimPath.processDOMTemplate("imageInfo_value_jst", 
			 {
				"imageInfoArray":imageInfoArray
			});
			
			
			$('#imageInfo_holder').html(result);
			
			document.testform.style.display = "";
			$('.num').numeric();
			$('.cust').alphanumeric({
				ichars:'"\''
			});

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}

function submitInfo() {
	$("#imageInformation").animate({width:600},"slow");
	
	editArray = {
		rating: document.testform.rating.value,
		title: document.testform.title.value ,
		author: document.testform.author.value,
		type: document.testform.type.value,
		asin: document.testform.asin.value,
		tags: document.testform.tag.value,
		image: imageName

	};
 		
	$.ajax({
		url: "php/dataretriever.php",
		type: "GET",
		data: {
			"edit_value": editArray
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {
			tagContent();
			
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
