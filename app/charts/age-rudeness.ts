import { Pivot } from "react-flexmonster";
import * as Highcharts from "highcharts";
import { parse } from "csv-parse/sync";

export default function createRudeQuestionsAreaChart(
  pivotRef: React.RefObject<Pivot>
) {
  pivotRef.current?.flexmonster.highcharts?.getData(
    {
      type: "area", // Set chart type to 'area'
      slice: {
        rows: [{ uniqueName: "Age" }], // Rows represent age
        columns: [], // Columns represent questions with 'rude'
        measures: [
          {
            uniqueName: "RespondentID", // Measure to calculate percentages
            aggregation: "count", // Aggregate by average to get % distribution
          },
        ],
      },
    },
    (data: any) => {
      console.log("Data from Flexmonster:", data);

      // Fetch and parse CSV data
      fetch(
        "https://raw.githubusercontent.com/fivethirtyeight/data/master/flying-etiquette-survey/flying-etiquette.csv"
      )
        .then((response) => response.text()) // Get the CSV as text
        .then((csvText) => {
          // Parse the CSV using csv-parse
          const records = parse(csvText, {
            columns: true, // Use the first row as column headers
            skip_empty_lines: true, // Skip empty lines
          });

          // Extract all questions containing the word "rude"
          const rudeQuestions = Object.keys(records[0]).filter((key) =>
            key.toLowerCase().includes("rude")
          );

          // Prepare data for the area chart
          let ageGroups: string[] = []; // Array to store unique age ranges

          records.forEach((row: any) => {
            const ageRange = row["Age"];
            if (ageGroups && !ageGroups.includes(ageRange)) { // Ensure it's not already in the array
              ageGroups.push(ageRange); // Add unique age range
            }
          });
          ageGroups.filter((ageGroup) => ageGroup != "")
          const customOrder = ['18-29', '30-44', '45-60', '> 60'];
          ageGroups = ageGroups.sort((a: any, b: any) => {
            return customOrder.indexOf(a) - customOrder.indexOf(b);
          });
          const seriesData = rudeQuestions.map((question) => {
            const seriesValues = ageGroups.map((age) => {
              const ageGroupRecords = records.filter(
                (row: any) => row["Age"] === age
              );
              const yesCount = ageGroupRecords.filter(
                (row: any) => row[question] && row[question].toLowerCase().includes("yes")
              ).length;
              const totalCount = ageGroupRecords.length;
              return totalCount > 0 ? (yesCount / totalCount) * 100 : 0; // Percentage
            });
            return {
              name: question,
              data: seriesValues,
            };
          });

          // Define the chart configuration
          data.chart = {
            type: "area", // Set chart type to area
          };

          data.title = {
            text: "Percentage of 'Yes' Responses by Age for Rude Questions",
          };

          data.xAxis = {
            categories: ageGroups, // Use age groups as x-axis categories
            title: {
              text: "Age", // Title for x-axis
            },
          };

          data.legend = {
            layout: 'horizontal', // Set legend layout to horizontal
            align: 'center', // Center the legend horizontally
            verticalAlign: 'bottom', // Position the legend at the bottom
            x: 0,
            y: 10, // Adjust the vertical position of the legend if needed
          }

          data.yAxis = {
            title: {
              text: "Percentage (%)", // Title for y-axis
            },
          };

          // Add data series for area chart
          data.series = seriesData;

          // Tooltip configuration
          data.tooltip = {
            shared: true, // Share tooltip between series
            valueSuffix: "%",
          };

          // Render the Highcharts area chart
          Highcharts.chart("chart-rude-questions", data);
        })
        .catch((error) => {
          console.error("Error fetching or parsing CSV:", error);
        });
    }
  );
}
