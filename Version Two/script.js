let currentPage = 1;
const apik = '3fd2be6f0c70a2a598f084ddfb75487c';
const DISCOVER_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key='+apik+'&page='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key='+apik

const main = document.getElementById('main')

// Get initial movies
getMovies(DISCOVER_URL+currentPage)

async function getMovies(url) {
  const res = await fetch(url)
  const data = await res.json()

  showMovies(data.results)
}

function showMovies(movies) {
  main.innerHTML = ''
  
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie
    const movieEl = document.createElement('div')
    
    movieEl.classList.add('movie')
  
    movieEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">

      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>

      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `
    main.appendChild(movieEl)
  })
}
  
function getClassByRate(vote) {
  if(vote >= 8) {
    return 'green'
  } else if(vote >= 5) {
    return 'orange'
  } else {
    return 'red'
  }
}

// -----------------Fetch Genre List----------------
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=`+apik+`&language=en-US`)
.then(response => response.json())
.then(data => {
	const genres = data.genres;
	const genreSelect = document.getElementById('list');

	genres.forEach(genre => {
	const option = document.createElement('option');
	option.value = genre.id;
	option.textContent = genre.name;
	genreSelect.appendChild(option);
	});
});


// ------------------Increment Button for Initial List------------------

const incrementButton = document.getElementById('next');
const decrementButton = document.getElementById('previous');
const page = document.getElementById('current');

const updatePage = (newPage) => {
  currentPage = newPage;
  page.textContent = currentPage;
  getMovies(DISCOVER_URL + currentPage);
}

incrementButton.addEventListener('click', () => updatePage(currentPage + 1));
decrementButton.addEventListener('click', () => updatePage(currentPage - 1));

// ------------------------Go Button------------------------

const goButton = document.getElementById('go-button')  

// const genreOption = genreSelect.querySelector(`option[value="${genre}"]`);
// const genreID = genreOption.value
// const query = searchInput.value

const showSearch = () => {
  const searchInput = document.querySelector('#search')
  const genreSelect = document.querySelector('#list')
  const genre = genreSelect.value;
  const genreOption = genreSelect.querySelector(`option[value="${genre}"]`);
  const genreID = genreOption.value
  const query = searchInput.value
  console.log(genreID)
  console.log(query)

  getMovies(SEARCH_API+ '&query='+ query+ '&with_genres='+ genreID)
  
}

goButton.addEventListener('click', showSearch)