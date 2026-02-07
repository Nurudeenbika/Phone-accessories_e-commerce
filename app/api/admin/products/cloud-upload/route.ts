import { uploadImages } from "@/lib/cloudinary/storage";
import { NextRequest, NextResponse } from "next/server";
import {ImageType} from "@/lib/jespo/types";

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        const images: ImageType[] | null = body.images;

        if(!images || images.length === 0) {
            return NextResponse.json({ urls: [] });
        }

        const urls = await uploadImages(images);

        return NextResponse.json({ urls }, { status: 201 });
    } catch (error) {
        console.error(`Failed to upload images: ${error}`);
        return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
    }

}