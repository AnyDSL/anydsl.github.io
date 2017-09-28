/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Realm Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

ANIMATION_DURATION = 300;

current_state = {
  count: 0
};

window.jazzy = {'docset': false}
if (typeof window.dash != 'undefined') {
  document.documentElement.className += ' dash'
  window.jazzy.docset = true
}
if (navigator.userAgent.match(/xcode/i)) {
  document.documentElement.className += ' xcode'
  window.jazzy.docset = true
}

// On doc load, toggle the URL hash discussion if present
$(document).ready(function() {
  if (!window.jazzy.docset) {
    var target = findTargetFromPath(window.location.hash);
    if(target) {
      current_state.targetpath = target.path;
      current_state.action = 'open';
      open(target);
    }
  }
});

$(window).on('popstate', function(e) {
  var state = e.originalEvent.state;
  if (!state || state.count < current_state.count) {
    //back button pressed, revert whatever the current step is
    if(current_state.action == 'open') {
      close(findTargetFromPath(current_state.targetpath));
    }
    else {
      open(findTargetFromPath(current_state.targetpath));
    }
    current_state = state? state : {};
  }
  else {
    // forward button pressed, do whatever that step tell you todo
    if(state.action == 'open') {
      open(findTargetFromPath(state.targetpath));
    }
    else {
      close(findTargetFromPath(state.targetpath));
    }
    current_state = state;
  }
});

// On token click, toggle its discussion and animate token.marginLeft
$('.token').click(function(event) {
  if (window.jazzy.docset) {
    return;
  }
  var target = findTargetFromToken($(this));
  current_state.targetpath = target.path;
  current_state.count++;
  if(isOpened(target)) {
    current_state.action = 'close';
    close(target);
    history.pushState(current_state, '', window.location.pathname);
  }
  else {
    current_state.action = 'open';
    open(target);
    history.pushState(current_state, '', target.path);
  }
  event.preventDefault();
});

function findTargetFromPath(path) {
  if (path === "") {
    return null;
  }
  target = {};
  target.path = path;
  target.$token = $('a[href="' + target.path +'"]');
  target.$content = target.$token.parent().parent().next();
  return target;
}

function findTargetFromToken($token) {
  if (!$token) {
    return null;
  }
  target = {};
  target.$token = $token;
  target.path = target.$token.attr('href');
  target.$content = target.$token.parent().parent().next();
  return target;
}

function isOpened(target) {
  return target? target.$content.css('display') !== 'none' : false;
}

function open(target) {
  if (target) {
    target.$content.slideDown(ANIMATION_DURATION);
  }
}

function close(target) {
  if (target) {
    target.$content.slideUp(ANIMATION_DURATION);
  }
}