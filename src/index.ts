import * as Highcharts from "highcharts";

import * as moment from "moment";

type SerieDataRow = [Date, number];

interface ISeries {
    [name: string]: Highcharts.IndividualSeriesOptions;
}

function get_or_init_series(series: ISeries, name: string): SerieDataRow[] {
    const ret = series[name];
    if (ret !== undefined) {
        return ret.data as SerieDataRow[];
    }
    const x = series[name] = {
        name,
        data: [],
    };
    return x.data;
}

async function draw_chart() {
    const response = await fetch("data.json");
    const input: [[string, string, number]] = await response.json();
    const series: ISeries = {};

    // convert input data to a format usable with Highcharts
    input.forEach(([input_time, name, value]) => {
        const time = moment(input_time, "YYYY-MM-DD HH:mm").toDate();
        const serie_data = get_or_init_series(series, name);
        serie_data.push([time, value]);
    });

    const data = [];
    for (const value of Object.values(series)) {
        data.push(value);
    }

    // create the chart
    Highcharts.chart("container", {
        chart: {
            type: "line",
            zoomType: "x",
        },
        series: data,
    });
}

draw_chart().then(console.log, console.error);
