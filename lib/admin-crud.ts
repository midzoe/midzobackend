import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";

/**
 * Fabrique des handlers CRUD admin pour les tables « annuaire ».
 *
 * Ces neuf entités partagent exactement le même contrat (lister tout, créer,
 * modifier, supprimer, réservé aux admins) ; les écrire à la main donnerait neuf
 * paires de fichiers identiques à la virgule près. Chaque route reste explicite
 * sur ce qui lui est propre : son modèle, ses champs obligatoires et la
 * normalisation de son payload.
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */

interface CrudModel {
  findAllAdmin(): Promise<unknown[]>;
  create(data: any): Promise<unknown>;
  update(id: number, data: any): Promise<unknown | null>;
  delete(id: number): Promise<boolean>;
}

interface CrudOptions {
  model: CrudModel;
  /** Libellé utilisé dans les logs et le message 404 (ex. « Flight »). */
  entity: string;
  /** Champs obligatoires à la création. */
  required?: string[];
  /** Normalise le corps de requête (listes texte -> tableaux, nombres, booléens). */
  parse: (body: any) => Record<string, unknown>;
}

/** 401 si non authentifié, 403 si non admin, null si l'accès est accordé. */
async function guard(request: NextRequest) {
  const auth = await getAuthWithRole(request);
  if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
  return null;
}

/** Handlers de la route collection : /api/admin/<entity>. */
export function adminCollectionRoute({ model, entity, required = [], parse }: CrudOptions) {
  return {
    async GET(request: NextRequest) {
      try {
        const denied = await guard(request);
        if (denied) return denied;

        const items = await model.findAllAdmin();
        return corsJson({ success: true, data: items, total: items.length });
      } catch (error) {
        console.error(`Admin list ${entity} error:`, error);
        return corsJson({ error: "Internal server error" }, { status: 500 });
      }
    },

    async POST(request: NextRequest) {
      try {
        const denied = await guard(request);
        if (denied) return denied;

        const body = await request.json();
        const data = parse(body);

        const missing = required.filter((field) => {
          const value = data[field];
          return value === undefined || value === null || value === "";
        });
        if (missing.length > 0) {
          return corsJson({ error: `${missing.join(", ")} required` }, { status: 400 });
        }

        const item = await model.create(data);
        return corsJson({ success: true, data: item }, { status: 201 });
      } catch (error) {
        console.error(`Create ${entity} error:`, error);
        return corsJson({ error: "Internal server error" }, { status: 500 });
      }
    },

    async OPTIONS() {
      return corsOptions("GET, POST, OPTIONS");
    },
  };
}

/** Handlers de la route élément : /api/admin/<entity>/[id]. */
export function adminItemRoute({ model, entity, parse }: Omit<CrudOptions, "required">) {
  type Ctx = { params: Promise<{ id: string }> };

  return {
    async PUT(request: NextRequest, { params }: Ctx) {
      try {
        const denied = await guard(request);
        if (denied) return denied;

        const { id } = await params;
        const itemId = parseInt(id);
        if (isNaN(itemId)) return corsJson({ error: "Invalid id" }, { status: 400 });

        const body = await request.json();
        const item = await model.update(itemId, parse(body));
        if (!item) return corsJson({ error: `${entity} not found` }, { status: 404 });

        return corsJson({ success: true, data: item });
      } catch (error) {
        console.error(`Update ${entity} error:`, error);
        return corsJson({ error: "Internal server error" }, { status: 500 });
      }
    },

    async DELETE(request: NextRequest, { params }: Ctx) {
      try {
        const denied = await guard(request);
        if (denied) return denied;

        const { id } = await params;
        const itemId = parseInt(id);
        if (isNaN(itemId)) return corsJson({ error: "Invalid id" }, { status: 400 });

        const deleted = await model.delete(itemId);
        if (!deleted) return corsJson({ error: `${entity} not found` }, { status: 404 });

        return corsJson({ success: true });
      } catch (error) {
        console.error(`Delete ${entity} error:`, error);
        return corsJson({ error: "Internal server error" }, { status: 500 });
      }
    },

    async OPTIONS() {
      return corsOptions("PUT, DELETE, OPTIONS");
    },
  };
}
