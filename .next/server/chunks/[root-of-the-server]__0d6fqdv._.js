module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},29936,e=>e.a(async(t,r)=>{try{let t=await e.y("@anthropic-ai/sdk-ecc607bf42a87dbf");e.n(t),r()}catch(e){r(e)}},!0),19107,e=>e.a(async(t,r)=>{try{var n=e.i(29936),a=t([n]);[n]=a.then?(await a)():a;let s=new n.default({apiKey:process.env.ANTHROPIC_API_KEY});e.s(["CLAUDE_MODEL",0,"claude-sonnet-4-5","anthropic",0,s]),r()}catch(e){r(e)}},!1),72039,e=>{"use strict";let t=`You are a document analysis assistant for Timeshare Exit Navigator, 
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
10. Flag any language that appears to be misrepresentation or high-pressure tactics`,r=`Analyze this timeshare contract document and extract the following information as structured JSON.

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
`,a=`Based on this timeshare case analysis, generate a prioritized action plan for the consumer.

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
`;e.s(["ACTION_PLAN_PROMPT",0,a,"CASE_SUMMARY_PROMPT",0,o,"COMPLAINT_LETTER_PROMPT",0,i,"CONTRACT_EXTRACTION_PROMPT",0,r,"ISSUE_SPOTTING_PROMPT",0,n,"RESCISSION_LETTER_PROMPT",0,s,"SYSTEM_PROMPT_BASE",0,t])},42246,e=>e.a(async(t,r)=>{try{var n=e.i(91929),a=e.i(19107),s=e.i(35217),i=e.i(72039),o=t([a]);async function l(e){try{let t,r=e.headers.get("x-user-id");if(!r)return n.NextResponse.json({error:"Unauthorized"},{status:401});let{caseId:o,letterType:l,agencyName:c}=await e.json();if(!o||!l)return n.NextResponse.json({error:"caseId and letterType required"},{status:400});let u=(0,s.createServerClient)(),{data:d}=await u.from("cases").select("*, extracted_facts(*), issue_flags(*)").eq("id",o).eq("user_id",r).single();if(!d)return n.NextResponse.json({error:"Case not found"},{status:404});let p=JSON.stringify(d,null,2);switch(l){case"RESCISSION":t=i.RESCISSION_LETTER_PROMPT;break;case"COMPLAINT":t=i.COMPLAINT_LETTER_PROMPT+`
Agency: ${c??"State Regulatory Agency"}
`;break;default:return n.NextResponse.json({error:`Unknown letter type: ${l}`},{status:400})}let h=(await a.anthropic.messages.create({model:a.CLAUDE_MODEL,max_tokens:2048,system:i.SYSTEM_PROMPT_BASE,messages:[{role:"user",content:t+p}]})).content.filter(e=>"text"===e.type).map(e=>e.text).join(""),m={};try{let e=h.match(/\{[\s\S]*\}/);e&&(m=JSON.parse(e[0]))}catch{m={body:h,subject:`${l} Letter`}}let{data:g}=await u.from("generated_letters").insert({case_id:o,letter_type:l,subject:m.subject,body:m.body,sending_instructions:m.sending_instructions,agency_name:c,generated_by:"AI",status:"DRAFT"}).select().single();return n.NextResponse.json({letter:g,letterData:m})}catch(e){return console.error("POST /api/letters error:",e),n.NextResponse.json({error:"Letter generation failed"},{status:500})}}async function c(e){try{if(!e.headers.get("x-user-id"))return n.NextResponse.json({error:"Unauthorized"},{status:401});let t=e.nextUrl.searchParams.get("caseId");if(!t)return n.NextResponse.json({error:"caseId required"},{status:400});let r=(0,s.createServerClient)(),{data:a}=await r.from("generated_letters").select("*").eq("case_id",t).order("created_at",{ascending:!1});return n.NextResponse.json({letters:a??[]})}catch(e){return console.error("GET /api/letters error:",e),n.NextResponse.json({error:"Failed to fetch letters"},{status:500})}}[a]=o.then?(await o)():o,e.s(["GET",0,c,"POST",0,l,"maxDuration",0,60]),r()}catch(e){r(e)}},!1),82495,e=>e.a(async(t,r)=>{try{var n=e.i(30733),a=e.i(82283),s=e.i(63611),i=e.i(86211),o=e.i(98320),l=e.i(94282),c=e.i(12297),u=e.i(35842),d=e.i(51354),p=e.i(80307),h=e.i(43300),m=e.i(89531),g=e.i(83079),f=e.i(36425),_=e.i(83),R=e.i(93695);e.i(40554);var E=e.i(15243),y=e.i(42246),T=t([y]);[y]=T.then?(await T)():T;let N=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/letters/route",pathname:"/api/letters",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/Desktop/timeshare-exit-app/src/app/api/letters/route.ts",nextConfigOutput:"",userland:y}),{workAsyncStorage:A,workUnitAsyncStorage:v,serverHooks:S}=N;async function x(e,t,r){r.requestMeta&&(0,i.setRequestMeta)(e,r.requestMeta),N.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/letters/route";n=n.replace(/\/index$/,"")||"/";let s=await N.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,params:T,nextConfig:x,parsedUrl:A,isDraftMode:v,prerenderManifest:S,routerServerContext:w,isOnDemandRevalidate:b,revalidateOnlyGenerated:O,resolvedPathname:I,clientReferenceManifest:C,serverActionsManifest:P}=s,M=(0,c.normalizeAppPath)(n),L=!!(S.dynamicRoutes[M]||S.routes[I]),U=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,A,!1):t.end("This page could not be found"),null);if(L&&!v){let e=!!S.routes[I],t=S.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await U();throw new R.NoFallbackError}}let j=null;!L||N.isDev||v||(j=I,j="/index"===j?"/":j);let D=!0===N.isDev||!L,k=L&&!D;P&&C&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:C,serverActionsManifest:P});let q=e.method||"GET",H=(0,o.getTracer)(),F=H.getActiveScopeSpan(),Y=!!(null==w?void 0:w.isWrappedByNextServer),B=!!(0,i.getRequestMeta)(e,"minimalMode"),W=(0,i.getRequestMeta)(e,"incrementalCache")||await N.getIncrementalCache(e,x,S,B);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let $={params:T,previewProps:S.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:D,incrementalCache:W,cacheLifeProfiles:x.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>N.onRequestError(e,t,n,a,w)},sharedContext:{buildId:y}},G=new u.NodeNextRequest(e),K=new u.NodeNextResponse(t),J=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let s,i=async e=>N.handle(J,$).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${q} ${n}`)}),l=async s=>{var o,l;let c=async({previousCacheEntry:a})=>{try{if(!B&&b&&O&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(s);e.fetchMetrics=$.renderOpts.fetchMetrics;let o=$.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let l=$.renderOpts.collectedTags;if(!L)return await (0,m.sendResponse)(G,K,n,$.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[_.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=_.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,a=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=_.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:E.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:b})},!1,w),t}},u=await N.handleResponse({req:e,nextConfig:x,cacheKey:j,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:O,responseGenerator:c,waitUntil:r.waitUntil,isMinimalMode:B});if(!L)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==E.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",b?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),v&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&L||d.delete(_.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,f.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(G,K,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};Y&&F?await l(F):(s=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${q} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!Y))}catch(t){if(t instanceof R.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:b})},!1,w),L)throw t;return await (0,m.sendResponse)(G,K,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:v})},"routeModule",0,N,"serverHooks",0,S,"workAsyncStorage",0,A,"workUnitAsyncStorage",0,v]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d6fqdv._.js.map