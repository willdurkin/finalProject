$( document ).ready(function() {
    console.log( "ready!" );
});

// Input fields
$('#urlInput').click(function() {
  console.log('slide');
  $('.slider').slideDown(500).css('display', 'flex');
});

// Initialize Firebase
 var config = {
    apiKey: "AIzaSyD33LPylUvbdB7cq8snMUc-_D63l4EQsHM",
    authDomain: "final-project-b4001.firebaseapp.com",
    databaseURL: "https://final-project-b4001.firebaseio.com",
    storageBucket: "final-project-b4001.appspot.com",
  };
  firebase.initializeApp(config);

var playerCounter = 1;
var newVideo;
var player;

function onYouTubePlayer() {
  videosInFirebase.on('value', function(results) {
    console.log('we got value');
    var videos = results.val();
  
    var weirdIds = Object.keys(videos);
  
    weirdIds.forEach(function(weirdId, index) {
      console.log(weirdId);
      var videoObject = videos[weirdId];
      var url = videoObject.url;
      var artist = videoObject.artist;
      var song = videoObject.song;
      var votes = videoObject.votes;
      $('#video-feed').append('<div id=player' + weirdId + '>');
      
      var player = new YT.Player('player' + weirdId, {
          height: '490',
          width: '880',
          videoId: weirdId,
          playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
      });   
    }); //end video loader
  });
}

function loadPlayer() { 
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
    console.log('undefined');
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubePlayerAPIReady = function() {
      console.log('API ready');
      onYouTubePlayer();
    };
  } else {
    console.log('is defined BAD');
  }
}

var firebaseDB = firebase.database();
var videosInFirebase = firebaseDB.ref('urls');

$('#submit').on('click', function(event) {
  event.preventDefault();
  var videoUrl = $('#urlInput').val();
  var artistName = $('#artistInput').val();
  var songName = $('#songInput').val();
  console.log(videoUrl + artistName + songName);
  

  // "Create" a new message object in the database
  videosInFirebase.push({
    url: videoUrl,
    artist: artistName,
    song: songName,
    votes: 0
  });
});

loadPlayer();

//Load viddeo click function
$('#submit').click(function(event){
  event.preventDefault();
  // $('#video-feed').append('<div id="player">')
  
  playerCounter += 1;

  function getVideoId() {
    console.log($('#urlInput').val());
    return $('#urlInput').val();
  }
});

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