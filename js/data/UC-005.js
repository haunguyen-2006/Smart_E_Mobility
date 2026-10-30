/* UC-005: View Hub Status
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-005",
  "name": "View Hub Status",
  "actor": "Student",
  "goal": "The student checks the current status and resource availability of a selected Mobility Hub.",
  "preconditions": "• The selected Hub exists in the system. | • The system can access available Hub status information.",
  "trigger": "The student selects “View Hub Status” for a Hub, usually from the search results.",
  "postconditions": "The system displays the latest available status information for the selected Hub.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• The system must distinguish unavailable or unverified data from confirmed current status. | • The information shown should reflect the latest data available to the system.",
  "assumptions": "Status information may come from sensors or simulated data and may include vehicle availability, battery levels, parking occupancy, charging-point availability, and Hub utilization.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects a Hub and requests its status."
    },
    {
      "n": 2,
      "text": "The system retrieves the latest available status information for that Hub."
    },
    {
      "n": 3,
      "text": "The system displays relevant vehicle availability, battery levels, parking occupancy, charging-point availability, and Hub utilization where available."
    },
    {
      "n": 4,
      "text": "The student reviews the information and returns to the search results or continues with another available service."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Hub has limited or no available resources",
      "description": "If resources are limited or unavailable, the system shows the current availability so that the student can consider another Hub."
    },
    {
      "code": "A2",
      "title": "Student proceeds to book a shared vehicle",
      "description": "If the student chooses to book a shared vehicle after viewing Hub status, the system activates “Book Shared Vehicle” as shown by the current diagram. The student continues with vehicle selection."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Hub status data is unavailable",
      "description": "The system informs the student that current status cannot be retrieved and does not present missing data as confirmed."
    },
    {
      "code": "E2",
      "title": "Only partial status data is available",
      "description": "The system identifies unavailable information and displays the remaining verified status data where useful."
    }
  ],
  "sourceTitle": "UC-005: View Hub Status",
  "category": "Hub Search & Discovery Services",
  "decisionIndex": 1,
  "decisionText": "Is status data available?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Hub Status Service",
      "Resource Status Data"
    ],
    "messages": [
      [
        0,
        1,
        "Select a Hub and request status",
        "call"
      ],
      [
        1,
        2,
        "Request latest Hub status",
        "call"
      ],
      [
        2,
        3,
        "Retrieve vehicle, parking and charging status",
        "call"
      ],
      [
        3,
        2,
        "Return available status data",
        "return"
      ],
      [
        2,
        2,
        "Check freshness and data completeness",
        "self"
      ],
      [
        2,
        1,
        "Return status overview",
        "return"
      ],
      [
        1,
        0,
        "Display verified resource status",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Hub status viewing",
    "states": [
      "Hub Selected",
      "Retrieving Status",
      "Status Displayed"
    ],
    "events": [
      "Request status",
      "Status data received"
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
        "label": "Status unavailable",
        "name": "Status Retrieval Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
