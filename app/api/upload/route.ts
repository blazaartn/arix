import { put } from '@vercel/blob';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const questionId = formData.get('questionId') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Aucune image' }, { status: 400 });
        }

        if (files.length > 5) {
            return NextResponse.json({ error: 'Max 5 images' }, { status: 400 });
        }

        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file
            if (!ALLOWED_TYPES.includes(file.type)) {
                console.log(`⚠️ Skipping ${file.name}: unsupported type`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                console.log(`⚠️ Skipping ${file.name}: too large`);
                continue;
            }

            console.log(`📤 Uploading ${file.name} to Vercel Blob...`);

            // ✅ Upload to Vercel Blob
            const blob = await put(file.name, file, {
                access: 'public',
                addRandomSuffix: true,
            });

            console.log(`✅ Uploaded: ${blob.url}`);

            // ✅ Save to database
            const result = await query(
                `INSERT INTO images (user_id, question_id, image_url, imagebb_id, caption, upload_order, is_primary)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, image_url`,
                [
                    session.user.id,
                    questionId || null,
                    blob.url,
                    blob.pathname,
                    file.name || `Image ${i + 1}`,
                    i,
                    i === 0 && !!questionId
                ]
            );
            uploadedImages.push(result.rows[0]);
        }

        if (uploadedImages.length === 0) {
            return NextResponse.json(
                { error: 'Aucune image n\'a pu être téléchargée' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            images: uploadedImages
        });

    } catch (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload: ' + (error instanceof Error ? error.message : 'Erreur inconnue') },
            { status: 500 }
        );
    }
}