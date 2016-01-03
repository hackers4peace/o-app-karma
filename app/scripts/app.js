/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {

    app.set('user', app.user);
    app.set('user.id', app.user.id);
  });
//
  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    //Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    //Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    // Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close ldrawer after menu item is selected if drawerPanel is narrow
  app.toggleDrawerPanel = function (panelId) {
    var drawerPanel = document.querySelector(panelId);
    drawerPanel.togglePanel();
  }

  app.toggleDrawerPanelLeft = function() {
    app.toggleDrawerPanel('#paperDrawerPanelLeft');
  };

  app.toggleDrawerPanelRight = function() {
    app.toggleDrawerPanel('#paperDrawerPanelRight');
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  }

  app.initializeData = function() {
    console.log('initialization');
    app.user = {
      id: '',
      activities: [] //FIXME
    }
  }

  app.handleOnStart = function () {
    this.set('currentActivity.startTime', (new Date()).toISOString());
    this.set('currentActivity.actor', app.user.id);
  }

  app.handleOnStop = function () {
    this.set('currentActivity.endTime',(new Date()).toISOString());
    this.push('user.activities', app.currentActivity);
    this.set('currentActivity', null);
  }
  app.user = {
    id: 'https://idp.wwelves.org/ef093385-8906-4c78-9a69-9217c76013a8#id',
    activities: []
  }
  // Person Project Goal Organization Activity
  // app.relations = [
  //   {
  //     objectType: 'Person',
  //     displayName: '',
  //     icon: ''
  //     relations: [
  //       {
  //         relationType : 'Goal',
  //         objectType: 'rev'
  //       },
  //     ]
  //   }
  //   {  'Person', objectType: '', relationType: '' },
  //   { subjectType: 'Person', objectType: '', relationType: '' },
  //   { subjectType: 'Person', objectType: '', relationType: '' },
  //   { subjectType: 'Person', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  //   { subjectType: '', objectType: '', relationType: '' },
  // ]

  app.onTypeSelected = function(e, detail) {
    app.toggleDrawerPanelLeft();

    switch (detail.subject) {
      case 'Goal':
        if (app.subject.type.indexOf('Person') >= 0) {
          app.set('subject.dataSelection', app.subject['@reverse']['role:assignee']);
        } else if (app.subject.type.indexOf('Project') >= 0) {
          app.set('subject.dataSelection', app.subject.goal);
        }

        break;
      case 'Project':
        app.set('subject.dataSelection', app.subject['@reverse']['role:contributor']);
        break;

       case 'Activity':
        app.set('subject.dataSelection', app.subject['@reverse']['actor']);
        break;
    }
      console.log('dataSelection', app.subject.dataSelection);
  }

  app.onRelationSelected = function (e, detail) {
    app.toggleDrawerPanelRight();

    switch (detail.relation) {
      case 'role:assignee':
        app.set('subject.dataSelection', app.subject['@reverse']['role:assignee']);
        break;
      case 'goal':
        app.set('subject.dataSelection', app.subject.goal);
        break;
      case 'role:contributor':
        app.set('subject.dataSelection', app.subject['@reverse']['role:contributor']);
        break;

       case 'actor':
        app.set('subject.dataSelection', app.subject['@reverse']['actor']);
        break;
    }
      console.log('dataSelection', app.subject.dataSelection);
  }

  app.onSubjectChange = function (e, detail) {
    if (detail && detail.id) {
      var path = '/subject/' + btoa(detail.id);
      page(path);
    }
  }


  app.onActivityClick = function (e) {
    app.currentActivity = {
      type: "Activity",
      object: this.subject.id
    };
  }


})(document);
