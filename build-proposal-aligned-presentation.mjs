import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const workspaceDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeModules = "C:/Users/Ahmer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const runtimePython = "C:/Users/Ahmer/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const skillDir = "C:/Users/Ahmer/.codex/plugins/cache/openai-primary-runtime/presentations/26.1026.10807/skills/presentations";
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(runtimeModules, "@oai/artifact-tool/dist/artifact_tool.mjs")).href);

const slides = [
  { file: "01-cover.png", title: "Duno", seconds: 40 },
  { file: "02-project-overview.png", title: "Project Overview", seconds: 45 },
  { file: "03-problem-context.png", title: "Problem Context", seconds: 50 },
  { file: "04-project-objectives.png", title: "Project Objectives", seconds: 50 },
  { file: "05-system-architecture.png", title: "System Architecture", seconds: 65 },
  { file: "06-authentication-and-access.png", title: "Authentication and Access", seconds: 60 },
  { file: "07-student-data-crud.png", title: "Student Data CRUD", seconds: 50 },
  { file: "08-core-study-features.png", title: "Objective and Feature Alignment", seconds: 70 },
  { file: "09-relational-database-design.png", title: "Relational Database Design", seconds: 90 },
  { file: "10-responsive-interface.png", title: "Responsive Interface", seconds: 50 },
  { file: "11-hosted-demo.png", title: "Hosted Website Demonstration", seconds: 65 },
  { file: "12-challenges-and-next-steps.png", title: "Challenges and Future Enhancements", seconds: 55 },
  { file: "13-photo-documentation.png", title: "Project Photo Documentation", seconds: 75 },
  { file: "14-closing.png", title: "Closing", seconds: 40 },
];

const presentation = Presentation.create({ slideSize: { width: 1920, height: 1080 } });
for (let index = 0; index < slides.length; index++) {
  const info = slides[index];
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  const pngPath = path.join(workspaceDir, "output", "proposal-aligned", "png", info.file);
  const bytes = await fs.readFile(pngPath);
  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  slide.images.add({
    blob,
    contentType: "image/png",
    alt: `Slide ${String(index + 1).padStart(2, "0")}: ${info.title}`,
    fit: "cover",
    position: { left: 0, top: 0, width: 1920, height: 1080 },
  });
}

const outputDir = path.join(workspaceDir, "output", "proposal-aligned");
const basePath = path.join(outputDir, "Duno-Final-Presentation-Proposal-Aligned.pptx");
let finalPath = basePath;
for (let revision = 2; ; revision++) {
  try {
    await fs.access(finalPath);
    finalPath = path.join(outputDir, `Duno-Final-Presentation-Proposal-Aligned-r${revision}.pptx`);
  } catch {
    break;
  }
}
const stagingDir = path.join(workspaceDir, ".codex-finalizer-proposal-aligned");
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
  receiptPath: path.join(stagingDir, "Duno-Final-Presentation-Proposal-Aligned.validation.json"),
});

console.log(`Created ${finalPath} with ${slides.length} slides and no speaker notes.`);




