<pre>
  <code>{history}</code>
</pre>
<form onsubmit={runQuery}>
  <input type="text" placeholder="Enter SQL query" />
  <button type="submit">Run</button>
</form>
<script>
	import { onMount, onDestroy } from 'svelte';

  let worker, history = '';

  onMount(async () => {
    if (window?.Worker) {
      const SqliteWorker = await import('$lib/sqliteWorker?worker');
      worker = new SqliteWorker.default();
      worker.onmessage = function (e) {
        if (e.data) {
          history += `\n${e.data}`;
        }
      };
    }
  });

  onDestroy(() => {
    worker?.terminate();
  });

  async function runQuery(e) {
    e.preventDefault(); // Prevent standard form submission behavior
    if (worker) {
      // TODO check if query already running, queue or block this one..
      history += `\n${e?.target?.[0]?.value}`;
      worker.postMessage(e?.target?.[0]?.value);
    }
  }
</script>