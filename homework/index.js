'use strict';

// Using promise fetch the URL.
{
  function fetchUrl(url) {
    return fetch(url)
      .then(result => {
        return result.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(`check the URL address${error}`);
      });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  // Load the Contributors information into  section2 div element.

  function addContributors(contribution) {
    const divElement = [];

    divElement.push('<div id="header">', `${'<h3>'} Contributions: ${'</h3>'} ${'</div>'}`);

    contribution.forEach(details => {
      divElement.push(
        '<ul>',
        `${'<li>'} ${'<img src="'}${details.avatar_url}" width="40" height="40">`,
        `</li>`,
        `<li>${details.login}</li>`,
        `<li>${details.contributions}</li>`,
        '</ul>',
      );
    });

    const htmlString = divElement.join('');
    document.getElementById('contributor-information').innerHTML = htmlString;
  }

  // Load the Repository information into  section1 div element.

  function loadRepoDetails(repoInfo, optionValue) {
    const templateElement = [];

    Object.keys(repoInfo).forEach(key => {
      if (optionValue === repoInfo[key].name) {
        // format the date
        const upDate = new Date(repoInfo[key].updated_at);
        const amOrPm = upDate.getHours() < 12 ? 'AM' : 'PM';
        const dateHours = upDate.getHours() % 12 || 12;
        const formatedUpdate = `${upDate.getMonth()}/${upDate.getDate()}/${upDate.getFullYear()} ${dateHours}
             : ${upDate.getMinutes()}:${upDate.getSeconds()} ${amOrPm}`;
        templateElement.push(
          '<div id="row">',
          `${'<p id="name-info">'} Repository name : ${'<a href="'}${
            repoInfo[key].html_url
          }"${'/>'} ${repoInfo[key].name}</a></p>`,
          `${'<p id="desc">'}  Description :  ${repoInfo[key].description}</p>`,
          `${'<p id="forks">'}  Forks       : ${repoInfo[key].forks_count}</p>`,

          `${'<p id="updated">'} Updated  : ${formatedUpdate}</p>`,
          '</div>',
        );
        fetchUrl(repoInfo[key].contributors_url).then(responseData => {
          addContributors(responseData);
        });
      }
    });
    const htmlString = templateElement.join('');
    document.getElementById('repo-details').innerHTML = htmlString;
  }

  // Create options under 'SELECT' element which should have HYF Repositories.

  function loadSelectionValues(userRepo) {
    const sortRepoName = [];

    const selectRepo = document.getElementById('select-repo');

    // push all the HYP repo names to sort array.

    Object.keys(userRepo).forEach(key => {
      sortRepoName.push(userRepo[key].name);
    });

    // sort the repo name using sort function and localeComapare for uppercase and lowercase sorting.
    sortRepoName.sort((a, b) => a.localeCompare(b));

    // Create Option under Select element and attach the  same with SELECT element.

    sortRepoName.forEach(repo => {
      const option = document.createElement('option');
      option.value = repo;
      option.text = repo;
      selectRepo.appendChild(option);
    });

    const selectBox = document.getElementById('select-repo');

    // Load Repository information for the choose repository name in the select box.
    loadRepoDetails(userRepo, selectBox.value);
    selectBox.onchange = function() {
      loadRepoDetails(userRepo, selectBox.value);
    };
  }

  function main(url) {
    const BodyEl = document.body;
    const root = document.getElementById('root');

    // Call the fetchUrl function to fetch Repository information. The function will in tern returns promise.
    const data = fetchUrl(url).then(responseData => {
      loadSelectionValues(responseData);
    });

    // Create div element 'select' in  document body to hold the label element and list box.

    createAndAppend('div', BodyEl, { id: 'select-container' });
    const select = document.getElementById('select-container');
    createAndAppend('LABEL', select, {
      text: 'HYF Repositories: ',
      id: 'label',
      for: 'repo',
    });
    createAndAppend('select', select, { id: 'select-repo' });

    // Create two div elements section1 and section2 under 'Root' div to have
    // section1 - Repository Information.
    // section2 - Contributions.

    createAndAppend('div', root, { id: 'repo-details' });
    createAndAppend('div', root, { id: 'contributor-information' });

    // Insert section1 before section2 div element under 'root' div.
    const newNode = document.getElementById('contributor-information');
    const referenceNode = document.querySelector('repo-details');
    root.insertBefore(newNode, referenceNode);

    // Insert Select div first in the body before root div.
    BodyEl.insertBefore(select, document.getElementById('root'));

    loadSelectionValues(data);
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
