import {getTestPages} from './test_pages.js';

const main = () => {
  for (const testPage of getTestPages()) {
    const startTestBtn = document.createElement('button');
    startTestBtn.innerHTML = testPage.name;
    startTestBtn.addEventListener('click', () => {
      const body = document.createElement('div');
      document.body.innerHTML = '';
      document.body.appendChild(testPage.getPage());
    });
    document.body.appendChild(startTestBtn);
  }
}

main();

