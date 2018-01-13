import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/retry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy , AfterViewInit {
  private cpu: AmChart ; ram: AmChart ; network: AmChart;
  staticData: any;
  dynamicData: any;
  timer: any;
  currentTime: Date;
  upTime: string;
  ramUse: number;

  // constructor
  constructor(private AmCharts: AmChartsService, private http: HttpClient) {
    this.timer = setInterval(() => {
      this.getDynamicData();
    }, 1000);
  }
  // error handling
  error = (err) => {
    return ( err.error instanceof Error ) ?
      console.log('An error occurred:', err.error.message) : console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
  }
  // converting types
  convert = (obj: object, param: string, power: number) => {
    return obj[param] = (obj[param] / Math.pow(1024, power)).toFixed(2);
  }
  update = (chart: any, value: any[]) => {
    this.AmCharts.updateChart(chart, () => {
      chart.arrows[0].setValue(value[0]);
      chart.axes[0].setBottomText(value[1]);
    });
  }
  // updateChart data
  updateCharts = () => {
    this.update(this.cpu, [this.dynamicData.currentLoad.currentload,
      'cpu']);
    this.update(this.ram, [this.ramUse,
      'Ram' + '(' + (this.convert(this.dynamicData.mem, 'used', 3) + '/' + this.convert(this.dynamicData.mem, 'total', 3)) + ')']);
    this.update(this.network, [this.dynamicData.networkStats.rx_sec * 8,
      this.dynamicData.networkStats.rx_sec + 'MBps']);
  }
  // dynamicData function
  getDynamicData = () => {
    this.http.get('http://127.0.0.1:3000/cpanel/dynamic').retry(2).subscribe(data => {
      this.dynamicData = data;
      // changing bytes to gb for HDD
      this.dynamicData.fsSize.map( disk => {
        this.convert(disk, 'size', 3);
        this.convert(disk, 'used', 3);
      });
      // changing bytes to mb for network
      ['rx', 'rx_sec', 'tx', 'tx_sec'].map((stat) => this.convert(this.dynamicData.networkStats ,stat, 2));
      this.currentTime = new Date(this.dynamicData.time.current);
      const time = new Date(this.dynamicData.time.uptime);
      this.upTime = Math.round(time.getTime() / 3600) + 'H ' + Math.round((time.getTime() / 60 ) % 60) + 'M';
      this.ramUse = (this.dynamicData.mem.used / this.dynamicData.mem.total) * 100;
      // chart update
      this.updateCharts();
    }, (err: HttpErrorResponse) => this.error(err));
  }
  // staticData function
  getStaticData = () => {
    this.http.get('http://127.0.0.1:3000/cpanel/static').retry(2)
      .subscribe(data => this.staticData = data, (err: HttpErrorResponse) => this.error(err));
  }
  ngOnInit(): void {
    this.getStaticData();
  }

  ngOnDestroy() {
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




