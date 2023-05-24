import axios from 'axios';

export default class imageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const url = `https://pixabay.com/api/`;
      const params = {
        key: '34700186-64fa17513eb3359bd5c913c6b',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      };
      const response = await axios.get(url, { params });
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
