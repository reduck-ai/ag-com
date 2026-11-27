import { put } from "@vercel/blob";

// An image a visitor adds to a message, at a URL of its own: eve keeps it with the message, so the
// chat shows the image again. Anyone may post, so only an image, at most the size eve gives a model.
// Without a Blob store, `put` throws: the chat then sends the image inline.
export async function POST(request: Request) {
  const image = await request.blob();
  if (!image.type.startsWith("image/") || image.size > 3 * 1024 * 1024)
    return new Response(null, { status: 400 });
  const { url } = await put("image", image, {
    access: "public",
    addRandomSuffix: true,
    contentType: image.type,
  });
  return Response.json({ url });
}
