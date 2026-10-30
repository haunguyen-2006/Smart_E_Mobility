/* UC-022: Apply Coordination Recommendations
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-022",
  "name": "Apply Coordination Recommendations",
  "actor": "Strategic Simulation Operator",
  "goal": "The operator selects a coordination recommendation from a completed simulation and initiates its application after checking current operating conditions.",
  "preconditions": "• The operator is logged in and authorized to apply recommendations. | • A completed simulation with available coordination recommendations exists. | • Current operational status can be checked before applying a recommendation.",
  "trigger": "The operator selects “Apply Coordination Recommendations” from a simulation result.",
  "postconditions": "The chosen recommendation is recorded and the applicable operational workflow is initiated or updated.",
  "stakeholders": "Strategic Simulation Operator, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• A recommendation must be checked against current operating conditions before application. | • The system must distinguish a proposed recommendation from an action that has actually been applied. | • Recommendations involving vehicle redistribution must be handed to or run through the vehicle-redistribution workflow.",
  "assumptions": "Recommendations may involve vehicle redistribution or charging-schedule adjustments; the exact actions depend on the simulation result and available operational services.",
  "steps": [
    {
      "n": 1,
      "text": "The operator opens the recommendations associated with a completed simulation."
    },
    {
      "n": 2,
      "text": "The system displays the available recommendations and their predicted benefits or affected resources."
    },
    {
      "n": 3,
      "text": "The operator selects a recommendation to apply."
    },
    {
      "n": 4,
      "text": "The system checks the current network state and validates that the recommendation remains feasible."
    },
    {
      "n": 5,
      "text": "The operator reviews and confirms the application."
    },
    {
      "n": 6,
      "text": "The system records the decision and initiates the applicable operational workflow."
    },
    {
      "n": 7,
      "text": "The system displays the recommendation status and the next action or result available."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Recommendation requires vehicle redistribution",
      "description": "If the recommendation involves moving vehicles between Hubs, the system passes the proposed action to the vehicle-redistribution workflow. The Real-time Operations Operator validates and coordinates the transfer; no vehicle movement is treated as complete until the operational state is confirmed."
    },
    {
      "code": "A2",
      "title": "Operator declines the recommendation",
      "description": "The operator chooses not to apply the selected recommendation. The system leaves operational resource states unchanged and returns to the simulation results."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Current network state has changed",
      "description": "If current conditions make the recommendation invalid, the system does not apply it and informs the operator that the recommendation must be reviewed or simulated again."
    },
    {
      "code": "E2",
      "title": "Recommendation application fails",
      "description": "The system displays an error and does not report the recommendation as applied. The operator may retry or coordinate an alternative action."
    }
  ],
  "sourceTitle": "UC-022: Apply Coordination Recommendations",
  "category": "What-if Simulation",
  "decisionIndex": 3,
  "decisionText": "Is the recommendation still feasible?",
  "sequence": {
    "parts": [
      "Strategic Simulation Operator",
      "Simulation UI",
      "Recommendation Service",
      "Operational Workflow / Live State"
    ],
    "messages": [
      [
        0,
        1,
        "Open recommendations for completed simulation",
        "call"
      ],
      [
        1,
        2,
        "Request available recommendations",
        "call"
      ],
      [
        2,
        3,
        "Retrieve recommendations and affected resources",
        "call"
      ],
      [
        3,
        2,
        "Return recommendations and predicted benefits",
        "return"
      ],
      [
        2,
        1,
        "Display recommendation list",
        "return"
      ],
      [
        0,
        1,
        "Select recommendation to apply",
        "call"
      ],
      [
        1,
        2,
        "Validate recommendation against current state",
        "call"
      ],
      [
        2,
        3,
        "Check live operational conditions",
        "call"
      ],
      [
        3,
        2,
        "Return feasibility result",
        "return"
      ],
      [
        2,
        1,
        "Display validation result",
        "return"
      ],
      [
        0,
        1,
        "Confirm application",
        "call"
      ],
      [
        1,
        2,
        "Record decision and initiate workflow",
        "call"
      ],
      [
        2,
        3,
        "Start applicable operational workflow",
        "call"
      ],
      [
        3,
        2,
        "Return initiation/status information",
        "return"
      ],
      [
        2,
        1,
        "Display recommendation status and next action",
        "return"
      ],
      [
        1,
        0,
        "Show outcome",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Coordination recommendation",
    "states": [
      "Recommendation Available",
      "Recommendation Selected",
      "Checking Live Feasibility",
      "Recommendation Approved",
      "Workflow Initiated"
    ],
    "events": [
      "Open results",
      "Select recommendation",
      "Current state supports action",
      "Operator confirms",
      "Start operational workflow"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Conditions changed",
        "name": "Recommendation Stale",
        "returnTo": 0
      },
      {
        "from": 3,
        "label": "Operator declines",
        "name": "Recommendation Declined",
        "terminal": true
      },
      {
        "from": 3,
        "label": "Workflow initiation fails",
        "name": "Application Failed",
        "returnTo": 2
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
