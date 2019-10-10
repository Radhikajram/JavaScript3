'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    const liElement = Util.createAndAppend('li', container);
    const imgElement = Util.createAndAppend('img', container, {
      src: this.contributor.avatar_url,
      width: 40,
      height: 40,
    });

    liElement.appendChild(imgElement);
    liElement.appendChild(document.createTextNode(this.contributor.login));
    liElement.appendChild(document.createTextNode(this.contributor.contributions));
  }
}
