import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './fetchImg';

const refs = {
  searchInput: document.querySelector('input'),
  searchBtn: document.querySelector('button'),
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.style.display = 'none';

refs.searchForm.addEventListener('submit', searchImages);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imagesApiService = new ImagesApiService();

function searchImages(event) {
  event.preventDefault();
  clearGallery();
  refs.loadMoreBtn.style.display = 'flex';

  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  imagesApiService
    .fetchImages()
    .then(({ totalHits, hits }) => {
      if (
        totalHits / (imagesApiService.page - 1) < imagesApiService.perPage &&
        hits.length !== 0
      ) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (hits.length === 0) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(hits);
      }
    })
    .catch(onFetchError);
}

function renderGallery(arrayForGallery) {
  const galleryMarkup = createGalleryMarkup(arrayForGallery);

  refs.galleryList.insertAdjacentHTML('beforeend', galleryMarkup);

  let lightbox = new SimpleLightbox('.gallery .gallery__item', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  return lightbox;
}

function createGalleryMarkup(imagesArray) {
  return imagesArray
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
                <div class="photo-card">
                    <a class="gallery__item" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320px" height="210px"/>
                    </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b><br/>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b><br/>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b><br/>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b><br/>${downloads}
                        </p>
                    </div>
                </div>
            `;
    })
    .join('');
}

function onLoadMore() {
  imagesApiService
    .fetchImages()
    .then(({ totalHits, hits }) => {
      renderGallery(hits);
      if (
        totalHits / (imagesApiService.page - 1) < imagesApiService.perPage &&
        hits.length !== 0
      ) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(onFetchError);
}

function clearGallery() {
  refs.galleryList.innerHTML = '';
}

function onFetchError(error) {
  Notiflix.Notify.failure(error.message);
}
