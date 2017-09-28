/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const TOOLBAR_SELECTOR = '.mdc-toolbar';


/**
 * Initializes anchor scroll correction. This ensures that the linked element
 * is visible instead of being hidden by the fixed toolbar.
 */
export function initAnchorScrollCorrection() {
  window.addEventListener('DOMContentLoaded', () => {
    scrollToAnchor(window.location.hash);
  });

  window.addEventListener('hashchange', (e) => {
    if (scrollToAnchor(window.location.hash)) {
      e.preventDefault();
    }
  });
}


function scrollToAnchor(anchor) {
  if (anchor[0] != '#') {
    return false;
  }

  const element = document.querySelector(anchor);
  if (!element) {
    return false;
  }

  const toolbarElement = document.querySelector(TOOLBAR_SELECTOR);
  if (!toolbarElement) {
    return false;
  }

  const elementRelativeTop = element.getBoundingClientRect().top;
  const toolbarHeight = toolbarElement.offsetHeight;
  window.scroll(
      window.pageXOffset,
      window.pageYOffset + elementRelativeTop - toolbarHeight);

  return true;
}
