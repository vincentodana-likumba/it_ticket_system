import localtunnel from 'localtunnel';

const SUBDOMAIN = process.env.TUNNEL_SUBDOMAIN || 'maximagritticket';
const PORT = parseInt(process.env.PORT || '4000', 10);

async function start() {
  console.log(`\n======================================================`);
  console.log(`  Maxim Agri IT Support Desk - Remote URL Service`);
  console.log(`======================================================\n`);
  console.log(`Connecting to secure tunnel for port ${PORT}...`);
  console.log(`Requested Subdomain: ${SUBDOMAIN}`);

  try {
    const tunnel = await localtunnel({ port: PORT, subdomain: SUBDOMAIN });
    console.log(`\n======================================================`);
    console.log(`  SUCCESS! Live Global Remote URL:`);
    console.log(`  👉 ${tunnel.url}`);
    console.log(`======================================================\n`);
    console.log(`Share this exact URL to access the IT Ticket System from`);
    console.log(`any phone, remote office, or home network globally.`);
    console.log(`(Press Ctrl+C to close the tunnel)\n`);

    tunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting in 5s...');
      setTimeout(start, 5000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      try { tunnel.close(); } catch (e) {}
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
    console.log('Retrying in 10s...');
    setTimeout(start, 10000);
  }
}

start();
