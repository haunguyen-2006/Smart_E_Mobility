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
      "description": "The operator declines at the confirmation step. The system records the recommendation as declined, leaves operational resource states unchanged, and returns to the simulation results."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Current network state has changed",
      "description": "If current conditions make the recommendation invalid, the system does not apply it and informs the operator that it must be reviewed or simulated again. The operator can choose another recommendation or return to the results."
    },
    {
      "code": "E2",
      "title": "Recommendation application fails",
      "description": "If the applicable operational workflow cannot be initiated, the system displays an error and does not report the recommendation as applied. The operator may retry or coordinate an alternative action."
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
      "Live Operational State",
      "Operational Workflow Service",
      "Saved Simulation Results"
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
        5,
        "Retrieve recommendations and affected resources",
        "call"
      ],
      [
        5,
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
        "[Failure: current network state changed] Return recommendation no longer feasible",
        "return"
      ],
      [
        2,
        1,
        "[Failure: current network state changed] Do not apply; require review or a new simulation",
        "return"
      ],
      [
        1,
        0,
        "[Failure: current network state changed] Offer another recommendation or return to results",
        "return"
      ],
      [
        3,
        2,
        "[If current conditions still support the recommendation] Return feasibility result",
        "return"
      ],
      [
        2,
        1,
        "[If recommendation remains feasible] Display validation result",
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
        4,
        "Start applicable operational workflow",
        "call"
      ],
      [
        4,
        2,
        "[Failure: workflow cannot be initiated] Return workflow initiation error",
        "return"
      ],
      [
        2,
        1,
        "[Failure: workflow cannot be initiated] Show error; do not report recommendation as applied",
        "return"
      ],
      [
        1,
        0,
        "[Failure: workflow cannot be initiated] Offer retry or coordinate an alternative action",
        "return"
      ],
      [
        4,
        2,
        "[If workflow starts] Return initiation/status information",
        "return"
      ],
      [
        2,
        1,
        "[If workflow starts] Display recommendation status and next action",
        "return"
      ],
      [
        1,
        0,
        "Show outcome",
        "return"
      ]
    ],
    "branches": [
      {
        "title": "Live conditions changed; recommendation is no longer feasible",
        "messages": [
          [3, 2, "Return changed live conditions", "return"],
          [2, 1, "Reject stale recommendation", "return"],
          [1, 0, "Explain that review or a new simulation is needed", "return"]
        ]
      },
      {
        "title": "Operator declines at confirmation",
        "messages": [
          [0, 1, "Decline recommendation", "call"],
          [1, 2, "Record declined decision; leave live resources unchanged", "call"],
          [2, 1, "Return declined status", "return"],
          [1, 0, "Return to simulation results", "return"]
        ]
      },
      {
        "title": "Operational workflow initiation fails",
        "messages": [
          [4, 2, "Return workflow initiation failure", "return"],
          [2, 1, "Report failure; do not mark recommendation applied", "return"],
          [1, 0, "Offer retry or coordination of an alternative action", "return"]
        ]
      }
    ]
  },
  "state": {
    "subject": "Coordination recommendation",
    "states": [
      "Recommendation Available",
      "Recommendation Selected",
      "Checking Live Feasibility",
      "Awaiting Operator Confirmation",
      "Application Confirmed",
      "Workflow Initiated"
    ],
    "events": [
      "Operator selects a recommendation",
      "System checks current network state",
      "Recommendation remains feasible",
      "Operator confirms application",
      "Operational workflow is initiated"
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
        "from": 4,
        "label": "Workflow initiation fails",
        "name": "Application Failed",
        "returnTo": 3
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
