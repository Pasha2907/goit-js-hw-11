const axios = require('axios').default;

const URL_BASE = 'https://pixabay.com/api/';
const API_KEY = '31603947-f30504e383afe7563a8407818';

export default class ImagesApiService {
  constructor(perPage = 40, searchQuery = '') {
    this.searchQuery = searchQuery;
    this.page = 1;
    this.perPage = perPage;
  }

  async fetchImages() {
    const URL = `${URL_BASE}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
    const response = await axios.get(URL);

    const { totalHits, hits } = response.data;

    this.page += 1;

    return { totalHits, hits };
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    return (this.searchQuery = newSearchQuery);
  }
}
