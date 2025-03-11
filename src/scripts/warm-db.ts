import { colors } from '@/constants';
import { request, IncomingMessage } from 'http';

setInterval(() => {
  const req = request('http://localhost:3000/api/warmup', (res: IncomingMessage) => {
    const statusCode = res.statusCode || 0;
    const statusColor = statusCode < 300 ? colors.green : colors.red;
    console.log(`${colors.bright}${statusColor}Warmed database, status: ${statusCode}${colors.reset}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`${colors.cyan}Response: ${data}${colors.reset}`);
    });
  });

  req.on('error', (err: Error) => {
    console.error(`${colors.red}Warmup failed: ${err.message}${colors.reset}`);
  });

  req.end();
}, 120000);

console.log(`${colors.bright}${colors.magenta}Database warming started${colors.reset}`);
