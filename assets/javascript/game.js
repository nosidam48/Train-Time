$(document).ready(function() {

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


      $(".btn").on("click", function(event) {
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
      
          $("#employee-name-input").val("");
          $("#role-input").val("");
          $("#start-input").val("");
          $("#rate-input").val("");
          console.log(newTrain.train);
          console.log(newTrain.dest);
          console.log(newTrain.first);
          console.log(newTrain.freq);

          database.ref().on("child_added", function(childSnapshot) {
    
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

            var trainTime = tfreq - tRemainder;
            
    
            var newRow = $("<tr>").append(
                $("<td>").text(ttrain),
                $("<td>").text(tdest),
                $("<td>").text(tfirst),
                $("<td>").text(tfreq),
                $("<td>").text(trainTime),
              );
    
              $("#train-table > tbody").append(newRow);
          })


      });

    //   database.ref().on("child_added", function(childSnapshot) {
    //     var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");

    //     var ttrain = childSnapshot.val().train;
    //     var tdest = childSnapshot.val().dest;
    //     var tfirst = childSnapshot.val().first;
    //     var tfreq = childSnapshot.val().freq;

    //     var tmin = moment().diff(moment(tfirst, "hh:mm"), "minutes");

    //     console.log(tmin);

    //     var tRemainder = tmin % tfreq;
        

    //     var newRow = $("<tr>").append(
    //         $("<td>").text(ttrain),
    //         $("<td>").text(tdest),
    //         $("<td>").text(tfirst),
    //         $("<td>").text(tfreq),
    //         $("<td>").text(tmin),
    //       );

    //       $("#train-table > tbody").append(newRow);
    //   })

    

});