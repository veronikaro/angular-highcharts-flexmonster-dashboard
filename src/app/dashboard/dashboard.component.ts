import { Component, OnInit, ViewChild } from "@angular/core";
import { FlexmonsterPivot } from "ng-flexmonster";
import * as Highcharts from "highcharts";

declare var require: any;
/* For working with Highcharts maps */
const HC_map = require("highcharts/modules/map");
HC_map(Highcharts);
require("./js/usamap")(Highcharts);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("pivot") pivot: FlexmonsterPivot;
  @ViewChild("pivot2") pivot2: FlexmonsterPivot;

  public pivotReport = {
    dataSource: {
      filename: "./assets/data/covid_19_clean_complete.csv",
      mapping: {
        "Province/State": {
          caption: "Province/State",
          type: "string",
        },
        "Country/Region": {
          caption: "Country/Region",
          type: "string",
        },
        Lat: {
          caption: "Lat",
          type: "number",
        },
        Long: {
          caption: "Long",
          type: "number",
        },
        Date: {
          caption: "Date",
          type: "date string",
        },
        Confirmed: {
          caption: "Confirmed",
          type: "number",
        },
        Deaths: {
          caption: "Deaths",
          type: "number",
        },
        Recovered: {
          caption: "Recovered",
          type: "number",
        },
        Active: {
          caption: "Active",
          type: "number",
        },
        "WHO Region": {
          caption: "WHO Region",
          type: "string",
        },
      },
    },
    slice: {
      rows: [
        {
          uniqueName: "Date",
          filter: {
            query: {
              last: "month",
            },
          },
        },
      ],
      columns: [
        {
          uniqueName: "Country/Region",
          filter: {
            members: ["country/region.[us]"],
          },
        },
        {
          uniqueName: "[Measures]",
        },
      ],
      measures: [
        {
          uniqueName: "Active",
          aggregation: "sum",
        },
        {
          uniqueName: "Recovered",
          aggregation: "sum",
        },
        {
          uniqueName: "Confirmed",
          aggregation: "sum",
        },
        {
          uniqueName: "Deaths",
          aggregation: "sum",
        },
      ],
    },
    options: {
      grid: {
        showGrandTotals: "columns",
      },
    },
  };

  public reportUSA = {
    dataSource: {
      filename:
        "./assets/data/2019-novel-coronavirus-covid-19-2019-ncov-data-repository-confirmed-cases-in-the-us.csv",
      mapping: {
        province_state: {
          type: "string",
          caption: "Province/State",
        },
        country_region: {
          type: "string",
          caption: "Country/Region",
        },
        lat: {
          type: "string",
        },
        long: {
          type: "string",
        },
        date: {
          type: "date",
          caption: "Date",
        },
        confirmed: {
          type: "number",
          caption: "Confirmed",
        },
      },
    },
    slice: {
      reportFilters: [
        {
          uniqueName: "country_region",
        },
      ],
      rows: [
        {
          uniqueName: "province_state",
          filter: {
            exclude: [
              "province_state.[grand princess]",
              "province_state.[diamond princess]",
            ],
          },
        },
      ],
      columns: [
        {
          uniqueName: "date.Month",
        },
        {
          uniqueName: "[Measures]",
        },
      ],
      measures: [
        {
          uniqueName: "confirmed",
          aggregation: "sum",
        },
      ],
    },
    conditions: [
      {
        formula: "#value > 2044129",
        measure: "confirmed",
        format: {
          backgroundColor: "#df3800",
          color: "#FFFFFF",
          fontFamily: "Arial",
          fontSize: "12px",
        },
      },
    ],
  };

  public theme: Highcharts.Options = {
    colors: ["#00A45A", "#DF3800", "#FFB800", "#6D3BD8", "#0075FF"],
    chart: {},
    title: {
      style: {
        color: "#000",
        font: 'bold 16px "Roboto", sans-serif',
      },
    },
    subtitle: {
      style: {
        color: "#666666",
        font: 'bold 12px "Roboto", sans-serif',
      },
    },
    legend: {
      itemStyle: {
        font: '9pt "Roboto", sans-serif',
        color: "black",
      },
      itemHoverStyle: {
        color: "gray",
      },
    },
  };

  ngOnInit(): void {
    Highcharts.setOptions(this.theme);
  }

  onFirstReportComplete(): void {
    this.pivot.flexmonster.off("reportcomplete");
    this.createLineChart();
    this.createBubbleChart();
  }

  onSecondReportComplete(): void {
    this.pivot2.flexmonster.off("reportcomplete");
    this.createMap();
  }

  createLineChart(): void {
    this.pivot.flexmonster.highcharts.getData(
      {
        type: "line",
      },
      function (chartConfig) {
        Highcharts.chart(
          "linechart-container",
          <Highcharts.Options>chartConfig
        );
      },
      function (chartConfig) {
        Highcharts.chart(
          "linechart-container",
          <Highcharts.Options>chartConfig
        );
      }
    );
  }

  createBubbleChart(): void {
    this.pivot.flexmonster.highcharts.getData(
      {
        type: "bubble",
        slice: {
          rows: [
            {
              uniqueName: "Country/Region",
              filter: {
                measure: {
                  uniqueName: "Active",
                  aggregation: "sum",
                },
                query: {
                  top: 10,
                },
              },
            },
          ],
          columns: [
            {
              uniqueName: "WHO Region",
            },
            {
              uniqueName: "[Measures]",
            },
          ],
          measures: [
            {
              uniqueName: "Active",
              aggregation: "sum",
            },
            {
              uniqueName: "Recovered",
              aggregation: "sum",
            },
          ],
        },
      },
      function (chartConfig) {
        chartConfig["tooltip"] = {
          useHTML: true,
          headerFormat: "<table>",
          pointFormat:
            '<tr><th colspan="2"><h3>Country: {point.name}</h3></th></tr>' +
            "<tr><th>WHO Region:</th><td>{series.name}</td></tr>" +
            "<tr><th>Active cases:</th><td>{point.y}</td></tr>" +
            "<tr><th>Recovered:</th><td>{point.z}</td></tr>",
          footerFormat: "</table>",
          followPointer: true,
        };
        Highcharts.chart(
          "bubblechart-container",
          <Highcharts.Options>chartConfig
        );
      },
      function (chartConfig) {
        chartConfig["tooltip"] = {
          useHTML: true,
          headerFormat: "<table>",
          pointFormat:
            '<tr><th colspan="2"><h3>Country: {point.name}</h3></th></tr>' +
            "<tr><th>WHO Region:</th><td>{series.name}</td></tr>" +
            "<tr><th>Active cases:</th><td>{point.y}</td></tr>" +
            "<tr><th>Recovered:</th><td>{point.z}</td></tr>",
          footerFormat: "</table>",
          followPointer: true,
        };
        Highcharts.chart(
          "bubblechart-container",
          <Highcharts.Options>chartConfig
        );
      }
    );
  }

  createMap(): void {
    let codesMap = new Map([
      ["Alabama", "AL"],
      ["Alaska", "AK"],
      ["American Samoa", "AS"],
      ["Arizona", "AZ"],
      ["Arkansas", "AR"],
      ["California", "CA"],
      ["Colorado", "CO"],
      ["Connecticut", "CT"],
      ["Delaware", "DE"],
      ["District of Columbia", "DC"],
      ["Florida", "FL"],
      ["Georgia", "GA"],
      ["Guam", "GU"],
      ["Hawaii", "HI"],
      ["Idaho", "ID"],
      ["Illinois", "IL"],
      ["Indiana", "IN"],
      ["Iowa", "IA"],
      ["Kansas", "KS"],
      ["Kentucky", "KY"],
      ["Louisiana", "LA"],
      ["Maine", "ME"],
      ["Maryland", "MD"],
      ["Massachusetts", "MA"],
      ["Michigan", "MI"],
      ["Minnesota", "MN"],
      ["Mississippi", "MS"],
      ["Missouri", "MO"],
      ["Montana", "MT"],
      ["Nebraska", "NE"],
      ["Nevada", "NV"],
      ["New Hampshire", "NH"],
      ["New Jersey", "NJ"],
      ["New Mexico", "NM"],
      ["New York", "NY"],
      ["North Carolina", "NC"],
      ["North Dakota", "ND"],
      ["Northern Mariana Islands", "MP"],
      ["Ohio", "OH"],
      ["Oklahoma", "OK"],
      ["Oregon", "OR"],
      ["Pennsylvania", "PA"],
      ["Puerto Rico", "PR"],
      ["Rhode Island", "RI"],
      ["South Carolina", "SC"],
      ["South Dakota", "SD"],
      ["Tennessee", "TN"],
      ["Texas", "TX"],
      ["Utah", "UT"],
      ["Vermont", "VT"],
      ["Virgin Islands", "VI"],
      ["Virginia", "VA"],
      ["Washington", "WA"],
      ["West Virginia", "WV"],
      ["Wisconsin", "WI"],
      ["Wyoming", "WY"],
    ]);

    this.pivot2.flexmonster.highcharts.getData(
      {
        type: "column",
        slice: {
          rows: [
            {
              uniqueName: "province_state",
              filter: {
                exclude: [
                  "province_state.[grand princess]",
                  "province_state.[diamond princess]",
                ],
              },
            },
          ],
          columns: [
            {
              uniqueName: "[Measures]",
            },
          ],
          measures: [
            {
              uniqueName: "confirmed",
              aggregation: "sum",
            },
          ],
        },
      },
      function (chartConfig, rawData) {
        const mapData: Array<any> = [];
        const categories: string[] = chartConfig["xAxis"].categories;
        const series: number[] = chartConfig["series"][0].data;
        const seriesName = chartConfig["yAxis"][0].title.text;
        /* Adding codes of states to processed data */
        categories.forEach((category, index) => {
          let code = codesMap.get(category);
          code = code.toLowerCase();
          const code_us = `us-${code}`;
          const _record = [code_us, series[index]];
          mapData.push(_record);
        });
        const chartMap = {
          chart: {
            map: "countries/us/us-all",
            height: 500,
          },
          title: {
            text: "Cases by states",
          },
          subtitle: {
            text: "USA",
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              alignTo: "spacingBox",
            },
          },
          colorAxis: {
            min: 0,
          },
          series: [
            {
              name: seriesName,
              states: {
                hover: {
                  color: "#BADA55",
                },
              },
              dataLabels: {
                enabled: true,
                format: "{point.name}",
              },
              allAreas: false,
              data: mapData,
            },
          ],
        };
        Highcharts.mapChart("map-container", <Highcharts.Options>chartMap);
      },
      function (chartConfig, rawData) {
        const mapData: Array<any> = [];
        const categories: string[] = chartConfig["xAxis"].categories;
        const series: number[] = chartConfig["series"][0].data;
        const seriesName = chartConfig["yAxis"][0].title.text;
        /* Adding codes of states to processed data */
        categories.forEach((category, index) => {
          let code = codesMap.get(category);
          code = code.toLowerCase();
          const code_us = `us-${code}`;
          const _record = [code_us, series[index]];
          mapData.push(_record);
        });

        const chartMap = {
          chart: {
            map: "countries/us/us-all",
            height: 500,
          },
          title: {
            text: "Cases by states",
          },
          subtitle: {
            text: "USA",
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              alignTo: "spacingBox",
            },
          },
          colorAxis: {
            min: 0,
          },
          series: [
            {
              name: seriesName,
              states: {
                hover: {
                  color: "#BADA55",
                },
              },
              dataLabels: {
                enabled: true,
                format: "{point.name}",
              },
              allAreas: false,
              data: mapData,
            },
          ],
        };
        Highcharts.mapChart("map-container", <Highcharts.Options>chartMap);
      }
    );
  }
}
