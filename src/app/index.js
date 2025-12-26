const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const TIMEZONES = {
  Калининград: 'Europe/Kaliningrad', // UTC+2
  Москва: 'Europe/Moscow', // UTC+3
  Новосибирск: 'Asia/Novosibirsk', // UTC+7
  Владивосток: 'Asia/Vladivostok', // UTC+10
};

function getTimeInTimezone(timezone) {
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  };

  const date = new Date();
  const formatter = new Intl.DateTimeFormat('ru-RU', options);
  return formatter.format(date);
}

function getUTCOffset(timezone) {
  const date = new Date();
  const options = { timeZone: timezone, timeZoneName: 'short' };
  const formatter = new Intl.DateTimeFormat('ru-RU', options);
  const parts = formatter.formatToParts(date);
  const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
  return timeZoneName;
}

app.get('/', (req, res) => {
  let timeCardsHTML = '';
  for (const [city, timezone] of Object.entries(TIMEZONES)) {
    const time = getTimeInTimezone(timezone);
    const offset = getUTCOffset(timezone);

    timeCardsHTML += `
      <div class="time-card">
         <h2>🌍<br>${city}</h2>
        <div class="time">${time}</div>
        <div class="offset">${offset}</div>
      </div>
    `;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Часовые пояса России - CI/CD Проект МИФИ</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        
        .header h1 {
          font-size: 2.5em;
          margin-bottom: 15px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .header p {
          font-size: 1.1em;
          opacity: 0.9;
        }
        
        .ci-cd-badge {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          margin-top: 10px;
          font-weight: bold;
        }
        
        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }
        
        .time-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        
        .time-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .time-card h2 {
          color: #667eea;
          margin-bottom: 20px;
          font-size: 1.8em;
        }
        
        .time {
          font-size: 1.3em;
          color: #333;
          margin: 15px 0;
          padding: 15px;
          background: #f7f7f7;
          border-radius: 10px;
          font-weight: 500;
        }
        
        .offset {
          color: #666;
          font-size: 0.95em;
          margin-top: 10px;
          font-style: italic;
        }
        
        .footer {
          text-align: center;
          color: white;
          margin-top: 40px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        
        .footer p {
          margin: 8px 0;
        }
        
        .status {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 6px 14px;
          border-radius: 15px;
          font-size: 0.9em;
          margin-top: 10px;
        }
        
        .refresh-btn {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 12px 30px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-size: 1em;
        }
        
        .refresh-btn:hover {
          background: #667eea;
          color: white;
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.8em;
          }
          
          .time-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕐 Часовые пояса России</h1>
          <p>Текущее время в разных регионах Российской Федерации</p>
          <span class="ci-cd-badge">✓ CI/CD Automated</span>
        </div>
        
        <div class="time-grid">
          ${timeCardsHTML}
        </div>
        
        <div class="footer">
          <p><strong>📚 НИЯУ МИФИ - Основы технологического конвейера</strong></p>
          <p><strong>Домашнее задание №2:</strong> Настройка CI/CD в GitHub Actions</p>
          <span class="status">✓ Приложение работает корректно</span>
          <br>
          <button class="refresh-btn" onclick="location.reload()">🔄 Обновить время</button>
        </div>
      </div>
      
      <script>
        // Автообновление каждые 30 секунд
        setTimeout(() => {
          location.reload();
        }, 30000);
      </script>
    </body>
    </html>
  `);
});

app.get('/api/time', (req, res) => {
  const times = {};
  for (const [city, timezone] of Object.entries(TIMEZONES)) {
    times[city] = {
      time: getTimeInTimezone(timezone),
      timezone: timezone,
      offset: getUTCOffset(timezone),
    };
  }

  res.json({
    success: true,
    data: times,
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Сервер запущен!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`✅ Готов к CI/CD автоматизации\n`);
  });
}
