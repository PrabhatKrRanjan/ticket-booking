// Getting Recent 

var movies
fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=7ac617c2c72b5659bf38cc09855556f9")
    .then(res => res.json())
    .then((data) => {
        movies = data.results
        // console.log(movies)
        createCard(movies)
    })
    .catch((error) => {
        console.log(error)
    })

// Movie Search Function

function searchMovie() {
    var searchName = document.getElementById("movieName").value;
    // console.log(searchName)
    let url = "https://api.themoviedb.org/3/search/movie?api_key=7ac617c2c72b5659bf38cc09855556f9&language=en-US&query=" + searchName + "&page=1&include_adult=false"

    fetch(url)
        .then(res => res.json())
        .then((data) => {
            movies = data.results
            // console.log(movies)
            createCard(movies)
        })
        .catch((err) => console.log(err));
}

let debouncing = function(func, delay){
    let debouce ;
    return function(){
        clearTimeout(debouce)
        debouce = setTimeout(()=>func.apply(this),delay)
    }
}

window.addEventListener("input", debouncing(searchMovie,500))

//Append Genre As Option

fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=7ac617c2c72b5659bf38cc09855556f9&language=en-US")
    .then(res => res.json())
    .then(data => {
        appendGenre(data.genres)
        // console.log(data.genres)
    })
    .catch(err => console.log(err))

function appendGenre(genres) {
    var addGenere = document.getElementById("addGenere");
    let output = ""
    for (let i = 0; i < genres.length; i++) {
        output += `<option value=${genres[i].id}> ${genres[i].name}</option>`
    }
    addGenere.innerHTML = output;
}

// Movie by Genre 

document.getElementById("addGenere").addEventListener("change", function () {
    var genereValue = document.getElementById('addGenere').value;
    let url = "https://api.themoviedb.org/3/discover/movie?api_key=7ac617c2c72b5659bf38cc09855556f9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + genereValue

    fetch(url)
        .then(res => res.json())
        .then(data => {
            createCard(data.results)
            // console.log(data.results)
        })
        .catch(err => console.log(err))
})

// Card Display Function

function createCard(movies) {
    var card = document.getElementById("card");
    let output = ''
    for (let i = 0; i < movies.length; i++) {
        let poster_path
        if (movies[i].poster_path == null) {
            poster_path = "https://dummyimage.com/300x450/000000/0011ff.png&text=Not+Found"
        }
        else {
            poster_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + movies[i].poster_path
        }
        output += `
            <div onclick="movieSelected('${movies[i].id}')" class="card bg bg-dark col-sm-12 col-md-6 col-lg-3 mb-5">
                <img class="card-image-top" src="${poster_path}">
                <div class="card-body text-white">
                    <h6>${movies[i].title}</h6>
                    <div>Release Date - ${movies[i].release_date}</div>
                    <a onclick="movieSelected('${movies[i].id}')" class="btn btn-success" href="details.html">View</a>
                </div>
            </div>
        `;
        card.innerHTML = output
    }
}

// Setting Id To Session Storage

function movieSelected(id) {
    sessionStorage.setItem('imdbId', id);
    window.location.href = 'details.html';
}

// Getting Details of Setected Movie

function getDetails() {
    var movieId = sessionStorage.getItem("imdbId");
    var movieDetails = document.getElementById("movieDetails")
    let url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=7ac617c2c72b5659bf38cc09855556f9&language=en-US"
    fetch(url)
        .then(res => res.json())
        .then((response) => {
            let movie = response;
            // console.log("movies", movie);
            let poster_path;

            if (movie.poster_path == null) {
                poster_path = "https://dummyimage.com/300x450/000000/0011ff.png&text=Not+Found"
            }
            else {
                poster_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + movie.poster_path
            }

            let genre = []
            let genres = movie.genres;
            for (let i = 0; i < genres.length; i++) {
                genre.push(genres[i]["name"])
            }
            let language = []
            let lang = movie.spoken_languages;
            for (let i = 0; i < lang.length; i++) {
                language.push(lang[i]["name"])
            }

            let production = [];
            let company = movie.production_companies;
            for (let i = 0; i < company.length; i++) {
                production.push(company[i]["name"])
            }

            let output = `
            <div class="row pt-5  mt-5 bg-linear">
                <div class="col-sm-12 col-md-12 col-lg-4">
                    <div class="d-flex justify-content-center mb-5">
                        <img src="${poster_path}" alt= "${movie.poster_path}">
                    </div>
                   
                </div>
                <div class="col-sm-12 col-md-12 col-lg-8">
                    <h1 class="text-white">${movie.original_title}</h1>
                    <ul class="list-group">
                        <li class="list-group-item"><strong class="text-danger">Genre : </strong> ${genre}</li>
                        <li class="list-group-item"><strong class="text-danger">Language : </strong> ${language}</li>
                        <li class="list-group-item"><strong class="text-danger">Rated : </strong> ${movie.vote_average}</li>
                        <li class="list-group-item"><strong class="text-danger">Revenue : </strong> ${movie.revenue}</li>
                        <li class="list-group-item"><strong class="text-danger">Release Date : </strong> ${movie.release_date}</li>
                        <li class="list-group-item"><strong class="text-danger">Runtime : </strong> ${movie.runtime} Min </li>
                        <li class="list-group-item"><strong class="text-danger">Production Companies : </strong> ${production}</li>
                        <li class="list-group-item"><strong class="text-danger">Tagline : </strong> ${movie.tagline} </li>
                    </ul>
                    
                </div>
            </div>

            <div class="">
            <div class="text-white">
                <h3 class="pt-4">Plot</h3>
                <div>${movie.overview}<div>
            </div>
            <hr>

            <div class="row justify-content-center text-white">
                <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-secondary ml-4">View IMDB</a>
                <a href="${movie.homepage}" target="_blank" class="btn btn-secondary ml-4">Home Page</a>
            </div>
            </div>
        `;
            movieDetails.innerHTML = output;
        })
        .catch((err) => {
            console.log(err);
        });
}

// function displaySeat() {
//     fetch("data.json")
//         .then((res) => {
//             return res.json()
//         })
//         .then((data) => {
//             seats = data.seats
//         })
//         .catch((error) => {
//             console.log(error)
//         })
//     console.log(seats)
// }