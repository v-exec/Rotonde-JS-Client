var postNum = 0;

//load feed
function loadFeed() {
	//load json file
	readJSON("../feed.json", function(text) {
		var myFeed = JSON.parse(text);
		setTitle(myFeed);
		loadFeeds(myFeed);
	});
}

//loads feeds
function loadFeeds(myFeed) {
	var following = myFeed.portal;

	for (var i = 0; i < following.length; i++) {
		readJSON("http://" + following[i], function(text) {
			var user = JSON.parse(text);
			loadPosts(user);
		});
	}
}

//loads all posts of a user
function loadPosts(user) {
	var timeline = document.getElementById('timeline');

	//check if user has feed
	if (user.feed) {
		var postCount = user.feed.length;
		var posts = user.feed;

		//for each post
		for (var i = 0; i < postCount; i++) {
			var listEntry = document.createElement('li');
			listEntry.className = 'post';

			//post
			var post = document.createElement('div');
			post.className = 'user-entry';

			//image
			if (posts[i].media) {
				var image = document.createElement('img');
				image.src = posts[i].media;
				image.className = 'post-image';
				post.append(image);
			}

			//text
			if (posts[i].text) {
				var text = document.createElement('p');
				var textContent = document.createTextNode(posts[i].text);
				text.append(textContent);
				post.append(text);
			}

			//append post entry
			listEntry.append(post);

			//divider
			var divider = document.createElement('div');
			divider.className = 'divider';
			listEntry.append(divider);

			//footer
			var footer = document.createElement('div');
			footer.className = 'user-footer';

			//pic
			if (user.profile.avatar) {
				var avatar = document.createElement('img');
				avatar.src = user.profile.avatar;
				avatar.className = 'avatar';
				footer.append(avatar);
			}

			//user info
			var userInfo = document.createElement('ul');
			userInfo.className = 'user-info';

			var nameAndLocation = document.createElement('li');
			nameAndLocation.className = 'user-info-item';

			//username
			if (user.profile.name) {
				var userName = document.createElement('span');
				userName.className = 'user-name';
				var userNameText = document.createTextNode(user.profile.name);
				userName.append(userNameText);
				nameAndLocation.append(userName);
			}

			//location
			if (user.profile.location) {
				var location = document.createElement('span');
				location.className = 'user-location';
				var locationText = document.createTextNode(' from ' + user.profile.location);
				location.append(locationText);
				nameAndLocation.append(location);
			}

			userInfo.append(nameAndLocation);

			//time
			var timeHolder = document.createElement('li');
			timeHolder.className = 'time';

			var newDate = new Date();
			newDate.setTime(posts[i].time*1000);
			dateString = newDate.toUTCString();

			var time = document.createTextNode(dateString);
			timeHolder.append(time);

			//toggle
			var toggle = document.createElement('a');
			var toggleSymbol = document.createTextNode('~');
			toggle.append(toggleSymbol);
			toggle.className = 'toggle';

			//toggle json origin (using closure to keep postNum)
			(function (postNum) {
				toggle.onclick = (function() {
					var currentPost = postNum;
					var jsonOrigin = document.getElementById("json_" + currentPost);
					if (jsonOrigin.style.display == "none") jsonOrigin.style.display = "block";
					else jsonOrigin.style.display = "none";
				});
			})(postNum);

			
			timeHolder.append(toggle);
			userInfo.append(timeHolder);

			//link
			if (posts[i].url) {
				var url = document.createElement('a');
				var urlText = document.createTextNode('link');
				url.append(urlText);
				url.href = posts[i].url;
				url.style = "color:" + user.profile.color;
				url.className = 'post-link';
				footer.append(url);
			}

			//source
			var source = document.createElement('div');
			source.className = 'json-source';
			source.id = 'json_' + postNum;
			source.style = 'display: none';
			var sourceText = document.createTextNode(JSON.stringify(posts[i]));
			source.append(sourceText);
			
			//reference (todo: handle comments)

			//append user info
			footer.append(userInfo);

			//append source data
			footer.append(source);

			//append footer
			listEntry.append(footer);

			//append post
			timeline.append(listEntry);

			postNum++;
		}
	}
}

//sets page title
function setTitle(myFeed) {
	var titleCard = document.getElementById('title-card');
	var titleCardText = document.createTextNode("Rotonde_Instance ~" + myFeed.profile.name);
	titleCard.appendChild(titleCardText);
}

//reads JSON file
function readJSON(file, callback) {
	var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//load feed on window loaded
window.addEventListener("DOMContentLoaded", function() {
	loadFeed();
});