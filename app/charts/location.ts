import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';
import Flexmonster from "flexmonster";

export default function createLocationChart(pivotRef: React.RefObject<Pivot>){
    const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

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
                reportFilters: gridSlice.reportFilters
            },
            
        },
        (data: any) => {  
            data.chart = {
                type: 'pie',
            };
            data.title = {
                text: 'Aggregated Survey Responses'
            };

            data.legend = {
                layout: 'horizontal',
                align: 'center', 
                verticalAlign: 'bottom',
                x: 0,
                y: 10, 
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
            Highcharts.chart('chart-location-distribution', data);
        },
        (data: any) => {
            Highcharts.chart('chart-location-distribution', data);
        }
    );
}