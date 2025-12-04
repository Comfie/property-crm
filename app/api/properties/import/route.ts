import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/shared/errors/error-handler';
import { logAudit } from '@/lib/shared/audit';
import { propertyService, bulkImportPropertiesSchema } from '@/lib/features/properties';

/**
 * POST /api/properties/import
 * Bulk import properties from CSV/JSON
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validatedData = bulkImportPropertiesSchema.parse(body);

    // Perform bulk import
    const result = await propertyService.bulkImport(
      session.user.organizationId,
      validatedData.properties,
      validatedData.skipErrors
    );

    // Log audit trail for successful imports
    if (result.successful > 0) {
      await logAudit(
        session,
        'bulk_imported',
        'property',
        'bulk',
        {
          total: result.total,
          successful: result.successful,
          failed: result.failed,
          propertyNames: result.createdProperties.map((p) => p.name),
        },
        request
      );
    }

    return NextResponse.json(
      {
        message: `Successfully imported ${result.successful} of ${result.total} properties`,
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
