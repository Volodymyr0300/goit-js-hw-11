import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/imageApiService';
import LoadMoreBtn from './js/loadMoreBtn';

const form = document.querySelector('#search-form');
const boxGallery = document.querySelector('.gallery');

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

form.addEventListener('submit', onShowImages);
loadMoreBtn.refs.button.addEventListener('click', onShowMoreImages);

let lightBox;

function initializeLightBox() {
  lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightBox.refresh();
}

function onShowImages(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return Notiflix.Notify.info('Please enter a search term.');
  }
  clearBoxGallery();
  loadMoreBtn.hide();

  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(({ hits, total, totalHits }) => {
    if (hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.refs.button.classList.add('is-hidden');
    } else {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      renderMarkupImagesCard(hits);
      initializeLightBox();
      if (hits.length < 40) {
        console.log(hits.length);
        console.log(hits);
        loadMoreBtn.refs.button.classList.add('is-hidden');
      } else {
        loadMoreBtn.show();
        loadMoreBtn.refs.button.classList.remove('is-hidden');
      }
    }
  });
}

function onShowMoreImages(event) {
  event.preventDefault();

  imagesApiService.fetchImages().then(({ hits, total, totalHits }) => {
    renderMarkupImagesCard(hits);
    initializeLightBox();

    if (hits.length < 40) {
      loadMoreBtn.refs.button.classList.add('is-hidden');
    }
  });
}

function renderMarkupImagesCard(images) {
  console.log(images);
  const markupImagesCard = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width=250px />
         <div class="info">
           <p class="info-item"><b>Likes: ${likes}</b></p>
           <p class="info-item"><b>Views: ${views}</b></p>
           <p class="info-item"><b>Comments: ${comments}</b></p>
           <p class="info-item"><b>Downloads: ${downloads}</b></p></div>
        </div></a>`;
      }
    )
    .join('');

  return boxGallery.insertAdjacentHTML('beforeend', markupImagesCard);
}

function clearBoxGallery() {
  boxGallery.innerHTML = '';
}
