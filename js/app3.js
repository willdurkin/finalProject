$( document ).ready(function() {
    console.log( "ready!" );
    loadPlayer();
});

$('#urlInput').click(function() {
  console.log('slide');
  $('.slider').slideDown(500).css('display', 'flex');
});

$('#submit').click(function() {
  $('.slider').slideUp(400);
  $('#urlInput').val('');
  $('#artistInput').val('');
  $('#songInput').val('');
})

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD33LPylUvbdB7cq8snMUc-_D63l4EQsHM",
    authDomain: "final-project-b4001.firebaseapp.com",
    databaseURL: "https://final-project-b4001.firebaseio.com",
    storageBucket: "final-project-b4001.appspot.com",
  };

  firebase.initializeApp(config);

var playerCounter = 1;

$('#submit').click(function(event){
  event.preventDefault();
  $('#video-feed').append('<div id="player' + playerCounter + '">')
  loadPlayer();
  playerCounter += 1;
});

function getVideoId() {
  return "'" + $('#input').val() + "'";
}

function loadPlayer() { 
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
    console.log('undefined');
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubePlayerAPIReady = function() {
      onYouTubePlayer();
    };
  } else {
    console.log('is defined');
  }
}

var player;

function onYouTubePlayer() {
  player = new YT.Player('player' + playerCounter, {
    height: '490',
    width: '880',
    videoId: '6Ci1IB1ijhY',
    playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
    events: {
      'onStateChange': onPlayerStateChange,
      'onError': catchError
    }
  });
}
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
  else if(event.data == YT.PlayerState.ENDED)
  {
    location.reload();
  }
}

function onPlayerReady(event) {

  //if(typeof(SONG.getVideoId()) == undefined)
  //{
  //  console.log("undefineeeed"); 
  //} 
  //event.target.playVideo();   
}

function catchError(event)
{
  if(event.data == 100) console.log("De video bestaat niet meer");
}

function stopVideo() {
  player.stopVideo();
}

// function PostVideo (url, artist, song) {
//   firebase.database().ref('artists/' + artist).set({
//     url: url,
//     artist: artist,
//     song: song,
//     votes: 0
//   });
// }

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

videosInFirebase.on('value', function(results) {
  // $('.message-board').empty();
  console.log(results);

  var videos = results.val();

  var unsortedWeirdIds = Object.keys(videos);
  var weirdIds = _.sortBy(unsortedWeirdIds, 'votes');

  weirdIds.forEach(function(weirdId) {
    var videoObject = videos[weirdId];
    var url = videoObject.url;
    var artist = videoObject.artist;
    var song = videoObject.song;
    var votes = videoObject.votes;


    var messageInFirebase = firebaseDB.ref('videos/' + weirdId);

    var $votesSpan = $('<span>').addClass('votes').html(votes);

   

    $votesSpan.on('click', function() {
      videosInFirebase.update({
        votes: votes + 1
      });
    });

    // var $videoLi = $('<li>').html(video).append($votesSpan);
    // $('.video-feed').append($videoLi);
  });
});
