import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {InputChartDataModel} from "./components/input-chart-data/input-chart-data.component";
import LdService from "./services/ld.service";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  chartOptions: Object;
  chartDataModel: InputChartDataModel = new InputChartDataModel();

  constructor(private lodash: LdService) {
    this.chartOptions = {
      title : { text : 'chart for list of numbers' },
      series: [{
        data: [],
      }]
    };
  }

  ngOnInit(): void {
    this.chartDataModelChange(this.chartDataModel);
  }

  chartDataModelChange(data: InputChartDataModel) {
    const method = this.lodash[data.methodId];
    let mode = 'string';
    let jsonData: any;
    try {
      jsonData = JSON.parse(data.dataInput);
      if (Array.isArray(jsonData)) {
        mode = 'list';
      } else {
        mode = 'object';
      }
    } catch (e) {

    }

    switch (mode) {
      case 'list':
        let lineChartData = method(jsonData, (x:any) => {
          return eval(data.fn);
        });

        if (lineChartData.length === 1) {
          lineChartData = [0, lineChartData[0], 0];
        }

        this.chartOptions = {
          chart: {type: 'line'},
          title : { text : 'chart for list of numbers' },
          series: [{
            data: lineChartData,
          }]
        };
        break;
      case 'string':
        let columnChartData = <any>[];
        let charAmountMap = { };
        const str = method(data.dataInput, (x: any) => {
          return eval(data.fn);
        });

        for (let i in str) {
          const char = data.dataInput[i];
          if (charAmountMap[char]) {
            charAmountMap[char]++;
          } else {
            charAmountMap[char] = 1;
          }
        }

        for (let char in charAmountMap) {
          columnChartData.push({name: char, y: charAmountMap[char]});
        }

        this.chartOptions = {
          chart: {type: 'column'},
          title : { text : 'Amount of chars in string' },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: 'Percent of appearance in the source string'
            }
          },
          series: [{
            name: 'Char',
            data: columnChartData,
          }]
        };
        break;
      default://<< 'object'
        const chartData = this.lodash.map(jsonData, (el: any, key: any) => {
          return [key, el];
        });

        this.chartOptions = {
          chart: {
            type: 'pie',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
            }
          },
          title: {
            text: 'Browser market shares at a specific website, 2014'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              }
            }
          },
          series: [{
            type: 'pie',
            name: 'Browser share',
            data: chartData,
          }]
        };
    }
  }
}
