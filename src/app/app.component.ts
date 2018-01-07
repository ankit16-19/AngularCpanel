import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';


/** @title Responsive sidenav */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  private cpu: AmChart;
  private ram: AmChart;
  private network: AmChart;
  private timer: any;
  mobileQuery: MediaQueryList;

  fillerNav = Array(50).fill(0).map((_, i) => `Nav Items ${i + 1}`);

  fillerContent = Array(50).fill(0).map(() =>
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private AmCharts: AmChartsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // timer to change the value of meter
    this.x = 60;
    this.timer = setInterval(() => {
      // Update chart
      this.AmCharts.updateChart(this.cpu, () => {
        this.cpu.arrows[0].value = this.x;
        // this.x
      });
    }, 1000);
  }

  ngAfterViewInit() {
    this.cpu = this.AmCharts.makeChart( 'cpu', {
      'type': 'gauge',
      'theme': 'none',
      'axes': [ {
        'axisThickness': 1,
        'axisAlpha': 0.2,
        'tickAlpha': 0.2,
        'valueInterval': 20,
        'bands': [ {
          'color': '#84b761',
          'endValue': 60,
          'startValue': 0
        }, {
          'color': '#fdd400',
          'endValue': 80,
          'startValue': 60
        }, {
          'color': '#cc4748',
          'endValue': 100,
          'innerRadius': '95%',
          'startValue': 80
        } ],
        'bottomText': 'CPU',
        'bottomTextYOffset': -20,
        'endValue': 100
      } ],
      'arrows': [ {'value': '0'} ],
      'export': {
        'enabled': false
      }
    } );
    this.ram = this.AmCharts.makeChart('ram', {
      'type': 'gauge',
      'theme': 'none',
      'axes': [ {
        'axisThickness': 1,
        'axisAlpha': 0.2,
        'tickAlpha': 0.2,
        'valueInterval': 20,
        'bands': [ {
          'color': '#84b761',
          'endValue': 60,
          'startValue': 0
        }, {
          'color': '#fdd400',
          'endValue': 80,
          'startValue': 60
        }, {
          'color': '#cc4748',
          'endValue': 100,
          'innerRadius': '95%',
          'startValue': 80
        } ],
        'bottomText': 'RAM(5.7/8)',
        'bottomTextYOffset': -20,
        'endValue': 100
      } ],
      'arrows': [ {'value': '50'} ],
      'export': {
        'enabled': false
      }
    } );
    this.network = this.AmCharts.makeChart( 'network', {
      'theme': 'light',
      'type': 'gauge',
      'axes': [ {
        'axisColor': '#67b7dc',
        'axisThickness': 3,
        'endValue': 100,
        'gridInside': false,
        'inside': false,
        'radius': '100%',
        'valueInterval': 10,
        'tickColor': '#67b7dc'
      }, {
        'axisColor': '#fdd400',
        'axisThickness': 3,
        'endValue': 12.5,
        'radius': '80%',
        'valueInterval': 1.25,
        'tickColor': '#fdd400'
      }],
      'arrows': [ {
        'color': '#67b7dc',
        'innerRadius': '20%',
        'nailRadius': 0,
        'radius': '85%'
      } ],
      'export': {
        'enabled': false
      }
    } );
  });


  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}


  /**  Copyright 2017 Google Inc. All Rights Reserved.
   Use of this source code is governed by an MIT-style license that
   can be found in the LICENSE file at http://angular.io/license */

