"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let userInput = $('.form-control').val()
  let result = await axios.get(`http://api.tvmaze.com/search/shows?q=${userInput}`)
  return [{
    "id": result.data[0].show.id,
    "name": result.data[0].show.name,
    "summary": result.data[0].show.summary,
    "image": (result.data[1].show.image.medium) === false ? "https://tinyurl.com/tv-missing": result.data[1].show.image.medium
  }]}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
              <img class="card-img-top w-25 mr-3" src="${show.image}">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }

  $(".episodes").on('click',function(){
    if($('#episodes-list')[0].children.length !== 0){
      $('#episodes-list').empty()
    }
     $(".Show").data("showId",shows[0].id)
    getEpisodesOfShow($(".Show").data('showId'))
  })
  
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }
async function getEpisodesOfShow(id){
  let result = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  let episodes = result.data
  let array = []
   for(episodes of episodes){
    array.push({
      id: episodes.id,
      name: episodes.name,
      season:episodes.season,
      number:episodes.number
    })
   }
populateEpisodes(array)
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
function populateEpisodes(episodes){
  for(episodes of episodes){
    $('#episodes-list').append(`<li>${episodes.name} (season ${episodes.season}, number ${episodes.number})`)
  }
  $episodesArea.css("display", "block")
}

