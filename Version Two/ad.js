let currentPage = 1;
const apik = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
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
    const { title, poster_path, vote_average, overview, id } = movie
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
        <br/>
        <button class = "know-more" id="${id}">Know More</button>
      </div>
    `
    main.appendChild(movieEl)

    document.getElementById(id).addEventListener('click', () => {
        console.log(id);
        openNav(movie);
    })
  })
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id
    fetch(BASE_URL + '/movie/'+ id + '/videos?'+API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if(videoData) {
            document.getElementById("myNav").style.width = "100%";
            if(videoData.results.length > 0) {
                var embed = [];
               // var dots = []; //variable dots
                videoData.results.forEach(video => {
                    let {name, key, site} = video
                    
                    if(site == "YouTube") {

                        embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                        `)
                      
                      //push for dots
                      // dots.push(`
                      //     <span class="dot">${idx + 1}</span>
                      //   `)

                    }
                })
              
              //untuk show video + slide
//               var content = `
//                 <h1 class="no-results">${movie.original_title}</h1>
//                 <br/>

//                 ${embed.join('')}
//                 <br/>

//                 <div class="dots">${dots.join('')}</div>

//                 `
//                 overlayContent.innerHTML = content;
//                 activeSlide=0;
//                 showVideos();
//               }else{
//                 overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
//               }

                overlayContent.innerHTML = embed.join('');
            }else{
                overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
        }
    })
    
  }

// display video 
// function showVideos(){
//   let embedClasses = document.querySelectorAll('.embed');
//   let dots = document.querySelectorAll('.dot');

//   totalVideos = embedClasses.length; 
//   embedClasses.forEach((embedTag, idx) => {
//     if(activeSlide == idx){
//       embedTag.classList.add('show')
//       embedTag.classList.remove('hide')

//     }else{
//       embedTag.classList.add('hide');
//       embedTag.classList.remove('show')
//     }
//   })

//   dots.forEach((dot, indx) => {
//     if(activeSlide == indx){
//       dot.classList.add('active');
//     }else{
//       dot.classList.remove('active')
//     }
//   })
// }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
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