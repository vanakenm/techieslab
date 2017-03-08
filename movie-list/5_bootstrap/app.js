var favMovies = new Firebase('https://my-movies-e8ce6.firebaseio.com');

function saveToList(event) {
  if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
    var movieName = document.getElementById('movieName').value.trim();
    if (movieName.length > 0) {
      saveToFB(movieName);
    }
    document.getElementById('movieName').value = '';
    return false;
  }
};

function saveToFB(movieName) {
  // this will save data to Firebase
  favMovies.push({
    name: movieName
  });
};

function refreshUI(list) {
  var lis = '';
  for (var i = 0; i < list.length; i++) {
    lis += '<tr data-key="' + list[i].key + '"><td>' + list[i].name + '</td>' + genLinks(list[i].key, list[i].name) + '</tr>';
  };
  document.getElementById('favMovies').innerHTML = lis;
};

function genLinks(key, mvName) {
  var links = '';
  links += '<td><a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')" class="btn btn-info">Edit</a></td>';
  links += '<td><a href="javascript:del(\'' + key + '\',\'' + mvName + '\')" class="btn btn-danger">Delete</a></td>';
  return links;
};

function edit(key, mvName) {
  var movieName = prompt("Update the movie name", mvName); // to keep things simple and old skool :D
  if (movieName && movieName.length > 0) {
  // build the FB endpoint to the item in movies collection
  var updateMovieRef = buildEndPoint(key);
  updateMovieRef.update({
    name: movieName
  });
  }
}

function del(key, mvName) {
  var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
  if (response == true) {
    // build the FB endpoint to the item in movies collection
   var deleteMovieRef = buildEndPoint(key);
    deleteMovieRef.remove();
  }
}

function buildEndPoint (key) {
  return new Firebase('https://my-movies-e8ce6.firebaseio.com/' + key);
}

// this will get fired on inital load as well as when ever there is a change in the data
favMovies.on("value", function(snapshot) {
  var data = snapshot.val();
  var list = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      name = data[key].name ? data[key].name : '';
      if (name.trim().length > 0) {
        list.push({
          name: name,
          key: key
        })
      }
    }
  }
  // refresh the UI
  refreshUI(list);
});