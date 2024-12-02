import { Pivot } from "react-flexmonster";
import * as Highcharts from 'highcharts';

export default function createAgeVsSpeakingChart(pivotRef: React.RefObject<Pivot>){
    pivotRef.current!.flexmonster.highcharts?.getData(
        {
          type: 'line',
          slice: {
            rows: [{ uniqueName: 'Age' }],
            columns: [{ uniqueName: 'Generally speaking, is it rude to say more than a few words tothe stranger sitting next to you on a plane?' }], 
            measures: [{ uniqueName: 'RespondentID', aggregation: 'count' }],  // Counting the number of respondents
          },
        },
        (data: any) => {
          // Preprocess the data (if necessary) and calculate the trend
          const totalByAgeGroup: Record<string, number> = {};
      
          // Calculate totals per age group
          data.series.forEach((series: any) => {
            series.data.forEach((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              if (!totalByAgeGroup[category]) totalByAgeGroup[category] = 0;
              totalByAgeGroup[category] += value;
            });
          });
      
          // Optional: Normalize the data to percentage or other calculations
          data.series.forEach((series: any) => {
            series.data = series.data.map((value: number, index: number) => {
              const category = data.xAxis.categories[index];
              return (value / totalByAgeGroup[category]) * 100;  // Convert to percentage
            });
          });

          // Custom order for categories (age groups)
      const customOrder = ['18-29', '30-44', '45-60', '> 60'];

      // Store the original order of categories
      let originalCategories = [...data.xAxis.categories];
      originalCategories = originalCategories.filter((category: any) => category !== '(blank)');
      data.xAxis.categories = originalCategories

      // Sort categories based on custom order
      const sortedCategories = data.xAxis.categories.sort((a: any, b: any) => {
        return customOrder.indexOf(a) - customOrder.indexOf(b);
      });

      data.series = data.series.filter((series: any) => series.name !== "(blank)");

      // Map each series.data to the new sorted order
      data.series.forEach((series: any) => {
        const sortedData: number[] = []
        sortedCategories.forEach((category: any) => {
            let index: number = originalCategories.indexOf(category)
            sortedData.push(series.data[index])
        })
        series.data = sortedData; // Update the series data with the sorted data
      });

      // Filter out blank answers if necessary
      data.xAxis.categories = sortedCategories.filter((category: any) => category !== '(blank)');
      
          // Configure chart options
          data.chart = {
            type: 'line',
          };
      
          data.title = {
            text: 'How the likelihood of speaking with strangers varies across different age groups',
          };
      
          data.xAxis = {
            categories: data.xAxis.categories,  // Categories represent the age groups
            title: {
              text: 'Age Group',
            },
          };
      
          data.yAxis = {
            min: 0,
            max: 100,  // Range for percentage data
            title: {
              text: 'Percentage of Respondents',
            },
            labels: {
              format: '{value}%',  // Format labels as percentages
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
            layout: 'horizontal', // Set legend layout to horizontal
            align: 'center', // Center the legend horizontally
            verticalAlign: 'bottom', // Position the legend at the bottom
            x: 0,
            y: 10, // Adjust the vertical position of the legend if needed
          }
      
          // Render the chart
          Highcharts.chart('chart-age-vs-speaking', data);
        }
      );
    }      