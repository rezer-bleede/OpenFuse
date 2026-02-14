import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <PageContainer>{children}</PageContainer>
    </AppShell>
  );
}
