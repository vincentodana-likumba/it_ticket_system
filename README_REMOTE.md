# Maxim IT Ticket System - Remote Access Guide

Access the **Maxim Agri IT Support Desk System** from any device outside your local network (e.g. mobile phones on cellular 4G/5G data, home laptops, branch offices in Nairobi, Rwanda, and Tanzania).

---

## 🌐 Quick Direct Remote URLs

- **Direct Global Web URL**: **`https://maximagritticket.loca.lt`**
- **Internal Network Address**: `http://192.168.88.33:4000`
- **Local IP**: `http://localhost:4000`
- **Public IP Address**: `197.254.118.118`
- **Application Port**: `4000`
- **Urgent Help Desk Call Line**: `0704488632`

---

## 🚀 Direct Approach: Live Branded Remote URL (Zero Router Config)

We have configured a dedicated tunnel with the exact subdomain **`maximagritticket`**:

### How to Start:
1. Open the `it_ticket_system` folder.
2. Double-click **`start_remote_tunnel.bat`**.
3. It will connect and host:
   👉 **`https://maximagritticket.loca.lt`**

### 🔑 First-time Access Verification (Localtunnel Security Check):
When opening `https://maximagritticket.loca.lt` in a browser for the first time:
1. It may ask for your **Endpoint IP** / **Tunnel Password**.
2. Enter your machine's Public IP: **`197.254.118.118`**
3. Click **Click to Submit**.
4. The IT Ticket Desk will load immediately and remain active.

---

## 🛡️ Method 2: Direct Router Port Forwarding

If you prefer direct IP routing:

### 1. Allow Windows Firewall Traffic
Double-click `open_firewall.bat` in `it_ticket_system` (click **Yes** on Administrator prompt).

### 2. Router Forwarding Settings
- **Service Name**: `MaximITTicketSystem`
- **Protocol**: `TCP`
- **External Port**: `4000`
- **Internal IP**: `192.168.88.33`
- **Internal Port**: `4000`

### 3. Access Remotely
From any cellular phone or remote network:
`http://197.254.118.118:4000`

---

## 📞 Urgent Support Line
For critical outages or SAP posting blocks:
Call Helpdesk directly at **0704488632**.
