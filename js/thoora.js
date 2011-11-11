$(document).ready(function() {
	
	// Add your topic and API token here.
	topic_id = "920599614675160476";
	api_token = "79f1e9322f5347e1f355032868f7eacd";

	//Initialize shadow box
	Shadowbox.init();
	
	page_number = 1;
	
	getNewsData(page_number);
	getTweets();
	
	getImages();
	
	$('#loadmore_button').click(function() {
		getNewsData();
	});
});
	
function getNewsData() {
	var api_url = "http://devweb1/public_api/v1/news/all_stories.jsonp?&callback=?";
	var stories_per_page = "6";
	$.getJSON(api_url,
	  {
	    api_token: api_token,
	    topic_id: topic_id,
		stories_per_page: stories_per_page,
		page_number: page_number,
	  },
		function(data) {
			
			if (data.stories.length > 0)
				page_number ++;
				
			$.each(data.stories, function(i, item) {
				if (item.description == '')
					return;
				var published_date = new Date();
				published_date.setTime(item.timestamp * 1000);
				published_month = published_date.toDateString().substring(4, 8) + '.';
				published_date = published_date.toDateString().substring(8, 10);
			
				var divider_div = '<div class="divider_container"><div class="color_block"></div><div class="domain">' + 
					get_hostname(item.source_url) + '</div></div>';
				var date_div = '<div class="date_container"><div class="month">' + published_month + '</div><div class="date">' + published_date + '</div></div>';
				if (item.image_medium != '') {

					var title_div = '<div class="story_title">' + item.title + '</div>';
					var image_div = '<img class="story_img" src="' + item.image_medium + '"/>';
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
			$('.story_desc').truncatable({limit: 600, more: '...', less: 'false'});
			$('.story_desc_img').truncatable({limit: 500, more: '...', less: 'false'});
			$('.story_title').truncatable({limit: 60, more: '...', less: 'false'});
		}
	)
}

function getTweets() {
	var api_url = "http://devweb1/public_api/v1/tweets/all_tweets.jsonp?&callback=?";

	$.getJSON(api_url,
	  {
	    api_token: api_token,
	    topic_id: topic_id,
	  },
		function(data) {
			$.each(data.tweets, function(i, item) {
				var published_date = new Date();
				var tweet_screen_name_div = '<div class="tweet_screen_name"><a href="http://twitter.com/#!/' + item.screen_name + '">' + item.screen_name + '</a></div>';
				var tweet_text_div = '<div class="tweet_text">' + transformTweet(item.text) + '</div>';
				var tweet_timestamp = '<div class="tweet_timestamp">' + getTimeDiff(item.created_at) + '</div>';
				var tweet = '<div class="tweet">' + tweet_screen_name_div + tweet_text_div + tweet_timestamp + '</div>'
				
				$(tweet).appendTo('.overview'); 
			})
			$('#scrollbar1').tinyscrollbar();
		}	
	)
}


function getImages() {
	var api_url = "http://devweb1/public_api/v1/images/all_images.jsonp?&callback=?";

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

function getTimeDiff(timestamp) {
	var diff_secs = new Date().getTime()/1000 - timestamp;
	
	if (diff_secs < 60) 
		return (diff_secs > 1)? parseInt(diff_secs) + ' seconds ago': parseInt(diff_secs) + ' second ago';
		
	var diff_mins =  parseInt(diff_secs/60);
	
	if (diff_mins < 60) 		
		return (diff_mins > 1)? diff_mins + ' mins ago': diff_mins + ' min ago';
	
	var diff_hrs = parseInt(diff_mins/60);
	if (diff_hrs < 24) {
		return (diff_hrs > 1)? diff_hrs + ' hours ago': diff_hrs + ' hour ago';
	}
	var diff_days = parseInt(diff_hrs/24);
	return (diff_days > 1)? diff_days + ' days ago': diff_days + ' day ago';
}

function transformTweet(tweet) {
	tweet_link_trans = tweet.replace(/http:\/\/\S+/g, function(match) {
		return '<a href="' + match + '">' + match + '</a>';
	});
	
	tweet_name_trans = tweet_link_trans.replace(/@[0-9a-zA-Z]+/g, function(match) {
		return '<a href="http://twitter.com/#!/' + match + '">' + match + '</a>';
	});
	
	tweet_hash_trans = tweet_name_trans.replace(/ #(\S+)/g, function(match, match2) {
		return '<a href="http://twitter.com/#!/search?q=%23' + match2 + '">' + match + '</a>';
	});
	
	return tweet_hash_trans;
}
