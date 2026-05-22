import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, request }) => {
    const audioUrl = url.searchParams.get('url');

    if (!audioUrl) {
        return new Response('Missing URL', { status: 400 });
    }

    // Forward the Range header if the browser sends one (needed for seek)
    const rangeHeader = request.headers.get('range');
    const fetchHeaders: HeadersInit = {};
    if (rangeHeader) {
        fetchHeaders['Range'] = rangeHeader;
    }

    const upstream = await fetch(audioUrl, { headers: fetchHeaders });

    const responseHeaders: HeadersInit = {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
    };

    // Forward Content-Range and Content-Length so the browser knows the file size
    const contentRange = upstream.headers.get('content-range');
    const contentLength = upstream.headers.get('content-length');
    if (contentRange) responseHeaders['Content-Range'] = contentRange;
    if (contentLength) responseHeaders['Content-Length'] = contentLength;

    return new Response(upstream.body, {
        status: upstream.status, // 206 Partial Content for range requests
        headers: responseHeaders,
    });
};