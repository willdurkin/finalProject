$( document ).ready(function() {
    console.log( "ready!" );
    // loadPlayer();
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




//Load viddeo click function
$('#submit').click(function(event){
  event.preventDefault();
  $('#video-feed').append('<div id="player' + playerCounter + '">')
  playerCounter += 1;

  function getVideoId() {
    console.log("'" + $('#urlInput').val() + "'")
    var newVideo = "'" + $('#urlInput').val() + "'";
  }


 // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubePlayer() {
          player.loadVideoById(newVideo);
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
        console.log('onReady');
      };
    } else {
      console.log('is defined');
    }
  }

      loadPlayer();

  // getVideoId();

  // function loadPlayer() { 
  //   if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
  //     console.log('undefined');
  //     var tag = document.createElement('script');
  //     tag.src = "https://www.youtube.com/iframe_api";
  //     var firstScriptTag = document.getElementsByTagName('script')[0];
  //     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
  //     window.onYouTubePlayerAPIReady = function() {
  //       onYouTubePlayer();
  //       console.log('onReady');
  //     };
  //   } else {
  //     console.log('is defined');
  //   }
  // }

  // var player;

  // function onYouTubePlayer() {
  //   player = new YT.Player('player', {
  //     height: '490',
  //     width: '880',
  //     videoId: getVideoId(),
  //     playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
  //     events: {
  //       'onStateChange': onPlayerStateChange,
  //       'onError': catchError
  //     }
  //   });
  //   console.log('player');
  // }
  $('.slider').slideUp(400);
  // $('#urlInput').val('');
  $('#artistInput').val('');
  $('#songInput').val('');
}); //end video loader






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

