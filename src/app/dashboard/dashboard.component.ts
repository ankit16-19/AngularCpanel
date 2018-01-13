import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/retry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy , AfterViewInit{
  private cpu: AmChart;
  private ram: AmChart;
  private network: AmChart;
  staticData: any;
  dynamicData: any;
  timer: any;
  currentTime: any;
  upTime: any;
  ramUse: number;

  constructor(private AmCharts: AmChartsService, private http: HttpClient) {
    this.timer = setInterval(() => {
      this.getDynamicData();
    }, 1000);
  }

  // function to update charts
  updateCharts() {
    // cpu chart
    this.AmCharts.updateChart(this.cpu, () => {
      this.cpu.arrows[0].value = this.dynamicData.currentLoad.currentload;
    });
    this.AmCharts.updateChart(this.ram, () => {
      this.ram.arrows[0].value = this.ramUse;
      this.ram.axes[0].bottomText = 'Ram' + '(' + (this.dynamicData.mem.used / ( 1024 * 1024 * 1024)).toFixed(2) + '/' + (this.dynamicData.mem.total / ( 1024 * 1024 * 1024 )).toFixed(2) + ')';
    });
    this.AmCharts.updateChart(this.network, () => {
      this.network.arrows[0].value = this.dynamicData.networkStats.rx_sec * 8;
      this.network.axes[0].bottomText = this.dynamicData.networkStats.rx_sec + 'MBps';
    });
  }

  // function to get dynamicData
  getDynamicData() {
    this.http.get('http://127.0.0.1:3000/cpanel/dynamic').retry(2).subscribe(data => {
      this.dynamicData = data;
      this.currentTime = new Date(this.dynamicData.time.current);
      const time = new Date(this.dynamicData.time.uptime);
      this.upTime = Math.round(time.getTime() / 3600) + 'H ' + Math.round((time.getTime() / 60 ) % 60) + 'M';
      this.ramUse = (this.dynamicData.mem.used / this.dynamicData.mem.total) * 100;
      // changing bytes to gb for HDD
      let i;
      for (i = 0; i < this.dynamicData.fsSize.length; i++) {
        this.dynamicData.fsSize[i].size = (this.dynamicData.fsSize[i].size / (1024 * 1024 * 1024)).toFixed(2);
        this.dynamicData.fsSize[i].used = (this.dynamicData.fsSize[i].used / (1024 * 1024 * 1024)).toFixed(2);
      }
      // changing bytes to gb for network
      this.dynamicData.networkStats.rx = (this.dynamicData.networkStats.rx / (1024 * 1024 )).toFixed(3);
      this.dynamicData.networkStats.tx = (this.dynamicData.networkStats.tx / (1024 * 1024 )).toFixed(3);
      this.dynamicData.networkStats.rx_sec = (this.dynamicData.networkStats.rx_sec / (1024 * 1024)).toFixed(3);
      this.dynamicData.networkStats.tx_sec = (this.dynamicData.networkStats.tx_sec / (1024 * 1024)).toFixed(3);

      console.log(data);
      // chart update
      this.updateCharts();
    }, (err: HttpErrorResponse) => {
      // error
      if (err.error instanceof Error) {
        // error client side
        console.log('An error occurred:', err.error.message);
      } else {
        // error server side
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  // function get staticData
  getStaticData() {
    this.http.get('http://127.0.0.1:3000/cpanel/static').retry(2).subscribe(data => {
      this.staticData = data;
      console.log(data);
    }, (err: HttpErrorResponse) => {
      // error
      if (err.error instanceof Error) {
        // error client side
        console.log('An error occurred:', err.error.message);
      } else {
        // error server side
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  ngOnInit(): void {
    this.getStaticData();
  }

  ngOnDestroy(){
    if (this.cpu) {
      this.AmCharts.destroyChart(this.cpu);
    }
    if (this.network) {
      this.AmCharts.destroyChart(this.network);
    }
    if (this.ram) {
      this.AmCharts.destroyChart(this.ram);
    }
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    this.cpu = this.AmCharts.makeChart('cpu', {
      'type': 'gauge',
      'theme': 'none',
      'axes': [{
        'axisThickness': 1,
        'axisAlpha': 0.2,
        'tickAlpha': 0.2,
        'valueInterval': 20,
        'bands': [{
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
        }],
        'bottomText': 'CPU',
        'bottomTextYOffset': -20,
        'endValue': 100
      }],
      'arrows': [{}],
      'export': {
        'enabled': false
      }
    });
    this.ram = this.AmCharts.makeChart('ram', {
      'type': 'gauge',
      'theme': 'none',
      'axes': [{
        'axisThickness': 1,
        'axisAlpha': 0.2,
        'tickAlpha': 0.2,
        'valueInterval': 20,
        'bands': [{
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
        }],
        'bottomText': 'RAM',
        'bottomTextYOffset': -20,
        'endValue': 100
      }],
      'arrows': [{'value': '0'}],
      'export': {
        'enabled': false
      }
    });
    this.network = this.AmCharts.makeChart('network', {
      'theme': 'light',
      'type': 'gauge',
      'axes': [{
        'axisColor': '#67b7dc',
        'axisThickness': 3,
        'endValue': 40,
        'gridInside': false,
        'inside': false,
        'radius': '100%',
        'valueInterval': 10,
        'tickColor': '#67b7dc'
      }, {
        'axisColor': '#fdd400',
        'axisThickness': 3,
        'endValue': 5,
        'radius': '80%',
        'valueInterval': 1.25,
        'tickColor': '#fdd400'
      }],
      'arrows': [{
        'color': '#67b7dc',
        'innerRadius': '20%',
        'nailRadius': 0,
        'radius': '85%'
      }],
      'export': {
        'enabled': false
      }
    });
  }
}



