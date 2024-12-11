"use client"
import * as React from "react";
import type { Pivot } from "react-flexmonster";
import dynamic from "next/dynamic";
import createTravelFrequencyViolationChart from "../charts/travel-frequency-violations";
import createAgeVsSpeakingChart from "../charts/age-vs-speaking";
import createBabyRudenessByGenderChart from "../charts/babys-gender";
import createPassengerIncomeAgeScatterChart from "../charts/age-rudeness";
import createRudeQuestionsAreaChart from "../charts/age-rudeness";
import createLocationChart from "../charts/location";
import createLocationFrequencyChart from "../charts/location-frequency";
import createPassengersDemandChart from "../charts/passenger-demands";

// take general Flexmonster parameters and some special for Next.js
const PivotWrap = dynamic(() => import('@/app/PivotWrapper'), {
    ssr: false,
    loading: () => <h1>Loading Flexmonster...</h1>
});

// pivotRef provides a reference to the Flexmonster instance for accessing the Flexmonster API.
const ForwardRefPivot = React.forwardRef<Pivot, Flexmonster.Params>((props, ref?: React.ForwardedRef<Pivot>) =>
    <PivotWrap {...props} pivotRef={ref} />
)

ForwardRefPivot.displayName = 'ForwardRefPivot'; 

export default function WithHighcharts() {

    const pivotRef: React.RefObject<Pivot> = React.useRef<Pivot>(null);

    const reportComplete = () => {
        pivotRef.current!.flexmonster.off("reportComplete", reportComplete);
        createChart();
    }

    const createChart = () => {
      const updateCharts = () => {
        createLocationChart(pivotRef)
        createLocationFrequencyChart(pivotRef)
        createPassengersDemandChart(pivotRef)
        createTravelFrequencyViolationChart(pivotRef)
        createAgeVsSpeakingChart(pivotRef)
        createBabyRudenessByGenderChart(pivotRef)
        createPassengerIncomeAgeScatterChart(pivotRef)
        createRudeQuestionsAreaChart(pivotRef)
    }

    pivotRef.current!.flexmonster.on('dataChanged', updateCharts);
    pivotRef.current!.flexmonster.on('filterclose', updateCharts);

    updateCharts();
  };

  // Listen to Flexmonster data changes and trigger chart update
  React.useEffect(() => {
    if (pivotRef.current) {
        const pivot = pivotRef.current.flexmonster;

        // Trigger the chart update when data changes
        pivot.on('dataChanged', createChart);
        pivot.on('filterclose', createChart);

        return () => {
          pivot.off('dataChanged', createChart);
          pivot.off('filterclose', createChart);
        }
    }
}, [pivotRef]);

  React.useEffect(() => {
    if (pivotRef.current) {
      pivotRef.current.flexmonster.on('reportComplete', createChart);
      return () => pivotRef.current?.flexmonster.off('reportComplete', createChart);
    }
  }, []);

    return (
        <div className="App">
          <h1 className="page-title">How to create a report for airline company with React data visualization libraries</h1>            
  
          <div id="container1" className="">
            <div id="pivot-container" className="">
              <ForwardRefPivot
                ref={pivotRef}
                toolbar={true}
                beforetoolbarcreated={toolbar => {
                  toolbar.showShareReportTab = true;
                }}
                shareReportConnection={{
                  url: "https://olap.flexmonster.com:9500"
                }}
                width="100%"
                height={600}
                report = {{
                  dataSource: { 
                    type: "csv", 
                    // path to the dataset
                    filename: "https://raw.githubusercontent.com/fivethirtyeight/data/master/flying-etiquette-survey/flying-etiquette.csv" 
                  },
                }}
                licenseFilePath="https://cdn.flexmonster.com/jsfiddle.charts.key"
                reportcomplete={reportComplete}
                // insert your licenseKey below
                //licenseKey="XXXX-XXXX-XXXX-XXXX-XXXX"
              />
            </div>
          </div>

         
          <div className="chart-grid">
            <div className="chart-item">
              <h2>Location Distribution</h2>
              <div id="chart-location-distribution"></div>
            </div>
            <div className="chart-item">
              <h2>How passengers demands on others compare to their own expectations?</h2>
              <div id="chart-seat-recline-vs-obligation"></div>
            </div>
            <div className="chart-item">
              <h2>Who is more likely to violate rules based on flight frequency?</h2>
              <div id="chart-travel-frequency-violations"></div>
            </div>
            <div className="chart-item">
              <h2>Age and ease of communication</h2>
              <div id="chart-age-vs-speaking"></div>
            </div>
            <div className="chart-item">
              <h2>Attitude toward bringing babies on board by gender</h2>
              <div id="chart-baby-rudeness-gender"></div>
            </div>
            <div className="chart-item">
              <h2>Rude Questions</h2>
              <div id="chart-rude-questions"></div>
            </div>
            <div className="chart-item">
              <h2>Flight frequency among different local groups</h2>
              <div id="chart-location-to-frequency"></div>
            </div>
          </div>
        </div>
    );
}