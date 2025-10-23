
// app.js — loads CSV and renders 3 charts using Chart.js
(() => {
  const csvInput = document.getElementById('csvFile');
  const downloadSampleBtn = document.getElementById('downloadSample');

  let lineChart, barChart, pieChart;

  // Helper: parse date strings to Date objects (try multiple formats)
  function parseDate(s) {
    const d = new Date(s);
    if (!isNaN(d)) return d;
    // fallback dd/mm/yyyy or yyyy-mm-dd
    const parts = s.split(/[-\/\.]/);
    if (parts.length === 3) {
      // guess yyyy-mm-dd or dd-mm-yyyy
      if (parts[0].length === 4) return new Date(parts[0], parts[1]-1, parts[2]);
      else return new Date(parts[2], parts[1]-1, parts[0]);
    }
    return new Date(s);
  }

  function aggregateByDate(rows) {
    // expects rows: [{date, category, value}, ...]
    const map = new Map();
    rows.forEach(r => {
      const d = parseDate(r.date);
      if (isNaN(d)) return;
      const key = d.toISOString().slice(0,10);
      const v = parseFloat(r.value) || 0;
      map.set(key, (map.get(key)||0) + v);
    });
    // sort by date
    const entries = Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
    return {
      labels: entries.map(e=>e[0]),
      values: entries.map(e=>e[1]),
    };
  }

  function aggregateByCategory(rows) {
    const map = new Map();
    rows.forEach(r=>{
      const cat = r.category || 'Unknown';
      const v = parseFloat(r.value) || 0;
      map.set(cat, (map.get(cat)||0)+v);
    });
    const entries = Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
    return {labels: entries.map(e=>e[0]), values: entries.map(e=>e[1])};
  }

  function renderLine(labels, values) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(ctx, {
      type: 'line',
      data: {labels, datasets: [{label:'Total', data: values, fill:true, tension:0.2}]},
      options: {
        responsive:true,
        plugins: {legend:{display:false}},
        scales: {x:{display:true}, y:{display:true}}
      }
    });
  }

  function renderBar(labels, values) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
      type: 'bar',
      data: {labels, datasets: [{label:'By Category', data: values}]},
      options:{responsive:true, plugins:{legend:{display:false}}}
    });
  }

  function renderPie(labels, values) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type:'pie',
      data:{labels, datasets:[{data: values}]},
      options:{responsive:true}
    });
  }

  function loadData(rows) {
    // clean rows: ensure keys lowercased
    const clean = rows.map(r=>{
      const keys = Object.keys(r);
      const obj = {};
      keys.forEach(k=>{
        obj[k.trim().toLowerCase()] = r[k];
      });
      return {date: obj.date || obj['time'] || '', category: obj.category || obj.cat || '', value: obj.value || obj.amount || '0'};
    });

    const byDate = aggregateByDate(clean);
    const byCat = aggregateByCategory(clean);

    renderLine(byDate.labels, byDate.values);
    renderBar(byCat.labels, byCat.values);
    renderPie(byCat.labels, byCat.values);
  }

  function handleFile(file) {
    Papa.parse(file, {
      header:true,
      dynamicTyping:false,
      skipEmptyLines:true,
      complete: function(results){
        if (results && results.data && results.data.length) {
          loadData(results.data);
        } else {
          alert('No data found in CSV.');
        }
      },
      error: function(err){
        console.error('CSV parse error', err);
        alert('Failed to parse CSV: ' + err.message);
      }
    });
  }

  csvInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if (f) handleFile(f);
  });

  // load sample.csv by default via fetch
  fetch('sample.csv').then(r=>r.text()).then(txt=>{
    Papa.parse(txt, {header:true, skipEmptyLines:true, complete:function(res){ if(res.data) loadData(res.data); }});
  }).catch(()=>{/* ignore if not available */});

  downloadSampleBtn.addEventListener('click', ()=>{
    fetch('sample.csv').then(r=>r.blob()).then(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample.csv';
      a.click();
      URL.revokeObjectURL(url);
    }).catch(()=>alert('sample.csv not available'));
  });

})();
