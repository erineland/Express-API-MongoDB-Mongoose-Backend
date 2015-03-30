angular.module('starter.controllers', [])

    .controller('LeagueTableCtrl', function($scope) {})

    //.controller('ChatsCtrl', function($scope, Chats) {
    //    $scope.chats = Chats.all();
    //    $scope.remove = function(chat) {
    //        Chats.remove(chat);
    //    }
    //})

    .controller('RoundsCtrl', function($scope, $ionicLoading, Rounds) {

        //only publicly accessible elements get added to the scope

        Rounds.all().then(function(data){
            //debugger;
            $scope.rounds = data;
            $scope.rounds = $scope.rounds.rounds;
        });

        //debugger
        $scope.remove = function(round) {
            Rounds.remove(round);
        };

        $scope.predict = function(roundid, prediction) { //prediction will be left, right, up
            Rounds.predict(roundid, prediction);
        };

        //$scope.markRoundPredicted = function() {
        //
        //    //get the list of rounds
        //
        //    //for each round
        //
        //    //get list of fixtures in this round
        //
        //    //get the list of predictions for the user
        //
        //    //loop over the list of predictions
        //    //if there exists ANY of the fixtures for the round in predictions
        //    //them mark this round as already having had predictions made on it
        //};

    })

    .controller('RoundDetailCtrl', function($scope, $ionicPopup, $stateParams, $ionicHistory, Rounds) {

        var _predictions = [];
        var updatePredictions = false; //flag to update predictions if some already exist.
        var user = '***REMOVED***6969';

        $scope.saveChangesNeeded = true;

        //Get the data for this particular round from the server
        Rounds.get($stateParams.roundId).then(function(data){

            //when first loading the page, clear out any local existing predictions.
            _predictions = [];

            //$ionicLoading.hide();
            $scope.fixtures = data;

            //every time a new set of fixtures is loaded, clear predictions
            debugger;
            _getExistingPredictions();

        });

        //predicton map struct to be used in below function
        var predictionMap = {
            1: "Home Win!",
            2: "Away Win!",
            3: "Draw!"
        };

        function _getExistingPredictions() {
            //go and get all of the predictions for the user
            Rounds.getExistingPredictions(user, $stateParams.roundId).then(function(data){
                //clear existing predictions
                _predictions = [];

                debugger;

                $scope.existingPredictions = data;
                $scope.predictionsOnServer = data;

                var currentFixturePrediction = null;

                if ($scope.existingPredictions.length) {

                    //now loop over fixtures and add in these predictions!
                    for (var i = 0; i < $scope.fixtures.length ; i++){

                        currentFixturePrediction = predictionMap[$scope.existingPredictions[i].prediction];

                        $scope.fixtures[i].prediction = currentFixturePrediction;
                    }

                    updatePredictions = true; //only set this if there are existing predictions!
                }

                for (var j = 0; j < $scope.existingPredictions.length; j++) {
                    _predictions.push({fixture: $scope.existingPredictions[j].fixture, prediction: $scope.existingPredictions[j].prediction});
                }

                //

                //force view to refresh
                //$scope.$apply();

            });
        }

        function _predictionExists(fixture) {

            var found = -1;

            for (var i = 0; i < _predictions.length; i++) {
                if (fixture == _predictions[i].fixture) {
                    //then the fixture has had a prediction made for it
                    found = i;
                    break; //breaks out of the inner loop
                }
            }

            return found;
        }

        function _addFixturePrediction(fixture, prediction) {

            //mark changes as requiring saving
            $scope.saveChangesNeeded = true;

            //update the fixture in the $scope.fixtures list
            debugger;

            //find the fixture with the matching id in the list
            //for (var i = 0; i < $scope.fixtures.length; i++){
            //    if ($scope.fixtures[i]._id == fixture) {
            //        //update the prediction
            //
            //        //call the prediction map!
            //        $scope.fixtures[i].prediction = predictionMap[prediction];
            //    }
            //}

            //update the class
            //$scope.getBackgroundColour(fixture)

            //if the _predictions array contains an object with the fixture id passed in here

            //find out if the current fixture has a prediction and if so, the position in the list
            var existingPredictionPosition = _predictionExists(fixture);

            if (existingPredictionPosition != -1) {
                //then update this current fixture using the position in the predictions array
                _predictions[existingPredictionPosition] = {fixture: fixture, prediction: prediction}

            } else { //else if a prediction for this fixture does not already exist...
                _predictions.push({fixture: fixture, prediction: prediction});
            }
        }

        //function to check that user is ready to leave without saving changes
        $scope.makeUnsavedChanges = function() {

            //ask if they are sure they want to go back if there are unsaved changes that would be lost
            debugger;

            //$ionicHistory.goBack();
            //if ($scope.saveChangesNeeded){
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Unsaved Changes',
                    template: 'Any unsaved changes to predictions will be lost'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        console.log('You are sure');
                        //then go on back!
                        //set save changes to false
                        $scope.saveChangesNeeded = false;
                        $ionicHistory.goBack();
                    } else {
                        console.log('You are not sure');
                        //stay in this view
                    }});
                //});
           // } else {
             //   $ionicHistory.goBack();
            //}

        };

        $scope.predictHomeWin = function (fixture) {
            _addFixturePrediction(fixture, 1);
        };

        $scope.predictAwayWin = function (fixture) {
            _addFixturePrediction(fixture, 2);
        };

        $scope.predictDraw = function (fixture) {
            _addFixturePrediction(fixture, 3);
        };

        var colourMap = {
            1: "home-win-predicted",
            2: "away-win-predicted",
            3: "draw-predicted"
        };

        $scope.getBackgroundColour = function(fixture) { //should be passing in the entire fixture object

            var predictionClass;

            //find prediction for this fixture
            for(var i = 0; i < _predictions.length; i++) {
                if (fixture._id == _predictions[i].fixture) {
                    //then return the prediction for this fixture else leave undefined
                    predictionClass = _predictions[i].prediction;

                }
            }

            return colourMap[predictionClass];
        };

        //clear out predictions
        $scope.clearPredictions = function() {
            _predictions = [];
        };

        //once predictions are all validated, and predict button send, send all predictions
        $scope.sendPredictions = function () { //TODO: Add username to the state params

            debugger;

            //mock out the username for now.

            var user = '***REMOVED***6969';

            //TODO: Try to replace the below for loops with angular.forEach
            //Validate that predictions have been made for every fixture in this round

            //if predictions array contains every fixture id from the round

            //outer loop
            //iterate over each of the fixtures and ensure it exists within the list of predictions
            var found;
            var validPredictions = false;
            var indexOfTheFuckingLoop = 0; //TODO: Change the anm;
            var predictionsToUpdate = [];
            for(; indexOfTheFuckingLoop < $scope.fixtures.length; indexOfTheFuckingLoop++) {

                found = false;

                //access the value of the current fixture here once per iteration
                var currentFixture = $scope.fixtures[indexOfTheFuckingLoop]._id;

                //now iterate over each item in the predictions array
                //inner loop
                for (var j = 0; j < _predictions.length; j++) {
                    if (currentFixture == _predictions[j].fixture) {
                        //then the fixture has had a prediction made for it
                        found = true;
                        break; //breaks out of the inner loop
                    }
                }

                if (!found) {
                    //throw an error because a prediction was not made for all fixtures

                    //alert the user, use the ionicPopUp service
                    $ionicPopup.alert({
                        title: 'Woah there!',
                        template: 'Please make a prediction for every fixture in the round!'
                    });

                    //now clear out the predictions to start again
                    //_predictions = [];

                    break;
                }

                //if we are looking at the last fixture in the round, and all of them have been found.
                if ((indexOfTheFuckingLoop == ($scope.fixtures.length - 1)) && (found)){

                    debugger;
                    validPredictions = true;
                    found = false;
                }

            }

            //if the predictions are valid, send them off to the server
            if (validPredictions) {
                debugger;
                //Send the validatied predictions

                //check to see if we are making new predictions or updating old ones
                if (updatePredictions){
                    //update existing predictions!
                    debugger;


                    //compare differences of new predictions to old ones, add to array of predictions to update
                    //loop over old predictions and compare to new
                    for (var i = 0; i < $scope.predictionsOnServer.length; i++){ //arrays are indexed by 0

                        var currentExistingPrediction = $scope.predictionsOnServer[i];

                        for (var j = 0; j < _predictions.length; j++) {

                            var currentUpdatedPrediction = _predictions[j];

                            //if fixture id is the same, but the prediction is different
                            if ((currentExistingPrediction.fixture == currentUpdatedPrediction.fixture) &&
                                (currentExistingPrediction.prediction != currentUpdatedPrediction.prediction)) {

                                //TODO: Here assign the fixture ID back into the prediction to be updated!!!
                                debugger;
                                currentUpdatedPrediction._id = currentExistingPrediction._id;

                                //add this prediction to the list of predictions to be updated
                                predictionsToUpdate.push(currentUpdatedPrediction);
                            }
                        }
                    }

                    debugger;
                    //once you have a list of predictions to update, async for loop and update
                    for (var i = 0, c = predictionsToUpdate.length; i < c; i++)
                    {
                        // creating an Immiedately Invoked Function Expression
                        (function( prediction ) {

                            //call the async function
                            Rounds.updatePrediction(user, prediction).then(function()
                            {
                                //changes were just saved, this is no longer true
                                $scope.saveChangesNeeded = false;
                            });

                            //fs.lstat(path, function (error, stat) {
                            //    console.log(path, stat);
                            //});
                        })( predictionsToUpdate[i] ); //use dogballs (a closure)
                        // passing predictions[i] in as "path" in the closure
                    }

                    // This may be causing an issue whereby the old predictions are pulled down before updates made
                    //_getExistingPredictions();

                    //tell the user things have been updated
                    $ionicPopup.alert(
                        {
                            title: 'Your predictions have been updated!',
                            template: 'Let\'s hope you do better than you previously would have!'
                        });

                } else { //make a set of new predictions
                    Rounds.makePredictions(user, $stateParams.roundId, _predictions).then(function(){
                        $ionicPopup.alert({
                                title: 'Your predictions have been made!',
                                template: 'Let\'s hope you do well!'
                        });

                        //changes have just been saved so no longer need this
                        $scope.saveChangesNeeded = false;

                        _getExistingPredictions();
                    });

                }
            }
        };

        $scope.deleteRoundPredictions = function () {

            debugger;


            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete the predictions for this round? \n You\'ll lose 20 points!'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                    Rounds.deleteRoundPredictions(user, $stateParams.roundId).then(function() {
                            $ionicPopup.alert(
                                {
                                    title: 'Your predictions for this round have been deleted!',
                                    template: 'Have another go!'
                                }
                            );

                            //changes have been saved
                            $scope.saveChangesNeeded = false;

                            _getExistingPredictions();
                        }

                    );
                } else {
                    console.log('You are not sure');
                }
            });
        };
    })

    .controller('ScoreboardCtrl', function($scope, Scoreboard) {

        //Get the data for scores for leaderboard
        Scoreboard.all().then(function(data){
            //debugger;
            $scope.scores = data;
        });
    })

    .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function($scope) {
        alert("This feature has been disabled for the demo app.");

        //$scope.settings = {
        //    enableFriends: true
        //};
    })

    .controller('DemoTabCtrl', function($scope, $ionicPopup, $state) {
        //alert("This feature has been disabled for the demo app.");

        $scope.accessDeny = function() {
            $ionicPopup.alert({
                title: 'Tab not available in demo!',
                template: 'This thing is a work in progress...'
            }).then(function(res) {

                //deflect the user from the tab which has not yet been implemented to a good tab
                $state.transitionTo("tab.rounds");
            });
        }
    });
