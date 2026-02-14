"use client";

import { useParams } from "next/navigation";

import { PipelineBuilder } from "@/components/pipelines/PipelineBuilder";

export default function EditPipelinePage() {
  const params = useParams<{ id: string }>();
  const pipelineId = Number(params.id);

  if (!Number.isFinite(pipelineId)) {
    return <p className="text-sm text-[var(--danger)]">Invalid pipeline id.</p>;
  }

  return <PipelineBuilder mode="edit" pipelineId={pipelineId} />;
}
