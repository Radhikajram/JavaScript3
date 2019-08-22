'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // Add code here to initialize your app
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    const BodyEl = document.body;

    const root = document.getElementById('root');

    // Create div element 'select' in  document body to hold the label element and list box.

    Util.createAndAppend('div', BodyEl, { id: 'select-container' });
    const select = document.getElementById('select-container');
    Util.createAndAppend('LABEL', select, {
      text: 'HYF Repositories: ',
      id: 'label',
      for: 'repo',
    });
    Util.createAndAppend('select', select, { id: 'select-repo' });

    // Create two div elements section1 and section2 under 'Root' div to have
    // section1 - Repository Information.
    // section2 - Contributions.

    Util.createAndAppend('div', root, { id: 'repo-details' });
    Util.createAndAppend('div', root, { id: 'contributor-information' });

    // Insert section1 before section2 div element under 'root' div.
    const newNode = document.getElementById('contributor-information');
    const referenceNode = document.querySelector('repo-details');
    root.insertBefore(newNode, referenceNode);

    // Insert Select div first in the body before root div.
    BodyEl.insertBefore(select, document.getElementById('root'));

    try {
      const repos = await Util.fetchJSON(url);

      this.repos = repos.map(repo => new Repository(repo));

      const sortRepoName = [];
      // push all the HYP repo names to sort array.

      Object.keys(repos).forEach(key => {
        sortRepoName.push(repos[key].name);
      });
      // sort the repo name using sort function and localeComapare for uppercase and lowercase sorting.
      sortRepoName.sort((a, b) => a.localeCompare(b));

      const selectBox = document.getElementById('select-repo');

      // Create Option under Select element and attach the  same with SELECT element.

      sortRepoName.forEach(loadrepo => {
        const option = document.createElement('option');
        option.value = loadrepo;
        option.text = loadrepo;
        selectBox.appendChild(option);
      });

      let keyIndex;
      console.log(selectBox.value);
      Object.keys(repos).forEach(key => {
        if (selectBox.value === repos[key].name) {
          keyIndex = key;
        }
      });
      this.fetchContributorsAndRender(keyIndex);

      selectBox.addEventListener('change', () => {
        Object.keys(repos).forEach(key => {
          if (selectBox.value === repos[key].name) {
            keyIndex = key;
          }
        });
        this.fetchContributorsAndRender(keyIndex);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      console.log(index);
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('repo-details');
      App.clearContainer(container);

      const contributorContainer = document.getElementById('contributor-information');
      App.clearContainer(contributorContainer);

      const leftDiv = 'repo-details';
      const rightDiv = document.getElementById('contributor-information');

      const contributorList = Util.createAndAppend('ul', rightDiv);

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the1 2 error.
   */
  renderError(error) {
    console.log(error); // TODO: replace with your own code
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
