/**
 * Created by JackDan9 on 2018/4/26.
 */
$(function () {
    let cpuData = [];
    function toDisplayCPU(v) {
        return v.toFixed(2);
    }

    function toDisplayMem(v) {

        if (v >= (1024 * 1024 * 1024)) {
            v /= (1024 * 1024 * 1024);
            return v.toFixed(2) + "GB";
        }

        if (v >= (1024 * 1024)) {
            v /= (1024 * 1024);
            return v.toFixed(2) + "MB";
        }

        if (v >= 1024) {
            v /= 1024;
            return v.toFixed(2) + "KB";
        }

        return v;
    }

    function renderChart() {
        let chartOptions = {
            dataSource: cpuData,
            width: "700px",
            height: "500px",
            title: "System Performance",
            subtitle: "CPU utilization over time until present",
            horizontalZoomable: true,
            verticalZoomable: true,
            rightMargin: 30,
            legend: { element: "legend" },
            axes: [{
                type: 'categoryX',
                name: 'xAxis',
                label: 'displayTime',
                labelAngle: 45
            },{
                type: 'numericY',
                name: 'yAxis',
                title: 'CPU Utilization',
                minimumValue: 0,
                maximumValue: 100,
                formatLabel: toDisplayCPU
            }, {
                type: "numericY",
                name: 'yAxisMemory',
                title: 'Memory Utilization',
                labelLocation: "outsideRight",
                minimumValue: 0,
                maximumValue: 16 * 1024 * 1024 * 1024,
                interval: 1024 * 1024 * 1024,
                formatLabel: toDisplayMem,
                majorStroke: "transparent",
            }],
            series: [{
                name: "cpu",
                type: "line",
                xAxis: "xAxis",
                yAxis: "yAxis",
                valueMemberPath: 'cpuUsage',
                showTooltip: true,
                tooltipTemplate: "<div><em>CPU:</em>&nbsp;<span>${item.displayCPU}</span>",
                title: "CPU Utilization"
            }, {
                name: "mem",
                type: "line",
                xAxis: "xAxis",
                yAxis: "yAxisMemory",
                valueMemberPath: "usedMem",
                showTooltip: true,
                tooltipTemplate: "<div><em>Memory:</em>&nbsp;<span>${item.displayMem}</span></div>",
                title: "Memory Utilization"
            }, {
                name: "itemTooltips",
                type: "itemToolTipLayer",
                useInterpolation: false,
                transitionDuration: 300
            }]
        };
        $('#chart').igDataChart(chartOptions)
    }

    renderChart();

    let socket = io.connect("http://localhost:8080");

    socket.on('cpuUpdate', function (update) {
        let currTime = new Date();
        let displayString = currTime.toLocaleTimeString();
        update.displayCPU = toDisplayCPU(update.cpuUsage);
        update.displayMem = toDisplayMem(update.usedMem);
        update.displayTime = displayString;
        cpuData.push(update)
        $('#chart').igDataChart('notifyInsertItem', cpuData, cpuData.length - 1, update);
    });
});
