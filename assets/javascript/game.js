$(document).ready(function () {

  var config = {
    apiKey: "AIzaSyBEngm6Tfoq8d-Swj8WZWx9TgoRYuh1ScY",
    authDomain: "train-time-9f2c7.firebaseapp.com",
    databaseURL: "https://train-time-9f2c7.firebaseio.com",
    projectId: "train-time-9f2c7",
    storageBucket: "",
    messagingSenderId: "18302731760"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  
  
  $("#log").on("click", function() {
    var provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);
      
    }).catch(function(error) {
      var errorMessage = error.message;
      console.log(errorMessage);
      
    });
  })


  function update() {
    $(".clock").html(moment().format("D, MMM YYYY hh:mm:ss"))
  }
  update();

  setInterval(update, 1000)

  $(".btn").on("click", function (event) {
    event.preventDefault();

    var train = $("#name").val().trim();
    var dest = $("#destination").val().trim();
    var first = $("#first-input").val().trim();
    var freq = $("#rate-input").val().trim();

    var newTrain = {
      train: train,
      dest: dest,
      first: first,
      freq: freq,
    };

    database.ref().push(newTrain);

    $("#name").val("");
    $("#destination").val("");
    $("#first-input").val("");
    $("#rate-input").val("");
    console.log(newTrain.train);
    console.log(newTrain.dest);
    console.log(newTrain.first);
    console.log(newTrain.freq);
  });



  database.ref().on("child_added", function (childSnapshot) {

    var ttrain = childSnapshot.val().train;
    var tdest = childSnapshot.val().dest;
    var tfirst = childSnapshot.val().first;
    var tfreq = childSnapshot.val().freq;

    console.log(ttrain);
    console.log(tdest);
    console.log(tfirst);
    console.log(tfreq);

    var firstTimeConverted = moment(tfirst, "HH:mm").subtract(1, "years");

    var tmin = moment().diff(moment(firstTimeConverted, "hh:mm"), "minutes");

    // console.log(tmin);

    var tRemainder = tmin % tfreq;

    var tilTrain = tfreq - tRemainder;

    var trainTime = moment().add(tilTrain, "minutes");


    var newRow = $("<tr class='" + ttrain + "'>").append(
      $("<td>").text(ttrain),
      $("<td>").text(tdest),
      $("<td>").text(tfreq),
      $("<td class='next-time'>").text(moment(trainTime).format("hh:mm")),
      $("<td class='minutes-til'>").text(tilTrain),
      $("<td data=" + childSnapshot.key + " class='train-remove'>").text("Remove")
    );
    console.log(".train-remove");

    $("#train-table > tbody").append(newRow);

    $(".train-remove").on("click", function () {
      var row = $(this).closest("tr");
      var attribute = $(this).attr("data")
      row.remove();
      database.ref().child(attribute).remove();
    })




  });


});