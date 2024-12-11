import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createAgeVsSpeakingChart(pivotRef: React.RefObject<Pivot>){
  const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

    pivotRef.current!.flexmonster.highcharts?.getData(
        {
          type: 'line',
          slice: {
            rows: [{ uniqueName: 'Age' }],
            columns: [{ uniqueName: 'Generally speaking, is it rude to say more than a few words tothe stranger sitting next to you on a plane?' }], 
            measures: [{ uniqueName: 'RespondentID', aggregation: 'count' }], 
            reportFilters: gridSlice.reportFilters
          },
        },
        (data: any) => {
          const totalByAgeGroup: Record<string, number> = {};
      
          // Calculate totals per age group
          data.series.forEach((series: any) => {
            series.data.forEach((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              if (!totalByAgeGroup[category]) totalByAgeGroup[category] = 0;
              totalByAgeGroup[category] += value;
            });
          });
      
          data.series.forEach((series: any) => {
            series.data = series.data.map((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              return (value / totalByAgeGroup[category]) * 100;  
            });
          });

      const customOrder = ['18-29', '30-44', '45-60', '> 60'];

      let originalCategories = [...data.xAxis.categories];
      originalCategories = originalCategories.filter((category: any) => category !== '(blank)');
      data.xAxis.categories = originalCategories

      const sortedCategories = data.xAxis.categories.sort((a: any, b: any) => {
        return customOrder.indexOf(a) - customOrder.indexOf(b);
      });

      data.series = data.series.filter((series: any) => series.name !== "(blank)");

      data.series.forEach((series: any) => {
        const sortedData: number[] = []
        sortedCategories.forEach((category: any) => {
            let index: number = originalCategories.indexOf(category)
            sortedData.push(series.data[index])
        })
        series.data = sortedData; 
      });

      data.xAxis.categories = sortedCategories.filter((category: any) => category !== '(blank)');
      
          data.chart = {
            type: 'line',
          };
      
          data.title = {
            text: 'How the likelihood of speaking with strangers varies across different age groups',
          };
      
          data.xAxis = {
            categories: data.xAxis.categories,  
            title: {
              text: 'Age Group',
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
      
          data.tooltip = {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y:.1f}%<br/>',
          };
          data.legend = {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 10, 
          }
      
          Highcharts.chart('chart-age-vs-speaking', data);
        }
      );
    }      