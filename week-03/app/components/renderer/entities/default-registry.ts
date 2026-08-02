import type { EntityRegistry } from "@/components/renderer/entity-view";
import { ExhibitCard } from "./exhibit-card";
import { ArtifactView } from "./artifact-view";
import { ProjectionView } from "./projection-view";
import { SignageView } from "./signage-view";
import { TimelineView } from "./timeline-view";
import { TerminalCard } from "./terminal-card";
import { StatueView } from "./statue-view";

export const defaultEntityRegistry: EntityRegistry = {
  exhibit: ExhibitCard,
  artifact: ArtifactView,
  projection: ProjectionView,
  signage: SignageView,
  timeline: TimelineView,
  terminal: TerminalCard,
  statue: StatueView,
};
