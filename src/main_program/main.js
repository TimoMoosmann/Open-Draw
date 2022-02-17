import {getMainMenuPage} from './view.js';
import {createEllipse, inEllipse} from '../data_types.js';
import {drawDotOnScreen, getElementCenter, getElementRadii} from '../util/browser.js';
import {runWebgazerFixationDetection} from '../webgazer_extensions/fixation_detection.js';

const runMainProgram = ({
  dwellDurationThreshold,
  fixationDispersionThreshold,
  fixationDurationThreshold,
  maxFixationDuration,
  webgazer
}) => {
  const drawnLines = [];
  const runFixationDetectionFixedThresholds = onFixation => {
    return runWebgazerFixationDetection({
      dispersionThreshold: fixationDispersionThreshold,
      durationThreshold: fixationDurationThreshold,
      maxFixationDuration,
      onFixation,
      webgazer
    });
  };
  const actionOnDwellFixedThreshold = ({btnList, fixation}) => actionOnDwell({
    btnList, fixation, dwellDurationThreshold
  });
  invokeMainMenuPage({
    actionOnDwellFixedThreshold,
    drawnLines,
    runFixationDetectionFixedThresholds
  });
};

const invokeMainMenuPage = ({
  actionOnDwellFixedThreshold,
  drawnLines,
  runFixationDetectionFixedThresholds
}) => {
  const mainMenuPage = getMainMenuPage();
  document.body.append(mainMenuPage);
  const dwellBtnList = Array.from(mainMenuPage.querySelectorAll('button')).map(
    btn => {
      const btnAction = getDwellBtnAction(btn.id);
      btn.addEventListener('click', btnAction);
      const btnEllipse = createEllipse({
        center: getElementCenter(btn),
        radius: getElementRadii(btn)
      });
      return createDwellBtn({action: btnAction, ellipse: btnEllipse});
    }
  );
  runFixationDetectionFixedThresholds(fixation => actionOnDwellFixedThreshold({
    btnList: dwellBtnList, fixation
  }));
}

const actionOnDwell = ({btnList, fixation, dwellDurationThreshold}) => {
  if (fixation.duration >= dwellDurationThreshold) {
    for (let btn of btnList) {
      if (inEllipse({ellipse: btn.ellipse, pos: fixation.center})) {
        btn.action();
        break;
      }
    }
  }
};

const createDwellBtn = ({action, ellipse}) => ({action, ellipse});

const getDwellBtnAction = dwellBtnId => {
  switch (dwellBtnId) {
    case 'drawBtn':
      return () => alert('Draw Button');
      break;
    case 'moveBtn':
      return () => alert('Move Button');
      break;
    case 'editBtn':
      return () => alert('Edit Button');
      break;
    case 'colorBtn':
      return () => alert('Color Button');
      break;
    default:
      throw new Error('No Action defined for button with ID: ' + dwellBtnId);
  }
}

export {runMainProgram};

