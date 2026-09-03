import { NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { contentBriefs } from "@/data/content-briefs";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (!isAdminSessionValid()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: contentBriefs.map(([slug, title, category]) => ({
      slug, title, category, authorName: "Prateek G.", status: "DRAFT",
      excerpt: `An editorial brief for a practical DiskSift guide about ${title.toLowerCase()}.`,
      body: `# ${title}\n\n## Reader question\n\nWhat does the reader need to understand or fix?\n\n## Verified answer\n\nResearch and write a clear, original answer based on current Apple documentation and first-hand testing.\n\n## DiskSift workflow\n\nExplain how DiskSift can help without promising automatic or risk-free deletion.\n\n## Verification checklist\n\n- Confirm every technical claim.\n- Add screenshots or measured results where useful.\n- Include safe rollback guidance.\n- Add relevant internal links.`,
      tags: ["Mac", "storage"],
    })),
  });
  return NextResponse.json({ created: result.count });
}
