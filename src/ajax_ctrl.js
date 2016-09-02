import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import './css/ajax-panel.css!';

const panelDefaults = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/ryantxu/ajax-panel/master/static/example.txt',
  errorMode: 'show'
};

export class AjaxCtrl extends PanelCtrl {
 // constructor($scope, $injector, private templateSrv, private $sce) { 
  constructor($scope, $injector, templateSrv, $sce, $http) {
    super($scope, $injector);
    this.$sce = $sce;
    this.$http = $http;
    this.templateSrv = templateSrv;

    _.defaults(this.panel, panelDefaults);
    _.defaults(this.panel.timeSettings, panelDefaults.timeSettings);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('refresh', this.onRender.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/grafana-ajax-panel/editor.html', 2);
    this.editorTabIndex = 1;
  }

  onPanelTeardown() {
   // this.$timeout.cancel(this.nextTickPromise);
  }

  onRender() {
    console.log( "onRender", this );
    // TODO, get the time query and user

(function(wrap){ // need access to 'this' later :(
    wrap.$http({
      method: wrap.panel.method,
      url: wrap.panel.url
    }).then(function successCallback(response) {
      console.log('success', response, wrap);
      wrap.updateContent(response.data  + "<br/>" +new Date() );
    }, function errorCallback(response) {
      console.log('error', response);
      var body = '<h1>Error</h1><pre>' + JSON.stringify(response, null, " ") + "</pre>";
      wrap.updateContent(body);
    });

}(this));

  }

  updateContent(html) {
    try {
      this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
    } catch (e) {
      console.log('Text panel error: ', e);
      this.content = this.$sce.trustAsHtml(html);
    }
  }
}

AjaxCtrl.templateUrl = 'module.html';
