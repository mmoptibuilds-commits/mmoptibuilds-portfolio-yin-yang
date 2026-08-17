import { SystemsShell } from "@/components/systems/SystemsShell";
import { systemsFontClass } from "@/lib/fonts-systems";

export default function SystemsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={systemsFontClass}>
      <SystemsShell>{children}</SystemsShell>
    </div>
  );
}
