import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createTravelFrequencyViolationChart(pivotRef: React.RefObject<Pivot>){
  const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

    pivotRef.current!.flexmonster.highcharts?.getData(
        {
          type: 'bar',
          slice: {
            rows: [{ uniqueName: 'How often do you travel by plane?' }],
            columns: [{ uniqueName: "Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?" }],
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
      
          data.chart = {
            type: 'bar',
          };
          data.title = {
            text: 'Percentage of people using electronics in relation to violations by flight frequency',
          };
          data.xAxis = {
            categories: data.xAxis.categories,
            title: {
              text: 'Travel Frequency',
            },
          };
          data.yAxis = {
            min: 0,
            max: 100,
            title: {
              text: 'Percentage of Respondents',
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

          data.legend = {
            layout: 'horizontal', 
            align: 'center', 
            verticalAlign: 'bottom',
            x: 0,
            y: 10, 
          }
          data.tooltip = {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y:.1f}%<br/>',
          };
          data.plotOptions = {
            bar: {
              stacking: 'percent',
              dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%',
              },
            },
            series: {
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#000',
                  },
                  borderWidth: 0,
                },
              },
          };
      
          Highcharts.chart('chart-travel-frequency-violations', data);
        }
      );
}