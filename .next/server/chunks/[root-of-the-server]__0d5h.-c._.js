module.exports=[93695,(e,t,n)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,n)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,n)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},29936,e=>e.a(async(t,n)=>{try{let t=await e.y("@anthropic-ai/sdk-ecc607bf42a87dbf");e.n(t),n()}catch(e){n(e)}},!0),19107,e=>e.a(async(t,n)=>{try{var a=e.i(29936),r=t([a]);[a]=r.then?(await r)():r;let s=new a.default({apiKey:process.env.ANTHROPIC_API_KEY});e.s(["CLAUDE_MODEL",0,"claude-sonnet-4-5","anthropic",0,s]),n()}catch(e){n(e)}},!1),72039,e=>{"use strict";let t=`You are a document analysis assistant for Timeshare Exit Navigator, 
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
10. Flag any language that appears to be misrepresentation or high-pressure tactics`,n=`Analyze this timeshare contract document and extract the following information as structured JSON.

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
`,a=`Based on the following timeshare contract facts and clauses, identify potential consumer protection issues, legal triggers, and actionable concerns.

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
`,r=`Based on this timeshare case analysis, generate a prioritized action plan for the consumer.

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
`,i=`Generate a consumer complaint letter for the specified agency.

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
`;e.s(["ACTION_PLAN_PROMPT",0,r,"CASE_SUMMARY_PROMPT",0,o,"COMPLAINT_LETTER_PROMPT",0,i,"CONTRACT_EXTRACTION_PROMPT",0,n,"ISSUE_SPOTTING_PROMPT",0,a,"RESCISSION_LETTER_PROMPT",0,s,"SYSTEM_PROMPT_BASE",0,t])},32597,e=>e.a(async(t,n)=>{try{var a=e.i(91929),r=e.i(19107),s=e.i(35217),i=e.i(72039),o=t([r]);async function l(e){try{let t;if(!e.headers.get("x-user-id"))return a.NextResponse.json({error:"Unauthorized"},{status:401});let{documentText:n,caseId:o,documentId:l}=await e.json();if(!n||n.trim().length<100)return a.NextResponse.json({error:"Document text too short or empty"},{status:400});let c=n.slice(0,8e4),u=n.length>8e4,d=await r.anthropic.messages.create({model:r.CLAUDE_MODEL,max_tokens:4096,system:i.SYSTEM_PROMPT_BASE,messages:[{role:"user",content:i.CONTRACT_EXTRACTION_PROMPT+c}]}),p=d.content.filter(e=>"text"===e.type).map(e=>e.text).join("");try{let e=p.match(/\{[\s\S]*\}/);if(!e)throw Error("No JSON found in response");t=JSON.parse(e[0])}catch(e){return console.error("Failed to parse Claude response:",e),a.NextResponse.json({error:"Failed to parse extraction result",rawResponse:p},{status:422})}let h=(0,s.createServerClient)();l&&await h.from("uploaded_documents").update({extraction_status:"COMPLETE",extracted_at:new Date().toISOString()}).eq("id",l);let m=t.facts;if(o&&m){let e=Object.entries(m).filter(([,e])=>null!==e).map(([e,n])=>({case_id:o,fact_key:e,fact_value:String(n),source_type:"DOCUMENT",confidence:t.confidence??.7,document_id:l??null}));e.length>0&&await h.from("extracted_facts").insert(e);let n=t.clauses;if(n?.length){let e=n.map(e=>({case_id:o,document_id:l??null,...e}));await h.from("contract_clauses").insert(e)}let a={};m.developer_name&&(a.developer_name=m.developer_name),m.resort_name&&(a.resort_name=m.resort_name),m.resort_state&&(a.resort_state=m.resort_state),m.purchase_date&&(a.purchase_date=m.purchase_date),m.purchase_price&&(a.purchase_price=Number(m.purchase_price)),void 0!==m.loan_balance&&(a.loan_balance=Number(m.loan_balance)),m.maintenance_fee_annual&&(a.maintenance_fee_annual=Number(m.maintenance_fee_annual)),m.rescission_deadline&&(a.rescission_deadline=m.rescission_deadline),Object.keys(a).length>0&&(a.status="DOCUMENT_ANALYZED",await h.from("cases").update(a).eq("id",o))}return a.NextResponse.json({extraction:t,wasTruncated:u,model:r.CLAUDE_MODEL,inputTokens:d.usage.input_tokens,outputTokens:d.usage.output_tokens})}catch(e){return console.error("POST /api/extract error:",e),a.NextResponse.json({error:"Extraction failed"},{status:500})}}[r]=o.then?(await o)():o,e.s(["POST",0,l,"maxDuration",0,60]),n()}catch(e){n(e)}},!1),60606,e=>e.a(async(t,n)=>{try{var a=e.i(30733),r=e.i(82283),s=e.i(63611),i=e.i(86211),o=e.i(98320),l=e.i(94282),c=e.i(12297),u=e.i(35842),d=e.i(51354),p=e.i(80307),h=e.i(43300),m=e.i(89531),_=e.i(83079),f=e.i(36425),g=e.i(83),E=e.i(93695);e.i(40554);var R=e.i(15243),y=e.i(32597),T=t([y]);[y]=T.then?(await T)():T;let N=new a.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/extract/route",pathname:"/api/extract",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/Desktop/timeshare-exit-app/src/app/api/extract/route.ts",nextConfigOutput:"",userland:y}),{workAsyncStorage:v,workUnitAsyncStorage:A,serverHooks:O}=N;async function x(e,t,n){n.requestMeta&&(0,i.setRequestMeta)(e,n.requestMeta),N.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/extract/route";a=a.replace(/\/index$/,"")||"/";let s=await N.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:y,params:T,nextConfig:x,parsedUrl:v,isDraftMode:A,prerenderManifest:O,routerServerContext:w,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,resolvedPathname:I,clientReferenceManifest:C,serverActionsManifest:P}=s,M=(0,c.normalizeAppPath)(a),L=!!(O.dynamicRoutes[M]||O.routes[I]),D=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,v,!1):t.end("This page could not be found"),null);if(L&&!A){let e=!!O.routes[I],t=O.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await D();throw new E.NoFallbackError}}let U=null;!L||N.isDev||A||(U=I,U="/index"===U?"/":U);let k=!0===N.isDev||!L,j=L&&!k;P&&C&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:C,serverActionsManifest:P});let q=e.method||"GET",H=(0,o.getTracer)(),F=H.getActiveScopeSpan(),Y=!!(null==w?void 0:w.isWrappedByNextServer),B=!!(0,i.getRequestMeta)(e,"minimalMode"),W=(0,i.getRequestMeta)(e,"incrementalCache")||await N.getIncrementalCache(e,x,O,B);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let K={params:T,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:k,incrementalCache:W,cacheLifeProfiles:x.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,a,r)=>N.onRequestError(e,t,a,r,w)},sharedContext:{buildId:y}},G=new u.NodeNextRequest(e),J=new u.NodeNextResponse(t),$=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let s,i=async e=>N.handle($,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=H.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=n.get("next.route");if(r){let t=`${q} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",r),s.updateName(t))}else e.updateName(`${q} ${a}`)}),l=async s=>{var o,l;let c=async({previousCacheEntry:r})=>{try{if(!B&&S&&b&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await i(s);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&n.waitUntil&&(n.waitUntil(o),o=void 0);let l=K.renderOpts.collectedTags;if(!L)return await (0,m.sendResponse)(G,J,a,K.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,r=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,w),t}},u=await N.handleResponse({req:e,nextConfig:x,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:B});if(!L)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",S?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,_.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&L||d.delete(g.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,f.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(G,J,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};Y&&F?await l(F):(s=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${q} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!Y))}catch(t){if(t instanceof E.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,w),L)throw t;return await (0,m.sendResponse)(G,J,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:A})},"routeModule",0,N,"serverHooks",0,O,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,A]),n()}catch(e){n(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d5h.-c._.js.map