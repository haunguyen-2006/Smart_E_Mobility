SMART E-MOBILITY HUB — MODULAR DIAGRAM STUDIO
================================================

START HERE
----------
1. Keep the complete folder structure together.
2. Open index.html in Chrome or Microsoft Edge.
3. Do not open only index.html after moving it away from the css/ and js/ folders.
4. No Internet connection, Node.js, or third-party libraries are required.

PROJECT STRUCTURE
-----------------
index.html
  Main page markup and local script loading order.

css/styles.css
  All visual styling: colors, typography, responsive layout, navigation, cards,
  tabs, gallery and print styles.

js/data/UC-001.js ... UC-023.js
  One file per Use Case. Edit the relevant data object here. Keep the object
  structure and field names consistent with the other Use Cases.

js/shared.js
  Shared SVG/text helpers used by all diagram renderers.

js/renderers/sequence.js
  Sequence Diagram layout and SVG generation.

js/renderers/activity.js
  Activity Diagram layout and SVG generation.

js/renderers/activity-flow.js
  Presentation-only flow adjustments for selected Activity Diagrams.

js/renderers/state.js
  State-chart layout and SVG generation.

js/app.js
  Navigation, search, subsystem filtering, tabs, gallery, source scenario
  details, print and SVG export.

reference/
  Exact original single-file HTML kept as a rollback reference.

EDITING GUIDE
-------------
- To edit one Use Case's wording, scenario, sequence participants/messages,
  activity steps/branches, or state model: edit only js/data/UC-xxx.js.
- To change the layout for every Activity Diagram: edit js/renderers/activity.js.
- To change the layout for every State-chart: edit js/renderers/state.js.
- To change the layout for every Sequence Diagram: edit js/renderers/sequence.js.
- To change shared text wrapping, SVG sizing, or arrow definitions: edit
  js/shared.js.
- To change colors, spacing, fonts or responsive behavior: edit css/styles.css.
- To change search, navigation, tabs, gallery or export behavior: edit js/app.js.

REBUILD A SINGLE-FILE VERSION
-----------------------------
If you need a portable one-file HTML again:
1. Open a terminal/PowerShell in this folder.
2. Run: python build_single_file.py
3. The script creates Smart_E_Mobility_Diagrams_Single_File.html.
The builder uses only Python's standard library.

IMPORTANT
---------
- Keep all 23 UC data files and the renderer files together.
- Script order in index.html is intentional: UC data first, then shared helpers,
  renderers, and finally the app controller.
- If you add or remove a Use Case, update the script list in index.html and the
  expected-count check in js/app.js.
- State-chart models are workflow interpretations where the source Use Case
  does not define a formal state machine. Confirm such assumptions with the team.




Smart_E_Mobility_Diagram_Studio_Modular/
│
├── index.html
├── README.txt
├── manifest.json
├── build_single_file.py
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── shared.js
│   │
│   ├── data/
│   │   ├── UC-001.js
│   │   ├── UC-002.js
│   │   ├── ...
│   │   └── UC-023.js
│   │
│   └── renderers/
│       ├── sequence.js
│       ├── activity.js
│       ├── activity-flow.js
│       └── state.js
│
├── reference/
│   └── Original_Source.html
│
└── Smart_E_Mobility_Diagrams_Single_File.html
