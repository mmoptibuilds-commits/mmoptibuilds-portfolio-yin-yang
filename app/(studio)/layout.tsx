import { StudioShell } from "@/components/studio/StudioShell";
import { studioFontClass } from "@/lib/fonts-studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={studioFontClass}>
      <StudioShell>{children}</StudioShell>
    </div>
  );
}
