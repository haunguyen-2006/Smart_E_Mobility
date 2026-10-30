/* UC-018: Adjust a Charging Schedule
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-018",
  "name": "Adjust a Charging Schedule",
  "actor": "Real-time Operations Operator",
  "goal": "The operator modifies an existing charging schedule to respond to updated demand, capacity, or vehicle priorities.",
  "preconditions": "• The operator is logged in and authorized to manage charging schedules. | • An existing charging schedule is available for adjustment.",
  "trigger": "The operator selects “Adjust a Charging Schedule” from the smart-charging management process.",
  "postconditions": "The valid schedule changes are saved and the updated schedule is displayed.",
  "stakeholders": "Real-time Operations Operator, Student, VNU-HCM Management",
  "priority": "Medium",
  "businessRules": "• A revised schedule must respect available charging capacity and avoid conflicting allocations. | • Priority changes must follow the configured smart-charging policy.",
  "assumptions": "The system maintains charging requests, resource availability, and existing schedule information.",
  "steps": [
    {
      "n": 1,
      "text": "The operator opens “Manage Smart Charging Schedule” and selects an existing schedule to adjust."
    },
    {
      "n": 2,
      "text": "The system displays the schedule, relevant charging demand, resource capacity, and current priorities."
    },
    {
      "n": 3,
      "text": "The operator changes the permitted time slots, allocation, or priority information."
    },
    {
      "n": 4,
      "text": "The system checks the proposed changes for capacity and scheduling conflicts."
    },
    {
      "n": 5,
      "text": "The operator reviews and confirms the valid changes."
    },
    {
      "n": 6,
      "text": "The system saves the adjusted schedule and displays a confirmation."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Proposed changes conflict with available capacity",
      "description": "The system identifies the conflict and suggests another supported time slot or allocation. The operator revises the proposal and submits it for validation again."
    },
    {
      "code": "A2",
      "title": "Operator cancels the adjustment",
      "description": "Before saving, the operator cancels the change. The existing schedule remains unchanged."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Current charging data cannot be retrieved",
      "description": "The system informs the operator that the schedule cannot be safely adjusted using unverified data."
    },
    {
      "code": "E2",
      "title": "Schedule update fails",
      "description": "The system displays an error and leaves the previously saved schedule unchanged."
    }
  ],
  "sourceTitle": "UC-018: Adjust a Charging Schedule",
  "category": "Dispatch & Network Monitoring",
  "decisionIndex": 3,
  "decisionText": "Are schedule changes conflict-free?",
  "sequence": {
    "parts": [
      "Real-time Operations Operator",
      "Operator UI",
      "Schedule Adjustment Service",
      "Charging Schedule & Capacity"
    ],
    "messages": [
      [
        0,
        1,
        "Open smart charging schedule and select one to adjust",
        "call"
      ],
      [
        1,
        2,
        "Request schedule, demand, capacity and priorities",
        "call"
      ],
      [
        2,
        3,
        "Retrieve current schedule and charging constraints",
        "call"
      ],
      [
        3,
        2,
        "Return schedule data",
        "return"
      ],
      [
        2,
        1,
        "Display current schedule",
        "return"
      ],
      [
        0,
        1,
        "Edit time slots, allocation or priority",
        "call"
      ],
      [
        1,
        2,
        "Submit proposed schedule change",
        "call"
      ],
      [
        2,
        3,
        "Check capacity and scheduling conflicts",
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
        "Display valid proposal or conflicts",
        "return"
      ],
      [
        0,
        1,
        "Review and confirm valid changes",
        "call"
      ],
      [
        1,
        2,
        "Save adjusted schedule",
        "call"
      ],
      [
        2,
        3,
        "Update saved schedule",
        "call"
      ],
      [
        3,
        2,
        "Return saved schedule",
        "return"
      ],
      [
        2,
        1,
        "Display adjustment confirmation",
        "return"
      ],
      [
        1,
        0,
        "Show updated schedule",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Charging schedule adjustment",
    "states": [
      "Existing Schedule",
      "Proposed Changes",
      "Validating Schedule",
      "Adjusted Schedule Saved"
    ],
    "events": [
      "Select schedule",
      "Edit slots/allocation/priority",
      "Checks pass"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Capacity conflict",
        "name": "Revise Proposal",
        "returnTo": 1
      },
      {
        "from": 1,
        "label": "Operator cancels",
        "name": "Existing Schedule Retained",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Data/save failure",
        "name": "Adjustment Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
