/* UC-015: Coordinate Vehicle Redistribution
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-015",
  "name": "Coordinate Vehicle Redistribution",
  "actor": "Real-time Operations Operator",
  "goal": "The operator coordinates transfers of shared vehicles between Hubs to address shortages, surplus, or uneven distribution.",
  "preconditions": "• The operator is logged in and authorized to coordinate redistribution. | • Current Hub and vehicle status information is available.",
  "trigger": "The operator selects “Coordinate Vehicle Redistribution”, usually after reviewing network status or a recommendation.",
  "postconditions": "The redistribution plan is validated and recorded for operational execution.",
  "stakeholders": "Real-time Operations Operator, Student, Admin, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• A source Hub must have vehicles available for redistribution. | • A destination Hub must be able to accept the planned vehicles. | • The system must not treat a planned transfer as completed until the corresponding operational state is confirmed.",
  "assumptions": "Vehicle locations and Hub capacity are represented by current or simulated operational data.",
  "steps": [
    {
      "n": 1,
      "text": "The operator opens “Coordinate Vehicle Redistribution”."
    },
    {
      "n": 2,
      "text": "The system displays Hub vehicle counts, demand indicators, and relevant resource status."
    },
    {
      "n": 3,
      "text": "The operator identifies a source Hub with surplus vehicles and a destination Hub with a shortage."
    },
    {
      "n": 4,
      "text": "The operator selects the vehicles or quantity to be transferred and the destination Hub."
    },
    {
      "n": 5,
      "text": "The system checks source availability and destination capacity."
    },
    {
      "n": 6,
      "text": "The operator reviews and confirms the proposed redistribution plan."
    },
    {
      "n": 7,
      "text": "The system records the plan and displays its details for operational follow-up."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Another source or destination is selected",
      "description": "If the selected Hubs cannot support the proposed transfer, the operator chooses another source, destination, or transfer quantity. The system rechecks the revised plan."
    },
    {
      "code": "A2",
      "title": "No beneficial redistribution is identified",
      "description": "If current network conditions do not justify a transfer, the operator leaves the allocation unchanged and ends the use case."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Hub state changes before confirmation",
      "description": "If vehicle availability or destination capacity changes, the system revalidates the plan and asks the operator to revise it before saving."
    },
    {
      "code": "E2",
      "title": "Redistribution plan cannot be recorded",
      "description": "The system displays an error and does not report the plan as saved. The operator may retry."
    }
  ],
  "sourceTitle": "UC-015: Coordinate Vehicle Redistribution",
  "category": "Dispatch & Network Monitoring",
  "decisionIndex": 4,
  "decisionText": "Can the transfer be supported?",
  "sequence": {
    "parts": [
      "Real-time Operations Operator",
      "Operator UI",
      "Redistribution Service",
      "Hub & Vehicle State"
    ],
    "messages": [
      [
        0,
        1,
        "Open Coordinate Vehicle Redistribution",
        "call"
      ],
      [
        1,
        2,
        "Request vehicle counts, demand and resource status",
        "call"
      ],
      [
        2,
        3,
        "Retrieve Hub vehicle distribution and capacity",
        "call"
      ],
      [
        3,
        2,
        "Return current network values",
        "return"
      ],
      [
        2,
        1,
        "Display source/destination indicators",
        "return"
      ],
      [
        0,
        1,
        "Select surplus source, shortage destination and quantity",
        "call"
      ],
      [
        1,
        2,
        "Submit proposed transfer",
        "call"
      ],
      [
        2,
        3,
        "Check source availability and destination capacity",
        "call"
      ],
      [
        3,
        2,
        "Return validation result",
        "return"
      ],
      [
        2,
        1,
        "Display redistribution plan for review",
        "return"
      ],
      [
        0,
        1,
        "Confirm proposed plan",
        "call"
      ],
      [
        1,
        2,
        "Record redistribution plan",
        "call"
      ],
      [
        2,
        3,
        "Save confirmed plan",
        "call"
      ],
      [
        3,
        2,
        "Return saved plan details",
        "return"
      ],
      [
        2,
        1,
        "Display plan for operational follow-up",
        "return"
      ],
      [
        1,
        0,
        "Show confirmed plan",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Vehicle redistribution plan",
    "states": [
      "Redistribution Draft",
      "Source & Destination Selected",
      "Capacity Validated",
      "Plan Confirmed & Recorded",
      "Transfer Awaiting Operational Confirmation"
    ],
    "events": [
      "Start plan",
      "Select transfer",
      "Capacity and counts valid",
      "Operator confirms",
      "Operational data confirms transfer"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Capacity/source conflict",
        "name": "Revise Plan",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Network changes before confirm",
        "name": "Revalidation Required",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Plan save fails",
        "name": "Plan Not Recorded",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
