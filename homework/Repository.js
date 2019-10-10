'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    const templateElement = [];

    // format the date
    const upDate = new Date(this.repository.updated_at);
    const amOrPm = upDate.getHours() < 12 ? 'AM' : 'PM';
    const dateHours = upDate.getHours() % 12 || 12;
    const formatedUpdate = `${upDate.getMonth()}/${upDate.getDate()}/${upDate.getFullYear()} ${dateHours}
             : ${upDate.getMinutes()}:${upDate.getSeconds()} ${amOrPm}`;
    templateElement.push(
      '<div id="row">',
      `${'<p id="name-info">'} Repository name : ${'<a href="'}${
        this.repository.html_url
      }"${'/>'} ${this.repository.name}</a></p>`,
      `${'<p id="desc">'}  Description :  ${this.repository.description}</p>`,
      `${'<p id="forks">'}  Forks       : ${this.repository.forks_count}</p>`,
      `${'<p id="updated">'} Updated  : ${formatedUpdate}</p>`,
      '</div>',
    );
    const htmlString = templateElement.join('');

    document.getElementById(container).innerHTML = htmlString;
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
