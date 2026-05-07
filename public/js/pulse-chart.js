/**
 * Pulse Chart Component for Weekly Attendance Visualization
 * Shows attendance patterns like heart rate pulses
 */

class AttendancePulseChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      width: options.width || 800,
      height: options.height || 300,
      weeksToShow: options.weeksToShow || 12,
      ...options
    };
    this.canvas = null;
    this.ctx = null;
  }

  async loadData(companyId, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/reports/attendance/${companyId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to load attendance data');
      
      this.data = await response.json();
      this.processData();
      return true;
    } catch (error) {
      console.error('Error loading attendance data:', error);
      return false;
    }
  }

  processData() {
    // Group attendance by week and day
    this.weeklyData = {};
    
    this.data.forEach(record => {
      const date = new Date(record.check_in);
      const week = this.getWeekNumber(date);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const key = `${date.getFullYear()}-W${week}`;

      if (!this.weeklyData[key]) {
        this.weeklyData[key] = {
          week: week,
          year: date.getFullYear(),
          days: {},
          total: 0
        };
      }

      if (!this.weeklyData[key].days[day]) {
        this.weeklyData[key].days[day] = 0;
      }
      
      this.weeklyData[key].days[day]++;
      this.weeklyData[key].total++;
    });
  }

  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  render() {
    this.setupCanvas();
    this.drawPulseChart();
  }

  setupCanvas() {
    // Clear container
    this.container.innerHTML = '';

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d');

    this.container.appendChild(this.canvas);
    this.addLegend();
  }

  drawPulseChart() {
    const ctx = this.ctx;
    const padding = 60;
    const chartWidth = this.canvas.width - 2 * padding;
    const chartHeight = this.canvas.height - 2 * padding;

    // Background
    ctx.fillStyle = window.getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, chartWidth, chartHeight);

    // Grid lines
    this.drawGrid(padding, chartHeight);

    // Data points
    this.drawPulses(padding, chartHeight);

    // Axes
    this.drawAxes(padding, chartWidth, chartHeight);
  }

  drawGrid(startX, chartHeight) {
    const ctx = this.ctx;
    const weeks = Object.keys(this.weeklyData).sort();
    const stepX = this.canvas.width - 120;
    const itemWidth = stepX / weeks.length;

    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;

    // Vertical grid lines
    weeks.forEach((week, index) => {
      const x = 60 + (index + 0.5) * itemWidth;
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, 60 + chartHeight);
      ctx.stroke();
    });

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = 60 + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(this.canvas.width - 60, y);
      ctx.stroke();
    }
  }

  drawPulses(startX, chartHeight) {
    const ctx = this.ctx;
    const weeks = Object.keys(this.weeklyData).sort();
    const maxAttendance = Math.max(...weeks.map(w => this.weeklyData[w].total || 1));
    const stepX = this.canvas.width - 120;
    const itemWidth = stepX / weeks.length;

    weeks.forEach((week, index) => {
      const data = this.weeklyData[week];
      const x = 60 + (index + 0.5) * itemWidth;
      const height = (data.total / maxAttendance) * chartHeight * 0.8;
      const y = 60 + chartHeight - height;

      // Draw pulse bars (like heart rate pulses)
      this.drawPulseBar(x, y, height, data.total, maxAttendance);

      // Draw week label
      ctx.fillStyle = '#666';
      ctx.font = '12px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`W${data.week}`, x, 60 + chartHeight + 25);
    });
  }

  drawPulseBar(x, y, height, value, max) {
    const ctx = this.ctx;
    const barWidth = 20;

    // Gradient color based on attendance percentage
    const percentage = (value / max) * 100;
    const color = this.getColorForPercentage(percentage);

    // Draw main bar
    ctx.fillStyle = color;
    ctx.fillRect(x - barWidth / 2, y, barWidth, height);

    // Draw glow effect
    ctx.fillStyle = color + '33';
    ctx.fillRect(x - barWidth / 2 - 5, y - 5, barWidth + 10, height + 10);

    // Add pulse animation effect (visual indicator)
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 2; i++) {
      const r = barWidth / 2 + i * 5;
      ctx.globalAlpha = 1 - (i / 3);
      ctx.beginPath();
      ctx.arc(x, y + height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Value label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(value, x, y - 10);
  }

  drawAxes(startX, chartWidth, chartHeight) {
    const ctx = this.ctx;

    // Y-axis label
    ctx.save();
    ctx.translate(30, startX + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#666';
    ctx.font = 'bold 12px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('عدد الحاضرين', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.fillStyle = '#666';
    ctx.font = 'bold 12px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('الأسابيع', this.canvas.width / 2, this.canvas.height - 15);
  }

  getColorForPercentage(percentage) {
    if (percentage >= 90) return '#28a745'; // Green
    if (percentage >= 70) return '#667eea'; // Blue
    if (percentage >= 50) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  }

  addLegend() {
    const legend = document.createElement('div');
    legend.style.cssText = `
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 20px;
      flex-wrap: wrap;
      font-family: Cairo, sans-serif;
      font-size: 12px;
    `;

    const items = [
      { color: '#28a745', label: 'ممتاز (90%+)' },
      { color: '#667eea', label: 'جيد (70-90%)' },
      { color: '#ffc107', label: 'متوسط (50-70%)' },
      { color: '#dc3545', label: 'ضعيف (-50%)' }
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.style.cssText = `display: flex; gap: 8px; align-items: center;`;
      div.innerHTML = `
        <div style="width: 16px; height: 16px; background: ${item.color}; border-radius: 2px;"></div>
        <span>${item.label}</span>
      `;
      legend.appendChild(div);
    });

    this.container.appendChild(legend);
  }
}

// Usage example:
/*
const chart = new AttendancePulseChart('#pulseChartContainer', {
  width: 800,
  height: 300
});

await chart.loadData(companyId, '2026-01-01', '2026-02-14');
chart.render();
*/
