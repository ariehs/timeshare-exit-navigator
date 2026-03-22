module.exports=[93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},29936,e=>e.a(async(t,a)=>{try{let t=await e.y("@anthropic-ai/sdk-ecc607bf42a87dbf");e.n(t),a()}catch(e){a(e)}},!0),19107,e=>e.a(async(t,a)=>{try{var n=e.i(29936),i=t([n]);[n]=i.then?(await i)():i;let s=new n.default({apiKey:process.env.ANTHROPIC_API_KEY});e.s(["CLAUDE_MODEL",0,"claude-sonnet-4-5","anthropic",0,s]),a()}catch(e){a(e)}},!1),72039,e=>{"use strict";let t=`You are a document analysis assistant for Timeshare Exit Navigator, 
a consumer education platform. Your role is to help timeshare owners understand their contracts and options.

CRITICAL RULES:
1. NEVER provide legal advice or represent yourself as an attorney
2. NEVER make predictions about legal outcomes or success probabilities
3. NEVER fabricate or infer facts not explicitly stated in the document
4. ALWAYS attach confidence scores (0.0–1.0) to every extracted fact
5. ALWAYS label the source of information: DOCUMENT, USER_STATED, or AI_ANALYSIS
6. ALWAYS include this disclaimer on any analysis: "This is educational information only, not legal advice"
7. NEVER recommend specific attorneys or make referral promises
8. ALWAYS note when information is MISSING from the document
9. When in doubt, express uncertainty rather than guess
10. Flag any language that appears to be misrepresentation or high-pressure tactics`,a=`Analyze this timeshare contract document and extract the following information as structured JSON.

ONLY extract facts explicitly stated in the document. If a field is not found, set it to null and note it in missing_items.

Return a JSON object with this exact structure:
{
  "facts": {
    "purchase_date": "ISO date string or null",
    "purchase_price": "number or null",
    "developer_name": "string or null",
    "resort_name": "string or null",
    "resort_state": "two-letter state code or null",
    "contract_number": "string or null",
    "unit_type": "string or null",
    "points_or_weeks": "POINTS or WEEKS or null",
    "annual_points": "number or null",
    "maintenance_fee_annual": "number or null",
    "maintenance_fee_frequency": "MONTHLY or ANNUAL or null",
    "loan_balance": "number or null",
    "interest_rate": "number or null",
    "rescission_period_days": "number or null",
    "rescission_deadline": "ISO date string or null",
    "deed_type": "DEEDED or RIGHT_TO_USE or null",
    "perpetuity_clause": "boolean or null",
    "heirs_obligation": "boolean or null",
    "transfer_restrictions": "string or null",
    "exit_provisions": "string or null",
    "special_assessment_history": "string or null"
  },
  "clauses": [
    {
      "id": "unique string",
      "type": "RESCISSION | MAINTENANCE_FEE | EXIT | TRANSFER | PERPETUITY | MISREPRESENTATION | ARBITRATION | OTHER",
      "text": "verbatim clause text (under 300 chars)",
      "page_reference": "string or null",
      "significance": "HIGH | MEDIUM | LOW",
      "plain_english": "one sentence plain-English summary",
      "consumer_implication": "one sentence explaining what this means for the owner"
    }
  ],
  "confidence": 0.0,
  "warnings": ["array of strings — anything unusual, potentially misleading, or concerning"],
  "missing_items": ["array of important fields that could not be found"],
  "extraction_notes": "string — any caveats about the quality of the extraction"
}

Document text:
`,n=`Based on the following timeshare contract facts and clauses, identify potential consumer protection issues, legal triggers, and actionable concerns.

For each issue found, return structured JSON. Only identify issues supported by the data — do NOT speculate.

Return a JSON array of issue objects:
[
  {
    "id": "unique string",
    "category": "RESCISSION_WINDOW | MISREPRESENTATION | MAINTENANCE_FEE_ABUSE | PERPETUITY_TRAP | LOAN_BURDEN | EXIT_OBSTRUCTION | ELDER_VULNERABILITY | OFFICIAL_EXIT_AVAILABLE | COMPLAINT_WARRANTED | OTHER",
    "title": "short issue title",
    "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL",
    "description": "2-3 sentences describing the issue in plain English",
    "evidence_basis": "what in the contract/facts supports this finding",
    "source_type": "DOCUMENT | USER_STATED | AI_ANALYSIS",
    "recommended_action": "specific next step the consumer should take",
    "legal_disclaimer": "This is educational information only, not legal advice.",
    "confidence": 0.0,
    "time_sensitive": false,
    "requires_attorney": false
  }
]

Facts and context:
`,i=`Based on this timeshare case analysis, generate a prioritized action plan for the consumer.

IMPORTANT: This is consumer education only. Never promise outcomes or provide legal advice.

Return a JSON object:
{
  "primary_path": {
    "name": "string — name of the primary recommended path",
    "description": "2-3 sentence plain-English description",
    "estimated_timeline": "string (e.g. '2-4 weeks')",
    "estimated_cost": "string (e.g. 'Free' or '$200-500 in filing fees')",
    "success_factors": ["what makes this path viable"],
    "risks": ["potential downsides or complications"]
  },
  "steps": [
    {
      "order": 1,
      "title": "string",
      "description": "what to do and how",
      "documents_needed": ["list of docs"],
      "estimated_time": "string",
      "difficulty": "EASY | MEDIUM | HARD",
      "is_time_sensitive": false,
      "deadline": "ISO date or null",
      "resources": ["helpful links or contacts"]
    }
  ],
  "missing_documents": ["important docs the consumer should gather"],
  "do_not_do": ["actions to avoid — especially scam traps"],
  "scam_warnings": ["specific red flags to watch for given this case"],
  "attorney_recommended": false,
  "attorney_reason": "string or null",
  "disclaimer": "This action plan is for educational purposes only and does not constitute legal advice."
}

Case data:
`,s=`Generate a rescission notice letter for a timeshare contract. 

IMPORTANT: This is a template only. The consumer should review it carefully before sending.
Include all legally required elements for the state specified.

Return a JSON object:
{
  "subject": "string",
  "body": "full letter text with [PLACEHOLDER] for any info we don't have",
  "sending_instructions": "how and where to send this letter",
  "proof_of_delivery_note": "why certified mail matters",
  "disclaimer": "This template is for educational purposes. Consult an attorney before sending."
}

Case details:
`,r=`Generate a consumer complaint letter for the specified agency.

Return a JSON object:
{
  "agency_name": "string",
  "agency_address": "string",
  "subject": "string",
  "body": "full letter with [PLACEHOLDER] for missing info",
  "attachments_to_include": ["list of supporting docs to attach"],
  "submission_method": "online | mail | both",
  "submission_url": "URL if available, or null",
  "follow_up_timeline": "when to expect a response",
  "disclaimer": "Filing this complaint does not guarantee any outcome and is not legal advice."
}

Case details and issues:
`,o=`Write a clear, plain-English summary of this timeshare case for the consumer dashboard.

The tone should be: calm, informative, and empowering. Never alarming or promising.

Return a JSON object:
{
  "headline": "one-sentence case summary (max 80 chars)",
  "situation": "2-3 sentences about what we know about their situation",
  "key_finding": "the single most important finding",
  "immediate_action": "the single most important thing to do right now, or null",
  "confidence_note": "brief note about data confidence and what would improve the analysis",
  "time_sensitive": false,
  "time_sensitive_reason": "string or null"
}

Case data:
`;e.s(["ACTION_PLAN_PROMPT",0,i,"CASE_SUMMARY_PROMPT",0,o,"COMPLAINT_LETTER_PROMPT",0,r,"CONTRACT_EXTRACTION_PROMPT",0,a,"ISSUE_SPOTTING_PROMPT",0,n,"RESCISSION_LETTER_PROMPT",0,s,"SYSTEM_PROMPT_BASE",0,t])},68042,e=>{"use strict";let t=[{name:"FL DBPR",url:"https://www.myfloridalicense.com",priority:1},{name:"FL Attorney General",url:"https://www.myfloridalicense.com",priority:2},{name:"CFPB",url:"https://www.consumerfinance.gov/complaint",priority:3},{name:"FTC",url:"https://reportfraud.ftc.gov",priority:4}],a=["marriott","mvc","marriott vacation club","mvw"],n=["Third-party exit companies charging upfront fees","Promises of guaranteed cancellation",'Claims of "special connections" with Marriott',"Requests to stop paying maintenance fees","Transfer of deed to unknown third parties"];e.s(["runRulesEngine",0,function(e){var i;let s,r,o,l,c,d,u,p,m=[],h=[],f=[],_=[],y=!1;if(e.rescissionDeadline){let t=new Date(e.rescissionDeadline),a=new Date,n=Math.ceil((t.getTime()-a.getTime())/864e5);n>0&&(h.push("RESCISSION"),m.push({id:"rescission-notice",title:`Send Rescission Notice — ${n} day${1===n?"":"s"} remaining`,description:`You are within your ${"FL"===e.resortState?"10":""}-day rescission window. Send a written cancellation notice immediately via certified mail with return receipt.`,path:"RESCISSION",priority:1,timeSensitive:!0,deadline:e.rescissionDeadline,estimatedCost:"Free (postal fees only)",estimatedTime:"Same day",difficulty:"EASY",documentsNeeded:["Original signed contract","Rescission letter","Proof of certified mail"]}),n<=2&&(y=!0,p="Rescission deadline is critically close. An attorney can help ensure proper delivery."))}else _.push("Contract signing date (needed to calculate rescission deadline)");let g=a.some(t=>e.developerName?.toLowerCase().includes(t));if(g){h.push("OFFICIAL_EXIT");let t=!e.loanBalance||0===e.loanBalance,a="DELINQUENT"!==e.maintenanceFeeStatus;t&&a?m.push({id:"marriott-deedback",title:"Request Marriott Deed-Back Evaluation",description:"Marriott offers a deed-back program for owners in good standing with no outstanding loan. Contact Owner Services and request a deed-back evaluation.",path:"OFFICIAL_EXIT",priority:2,timeSensitive:!1,estimatedCost:"Free (possible transfer fees)",estimatedTime:"60-90 days",difficulty:"MEDIUM",documentsNeeded:["Account statement showing $0 loan balance","Proof of current maintenance fees"]}):m.push({id:"marriott-contact",title:"Contact Marriott Owner Services Directly",description:"Before engaging any third-party exit company, contact Marriott Owner Services at 800-860-9384 to discuss your options directly.",path:"OFFICIAL_EXIT",priority:2,timeSensitive:!1,estimatedCost:"Free",estimatedTime:"1 hour",difficulty:"EASY",documentsNeeded:["Contract number","Account number"]})}if(e.hasHardship){h.push("HARDSHIP");let t=e.elderlyOwner||e.hardshipType?.includes("age"),a=e.hardshipType?.includes("medical")||e.hardshipType?.includes("disability");m.push({id:"hardship-request",title:"Submit Hardship Exit Request",description:`Document your hardship in writing and submit to ${g?"Marriott":"the developer"} via certified mail. Financial hardship, medical issues, and age-related inability to travel are factors developers may consider.`,path:"HARDSHIP",priority:3,timeSensitive:!1,estimatedCost:"Free (postal fees)",estimatedTime:"30-60 days for response",difficulty:"MEDIUM",documentsNeeded:["Hardship letter",a?"Medical documentation":"","Financial statements if applicable","Certified mail receipt"].filter(Boolean)}),(t||a)&&(y=!0,p="Elder or medical hardship cases may qualify for additional consumer protections. An attorney can help maximize your options.")}if(e.issueCategories?.length&&e.issueCategories.some(e=>["MISREPRESENTATION","MAINTENANCE_FEE_ABUSE","EXIT_OBSTRUCTION"].includes(e))){h.push("COMPLAINT");let a="FL"===e.resortState?t:[{name:"CFPB",url:"https://www.consumerfinance.gov/complaint",priority:1},{name:"FTC",url:"https://reportfraud.ftc.gov",priority:2},{name:"State Attorney General",url:"#",priority:3}];m.push({id:"file-complaint",title:`File Consumer Complaint — ${a[0].name}`,description:`Based on identified issues, filing a complaint with ${a[0].name} is recommended. Complaints create a paper trail, may trigger investigations, and sometimes result in direct resolution.`,path:"COMPLAINT",priority:4,timeSensitive:!1,estimatedCost:"Free",estimatedTime:"30-90 days for response",difficulty:"MEDIUM",documentsNeeded:["Contract","Correspondence with developer","Evidence of issues","Timeline of events"]})}return e.priorExitCompany&&(f.push('You mentioned a prior third-party exit company. Beware of "recovery scams" — companies that charge fees to recover money lost to exit scams.'),f.push("Legitimate exit assistance is almost always free (developer programs) or billed hourly (attorneys). Upfront fees are a major red flag.")),f.push(...n.slice(0,3)),e.purchaseDate||_.push("Purchase date (required for rescission calculation)"),e.resortState||_.push("Resort state (determines applicable laws)"),e.maintenanceFeeStatus||_.push("Maintenance fee payment status"),e.loanBalance||0===e.loanBalance||_.push("Current loan balance"),0===m.length&&(h.push("GENERAL_EDUCATION"),m.push({id:"gather-docs",title:"Gather Your Contract Documents",description:"Upload your full timeshare contract to enable a complete analysis. Key documents: original purchase agreement, all addenda, maintenance fee statements, and any correspondence with the developer.",path:"GENERAL_EDUCATION",priority:10,timeSensitive:!1,estimatedCost:"Free",estimatedTime:"1-2 hours",difficulty:"EASY",documentsNeeded:["Original purchase agreement","All addenda","Maintenance fee statements"]})),m.sort((e,t)=>e.priority-t.priority),{triggeredPaths:h,actionSteps:m,scamWarnings:f,missingEvidence:_,requiresAttorney:y,attorneyReason:p,actionabilityScore:(s=[],r=0,(i=e).rescissionDeadline&&(r=100*(Math.ceil((new Date(i.rescissionDeadline).getTime()-Date.now())/864e5)>0)),s.push({key:"rescission_window_open",label:"Rescission Window",weight:.25,score:r,explanation:r>0?"Rescission window is still open — strongest possible option":"Rescission window has passed"}),s.push({key:"official_exit_path",label:"Official Exit Program",weight:.15,score:(o=a.some(e=>i.developerName?.toLowerCase().includes(e)))?80:40,explanation:o?"Marriott has known deed-back and resale programs":"Developer exit programs unknown — research recommended"}),s.push({key:"document_completeness",label:"Document Completeness",weight:.15,score:Math.round((l=[i.purchaseDate,i.resortState,i.developerName,void 0!==i.loanBalance,i.maintenanceFeeAnnual,i.rescissionDeadline].filter(Boolean).length)/6*100),explanation:`${l}/6 key data points found in documents`}),s.push({key:"hardship",label:"Documented Hardship",weight:.12,score:i.hasHardship?70:20,explanation:i.hasHardship?"Hardship factors increase likelihood of developer accommodation":"No hardship documented"}),s.push({key:"financing_burden",label:"Financing Status",weight:.08,score:c=i.loanBalance&&0!==i.loanBalance?30:80,explanation:80===c?"No outstanding loan — deed-back eligible":"Outstanding loan complicates exit options"}),s.push({key:"fee_status",label:"Maintenance Fee Status",weight:.05,score:"CURRENT"===i.maintenanceFeeStatus?80:"DELINQUENT"===i.maintenanceFeeStatus?20:50,explanation:"CURRENT"===i.maintenanceFeeStatus?"Fees current — eligible for most programs":"DELINQUENT"===i.maintenanceFeeStatus?"Delinquent fees restrict exit options":"Fee status unknown"}),d=Math.round(s.reduce((e,t)=>e+t.score*t.weight,0)),u=s.sort((e,t)=>t.score*t.weight-e.score*e.weight)[0],{total:d,grade:d>=80?"A":d>=65?"B":d>=50?"C":d>=35?"D":"F",label:d>=80?"Strong Options Available":d>=65?"Good Options Available":d>=50?"Moderate Options Available":d>=35?"Limited Options — More Info Needed":"Minimal Options Identified",factors:s,explanation:`Score driven primarily by: ${u.label}. ${d>=50?"Real action paths exist.":"Gathering more documents may reveal additional options."}`})}}])},2366,e=>e.a(async(t,a)=>{try{var n=e.i(91929),i=e.i(19107),s=e.i(35217),r=e.i(72039),o=e.i(68042),l=t([i]);async function c(e){try{let t=e.headers.get("x-user-id");if(!t)return n.NextResponse.json({error:"Unauthorized"},{status:401});let{caseId:a}=await e.json();if(!a)return n.NextResponse.json({error:"caseId required"},{status:400});let l=(0,s.createServerClient)(),{data:c,error:d}=await l.from("cases").select("*").eq("id",a).eq("user_id",t).single();if(d||!c)return n.NextResponse.json({error:"Case not found"},{status:404});let{data:u}=await l.from("extracted_facts").select("*").eq("case_id",a),p=JSON.stringify({case:{developer_name:c.developer_name,resort_name:c.resort_name,resort_state:c.resort_state,purchase_date:c.purchase_date,purchase_price:c.purchase_price,loan_balance:c.loan_balance,maintenance_fee_annual:c.maintenance_fee_annual,maintenance_fee_status:c.maintenance_fee_status,rescission_deadline:c.rescission_deadline,has_hardship:c.has_hardship,hardship_types:c.hardship_types,dissatisfaction_reasons:c.dissatisfaction_reasons,sales_pressure_tactics:c.sales_pressure_tactics,prior_exit_company:c.prior_exit_company},extracted_facts:u?.reduce((e,t)=>(e[t.fact_key]=t.fact_value,e),{})??{}},null,2),[m,h]=await Promise.all([i.anthropic.messages.create({model:i.CLAUDE_MODEL,max_tokens:2048,system:r.SYSTEM_PROMPT_BASE,messages:[{role:"user",content:r.ISSUE_SPOTTING_PROMPT+p}]}),i.anthropic.messages.create({model:i.CLAUDE_MODEL,max_tokens:1024,system:r.SYSTEM_PROMPT_BASE,messages:[{role:"user",content:r.CASE_SUMMARY_PROMPT+p}]})]),f=m.content.filter(e=>"text"===e.type).map(e=>e.text).join(""),_=[];try{let e=f.match(/\[[\s\S]*\]/);e&&(_=JSON.parse(e[0]))}catch(e){console.error("Issues parse error:",e)}let y=h.content.filter(e=>"text"===e.type).map(e=>e.text).join(""),g={};try{let e=y.match(/\{[\s\S]*\}/);e&&(g=JSON.parse(e[0]))}catch(e){console.error("Summary parse error:",e)}let E={purchaseDate:c.purchase_date,rescissionDeadline:c.rescission_deadline,resortState:c.resort_state,developerName:c.developer_name,loanBalance:c.loan_balance,maintenanceFeeAnnual:c.maintenance_fee_annual,maintenanceFeeStatus:c.maintenance_fee_status,hasHardship:c.has_hardship,hardshipType:c.hardship_types,priorExitCompany:c.prior_exit_company,issueCategories:_.map(e=>e.category)},R=(0,o.runRulesEngine)(E),S=JSON.stringify({...E,issues:_,summary:g,rulesResult:R},null,2),w=(await i.anthropic.messages.create({model:i.CLAUDE_MODEL,max_tokens:2048,system:r.SYSTEM_PROMPT_BASE,messages:[{role:"user",content:r.ACTION_PLAN_PROMPT+S}]})).content.filter(e=>"text"===e.type).map(e=>e.text).join(""),T={};try{let e=w.match(/\{[\s\S]*\}/);e&&(T=JSON.parse(e[0]))}catch(e){console.error("Action plan parse error:",e)}return _.length>0&&(await l.from("issue_flags").delete().eq("case_id",a),await l.from("issue_flags").insert(_.map(e=>({case_id:a,...e})))),await l.from("action_plans").upsert({case_id:a,primary_path:R.triggeredPaths[0]||"GENERAL_EDUCATION",steps:T.steps??R.actionSteps,missing_documents:T.missing_documents??R.missingEvidence,scam_warnings:T.scam_warnings??R.scamWarnings,attorney_recommended:T.attorney_recommended??R.requiresAttorney,attorney_reason:T.attorney_reason??R.attorneyReason,generated_by:"AI_RULES_COMBINED"},{onConflict:"case_id"}),await l.from("cases").update({status:"ANALYZED",actionability_score:R.actionabilityScore.total,actionability_grade:R.actionabilityScore.grade,actionability_label:R.actionabilityScore.label,primary_path:R.triggeredPaths[0]||"GENERAL_EDUCATION",requires_attorney:R.requiresAttorney,attorney_reason:R.attorneyReason,ai_summary_headline:g.headline,ai_summary_situation:g.situation,ai_summary_key_finding:g.key_finding,ai_summary_immediate_action:g.immediate_action,ai_time_sensitive:g.time_sensitive,last_analyzed_at:new Date().toISOString()}).eq("id",a),n.NextResponse.json({issues:_,summary:g,actionPlan:{...T,steps:T.steps??R.actionSteps,scamWarnings:T.scam_warnings??R.scamWarnings},rulesResult:R,score:R.actionabilityScore})}catch(e){return console.error("POST /api/analyze error:",e),n.NextResponse.json({error:"Analysis failed"},{status:500})}}[i]=l.then?(await l)():l,e.s(["POST",0,c,"maxDuration",0,90]),a()}catch(e){a(e)}},!1),58356,e=>e.a(async(t,a)=>{try{var n=e.i(30733),i=e.i(82283),s=e.i(63611),r=e.i(86211),o=e.i(98320),l=e.i(94282),c=e.i(12297),d=e.i(35842),u=e.i(51354),p=e.i(80307),m=e.i(43300),h=e.i(89531),f=e.i(83079),_=e.i(36425),y=e.i(83),g=e.i(93695);e.i(40554);var E=e.i(15243),R=e.i(2366),S=t([R]);[R]=S.then?(await S)():S;let T=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/Desktop/timeshare-exit-app/src/app/api/analyze/route.ts",nextConfigOutput:"",userland:R}),{workAsyncStorage:v,workUnitAsyncStorage:A,serverHooks:N}=T;async function w(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/analyze/route";n=n.replace(/\/index$/,"")||"/";let s=await T.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:S,nextConfig:w,parsedUrl:v,isDraftMode:A,prerenderManifest:N,routerServerContext:x,isOnDemandRevalidate:b,revalidateOnlyGenerated:O,resolvedPathname:C,clientReferenceManifest:I,serverActionsManifest:P}=s,M=(0,c.normalizeAppPath)(n),D=!!(N.dynamicRoutes[M]||N.routes[C]),L=async()=>((null==x?void 0:x.render404)?await x.render404(e,t,v,!1):t.end("This page could not be found"),null);if(D&&!A){let e=!!N.routes[C],t=N.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await L();throw new g.NoFallbackError}}let U=null;!D||T.isDev||A||(U=C,U="/index"===U?"/":U);let k=!0===T.isDev||!D,F=D&&!k;P&&I&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:I,serverActionsManifest:P});let q=e.method||"GET",H=(0,o.getTracer)(),B=H.getActiveScopeSpan(),j=!!(null==x?void 0:x.isWrappedByNextServer),Y=!!(0,r.getRequestMeta)(e,"minimalMode"),G=(0,r.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,w,N,Y);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let $={params:S,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:k,incrementalCache:G,cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>T.onRequestError(e,t,n,i,x)},sharedContext:{buildId:R}},W=new d.NodeNextRequest(e),J=new d.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(W,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>T.handle(K,$).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${q} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",i),s.updateName(t))}else e.updateName(`${q} ${n}`)}),l=async s=>{var o,l;let c=async({previousCacheEntry:i})=>{try{if(!Y&&b&&O&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await r(s);e.fetchMetrics=$.renderOpts.fetchMetrics;let o=$.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=$.renderOpts.collectedTags;if(!D)return await (0,h.sendResponse)(W,J,n,$.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[y.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,i=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:E.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:b})},!1,x),t}},d=await T.handleResponse({req:e,nextConfig:w,cacheKey:U,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:O,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:Y});if(!D)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==E.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||t.setHeader("x-nextjs-cache",b?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,f.fromNodeOutgoingHttpHeaders)(d.value.headers);return Y&&D||u.delete(y.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,_.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(W,J,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};j&&B?await l(B):(s=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${q} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!j))}catch(t){if(t instanceof g.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:b})},!1,x),D)throw t;return await (0,h.sendResponse)(W,J,new Response(null,{status:500})),null}}e.s(["handler",0,w,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:A})},"routeModule",0,T,"serverHooks",0,N,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0wuc1ez._.js.map