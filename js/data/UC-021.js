/* UC-021: Compare What-if Scenarios
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-021",
  "name": "Compare What-if Scenarios",
  "actor": "Strategic Simulation Operator",
  "goal": "The operator compares completed simulation scenarios to understand their relative impact on the mobility network.",
  "preconditions": "• The operator is logged in and authorized to compare scenarios. | • At least two comparable simulation results are available.",
  "trigger": "The operator selects “Compare What-if Scenarios”, usually after running simulations.",
  "postconditions": "The system displays a comparison of the selected scenarios and their predicted impacts.",
  "stakeholders": "Strategic Simulation Operator, Real-time Operations Operator, VNU-HCM Management",
  "priority": "Medium",
  "businessRules": "• The system must identify which scenarios are being compared. | • Comparisons must distinguish simulation outcomes from actual live network status.",
  "assumptions": "Stored simulation results include enough information to compare relevant impacts, such as capacity, resource utilization, vehicle distribution, or charging demand.",
  "steps": [
    {
      "n": 1,
      "text": "The operator selects “Compare What-if Scenarios”."
    },
    {
      "n": 2,
      "text": "The system displays the completed scenarios available for comparison."
    },
    {
      "n": 3,
      "text": "The operator selects two or more scenarios to compare."
    },
    {
      "n": 4,
      "text": "The system checks that the selected results are available and sufficiently comparable."
    },
    {
      "n": 5,
      "text": "The system displays a side-by-side comparison of predicted network impacts and relevant recommendations."
    },
    {
      "n": 6,
      "text": "The operator reviews the results and identifies the scenario or recommendation to examine further."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Fewer than two scenarios are available",
      "description": "The system informs the operator that more completed scenarios are needed. The operator may run another simulation or leave the comparison screen."
    },
    {
      "code": "A2",
      "title": "Operator changes the scenario selection",
      "description": "The operator selects a different combination of completed scenarios, and the system refreshes the comparison."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "A selected result is unavailable",
      "description": "The system identifies the unavailable result and asks the operator to select another completed scenario."
    },
    {
      "code": "E2",
      "title": "Comparison cannot be generated",
      "description": "The system displays an error and does not present the incomplete comparison as successful."
    }
  ],
  "sourceTitle": "UC-021: Compare What-if Scenarios",
  "category": "What-if Simulation",
  "decisionIndex": 3,
  "decisionText": "Are selected scenarios comparable?",
  "sequence": {
    "parts": [
      "Strategic Simulation Operator",
      "Simulation UI",
      "Comparison Service",
      "Saved Simulation Results"
    ],
    "messages": [
      [
        0,
        1,
        "Open Compare What-if Scenarios",
        "call"
      ],
      [
        1,
        2,
        "Request completed scenarios",
        "call"
      ],
      [
        2,
        3,
        "Retrieve saved simulation results",
        "call"
      ],
      [
        3,
        2,
        "Return available scenarios",
        "return"
      ],
      [
        2,
        1,
        "Display scenario list",
        "return"
      ],
      [
        0,
        1,
        "Select two or more scenarios",
        "call"
      ],
      [
        1,
        2,
        "Submit selected scenario IDs",
        "call"
      ],
      [
        2,
        3,
        "Verify results and comparability",
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
        2,
        "Compute side-by-side impact comparison",
        "self"
      ],
      [
        2,
        1,
        "Display comparative impacts and recommendations",
        "return"
      ],
      [
        1,
        0,
        "Show comparison for review",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Scenario comparison",
    "states": [
      "Scenario Selection",
      "Validating Results",
      "Comparison Displayed",
      "Results Reviewed"
    ],
    "events": [
      "Select scenarios",
      "At least two comparable results",
      "Comparison generated"
    ],
    "branches": [
      {
        "from": 1,
        "label": "Fewer than two scenarios",
        "name": "More Scenarios Required",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Selected result unavailable",
        "name": "Change Selection",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Comparison generation fails",
        "name": "Comparison Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
