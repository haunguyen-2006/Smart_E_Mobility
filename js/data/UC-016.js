/* UC-016: Monitor Hub Network and Resource Status
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-016",
  "name": "Monitor Hub Network and Resource Status",
  "actor": "Real-time Operations Operator",
  "goal": "The operator monitors Hub and resource conditions to identify capacity risks, shortages, and operational problems.",
  "preconditions": "• The operator is logged in and authorized to monitor the network. | • Hub and resource status data is available from real or simulated sources.",
  "trigger": "The operator selects “Monitor Hub Network and Resource Status”.",
  "postconditions": "The system displays the current available network status and highlights conditions that may need attention.",
  "stakeholders": "Real-time Operations Operator, Student, Admin, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• The displayed status must distinguish current verified information from unavailable data. | • Capacity warnings must be based on configured capacity limits or operating rules.",
  "assumptions": "Available data can include vehicle counts and status, parking occupancy, charging-point availability, and Hub utilization.",
  "steps": [
    {
      "n": 1,
      "text": "The operator opens “Monitor Hub Network and Resource Status”."
    },
    {
      "n": 2,
      "text": "The system retrieves the latest available information for the Hubs and their resources."
    },
    {
      "n": 3,
      "text": "The system displays the network overview and the status of vehicles, parking spaces, charging points, and Hub utilization where available."
    },
    {
      "n": 4,
      "text": "The system highlights Hubs or resources that approach capacity limits or show abnormal status."
    },
    {
      "n": 5,
      "text": "The operator reviews a Hub or warning and determines whether further action is required."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Vehicle distribution is unbalanced",
      "description": "If monitoring identifies a shortage or surplus, the operator may activate “Coordinate Vehicle Redistribution”."
    },
    {
      "code": "A2",
      "title": "An operational incident is identified",
      "description": "If a resource issue requires intervention, the operator may activate “Handle Operational Incidents”."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Some status data is unavailable",
      "description": "The system marks the affected data as unavailable or stale and displays other verified information."
    },
    {
      "code": "E2",
      "title": "Network status service fails",
      "description": "The system informs the operator that monitoring data cannot currently be refreshed and allows a retry."
    }
  ],
  "sourceTitle": "UC-016: Monitor Hub Network and Resource Status",
  "category": "Dispatch & Network Monitoring",
  "decisionIndex": 1,
  "decisionText": "Is current status data available?",
  "sequence": {
    "parts": [
      "Real-time Operations Operator",
      "Operator UI",
      "Monitoring Service",
      "Telemetry & Resource Status"
    ],
    "messages": [
      [
        0,
        1,
        "Open Monitor Hub Network and Resource Status",
        "call"
      ],
      [
        1,
        2,
        "Request latest network overview",
        "call"
      ],
      [
        2,
        3,
        "Retrieve Hub and resource status",
        "call"
      ],
      [
        3,
        2,
        "Return current/available telemetry",
        "return"
      ],
      [
        2,
        2,
        "Evaluate capacity limits and abnormal states",
        "self"
      ],
      [
        2,
        1,
        "Build overview with warnings and stale-data labels",
        "return"
      ],
      [
        1,
        0,
        "Display network dashboard",
        "return"
      ],
      [
        0,
        1,
        "Select a Hub or warning",
        "call"
      ],
      [
        1,
        2,
        "Request details or next operational action",
        "call"
      ],
      [
        2,
        1,
        "Display status detail / action options",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Network monitoring view",
    "states": [
      "Dashboard Idle",
      "Refreshing Network Data",
      "Status Displayed",
      "Warnings Reviewed"
    ],
    "events": [
      "Open monitoring",
      "Data received",
      "Review dashboard"
    ],
    "branches": [
      {
        "from": 1,
        "label": "Some data stale/missing",
        "name": "Partial Status Displayed",
        "returnTo": 2
      },
      {
        "from": 1,
        "label": "Refresh service fails",
        "name": "Refresh Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
