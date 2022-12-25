const apiKey = "3fd2be6f0c70a2a598f084ddfb75487c";
const baseUrl = "https://api.themoviedb.org/3/";

function getMovies(searchTerm) {
  const url = `${baseUrl}search/movie?api_key=${apiKey}&query=${searchTerm}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      results.forEach(movie => {
        const movieId = movie.id;
        getTrailer(movieId);
      });
    });
}

function getTrailer(movieId) {
  const url = `${baseUrl}movie/${movieId}/videos?api_key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      results.forEach(video => {
        if (video.type === "Trailer") {
          const trailerId = video.key;
          searchTrailerOnYouTube(trailerId);
        }
      });
    });
}

function searchTrailerOnYouTube(trailerId) {
  const youtubeUrl = `https://www.youtube.com/results?search_query=${trailerId} trailer`;
  fetch(youtubeUrl)
    .then(response => response.text())
    .then(data => {
      // parse HTML data to find first YouTube video result
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const videoElement = htmlDoc.querySelector(".yt-uix-tile-link");
      if (videoElement) {
        const videoUrl = `https://www.youtube.com${videoElement.getAttribute("href")}`;
        addTrailerToCarousel(videoUrl);
      }
    });
}

function addTrailerToCarousel(videoUrl) {
  // create new carousel item element
  const carouselItem = document.createElement("div");
  carouselItem.classList.add("carousel-item");
  // create new iframe element for video
  const iframe = document.createElement("iframe");
  iframe.src = videoUrl;
  iframe.setAttribute("allowfullscreen", "true");
  // add iframe to carousel item
  carouselItem.appendChild(iframe);
  // add carousel item to carousel
  const carousel = document.querySelector(".carousel");
  carousel.appendChild(carouselItem);
}

document.querySelector(".search-form").addEventListener("submit", event => {
  event.preventDefault();
  const searchTerm = document.querySelector(".search-input").value;
  getMovies(searchTerm);
});