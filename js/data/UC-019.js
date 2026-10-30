/* UC-019: Manage Smart Charging Schedule
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-019",
  "name": "Manage Smart Charging Schedule",
  "actor": "Real-time Operations Operator",
  "goal": "The operator manages charging schedules and priorities to use limited charging resources efficiently.",
  "preconditions": "• The operator is logged in and authorized to manage smart charging. | • Charging requests and current charging-resource status are available.",
  "trigger": "The operator selects “Manage Smart Charging Schedule”.",
  "postconditions": "The current schedule and charging-priority decisions are recorded and displayed.",
  "stakeholders": "Real-time Operations Operator, Student, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Scheduling must respect charging-point capacity and avoid conflicting time-slot allocations. | • Vehicles with low battery levels or upcoming usage needs may receive higher priority according to the configured policy. | • Priority thresholds must be defined by the project’s business rules rather than assumed in the use case.",
  "assumptions": "The system can retrieve personal charging demand, shared-vehicle charging needs, and charging-point availability where those data are available.",
  "steps": [
    {
      "n": 1,
      "text": "The operator selects “Manage Smart Charging Schedule”."
    },
    {
      "n": 2,
      "text": "The system displays charging demand, available charging capacity, existing schedules, and relevant vehicle priorities."
    },
    {
      "n": 3,
      "text": "The system presents the current schedule or a proposed allocation based on the available demand and resource information."
    },
    {
      "n": 4,
      "text": "The operator reviews the schedule and confirms the allocation or priority decisions."
    },
    {
      "n": 5,
      "text": "The system validates the schedule against available capacity and time-slot conflicts."
    },
    {
      "n": 6,
      "text": "The system saves the valid schedule and displays the updated result."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Operator adjusts an existing schedule",
      "description": "If a schedule requires changes, the operator selects “Adjust a Charging Schedule”. The system runs that extension and returns to the updated schedule."
    },
    {
      "code": "A2",
      "title": "Demand exceeds available capacity",
      "description": "The system identifies requests that cannot be accommodated in the current period and presents supported alternatives, such as a later slot, another Hub, or a lower-priority allocation."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Charging-point status is unavailable",
      "description": "The system identifies the unavailable status data and avoids confirming allocations that rely on unverified capacity."
    },
    {
      "code": "E2",
      "title": "Schedule validation or saving fails",
      "description": "The system displays an error and preserves the previously saved schedule."
    }
  ],
  "sourceTitle": "UC-019: Manage Smart Charging Schedule",
  "category": "Dispatch & Network Monitoring",
  "decisionIndex": 4,
  "decisionText": "Does the allocation fit current capacity?",
  "sequence": {
    "parts": [
      "Real-time Operations Operator",
      "Operator UI",
      "Smart Charging Scheduler",
      "Charging Requests & Capacity"
    ],
    "messages": [
      [
        0,
        1,
        "Open Manage Smart Charging Schedule",
        "call"
      ],
      [
        1,
        2,
        "Request demand, capacity, schedules and priorities",
        "call"
      ],
      [
        2,
        3,
        "Retrieve charging requests and resource capacity",
        "call"
      ],
      [
        3,
        2,
        "Return queue and capacity data",
        "return"
      ],
      [
        2,
        2,
        "Prepare current/proposed allocation",
        "self"
      ],
      [
        2,
        1,
        "Display schedule proposal and priorities",
        "return"
      ],
      [
        0,
        1,
        "Review and confirm allocation/priority decisions",
        "call"
      ],
      [
        1,
        2,
        "Submit schedule for validation",
        "call"
      ],
      [
        2,
        3,
        "Check capacity and time-slot conflicts",
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
        3,
        "Save valid smart charging schedule",
        "call"
      ],
      [
        3,
        2,
        "Return updated schedule",
        "return"
      ],
      [
        2,
        1,
        "Display saved schedule",
        "return"
      ],
      [
        1,
        0,
        "Show updated result",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Smart charging schedule",
    "states": [
      "Charging Demand Loaded",
      "Schedule Proposed",
      "Operator Review",
      "Validating Allocation",
      "Smart Schedule Saved"
    ],
    "events": [
      "Load demand and capacity",
      "Prepare proposal",
      "Confirm decision",
      "Validation passes"
    ],
    "branches": [
      {
        "from": 3,
        "label": "Demand exceeds capacity",
        "name": "Alternative Allocation Needed",
        "returnTo": 1
      },
      {
        "from": 3,
        "label": "Status/validation unavailable",
        "name": "Previous Schedule Retained",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
