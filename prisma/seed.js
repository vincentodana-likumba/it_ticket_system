import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log("Seeding IT Support Ticket System database...");

  // Clear existing records
  await prisma.comment.deleteMany({});
  await prisma.ticket.deleteMany({});

  // Ticket 1
  const t1 = await prisma.ticket.create({
    data: {
      title: "SAP SD Module Access Authorization Error (Code: SAP-403)",
      description: "Newly onboarded Sales Representative (Jane Wanjiku) cannot access transaction code VA01 to create sales orders. Receiving error: 'No authorization for object V_VBAK_VKO'.",
      status: "In Progress",
      priority: "Critical",
      category: "Access & Permissions",
      department: "Sales",
      contactEmail: "j.wanjiku@maxim.com",
      requester: "Jane Wanjiku",
      assignedTo: "Senior IT Officer",
      impact: "Department",
      comments: {
        create: [
          {
            author: "Jane Wanjiku",
            authorRole: "User",
            content: "Hi IT team, I am unable to process customer orders this morning due to this authorization block.",
            isInternal: false,
          },
          {
            author: "Senior IT Officer",
            authorRole: "IT Support",
            content: "Investigating SAP role assignment. Checked BASIS authorization profiles.",
            isInternal: true,
          },
          {
            author: "Senior IT Officer",
            authorRole: "IT Support",
            content: "Hello Jane, we have submitted an approval request to your department head to add the Z_SD_ORDER_CREATE role to your SAP user account.",
            isInternal: false,
          }
        ]
      }
    }
  });

  // Ticket 2
  const t2 = await prisma.ticket.create({
    data: {
      title: "Wi-Fi Access Point Dropping Packets on 2nd Floor East Wing",
      description: "Multiple users in the Operations team report intermittent wireless disconnects every 15-20 minutes. Ethernet connections remain unaffected.",
      status: "Open",
      priority: "High",
      category: "Network & Connectivity",
      department: "Nairobi",
      contactEmail: "ops.team@maxim.com",
      requester: "David Kamau",
      assignedTo: "Network Tech Team",
      impact: "Department",
      comments: {
        create: [
          {
            author: "David Kamau",
            authorRole: "User",
            content: "It seems to happen whenever there are more than 15 laptops connected to AP-2E.",
            isInternal: false,
          }
        ]
      }
    }
  });

  // Ticket 3
  const t3 = await prisma.ticket.create({
    data: {
      title: "Dual 27-inch Monitor & Docking Station Procurement Request",
      description: "Requesting second monitor (HDMI/DisplayPort) and USB-C Thunderbolt docking station for financial reporting tasks.",
      status: "Open",
      priority: "Medium",
      category: "Hardware Request",
      department: "Finance",
      contactEmail: "m.njeri@maxim.com",
      requester: "Mary Njeri",
      assignedTo: null,
      impact: "Individual",
      comments: {
        create: [
          {
            author: "Mary Njeri",
            authorRole: "User",
            content: "Requisition form approved by CFO appended.",
            isInternal: false,
          }
        ]
      }
    }
  });

  // Ticket 4
  const t4 = await prisma.ticket.create({
    data: {
      title: "Microsoft 365 Outlook Client OST File Corruption",
      description: "Outlook crashes immediately upon opening with error 'Cannot start Microsoft Outlook. Cannot open the Outlook window. The set of folders cannot be opened.'",
      status: "In Progress",
      priority: "Medium",
      category: "Software Issue",
      department: "Hr",
      contactEmail: "hr.admin@maxim.com",
      requester: "Grace Ochieng",
      assignedTo: "Helpdesk Analyst",
      impact: "Individual",
      comments: {
        create: [
          {
            author: "Grace Ochieng",
            authorRole: "User",
            content: "I can access emails via web browser for now, but need desktop app working for PST archives.",
            isInternal: false,
          },
          {
            author: "Helpdesk Analyst",
            authorRole: "IT Support",
            content: "Rebuilding OST file in %LOCALAPPDATA%\\Microsoft\\Outlook. Remote session scheduled at 2:00 PM.",
            isInternal: false,
          }
        ]
      }
    }
  });

  // Ticket 5
  const t5 = await prisma.ticket.create({
    data: {
      title: "FortiClient VPN Authentication Multi-Factor Reset",
      description: "User changed mobile phone and needs FortiToken OTP re-enrolled for secure remote access.",
      status: "Resolved",
      priority: "Low",
      category: "Access & Permissions",
      department: "Security Section",
      contactEmail: "b.mwangi@maxim.com",
      requester: "Brian Mwangi",
      assignedTo: "Security Administrator",
      impact: "Individual",
      resolutionNotes: "Re-issued FortiToken activation QR code via encrypted email. User successfully authenticated.",
      comments: {
        create: [
          {
            author: "Security Administrator",
            authorRole: "IT Support",
            content: "Token reset completed. QR code dispatched to registered mobile number.",
            isInternal: false,
          },
          {
            author: "Brian Mwangi",
            authorRole: "User",
            content: "Confirmed, VPN connection successful! Thanks.",
            isInternal: false,
          }
        ]
      }
    }
  });

  // Ticket 6
  const t6 = await prisma.ticket.create({
    data: {
      title: "Zebra Barcode Scanner Driver Reinstallation for WMS Terminal #3",
      description: "Handheld USB barcode scanner not recognized by Warehouse Management System terminal after OS update.",
      status: "Resolved",
      priority: "High",
      category: "Hardware Request",
      department: "Warehouse",
      contactEmail: "wh.lead@maxim.com",
      requester: "Peter Otieno",
      assignedTo: "Hardware Specialist",
      impact: "Department",
      resolutionNotes: "Updated Zebra CDC USB Driver to v3.7.0 and reconfigured COM port mapping in WMS config file.",
      comments: {
        create: [
          {
            author: "Hardware Specialist",
            authorRole: "IT Support",
            content: "Installed updated VCP drivers and re-scanned programming barcodes.",
            isInternal: true,
          }
        ]
      }
    }
  });

  console.log(`Seeding finished successfully! Created tickets: ${t1.id.substring(0,8)}, ${t2.id.substring(0,8)}, ${t3.id.substring(0,8)}, ${t4.id.substring(0,8)}, ${t5.id.substring(0,8)}, ${t6.id.substring(0,8)}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
