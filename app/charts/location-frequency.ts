import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createLocationFrequencyChart(pivotRef: React.RefObject<Pivot>){
    pivotRef.current!.flexmonster.highcharts?.getData(
        {
            type: 'column',
            slice: {
                rows: [{ uniqueName: 'Location (Census Region)' }], 
                columns: [{ uniqueName: 'How often do you travel by plane?' }],
                measures: [{ uniqueName: 'RespondentID', aggregation: 'count' }] 
            }
        },
        (data: any) => {
            // Preprocess and filter out unwanted data (like blanks)
            const filteredSeries = data.series.filter((seriesItem: any) => {
                return seriesItem.name !== "" && seriesItem.name !== "(blank)";
            });
  
            // Update the series with the filtered data
            data.series = filteredSeries;
  
            // Chart configuration
            data.chart = {
                type: 'column',
            };
            data.title = {
                text: 'How often people from different USA regions tend to travel by plane',
            };
            data.xAxis = {
                categories: data.xAxis.categories,
                title: {
                    text: 'Location Regions',
                },
            };
            data.yAxis = {
                min: 0,
                title: {
                    text: 'Number of Respondents',
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: 'gray',
                    },
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
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            };
            data.plotOptions = {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                    },
                },
            };

            data.legend = {
                layout: 'horizontal', // Set legend layout to horizontal
                align: 'center', // Center the legend horizontally
                verticalAlign: 'bottom', // Position the legend at the bottom
                x: 0,
                y: 10, // Adjust the vertical position of the legend if needed
              }
  
            Highcharts.chart('chart-location-to-frequency', data);
        }
    );
}