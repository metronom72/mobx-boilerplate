import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import path from 'path';

const pathToStorybookStatic = path.join(__dirname, '../../', 'storybook-static');

const getMatchOptions = ({ context: { kind, story }, url }) => {
  return {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
  };
};

initStoryshots({
  suite: 'Image storyshots', 
  test: imageSnapshot({
    storybookUrl: `file://${pathToStorybookStatic}`,
    getMatchOptions,
  })
});