// Getting Data From JSON File
var movies
fetch("data.json")
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        movies = data.movies
        genres = data.genres
        theatre = data.theatre
        // location = data.location

        console.log(movies)
        createCard(movies)
        appendGenre(genres)
    })
    .catch((error) => {
        console.log(error)
    })

//Append Genre As Option
function appendGenre(genres) {
    var addGenere = document.getElementById("addGenere");
    let output = ""
    for (let i = 0; i < genres.length; i++) {
        output += `<option value=${genres[i].name}> ${genres[i].name}</option>`
    }
    addGenere.innerHTML = output;
}

// Genre
document.getElementById("addGenere").addEventListener("change", function () {
    var genereValue = document.getElementById('addGenere').value;
    console.log("addGenere", genereValue)

    if (genereValue == "All") {
        createCard(movies)
    }
    else {
        let genFilter = []
        for (let i = 0; i < movies.length; i++) {
            let gen = movies[i]["Genre"].split(",")
            for (let j = 0; j < gen.length; j++) {
                if (gen[j] == genereValue) {
                    genFilter.push(movies[i])
                }
            }
        }
        if (genFilter.length == 0) {
            document.getElementById("card").innerHTML = "<h1 class='text-white'>NO Movies</div>"
        }
        else {
            createCard(genFilter)
        }
        console.log(genFilter)
    }
})

// Card Display Function
function createCard(movies) {
    var card = document.getElementById("card");
    let output = ''
    for (let i = 0; i < movies.length; i++) {
        output += `
            <div class="card bg bg-dark col-3 p-4 mb-3">
                <div class="text-center text-white">
                <img class="cardImage" src="${movies[i].Poster}">
                <h5>${movies[i].Title}</h5>
                <div>Year - ${movies[i].Year}</div>
                <a onclick="movieSelected('${movies[i].imdbID}')" class="btn btn-success" href="details.html">Book Now</a>
                </div>
            </div>
        `;
        card.innerHTML = output
    }
}

// Movie Search Function
function searchMovie() {
    var searchName = document.getElementById("movieName").value;
    console.log(searchName)
    axios.get("https://www.omdbapi.com?apikey=5483a5bc&s=" + searchName)
        .then(res => {
            let movies = res.data.Search
            console.log(movies)
            createCard(movies)
        })
        .catch((err) => console.log(err));
}

// Setting Id To Session Storage
function movieSelected(id) {
    sessionStorage.setItem('imdbId', id);
}

// Getting Details of Setected Movie
function getDetails() {
    var imdbId = sessionStorage.getItem("imdbId");
    var movieDetails = document.getElementById("movieDetails")
    console.log(imdbId)

    axios.get('http://www.omdbapi.com/?apikey=5483a5bc&i=' + imdbId)
        .then((response) => {
            console.log(response);
            let movie = response.data;

            let output = `
            <div class="row pt-5">
                <div class="col-md-4">
                    <img src="${movie.Poster}" class="detailImg">
                    <div class="text-success mt-4">
                        <div> <span class="text-danger">Runtime - </span> ${movie.Runtime}</div>
                        <div> <span class="text-danger">Gener - </span> ${movie.Genre}</div>
                    </div>
                </div>
                <div class="col-md-8">
                    <h1 class="text-white">${movie.Title}</h1>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                        <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                        <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                        <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                        <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                        <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                        <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                    </ul>
                    <div class="text-white">
                        <h3 class="pt-4">Plot</h3>
                        <div>${movie.Plot}<div>
                    </div>
                </div>
            </div>
            <hr>

            <div class=" row text-white">
                <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-secondary ml-4">View IMDB</a>
                <a href="index.html" class="btn btn-secondary ml-4">Go Back To Home</a>
            </div>
        `;
            movieDetails.innerHTML = output;
        })
        .catch((err) => {
            console.log(err);
        });
}