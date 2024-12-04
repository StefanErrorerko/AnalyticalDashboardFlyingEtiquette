import { Pivot } from "react-flexmonster";
import * as Highcharts from "highcharts";
import { parse } from "csv-parse/sync";

export default function createBabyRudenessGenderPieChart(
  pivotRef: React.RefObject<Pivot>
) {
  pivotRef.current?.flexmonster.highcharts?.getData(
    {
      type: "pie", // Set chart type to 'pie'
      slice: {
        rows: [{ uniqueName: "Gender" }], // Rows represent gender
        columns: [], // No need for columns in pie chart
        measures: [
          {
            uniqueName: "RespondentID", // Measure to count occurrences
            aggregation: "count", // Aggregate by count
          },
        ],
      },
    },
    (data: any) => {
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

          // Filter data for "Yes, very rude" responses by gender
          const maleCount = records.filter(
            (row: any) =>
              row["In general, is itrude to bring a baby on a plane?"] === "Yes, very rude" &&
              row["Gender"] === "Male"
          ).length;

          const femaleCount = records.filter(
            (row: any) =>
              row["In general, is itrude to bring a baby on a plane?"] === "Yes, very rude" &&
              row["Gender"] === "Female"
          ).length;

          // Update data series for the pie chart
          data.chart = {
            type: "pie", // Set chart type to pie
          };
          data.legend = {
            layout: 'horizontal', // Set legend layout to horizontal
            align: 'center', // Center the legend horizontally
            verticalAlign: 'bottom', // Position the legend at the bottom
            x: 0,
            y: 10, // Adjust the vertical position of the legend if needed
          }

          data.title = {
            text: "Gender distribution of 'Yes, very rude' responses to question: 'Is it rude to bring unruly babies onboard?'",
          };

          // Prepare pie chart data
          data.series = [
            {
              name: "Gender",
              colorByPoint: true,
              data: [
                { name: "Male", y: maleCount, color: "#1E90FF" },
                { name: "Female", y: femaleCount, color: "#FF69B4" },
              ],
            },
          ];

          // Tooltip configuration
          data.tooltip = {
            pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y})",
          };

          // Render the Highcharts pie chart
          Highcharts.chart("chart-baby-rudeness-gender", data);
        })
        .catch((error) => {
          console.error("Error fetching or parsing CSV:", error);
        });
    }
  );
}
