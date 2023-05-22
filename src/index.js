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

function onShowImages(event) {
  event.preventDefault();
  clearBoxGallery();
  loadMoreBtn.hide();

  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(({ hits, total, totalHits }) => {
    if (hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    renderMarkupImagesCard(hits);
    lightBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
    loadMoreBtn.show();
  });
}

function onShowMoreImages(event) {
  event.preventDefault();

  imagesApiService.fetchImages().then(({ hits, total, totalHits }) => {
    renderMarkupImagesCard(hits);
    lightBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
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
