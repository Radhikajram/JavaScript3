'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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

    // eslint-disable-next-line no-restricted-syntax
    for (const details of contribution) {
      divElement.push(
        '<ul>',
        `${'<li>'} ${'<img src="'}${details.avatar_url}" width="40" height="40">`,
        `</li>`,
        `<li>${details.login}</li>`,
        `<li>${details.contributions}</li>`,
        '</ul>',
      );
    }

    const htmlString = divElement.join('');
    document.getElementById('contributorinfomation').innerHTML = htmlString;
  }

  // Load the Repository information into  section1 div element.

  function loadRepoDetails(repoInfo, optionValue) {
    const templateElement = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const repo in repoInfo) {
      if (Object.prototype.hasOwnProperty.call(repoInfo, repo)) {
        if (optionValue === repoInfo[repo].name) {
          // format the date
          const upDate = new Date(repoInfo[repo].updated_at);
          const amOrPm = upDate.getHours() < 12 ? 'AM' : 'PM';
          const dateHours = upDate.getHours() % 12 || 12;
          const formatedUpdate = `${upDate.getMonth()}/${upDate.getDate()}/${upDate.getFullYear()} ${dateHours}
             : ${upDate.getMinutes()}:${upDate.getSeconds()} ${amOrPm}`;

          templateElement.push(
            '<div id="row">',
            `${'<p id="name-info">'} Repository name : ${'<a href="'}${
              repoInfo[repo].html_url
            }"${'/>'} ${repoInfo[repo].name}</a></p>`,
            `${'<p id="desc">'}  Description :  ${repoInfo[repo].description}</p>`,
            `${'<p id="forks">'}  Forks       : ${repoInfo[repo].forks_count}</p>`,

            `${'<p id="updated">'} Updated  : ${formatedUpdate}</p>`,
            '</div>',
          );

          // Call another function(addContributors) to fill i contributor information.
          fetchJSON(repoInfo[repo].contributors_url, (err, data) => {
            const root = document.getElementById('root');

            if (err) {
              createAndAppend('div', root, { text: err.message, class: 'alert-error' });
            } else {
              addContributors(data);
            }
          });
        }
      }
    }
    const htmlString = templateElement.join('');
    document.getElementById('repodetails').innerHTML = htmlString;
  }

  // Create options under 'SELECT' element which should have HYF Repositories.

  function loadSelectionValues(userRepo) {
    const sortRepoName = [];

    const selectRepo = document.getElementById('selectrepo');

    // push all the HYP repo names to sort array.

    // eslint-disable-next-line no-restricted-syntax
    for (const repo in userRepo) {
      if (Object.prototype.hasOwnProperty.call(userRepo, repo)) {
        sortRepoName.push(userRepo[repo].name);
      }
    }

    // sort the repo name using sort function and localeComapare for uppercase and lowercase sorting.
    sortRepoName.sort((a, b) => a.localeCompare(b));

    // Create Option under Select element and attach the  same with SELECT element.

    // eslint-disable-next-line no-restricted-syntax
    for (const repo of sortRepoName) {
      const option = document.createElement('option');
      option.value = repo;
      option.text = repo;
      selectRepo.appendChild(option);
    }

    const selectBox = document.getElementById('selectrepo');
    const selectedValue = selectBox.options[selectBox.selectedIndex].value;

    // Load Repository information for the choose repository name in the select box.
    loadRepoDetails(userRepo, selectedValue);
    selectBox.onchange = function() {
      loadRepoDetails(userRepo, selectBox.value);
    };
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      const BodyEl = document.body;

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // Create div element 'select' in  document body to hold the label element and list box.

        createAndAppend('div', BodyEl, { id: 'seletcontainer' });
        const select = document.getElementById('seletcontainer');
        createAndAppend('LABEL', select, {
          text: 'HYF Repositories: ',
          id: 'label',
          for: 'repo',
        });
        createAndAppend('select', select, { id: 'selectrepo' });

        // Create two div elements section1 and section2 under 'Root' div to have
        // section1 - Repository Information.
        // section2 - Contributions.

        createAndAppend('div', root, { id: 'repodetails' });
        createAndAppend('div', root, { id: 'contributorinfomation' });

        // Insert section1 before section2 div element under 'root' div.
        const newNode = document.getElementById('contributorinfomation');
        const referenceNode = document.querySelector('repodetails');
        root.insertBefore(newNode, referenceNode);

        // Insert Select div first in the body before root div.
        BodyEl.insertBefore(select, document.getElementById('root'));

        loadSelectionValues(data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
