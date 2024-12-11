import { Pivot } from "react-flexmonster";
import * as Highcharts from "highcharts";
import { parse } from "csv-parse/sync";

export default function createBabyRudenessGenderPieChart(pivotRef: React.RefObject<Pivot>) {
  const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

  pivotRef.current?.flexmonster.highcharts?.getData(
    {
      type: "pie",
      slice: {
        rows: [{ uniqueName: "Gender" }],
        columns: [], 
        measures: [
          {
            uniqueName: "RespondentID",
            aggregation: "count", 
          },
        ],
        reportFilters: gridSlice.reportFilters
      },
    },
    (data: any) => {
      fetch(
        "https://raw.githubusercontent.com/fivethirtyeight/data/master/flying-etiquette-survey/flying-etiquette.csv"
      )
        .then((response) => response.text())
        .then((csvText) => {
          const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
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

          data.chart = {
            type: "pie",
          };
          data.legend = {
            layout: 'horizontal',
            align: 'center', 
            verticalAlign: 'bottom',
            x: 0,
            y: 10, 
          }

          data.title = {
            text: "Gender distribution of 'Yes, very rude' responses to question: 'Is it rude to bring unruly babies onboard?'",
          };

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

          data.tooltip = {
            pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y})",
          };

          Highcharts.chart("chart-baby-rudeness-gender", data);
        })
        .catch((error) => {
          console.error("Error fetching or parsing CSV:", error);
        });
    }
  );
}
