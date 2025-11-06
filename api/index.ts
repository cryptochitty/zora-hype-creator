// Fix: Use the correct express import and type annotations to avoid conflicts with global DOM types.
import express from 'express';

const app = express();
app.use(express.json());

// Your Vercel URL, or use a tool like ngrok for local development
const FRAME_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

app.get('/api/frame', (req: express.Request, res: express.Response) => {
    // Initial frame GET request
    const frameHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="Zora Hype Campaign: GREG">
                <meta property="og:image" content="${FRAME_URL}/frame-image.svg">
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="${FRAME_URL}/frame-image.svg">
                <meta property="fc:frame:button:1" content="Support GREG">
                <meta property="fc:frame:button:2" content="Hate GREG">
                <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame">
            </head>
            <body>
                <h1>Zora Hype Mini App</h1>
                <p>This is a Farcaster Frame. To use it, cast the URL of this page.</p>
            </body>
        </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(frameHtml);
});

app.post('/api/frame', (req: express.Request, res: express.Response) => {
    // Frame action POST request
    const buttonIndex = req.body?.untrustedData?.buttonIndex;
    let text = '';
    
    if (buttonIndex === 1) {
        text = 'Thank you for Supporting GREG!';
    } else if (buttonIndex === 2) {
        text = 'You have chosen to Hate GREG. Bold move!';
    } else {
        text = 'Something went wrong.';
    }

    const responseHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="Zora Hype - Action Confirmed">
                <meta property="og:image" content="${FRAME_URL}/frame-image.svg">
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="${FRAME_URL}/frame-image.svg">
                <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
                <meta property="fc:frame:text_input" content="${text}" />
            </head>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(responseHtml);
});

export default app;
