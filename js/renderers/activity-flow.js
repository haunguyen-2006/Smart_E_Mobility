/* Activity-flow presentation rules. They only affect how selected source steps are visualized. */
window.SmartMobilityActivityFlow = (() => {
const activityFlowOverrides = {
  "UC-003": {
    replace: {4: "The system validates the required information."},
    insertAfter: {4: "The system records the valid problem report."},
    decisionIndex: 4,
    decisionText: "Are the required report details complete?"
  },
  "UC-004": {
    replace: {3: "The system retrieves matching Hubs based on the search criteria."},
    insertAfter: {3: "The system displays matching Hubs with their basic information."},
    decisionIndex: 3,
    decisionText: "Were any matching Hubs found?"
  },
  "UC-010": {
    replace: {5: "The system validates the request and checks the available charging capacity."},
    insertAfter: {5: "The system records the valid charging demand for smart-schedule processing."},
    decisionIndex: 5,
    decisionText: "Is the charging request valid and feasible?"
  },
  "UC-022": {
    secondaryDecisionIndex: 5,
    secondaryDecisionText: "Did the operational workflow start?",
    secondaryRetryIndex: 5,
    secondaryErrorText: "The system shows an error, does not report the recommendation as applied, and allows retry or coordination of an alternative action."
  }
};
function activityFlow(u){
  const model=activityFlowOverrides[u.id];
  if(!model) return {steps:u.steps, decisionIndex:u.decisionIndex, decisionText:u.decisionText};
  const steps=[];
  u.steps.forEach((step,i)=>{
    steps.push({...step, text:model.replace?.[i] ?? step.text});
    if(model.insertAfter && Object.prototype.hasOwnProperty.call(model.insertAfter,i))
      steps.push({n:steps.length+1,text:model.insertAfter[i],activityInserted:true});
  });
  return {
    steps,
    decisionIndex:model.decisionIndex ?? u.decisionIndex,
    decisionText:model.decisionText ?? u.decisionText,
    secondaryDecisionIndex:model.secondaryDecisionIndex,
    secondaryDecisionText:model.secondaryDecisionText,
    secondaryRetryIndex:model.secondaryRetryIndex,
    secondaryErrorText:model.secondaryErrorText
  };
}
  return { activityFlow };
})();
