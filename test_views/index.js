import {getTestPages} from './test_pages.js';

import '../assets/css/test_views.css';

const main = () => {

  const container = document.createElement('div');
  container.id = 'startTestBtnsContainer';

  for (const testPage of getTestPages()) {
    const startTestBtn = document.createElement('button');
    startTestBtn.className = 'startTestBtn';
    startTestBtn.innerHTML = testPage.name;
    startTestBtn.addEventListener('click', () => {
      const body = document.createElement('div');
      document.body.innerHTML = '';
      testPage.drawPage()
    });
    document.body.appendChild(startTestBtn);
  }
}

main();

