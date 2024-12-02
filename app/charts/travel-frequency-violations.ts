import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createTravelFrequencyViolationChart(pivotRef: React.RefObject<Pivot>){
    pivotRef.current!.flexmonster.highcharts?.getData(
        {
          type: 'bar',
          slice: {
            rows: [{ uniqueName: 'How often do you travel by plane?' }],
            columns: [{ uniqueName: "Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?" }],
            measures: [{ uniqueName: 'RespondentID', aggregation: 'count' }],
          },
        },
        (data: any) => {
          // Preprocess the data for percentage calculation
          const totalByCategory: Record<string, number> = {};
      
          // Calculate totals per category (X-axis)
          data.series.forEach((series: any) => {
            series.data.forEach((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              if (!totalByCategory[category]) totalByCategory[category] = 0;
              totalByCategory[category] += value;
            });
          });
      
          // Convert data values to percentages
          data.series.forEach((series: any) => {
            series.data = series.data.map((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              return (value / totalByCategory[category]) * 100;
            });
          });
      
          // Configure chart options for percentage stacking
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
            layout: 'horizontal', // Set legend layout to horizontal
            align: 'center', // Center the legend horizontally
            verticalAlign: 'bottom', // Position the legend at the bottom
            x: 0,
            y: 10, // Adjust the vertical position of the legend if needed
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
                    color: '#000', // Set color for data labels
                  },
                  borderWidth: 0, // Remove the border around the numbers
                },
              },
          };
      
          // Render the chart
          Highcharts.chart('chart-travel-frequency-violations', data);
        }
      );
}