import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createLocationChart(pivotRef: React.RefObject<Pivot>){
    pivotRef.current!.flexmonster.highcharts?.getData(
        {
            type: 'pie',
            slice: {
                rows: [{ uniqueName: 'Location (Census Region)', }],
                measures: [
                    {
                        uniqueName: 'RespondentID',
                        aggregation: 'count',
                    },
                ],
            },
        },
        (data: any) => {  
          console.log("treba", data)
            // Define the chart configuration within the data object
            data.chart = {
                type: 'pie',
            };
            data.title = {
                text: 'Aggregated Survey Responses'
            };

            data.legend = {
                layout: 'horizontal', // Set legend layout to horizontal
                align: 'center', // Center the legend horizontally
                verticalAlign: 'bottom', // Position the legend at the bottom
                x: 0,
                y: 10, // Adjust the vertical position of the legend if needed
              }
            data.plotOptions = {
                pie: {
                    innerSize: '50%',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    },
                },
            };  
            // Pass data directly to Highcharts
            Highcharts.chart('chart-location-distribution', data);
        },
        (data: any) => {
            Highcharts.chart('chart-location-distribution', data);
        }
    );
}