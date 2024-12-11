import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createPassengersDemandChart(pivotRef: React.RefObject<Pivot>){
  const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

    pivotRef.current!.flexmonster.highcharts?.getData(
        {
          type: 'column',
          slice: {
            rows: [{ uniqueName: 'Is itrude to recline your seat on a plane?' }],
            columns: [{ uniqueName: 'Do you ever recline your seat when you fly?' }],
            measures: [{ uniqueName: 'RespondentID', aggregation: 'count' }],
            reportFilters: gridSlice.reportFilters
          },
        },
        (data: any) => {
          const totalByCategory: Record<string, number> = {};

          data.series.forEach((series: any) => {
            series.data.forEach((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              if (!totalByCategory[category]) totalByCategory[category] = 0;
              totalByCategory[category] += value;
            });
          });
      
          data.series.forEach((series: any) => {
            series.data = series.data.map((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              return (value / totalByCategory[category]) * 100;
            });
          });
      
          const filteredCategories: any[] = [];
          data.series.forEach((series: any) => {
            series.data = series.data.filter((point: any, index: number) => {
              if (data.xAxis.categories[index] !== '(blank)') {
                filteredCategories.push(data.xAxis.categories[index]);
                return true;
              }
              return false;
            });
          });
          data.xAxis.categories = filteredCategories;
      
          const customOrder = ['Never', 'Once in a while', 'About half the time', 'Usually', 'Always'];
          data.series.sort((a: any, b: any) => {
            return customOrder.indexOf(a.name) - customOrder.indexOf(b.name);
          });
      
          data.chart = {
            type: 'column',
          };
          data.title = {
            text: 'Seat Recline vs Obligation',
          };
          data.xAxis = {
            categories: data.xAxis.categories,
            title: {
              text: 'Is it rude for others to recline their seats?',
            },
          };
          data.yAxis = {
            min: 0,
            max: 100,
            title: {
              text: 'How often do you recline your seat?',
            },
            labels: {
              format: '{value}%',
            },
          };
          data.legend = {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
          };
          data.tooltip = {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y:.1f}%<br/>',
          };
          data.plotOptions = {
            column: {
              stacking: 'percent',
              dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%',
              },
            },
          };

          data.legend = {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 10,
          }
      
          Highcharts.chart('chart-seat-recline-vs-obligation', data);
        }
      );
}