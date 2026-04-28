import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import type { PerfHistory } from '../hooks/use-my-dashboard';

export function PerfChart({ data }: { data: PerfHistory }) {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true },
      fontFamily: 'inherit',
    },
    colors: ['#465fff', '#12b76a', '#94a3b8'],
    stroke: { curve: 'smooth', width: [3, 3, 2], dashArray: [0, 0, 6] },
    markers: { size: 5, strokeWidth: 2, hover: { sizeOffset: 2 } },
    xaxis: {
      categories: data.quarters,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontSize: '12px' } },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
        formatter: (v) => v.toFixed(1),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      labels: { colors: '#64748b' },
      markers: { size: 6, strokeWidth: 0 },
      itemMargin: { horizontal: 12 },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      padding: { left: 8, right: 8 },
    },
    tooltip: {
      y: { formatter: (v) => (v == null ? '—' : `${v.toFixed(1)} / 5`) },
    },
    dataLabels: { enabled: false },
  };
  const series = [
    { name: 'Self score', data: data.self },
    { name: 'Reviewer final', data: data.reviewer },
    { name: 'Calibrated', data: data.calibrated },
  ];
  return (
    <div className="h-full w-full">
      <Chart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
  );
}
