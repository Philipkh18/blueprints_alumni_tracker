import { auth } from "@clerk/nextjs/server";
import ConnectionsExplorer from "@/components/connections/ConnectionsExplorer";
import {
  getAllFamilyTrees,
  getAllProfiles,
  getProfileByClerkId,
} from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const { userId } = await auth();
  const [profiles, familyTrees, viewer] = await Promise.all([
    getAllProfiles(),
    getAllFamilyTrees(),
    userId ? getProfileByClerkId(userId) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div className="brand-panel rounded-[2rem] px-6 py-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Connections
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Mentor-Mentee Trees
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Explore mentor-mentee lineage across the Blueprints network. Tap a
          person&apos;s icon or name to jump to their profile.
        </p>
      </div>

      <ConnectionsExplorer
        profiles={profiles}
        familyTrees={familyTrees}
        currentUserProfileId={viewer?.id ?? null}
        isAdmin={viewer?.is_admin ?? false}
      />
    </div>
  );
}
