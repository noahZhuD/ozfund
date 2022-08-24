var chartDom = document.getElementById('curve');
var myChart = echarts.init(chartDom);
var option = {
  xAxis: {
    type: 'category',
    data: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    axisLine: { show: false },
    axisLabel: {
      fontSize : 16,
      color: "#666666",
    },
  },
  yAxis: {
    type: 'value',
    show: false
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '0',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#0385F2',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(3,133,242,.1)' },
            { offset: 1, color: '#FFFFFF'},
          ],
          global: false // 缺省为 false
        }
      }
    }
  ]
};
option && myChart.setOption(option);

$('.graph_data_right li').click(function() {
  $(this).addClass('cur').siblings().removeClass('cur')
  console.log('点击了' + $(this).text())
})