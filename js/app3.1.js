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

var newVideo;

//Load viddeo click function
$('#submit').click(function(event){
  event.preventDefault();
  
  var newPlayerId = 'player' + playerCounter;
  
  
  loadPlayer();
  
  function getVideoId() {
    return $('#urlInput').val();
  }

  console.log(newPlayerId);


  function loadPlayer() { 
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
      console.log('undefined');
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubePlayerAPIReady = function() {
        onYouTubePlayer();
        console.log('byId');
      };
    } else {
      console.log('is defined');
    }
  }

  function onYouTubePlayer() {
   
    videosInFirebase.on('value', function(results) {

    $('#video-feed').empty();

      // $('.message-board').empty();

      var videos = results.val();

      // iterate through dom elements
      //   id = id portion of dom id
      //   if (id portion of dom id === videos)

      var weirdIds = Object.keys(videos);

      weirdIds.forEach(function(weirdId, index) {
        var videoObject = videos[weirdId];
        var videoId = videoObject.videoId;
        var artist = videoObject.artist;
        var song = videoObject.song;
        var votes = videoObject.votes;
        $('#video-feed').append('<div id=player-"' + weirdId + '">')

        var player = new YT.Player('player-' + weirdId, {
                height: '240',
                width: '320',
                videoId: weirdId,
                events: {
                    'onReady': onPlayerReady
                }
            })


        var messageInFirebase = firebaseDB.ref('videos/' + weirdId);

        var $votesSpan = $('<span>').addClass('votes').html(votes);

       

        $votesSpan.on('click', function() {
          videosInFirebase.update({
            votes: votes + 1
          });
        });

    console.log('function' + newPlayerId);
  }

  $('.slider').slideUp(400);
  $('#urlInput').val('');
  $('#artistInput').val('');
  $('#songInput').val('');
  playerCounter += 1;
}); //end video loader




var firebaseDB = firebase.database();
var videosInFirebase = firebaseDB.ref('urls');

$('#submit').on('click', function(event) {
  event.preventDefault();
  var videoId = $('#urlInput').val();
  var artistName = $('#artistInput').val();
  var songName = $('#songInput').val();
  console.log(videoId + artistName + songName);
  

  // "Create" a new message object in the database
  videosInFirebase.push({
    videoId: videoId,
    artist: artistName,
    song: songName,
    votes: 0
  });

var onYouTubeIframeAPIReady;

});
});

    // var $videoLi = $('<li>').html(video).append($votesSpan);
    // $('.video-feed').append($videoLi);

