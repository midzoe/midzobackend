import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { BlogModel } from "@/src/models/Blog";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Try numeric id first, fallback to slug lookup
    const numericId = parseInt(slug);
    const post = isNaN(numericId)
      ? await BlogModel.findBySlug(slug)
      : await BlogModel.findById(numericId);

    // Route publique : un brouillon ne doit pas fuiter par devinette de slug ou d'id.
    // La liste publique filtre déjà sur isPublished ; l'accès direct doit s'aligner.
    if (!post || !post.is_published) return corsJson({ error: "Post not found" }, { status: 404 });

    return corsJson({ success: true, data: post });
  } catch (error) {
    console.error("Blog find error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
