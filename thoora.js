$(document).ready(function() {
	page_number = 1;
	getNewsData(page_number);

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
				if (item.image_medium != '') {
					var title_div = '<div class="story_title">' + item.title + '</div>';
					var image_div = '<div class="story_img"><img src="' + item.image_medium + '"/></div>';
					var desc_div = '<div class="story_desc_img"><a href="' + item.source_url + '">' + item.description + '</a></div>';
					var body_div = '<div class="story_body">' + title_div + image_div + desc_div + '</div>';
					var story_div = '<div class="story_container_img">' + body_div + '</div>';
					$(story_div).appendTo('#stories_container');
				} else {
					var title_div = '<div class="story_title">' + item.title + '</div>';
					var desc_div = '<div class="story_desc"><a href="' + item.source_url + '">' + item.description + '</a></div>';
					var body_div = '<div class="story_body">' + title_div + desc_div + '</div>';
					var story_div = '<div class="story_container">' + body_div + '</div>';
					$(story_div).appendTo('#stories_container');
				}
			})
			$('.story_desc').truncatable({    limit: 600, more: '...', less: 'false'});
			$('.story_desc_img').truncatable({    limit: 500, more: '...', less: 'false'});;
		}
	)
} 

