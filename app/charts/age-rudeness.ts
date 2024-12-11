import { Pivot } from "react-flexmonster";
import * as Highcharts from "highcharts";
import { parse } from "csv-parse/sync";

export default function createRudeQuestionsAreaChart(pivotRef: React.RefObject<Pivot>) {
  const gridSlice = pivotRef.current!.flexmonster.getReport()?.slice as Flexmonster.Slice

  pivotRef.current?.flexmonster.highcharts?.getData(
    {
      type: "area", 
      slice: {
        rows: [{ uniqueName: "Age" }],
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
          // Parse the CSV using csv-parse
          const records = parse(csvText, {
            columns: true, // Use the first row as column headers
            skip_empty_lines: true, 
          });

          // Extract all questions containing the word "rude"
          const rudeQuestions = Object.keys(records[0]).filter((key) =>
            key.toLowerCase().includes("rude")
          );

          let ageGroups: string[] = [];

          records.forEach((row: any) => {
            const ageRange = row["Age"];
            if (ageGroups && !ageGroups.includes(ageRange)) {
              ageGroups.push(ageRange); 
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

          data.chart = {
            type: "area",
          };

          data.title = {
            text: "Percentage of 'Yes' Responses by Age for Rude Questions",
          };

          data.xAxis = {
            categories: ageGroups,
            title: {
              text: "Age",
            },
          };

          data.legend = {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 10, 
          }

          data.yAxis = {
            title: {
              text: "Percentage (%)", 
            },
          };

          data.series = seriesData;

          data.tooltip = {
            shared: true,
            valueSuffix: "%",
          };

          Highcharts.chart("chart-rude-questions", data);
        })
        .catch((error) => {
          console.error("Error fetching or parsing CSV:", error);
        });
    }
  );
}
