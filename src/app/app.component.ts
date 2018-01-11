import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/retry';

/** @title Responsive sidenav */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  private cpu: AmChart;
  private ram: AmChart;
  private network: AmChart;
  staticData: string[{}];
  dynamicData: string[{}];
  timer: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private AmCharts: AmChartsService, private http: HttpClient) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.timer = setInterval(() => {
      this.getDynamicData(); }, 1000);
  }
  getDynamicData(){
    this.http.get('http://127.0.0.1:3000/cpanel/dynamic').retry(2).subscribe(data =>  {
      this.dynamicData = data;
      console.log(data);
      console.log(data);
    }, ( err: HttpErrorResponse) => {
      if ( err.error instanceof Error ) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }
  ngOnInit(): void {
    this.http.get('http://127.0.0.1:3000/cpanel/static').retry(2).subscribe(data =>  {
      this.staticData = data;
      console.log(data);
      }, ( err: HttpErrorResponse) => {
          if ( err.error instanceof Error ) {
            console.log('An error occurred:', err.error.message);
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
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
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}


  /**  Copyright 2017 Google Inc. All Rights Reserved.
   Use of this source code is governed by an MIT-style license that
   can be found in the LICENSE file at http://angular.io/license */

