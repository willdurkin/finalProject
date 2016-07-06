$( document ).ready(function() {
    console.log( "ready!" );
});

// Input fields sider
$('#urlInput').click(function() {
  console.log('slide');
  $('.slider').slideDown(500).css('display', 'flex');
  $('#cancel').slideDown(500);
});


$('.upvote').click(function() {
  $(this).css('background', '#92A8D1').html('great');
  console.log('rock the vote');
});


// Initialize Firebase
 var config = {
    apiKey: "AIzaSyD33LPylUvbdB7cq8snMUc-_D63l4EQsHM",
    authDomain: "final-project-b4001.firebaseapp.com",
    databaseURL: "https://final-project-b4001.firebaseio.com",
    storageBucket: "final-project-b4001.appspot.com",
  };
  firebase.initializeApp(config);

var newVideo;

var firebaseDB = firebase.database();
var videosInFirebase = firebaseDB.ref('urls');

function onYouTubePlayer() {
  videosInFirebase.on('value', function(results) {
    console.log('we got value');
    var videos = results.val();
  
    var weirdIds = Object.keys(videos);
  
    weirdIds.forEach(function(weirdId, index) {
      var videoObject = videos[weirdId];
      var url = videoObject.url;
      var artist = videoObject.artist;
      var song = videoObject.song;
      var votes = videoObject.votes;
      var plays = videoObject.plays;
      var videoId = firebaseDB.ref('urls/' + weirdId);
      var $voteButton = $('<button>^</button>').addClass('upvote');
      console.log(weirdId + ' ' + url);
      
      $('#video-feed').append('<h2>' + artist + ' - ' + song + '</h2><div class=video id=player' + weirdId + '></div>').append($voteButton).append('<span class="vote-span">' + votes + ' votes</span>');
      var player;
      var player = new YT.Player('player' + weirdId, {
          height: '490',
          width: '880',
          videoId: url,
          playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
          events: {
            // 'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
          }
      }); 
      $voteButton.click(function() {
        videoId.set({
          votes: votes + 1
        })
      });  
      $(player).click(function() {
        videoId.set({
          plays: plays + 1
        })
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


// "Create" a new video object in the database

$('#submit').on('click', function(event) {
  event.preventDefault();
  var videoUrl = $('#urlInput').val();
  var artistName = $('#artistInput').val();
  var songName = $('#songInput').val();
  console.log(videoUrl + artistName + songName);
  

  videosInFirebase.push({
    url: videoUrl,
    artist: artistName,
    song: songName,
    votes: 0,
    plays: 0,
  });
});

//Load the player

loadPlayer();

//Submite fields functions
$('#submit').click(function(event){
  event.preventDefault();
  $('.slider').slideUp(400);
  $('#urlInput').val('');
  $('#artistInput').val('');
  $('#songInput').val('');
  $('#video-feed').empty();
  onYouTubePlayer();
});

function onPlayerReady(event) {
  document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
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
};

function stopVideo() {
  player.stopVideo();
};

$('#cancel').click(function() {
  $('.slider').slideUp(400);
  $('#cancel').slideUp(400);
});
