$(document).ready( function() {
  console.log( "ready!" );
  loadPlayer();
});


function getArtistId() {
  return 'l-gQLqv9f4o';
}

function loadPlayer() { 
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubePlayerAPIReady = function() {
      onYouTubePlayer();
    };

  } else {

    onYouTubePlayer();

  }
}


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  console.log('onYouTubeIframeAPIReady');

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'QqqBs6kkzHE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

onYouTubeIframeAPIReady();

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

var newVideo;

$('#submit').click(function(event) {
  event.preventDefault();

  var newVideo = "'" + $('#input').val() + "'";
  $('.video-feed').append('<div class="video">' + newVideo + '</div>');

  console.log(hi);

  // player.loadVideoById({'videoId': 'bHQqvYy5KYo',
  //              'startSeconds': 5,
  //              'endSeconds': 60,
  //              'suggestedQuality': 'large'});                 
});


function Video (url, artist, song) {
  this.url = url,
  this.artist = artist,
  this.song = song,
  this.votes = votes
}

function PostVideo (url, artist, song) {
  firebase.database().ref('artists/' + artist).set({
    url: url,
    artist: artist,
    song: song,
    votes: 0
  });
}

var firebaseDB = firebase.database();
var videoInFirebase = firebaseDB.ref('artists');

$('#inputForm').on('submit', function(event) {
  event.preventDefault();
  var videoInfo = $('#input').val();
  

  // "Create" a new message object in the database
  videoInFirebase.push({
    url: url,
    artist: artist,
    song: song,
    votes: 0
  });
});

videosInFirebase.on('value', function(results) {
  // $('.message-board').empty();
  console.log(results);

  var videos = results.val();

  var unsortedWeirdIds = Object.keys(videos);
  var weirdIds = _.sortBy(unsortedWeirdIds, 'votes');


  weirdIds.forEach(function(weirdId) {
    var videoObject = messages[weirdId];
    var videoUrl = messageObject.url;
    var votes = messageObject.votes;

    var messageInFirebase = firebaseDB.ref('videos/' + weirdId);

    var $votesSpan = $('<span>').addClass('votes').html(votes);

   

    $votesSpan.on('click', function() {
      videosInFirebase.update({
        votes: votes + 1
      });
    });

    var $videoLi = $('<li>').html(video).append($votesSpan);
    $('.video-feed').append($videoLi);
  });
});