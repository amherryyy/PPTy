import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const workspaceDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeModules = "C:/Users/Ahmer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const runtimePython = "C:/Users/Ahmer/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const skillDir = "C:/Users/Ahmer/.codex/plugins/cache/openai-primary-runtime/presentations/26.1026.10807/skills/presentations";
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(runtimeModules, "@oai/artifact-tool/dist/artifact_tool.mjs")).href);

const slides = [
  { file: "01-cover.png", title: "Duno", seconds: 40, notes: "Introduce Duno as a personalized study planning, tracking, and academic analytics project. The official logo is placed unchanged on the cover. Frame this talk as a product and implementation overview. The hosted URL is included later, but authenticated hosted workflows are not verified. Sources: assets/duno-handoff/design-system.md; docs/requirements.md." },
  { file: "02-project-overview.png", title: "Project Overview", seconds: 45, notes: "Describe Duno as a browser-based academic companion. Its flow connects subjects and topics, priority, available time, recorded sessions, curated guidance, and descriptive summaries. Admin visibility is limited to aggregate counts in the documented design. Avoid implying academic outcomes or prediction. Sources: docs/requirements.md; docs/system-design-paper-pack.md." },
  { file: "03-problem-context.png", title: "Problem Context", seconds: 50, notes: "Explain the project framing as a workflow need: organize academic work, choose a manageable next step, then record and review study activity. This is derived from the stated project purpose, not survey evidence. No measured respondent counts or learning gains are claimed. Source: docs/requirements.md." },
  { file: "04-project-objectives.png", title: "Project Objectives", seconds: 50, notes: "Summarize the general objective and three practical goals: organize and prioritize study topics, plan and track study activity, and review activity while evaluating product quality. ISO/IEC 25010 is an intended evaluation, not a completed evaluation. Sources: docs/DUNO_SRS_ALIGNMENT_DRAFT.md; docs/requirements.md; docs/academic-evidence/implementation-status.md." },
  { file: "05-system-architecture.png", title: "System Architecture", seconds: 65, notes: "Walk through the conceptual request path from responsive browser UI to CodeIgniter routes, controllers, services and models, and MySQL or MariaDB. Shield handles authentication and sessions; SMTP supports registration verification. The application uses owner-scoped queries and documented composite constraints. The PWA allowlist is limited to public static assets. This is a source-derived architecture illustration, not a performance test. Sources: README.md; docs/system-design-paper-pack.md; docs/deployment.md." },
  { file: "06-authentication-and-access.png", title: "Authentication and Access", seconds: 60, notes: "Explain the designed account flow and server-side student/admin route boundaries. Student data operations are scoped to the authenticated owner; admin access is permission-gated and aggregate-only. On hosted r25, only public pages were observed. No authentication or registration form was submitted. The registration page showed consent text but no visible or accessible checkbox, so registration is not verified. Sources: docs/auth-security-story.md; docs/academic-evidence/deployment-evidence.md." },
  { file: "07-student-data-crud.png", title: "Student Data CRUD", seconds: 50, notes: "Subjects and topics are the core student-managed entities. The slide names only fields present in the supplied six-table handoff. Server-side validation, CSRF, escaping, ownership scope, and foreign-reference checks are part of the implementation approach. Previously recorded local subject and topic tests do not establish authenticated hosted r25 CRUD acceptance. Sources: docs/requirements.md; docs/academic-evidence/testing-evidence.md; assets/duno-handoff/erd.md." },
  { file: "08-core-study-features.png", title: "Core Study Features", seconds: 70, notes: "Follow the four-stage workflow. Duno Focus prioritizes topics using documented inputs. Duno Plan arranges topics within available time. The Study Session Tracker records duration. Aralytics summarizes recorded activity. All miniatures are explicitly conceptual UI illustrations because verified application screenshots are unavailable in the handoff. They are not evidence of hosted screens. Sources: docs/requirements.md; assets/duno-handoff/screenshot-manifest.md." },
  { file: "09-relational-database-design.png", title: "Relational Database Design", seconds: 90, notes: "Review the six-table simplified core study-flow model: users, subjects, topics, study_plans, study_plan_items, and study_sessions. Call out nullable program_id, due_date, item topic_id, item start_time, and session topic_id. Composite ownership references keep topics within their subject owner, plan items within their plan owner, and sessions within their subject owner. Optional topic references remain optional; session topic and subject are kept aligned. This is the authoritative handoff view, not a live database export or a claim of full schema parity. Source: assets/duno-handoff/erd.md." },
  { file: "10-responsive-interface.png", title: "Responsive Interface", seconds: 50, notes: "The device illustration is conceptual, not a screenshot. Earlier local Playwright records cover selected pages and viewports at 320, 400, 768, and 1280 pixels. Those historical local checks do not verify every page, mobile behavior on hosted r25, or authenticated layouts. Sources: docs/academic-evidence/testing-evidence.md; assets/duno-handoff/screenshot-manifest.md." },
  { file: "11-deployment.png", title: "Deployment and Release", seconds: 65, notes: "Show the hosted site URL. The owner-reported r25 marker text appeared in Brave. A visible marker alone does not prove complete file parity. A fresh private browser showed the public landing page, student login, admin sign-in, and registration GET. No form submission was made. Authenticated workflows and full hosted acceptance remain unverified. Sources: docs/academic-evidence/deployment-evidence.md; docs/deployment.md; docs/live-demo-runbook.md." },
  { file: "12-challenges-and-next-steps.png", title: "Challenges and Future Enhancements", seconds: 55, notes: "Discuss three constraints: shared-hosting release limits, strict student record ownership, and the evidence gap between source implementation and hosted workflows. The immediate next steps are to resolve the missing consent checkbox, test with synthetic data in an approved environment, recheck responsive and public PWA behavior, and carry out the planned ISO/IEC 25010 evaluation. Do not claim those steps are already complete. Sources: docs/deployment.md; docs/auth-security-story.md; docs/academic-evidence/implementation-status.md." },
  { file: "13-means-of-verification.png", title: "Means of Verification", seconds: 75, notes: "Separate evidence into source implementation, previously recorded local testing, and hosted r25 public-page observations. The release record reports 123 PHPUnit tests and 1,389 assertions passed on Nov 3, but this presentation did not rerun them. Historical local Playwright records are dated Oct 31 and Nov 2. Hosted authenticated workflows, CRUD, full parity, and PWA behavior are unverified. Registration remains unverified due to the missing visible consent checkbox. ISO/IEC 25010 results are pending. Sources: docs/academic-evidence/testing-evidence.md; docs/academic-evidence/deployment-evidence.md; docs/live-demo-runbook.md." },
  { file: "14-closing.png", title: "Closing", seconds: 40, notes: "Close with Duno's purpose and invite questions. The official logo is used unchanged. If asked about live verification, restate that r25 public pages were observed but authenticated workflows have not been verified. The site URL is shown for reference, not as proof of full functionality. Source: docs/requirements.md." },
];

const presentation = Presentation.create({ slideSize: { width: 1920, height: 1080 } });
for (let index = 0; index < slides.length; index++) {
  const info = slides[index];
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  const pngPath = path.join(workspaceDir, "output", "readable", "png", info.file);
  const bytes = await fs.readFile(pngPath);
  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  slide.images.add({
    blob,
    contentType: "image/png",
    alt: `Slide ${String(index + 1).padStart(2, "0")}: ${info.title}`,
    fit: "cover",
    position: { left: 0, top: 0, width: 1920, height: 1080 },
  });
  slide.speakerNotes.text = `Target time: ${info.seconds} seconds.\n\n${info.notes}`;
  slide.speakerNotes.setVisible(true);
}

const outputDir = path.join(workspaceDir, "output", "readable");
const basePath = path.join(outputDir, "Duno-Final-Presentation-Readable.pptx");
let finalPath = basePath;
for (let revision = 2; ; revision++) {
  try {
    await fs.access(finalPath);
    finalPath = path.join(outputDir, `Duno-Final-Presentation-Readable-r${revision}.pptx`);
  } catch {
    break;
  }
}
const stagingDir = path.join(workspaceDir, ".codex-finalizer-readable");
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, "duno-readable-candidate.pptx");
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href);
await finalizePresentation({
  explicitTotalSlideCount: 14,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: runtimePython,
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "18288000,10287000"],
  fontPolicy: { basis: "design", families: ["Aptos", "Segoe UI"] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "Duno-Final-Presentation-Readable-final.validation.json"),
});

const totalSeconds = slides.reduce((sum, slide) => sum + slide.seconds, 0);
const script = slides.map((slide, index) => `## ${String(index + 1).padStart(2, "0")}. ${slide.title} (${slide.seconds}s)\n\n${slide.notes}`).join("\n\n");
await fs.writeFile(path.join(outputDir, "speaker-notes.md"), `# Duno AppDev Presentation Speaker Notes\n\nTarget duration: ${Math.floor(totalSeconds / 60)} minutes ${totalSeconds % 60} seconds.\n\n${script}\n`, "utf8");
console.log(`Created ${finalPath} with ${slides.length} slides and ${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")} target notes.`);




