import {getMainMenuPage} from './view.js';
import {createEllipse, isInEllipse} from '../data_types.js';
import {getElementCenter, getElementSize} from '../util/browser.js';

const main = ({
  dwellDurationThreshold,
  fixationDispersionThreshold,
  fixationDurationThreshold,
}) => {
  const drawnLines = [];
  invokeMainMenuPage({
    drawnLines,
    dwellDurationThreshold,
    fixationDispersionThreshold,
    fixationDurationThreshold
};

const invokeMainMenuPage = ({
  dispersionThreshold,
  drawnLines,
  durationThreshold,
  dwellTime
}) => {
  const mainMenutPage = getMainMenuPage();
  const dwellBtnList = mainMenuPage.querySelectorAll('button').map(
    btn => {
      const btnAction = getDwellBtnAction(btn.id);
      btn.addEventListener('click', btnAction);
      const btnEllipse = createEllipse({
        center: getElementCenter(btn),
        radius: getElementSize(btn)
      });
      return createDwellBtn({action: btnAction, ellipse: btnEllipse});
    }
  );
  runWebgazerDwellDetection({
    dispersionThreshold,
    durationThreshold,
    onFixation: fixation => actionOnDwell({
      btnList: dwellBtnList,
      dwellTime,
      fixation
    });
  });
  document.body.append(mainMenuPage);
}


  // Wait until a button is clicked / gazed At
  // activate the Buttons corresponding page and give drawnLines to it
}

const actionOnDwell = ({btnList, fixation, dwellTime}) => {
  if (fixation.duration >= dwellTime) {
    for (let btn of btn_list) {
      if (inEllipse(btn.ellipse, fixation.center)) {
        btn.action();
        break;
      }
    }
  }
};

const createDwellBtn = ({action, ellipse}) => ({action, ellipse});

const getDwellBtnAction = dwellBtnId => {
  switch (dwellBtnName) {
    case 'drawBtn':
      return () => alert('Draw Button');
      break;
    case 'moveBtn':
      return () => alert('Move Button');
      break;
    case 'editBtn':
      return () => alert('Edit Button');
      break;
    default:
      throw new Error('A button with id: ' + dwellBtnId + ' is not available.');
  }
}

