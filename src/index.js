import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';

const fetchImages = async(value, page) => {
    const url = 'https://pixabay.com/api/';
    const key = '11240134-58b8f655e9e0f8ae8b6e8e7de';
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    try {
        const response = await axios.get(`${url}${filter}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch images');
    }
};

const renderImages = (images) => {
    const markup = images.map(image => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
};

const handleSearchSubmit = async(event) => {
    event.preventDefault();
    searchQuery = searchForm.searchQuery.value.trim();
    if (!searchQuery) {
        return;
    }
    currentPage = 1;
    gallery.innerHTML = '';
    try {
        const data = await fetchImages(searchQuery, currentPage);
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        renderImages(data.hits);
        loadMoreButton.style.display = 'block';
    } catch (error) {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
};

const handleLoadMore = async() => {
    currentPage += 1;
    try {
        const data = await fetchImages(searchQuery, currentPage);
        if (data.hits.length === 0) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreButton.style.display = 'none';
            return;
        }
        renderImages(data.hits);
    } catch (error) {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
};

searchForm.addEventListener('submit', handleSearchSubmit);
loadMoreButton.addEventListener('click', handleLoadMore);