import React from 'react';

import { storiesOf } from '@storybook/react';
// import { withScreenshot } from 'storybook-chrome-screenshot';

import '../src/assets/styles.styl';

storiesOf('Pagination', module)
  // .add('first page', 
  //   withScreenshot()(
  //     () => (
  //       <Pagination
  //         totalItemsCount={100500}
  //         itemsPerPage={30}
  //         currentPage={1}
  //         pagesCount={Math.floor((100500 + 30 - 1) / 30)}
  //       />
  //     )
  //   )
  // )