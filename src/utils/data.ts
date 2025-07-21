export const clients = [
  {
    id: 1,
    name: "Air India - Main Office",
    services: {
      "FTP Server": {
        status: "down",
        address: "http://ftp.airindia.com:21",
        details: "ECONNREFUSED: Connection refused",
      },
      "FileMaker OData API": {
        status: "down",
        address: "http://odata.airindia.com:200",
        details: "Timeout: API response took too long",
      },
      "Legacy Service": {
        status: "na",
        address: "",
        details: "Service not applicable for this client",
      },
      "Node.js Backend": {
        status: "down",
        address: "http://backend.airindia.com:200",
        details: "fetch failed - HTTP 500 Internal Server Error",
      },
      "Node.js Dev Server": {
        status: "na",
        address: "",
        details: "Development server not in use",
      },
    },
  },
  {
    id: 2,
    name: "IndiGo - Remote Site",
    services: {
      "FTP Server": {
        status: "down",
        address: "http://ftp.indigo.com:21",
        details: "fetch failed - DNS resolution failed",
      },
      "FileMaker OData API": {
        status: "down",
        address: "http://odata.indigo.com:500",
        details: "Service unavailable - HTTP 503",
      },
      "Legacy Service": {
        status: "na",
        address: "",
        details: "Retired legacy service",
      },
      "Node.js Backend": {
        status: "down",
        address: "http://localhost:9999",
        details: "Failed to fetch - ECONNRESET",
      },
      "Node.js Dev Server": {
        status: "na",
        address: "",
        details: "Not deployed on remote site",
      },
    },
  },
  {
    id: 3,
    name: "Vistara - Development",
    services: {
      "FTP Server": {
        status: "na",
        address: "",
        details: "FTP not required for dev",
      },
      "FileMaker OData API": {
        status: "up",
        address: "http://dev.odata.vistara.com:4000",
        details: "OK",
      },
      "Legacy Service": {
        status: "down",
        address: "http://legacy.vistara.com:3000",
        details: "fetch failed - legacy service expired certificate",
      },
      "Node.js Backend": {
        status: "na",
        address: "",
        details: "Backend service turned off for dev",
      },
      "Node.js Dev Server": {
        status: "down",
        address: "http://localhost:3000",
        details: "React Dev Server crashed unexpectedly",
      },
    },
  },
  {
    id: 4,
    name: "SpiceJet - Catering HQ",
    services: {
      "FTP Server": {
        status: "up",
        address: "http://ftp.spicejet.com:21",
        details: "OK",
      },
      "FileMaker OData API": {
        status: "up",
        address: "http://odata.spicejet.com:200",
        details: "OK",
      },
      "Legacy Service": {
        status: "up",
        address: "http://legacy.spicejet.com:8080",
        details: "OK",
      },
      "Node.js Backend": {
        status: "up",
        address: "http://backend.spicejet.com:4000",
        details: "OK",
      },
      "Node.js Dev Server": {
        status: "na",
        address: "",
        details: "Not deployed in production",
      },
    },
  },
  {
    id: 5,
    name: "AirAsia - Remote Kitchen",
    services: {
      "FTP Server": {
        status: "down",
        address: "http://ftp.airasia.com:21",
        details: "Connection timeout after 5 seconds",
      },
      "FileMaker OData API": {
        status: "down",
        address: "http://odata.airasia.com:200",
        details: "fetch failed - HTTP 403 Forbidden",
      },
      "Legacy Service": {
        status: "na",
        address: "",
        details: "Not used for this kitchen",
      },
      "Node.js Backend": {
        status: "down",
        address: "http://backend.airasia.com:3000",
        details: "fetch failed - Invalid JSON response",
      },
      "Node.js Dev Server": {
        status: "na",
        address: "",
        details: "Dev server not installed",
      },
    },
  },
];
