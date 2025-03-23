<script>
	import { onMount, onDestroy } from 'svelte';
	import { Chart, LineController, LineElement, PointElement, CategoryScale,
    LinearScale, TimeScale, Decimation, Tooltip, } from 'chart.js';
  import '$lib/chartjs-adapter-dayjs';

	let canvas, hideText = true, worker;
	Chart.register(LineController, LineElement, PointElement, CategoryScale,
    LinearScale, TimeScale, Decimation, Tooltip);

	onMount(async () => {
    const SqliteWorker = (await import('$lib/sqliteWorker?worker')).default;
    worker = new SqliteWorker();
    worker.onmessage = async e => {
      if (e.data === 'ready') {
        worker?.postMessage('SELECT date,aqi FROM aqi LIMIT 8;');
      } else {
        new Chart(canvas, {
    			type: 'line',
		    	data: {
    				datasets: [{
		    			data: e.data.map(([x, y]) => ({x: x * 1000, y}))
				    }]
			    },
			    options: {
            parsing: false,
            animation: {
              duration: 0,
              onComplete: () => {
                // uncomment for Lighthouse test
                // hideText = false;
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time', // 'linear'
                // min: 0,
                // max: 1
              },
              y: {
                // min: 0,
                // max: 5
              }
            },
            plugins: {
              tooltip: {
                enabled: true,
              },
              // decimation: {
              //   enabled: true,
              //   algorithm: 'lttb'
              // }
            }
          }
        });
      }
    };
	});

  onDestroy(() => worker?.terminate());
</script>

<div style="position: relative; width: 100vw; height: 100vh;">
	<p style={hideText ? 'display: none;' : ''}>Loaded chart</p>
	<canvas bind:this={canvas} />
</div>
