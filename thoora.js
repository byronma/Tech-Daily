$(document).ready(function() {
	//Initialize shadow box
	Shadowbox.init();
	
	page_number = 1;
	
	getNewsData(page_number);
	getImages();
	
	$('#loadmore_button').click(function() {
		page_number ++;
		getNewsData(page_number);
	});
});

	
function getNewsData(page_number) {
	var api_url = "http://devweb1/public_api/v1/news/all_stories.jsonp?&callback=?";
	var topic_id = "4873630349695342280";
	var api_token = "b4592be7450b267100e35d0d20acdb99";
	var stories_per_page = "6";
	$.getJSON(api_url,
	  {
	    api_token: api_token,
	    topic_id: topic_id,
		stories_per_page: stories_per_page,
		page_number: page_number,
	  },
		function(data) {
			$.each(data.stories, function(i, item) {
				var published_date = new Date();
				published_date.setTime(item.timestamp * 1000);
				published_month = published_date.toDateString().substring(4, 8) + '.';
				published_date = published_date.toDateString().substring(8, 10);
			
				var divider_div = '<div class="divider_container"><div class="color_block"></div><div class="domain">' + 
					get_hostname(item.source_url) + '</div></div>';
				var date_div = '<div class="date_container"><div class="month">' + published_month + '</div><div class="date">' + published_date + '</div></div>';
				if (item.image_medium != '') {

					var title_div = '<div class="story_title">' + item.title + '</div>';
					var image_div = '<div class="story_img"><img src="' + item.image_medium + '"/></div>';
					var desc_div = '<div class="story_desc_img"><a href="' + item.source_url + '">' + item.description + '</a></div>';
					var body_div = '<div class="story_body">' + title_div + image_div + desc_div + '</div>';
					var story_div = '<div class="story_container_img">' + date_div + body_div + '</div>';
					$(story_div + divider_div).appendTo('#stories_container');
				} else {
					var title_div = '<div class="story_title">' + item.title + '</div>';
					var desc_div = '<div class="story_desc"><a href="' + item.source_url + '">' + item.description + '</a></div>';
					var body_div = '<div class="story_body">' + title_div + desc_div + '</div>';
					var story_div = '<div class="story_container">' + date_div + body_div + '</div>';
					$(story_div + divider_div).appendTo('#stories_container');
				}
			})
			$('.story_desc').truncatable({    limit: 600, more: '...', less: 'false'});
			$('.story_desc_img').truncatable({    limit: 500, more: '...', less: 'false'});
			$('.story_title').truncatable({    limit: 60, more: '...', less: 'false'});
		}
	)
}

function getImages() {
	var api_url = "http://devweb1/public_api/v1/images/all_images.jsonp?&callback=?";
	var topic_id = "4873630349695342280";
	var api_token = "b4592be7450b267100e35d0d20acdb99";
	$.getJSON(api_url,
	  {
	    api_token: api_token,
	    topic_id: topic_id,
	  },
		function(data) {
			var total_images = data.images_count;
			var count = 1;
			var html = '<div class="image_row">';
			$.each(data.images, function(i, item) {
				if (count == 30)
					return false;
				
				var image_div = '<a href="'+item.image_large + '" rel="shadowbox" title="' + item.title + '"><img class="image" src="'+item.image_small + '"/></a>';
				
				if (count%5 == 0) {
					html += image_div;
					html += '</div><div class="image_row">';
				} else {
					html += image_div;
				}	
				count++;
			})
			html += '</div></div>';
			$(html).appendTo('#images');
		}
	)
} 

function get_hostname(url) {
    var m = ((url||'')+'').match(/(^http:\/\/)([^/]+)/);
    return m ? m[2] : null;
}
