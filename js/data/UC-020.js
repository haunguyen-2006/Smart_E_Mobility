/* UC-020: Run a What-if Simulation
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-020",
  "name": "Run a What-if Simulation",
  "actor": "Strategic Simulation Operator",
  "goal": "The operator simulates a hypothetical mobility-network scenario to assess its effects before applying operational changes.",
  "preconditions": "• The Strategic Simulation Operator is logged in and authorized to run simulations. | • A current or simulated baseline state of the network is available.",
  "trigger": "The operator selects “Run a What-if Simulation”.",
  "postconditions": "The simulation results and relevant coordination recommendations are generated and displayed without directly changing operational resource states.",
  "stakeholders": "Strategic Simulation Operator, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• A simulation must use a defined baseline state and valid scenario parameters. | • Simulation results must be distinguished from actual operational state. | • Running a simulation must not itself move vehicles or alter actual parking or charging allocations.",
  "assumptions": "Supported scenarios may include a demand surge, a Hub reaching capacity, increased charging demand, charging-point outages, or vehicle concentration at one Hub.",
  "steps": [
    {
      "n": 1,
      "text": "The Strategic Simulation Operator selects “Run a What-if Simulation”."
    },
    {
      "n": 2,
      "text": "The system displays the available scenario inputs and the current or selected baseline network state."
    },
    {
      "n": 3,
      "text": "The operator selects a scenario type and enters the assumptions or parameters to evaluate."
    },
    {
      "n": 4,
      "text": "The system validates the scenario inputs."
    },
    {
      "n": 5,
      "text": "The system simulates the network response and evaluates the impact on Hub capacity, resource utilization, vehicle distribution, or charging demand as applicable."
    },
    {
      "n": 6,
      "text": "The system displays the predicted results and coordination recommendations."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Operator compares scenarios",
      "description": "After a simulation is completed, the operator selects “Compare What-if Scenarios”. The comparison use case evaluates the selected simulation results."
    },
    {
      "code": "A2",
      "title": "Operator applies a recommendation",
      "description": "After reviewing the results, the operator selects “Apply Coordination Recommendations” for a chosen recommendation, subject to current operational validation."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Scenario inputs are invalid or incomplete",
      "description": "The system identifies the input that needs correction and allows the operator to revise the scenario."
    },
    {
      "code": "E2",
      "title": "Simulation cannot be completed",
      "description": "If the baseline data or simulation service is unavailable, the system displays an error and does not present incomplete results as a successful simulation."
    }
  ],
  "sourceTitle": "UC-020: Run a What-if Simulation",
  "category": "What-if Simulation",
  "decisionIndex": 3,
  "decisionText": "Are scenario inputs valid?",
  "sequence": {
    "parts": [
      "Strategic Simulation Operator",
      "Simulation UI",
      "Simulation Coordinator",
      "Simulation Engine (logical)"
    ],
    "messages": [
      [
        0,
        1,
        "Open Run a What-if Simulation",
        "call"
      ],
      [
        1,
        2,
        "Request scenario inputs and baseline state",
        "call"
      ],
      [
        2,
        3,
        "Load selected/current baseline and scenario options",
        "call"
      ],
      [
        3,
        2,
        "Return baseline and options",
        "return"
      ],
      [
        2,
        1,
        "Display scenario setup",
        "return"
      ],
      [
        0,
        1,
        "Select scenario and enter assumptions/parameters",
        "call"
      ],
      [
        1,
        2,
        "Submit scenario inputs",
        "call"
      ],
      [
        2,
        2,
        "Validate scenario parameters",
        "self"
      ],
      [
        2,
        3,
        "Run network simulation",
        "call"
      ],
      [
        3,
        2,
        "Return predicted impacts and recommendations",
        "return"
      ],
      [
        2,
        1,
        "Display simulation results",
        "return"
      ],
      [
        1,
        0,
        "Show results for review",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "What-if simulation run",
    "states": [
      "Scenario Draft",
      "Validating Inputs",
      "Simulation Running",
      "Results Available"
    ],
    "events": [
      "Configure scenario",
      "Inputs valid",
      "Simulation completes"
    ],
    "branches": [
      {
        "from": 1,
        "label": "Invalid inputs",
        "name": "Input Correction Required",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Baseline/service unavailable",
        "name": "Simulation Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
