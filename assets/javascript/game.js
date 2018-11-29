$(document).ready(function () {
  
  // configure firebase
  var config = {
    apiKey: "AIzaSyBEngm6Tfoq8d-Swj8WZWx9TgoRYuh1ScY",
    authDomain: "train-time-9f2c7.firebaseapp.com",
    databaseURL: "https://train-time-9f2c7.firebaseio.com",
    projectId: "train-time-9f2c7",
    storageBucket: "",
    messagingSenderId: "18302731760"
  };
  firebase.initializeApp(config);
  // set a variable to represent the firebase database
  var database = firebase.database();
  
  // When the user clicks the #log button
  $("#log").on("click", function() {
    // create a variable to hold the github authorization 
    var provider = new firebase.auth.GithubAuthProvider();
    // set the sign-in to a pop-up window. Users can now log in using that window
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);
      // catch any errors with the user setup
    }).catch(function(error) {
      var errorMessage = error.message;
      console.log(errorMessage);
      
    });
  });
  // Set up a listener to check if the sign-in status of the user changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    }
  });

  

//   setInterval(function() {
//     $(".clock").html(moment().format("D, MMM YYYY hh:mm:ss"));

//     database.ref().once("value").then(function (snap) {
//       snap.forEach(function (childSnapshot) {

      
    

//       var ttrain = childSnapshot.val().train;
//       var tdest = childSnapshot.val().dest;
//       var tfirst = childSnapshot.val().first;
//       var tfreq = childSnapshot.val().freq;
  
  
//       var firstTimeConverted = moment(tfirst, "HH:mm").subtract(1, "years");
  
//       var tmin = moment().diff(moment(firstTimeConverted, "hh:mm"), "minutes");
                
//       let timeUntilTrain;
//                 let nextTrainTime;
//                 let timeRemainder;

//       if (tmin < 0) {
//         timeUntilTrain = Math.abs(timeDiff) + 1;
//         nextTrainTime = convertedTime.format("HH:mm");
//       }
//       else {
//        tRemainder = tmin % tfreq;
  
//        tilTrain = tfreq - tRemainder;
  
//        trainTime = moment().add(tilTrain, "minutes");
//       }
//       // console.log(tmin);
  
      

//       $("<tr class='" + ttrain + "'>").empty();

//       $("<tr class='" + ttrain + "'>").append(
//         $("<td>").text(ttrain),
//         $("<td>").text(tdest),
//         $("<td>").text(tfreq),
//         $("<td data=" + childSnapshot.key + "class='next-time'>").text(moment(trainTime).format("hh:mm")),
//         $("<td data=" + childSnapshot.key + "class='minutes-til'>").text(tilTrain),
//         $("<td data=" + childSnapshot.key + " class='train-remove'>").text("Remove")
//       );
      
//       });
//   });
// }, 1000);

  // When the add train button is clicked
  $(".btn").on("click", function (event) {
    event.preventDefault();

    // get the values from the user input boxes and set them to variables
    var train = $("#name").val().trim();
    var dest = $("#destination").val().trim();
    var first = $("#first-input").val().trim();
    var freq = $("#rate-input").val().trim();
    // Create a new train object using the newly created variables
    var newTrain = {
      train: train,
      dest: dest,
      first: first,
      freq: freq,
    };
    // Push the newTrain to the firebase database
    database.ref().push(newTrain);

    // Reset all the form inputs to empty
    $("#name").val("");
    $("#destination").val("");
    $("#first-input").val("");
    $("#rate-input").val("");
    console.log(newTrain.train);
    console.log(newTrain.dest);
    console.log(newTrain.first);
    console.log(newTrain.freq);
  });


  // When a child is added to the database, take a snapshot
  database.ref().on("child_added", function (childSnapshot) {
    // Retrieve the values of the database object
    var ttrain = childSnapshot.val().train;
    var tdest = childSnapshot.val().dest;
    var tfirst = childSnapshot.val().first;
    var tfreq = childSnapshot.val().freq;

    console.log(ttrain);
    console.log(tdest);
    console.log(tfirst);
    console.log(tfreq);
    // Set up the first train time. Subtract a year to avoid errors
    var firstTimeConverted = moment(tfirst, "HH:mm").subtract(1, "years");
    // Find the difference between the current train time and the first train time in minutes
    var tmin = moment().diff(firstTimeConverted, "minutes");
    // 
    var tRemainder = tmin % tfreq;
    // Subtract the remainder to find the number of minutes until the next train 
    var tilTrain = tfreq - tRemainder;
    // Add the minutes remaining until arrival to the current time to get arrival time
    var trainTime = moment().add(tilTrain, "minutes");

    // Create a new <tr> to hold the newTrain information
    var newRow = $("<tr class='" + ttrain + "'>").append(
      $("<td>").text(ttrain),
      $("<td>").text(tdest),
      $("<td>").text(tfreq),
      $("<td data=" + childSnapshot.key + "class='next-time'>").text(moment(trainTime).format("hh:mm")),
      $("<td data=" + childSnapshot.key + "class='minutes-til'>").text(tilTrain),
      $("<td data=" + childSnapshot.key + " class='train-remove'>").text("Remove")
    );
    console.log(".train-remove");
      // Append the new train to the html grid
    $("#train-table > tbody").append(newRow);

    //When the remove button is clicked
    $(".train-remove").on("click", function () {
      // Reference the closest <tr>
      var row = $(this).closest("tr");
      // Get the specific database id from the attribute of data
      var attribute = $(this).attr("data")
      // Remove the row from the HTML
      row.remove();
      // Remove the train from the database
      database.ref().child(attribute).remove();
    })




  });


});