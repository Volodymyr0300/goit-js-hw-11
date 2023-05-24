export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = {
      button: document.querySelector(selector),
    };

    if (!this.refs.button) {
      throw new Error(`No element found with the selector "${selector}".`);
    }

    if (hidden) {
      this.hide();
    }
  }

  show() {
    this.refs.button.classList.remove('hidden');
  }

  hide() {
    this.refs.button.classList.add('hidden');
  }
}
