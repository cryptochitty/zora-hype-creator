// Fix: Use the correct express import and type annotations to avoid conflicts with global DOM types.
import express from 'express';

// --- Mock Data and Types (copied from frontend for API use) ---
// In a real-world app, this would come from a database or blockchain query.

interface Campaign {
    id: number;
    creator: string;
    tokenName: string;
    nftImage: string;
    supporterPool: number;
    hatterPool: number;
    endDate: Date;
    network: 'Base' | 'Celo' | 'Common';
}

const mockCampaigns: Campaign[] = [
    {
      id: 1,
      creator: 'greg',
      tokenName: 'GREG',
      nftImage: 'https://i.imgur.com/zPR6L1b.png',
      supporterPool: 12500,
      hatterPool: 7800,
      endDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), 
      network: 'Base',
    },
    {
      id: 2,
      creator: 'degen',
      tokenName: 'DEGEN',
      nftImage: 'https://i.imgur.com/w1iAqL4.png',
      supporterPool: 8900,
      hatterPool: 11200,
      endDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
      network: 'Base',
    },
    {
      id: 3,
      creator: 'nouns',
      tokenName: 'NOUNS',
      nftImage: 'https://i.imgur.com/55S4Gmm.png',
      supporterPool: 45000,
      hatterPool: 22000,
      endDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      network: 'Common',
    },
];

// --- End of Mock Data ---

const app = express();
app.use(express.json());

// Your Vercel URL, or use a tool like ngrok for local development
const FRAME_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

// Endpoint to generate a dynamic SVG image for a campaign
app.get('/api/frame-image', (req: express.Request, res: express.Response) => {
    const campaignId = parseInt(req.query.campaignId as string, 10);
    const campaign = mockCampaigns.find(c => c.id === campaignId);

    if (!campaign) {
        return res.status(404).send('Campaign not found');
    }

    const svg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              .bg { fill: #111827; }
              .title { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 72px; font-weight: bold; fill: #FFFFFF; }
              .creator { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: normal; fill: #9CA3AF; }
              .pool-label { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 36px; font-weight: bold; }
              .pool-value { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 60px; font-weight: bold; fill: #FFFFFF; }
              .supporter { fill: #00B159; }
              .hatter { fill: #FF4136; }
            </style>
            <linearGradient id="grad-supporter" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00B159;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-hatter" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" style="stop-color:#FF4136;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect class="bg" width="1200" height="630" />
          <rect x="0" y="0" width="1200" height="630" fill="url(#grad-supporter)" opacity="0.3"/>
          <rect x="0" y="0" width="1200" height="630" fill="url(#grad-hatter)" opacity="0.3"/>
          <g transform="translate(60, 80)">
            <text class="title">${campaign.tokenName} Token Hype</text>
            <text y="70" class="creator">by ${campaign.creator}</text>
          </g>
          <rect x="60" y="200" width="1080" height="4" fill="#374151"/>
          <g transform="translate(150, 350)">
            <text class="pool-label supporter">Supporters</text>
            <text y="80" class="pool-value">$${campaign.supporterPool.toLocaleString()}</text>
          </g>
          <g transform="translate(750, 350)">
            <text class="pool-label hatter">Hatters</text>
            <text y="80" class="pool-value">$${campaign.hatterPool.toLocaleString()}</text>
          </g>
          <text x="600" y="580" text-anchor="middle" font-family="Helvetica" font-size="28" fill="#4B5563">ZoraHype - Click a button to play</text>
        </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
});

// Endpoint to generate a dynamic SVG image for the response message
app.get('/api/frame-response-image', (req: express.Request, res: express.Response) => {
    const text = req.query.text as string || 'Action recorded!';
    
    // Basic text wrapping
    const maxLineLength = 35;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + word).length > maxLineLength) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += `${word} `;
    }
    lines.push(currentLine.trim());

    const tspanElements = lines.map((line, index) => `<tspan x="600" dy="${index === 0 ? 0 : '1.2em'}">${line}</tspan>`).join('');

    const svg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              .bg { fill: #111827; }
              .message { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 60px; font-weight: bold; fill: #FFFFFF; text-anchor: middle; }
              .footer { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; fill: #4B5563; text-anchor: middle; }
            </style>
          </defs>
          <rect class="bg" width="1200" height="630" />
          <text x="600" y="${335 - (lines.length - 1) * 36}" class="message">${tspanElements}</text>
          <text x="600" y="580" class="footer">ZoraHype - Powered by Farcaster Frames</text>
        </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
});

// Main endpoint for serving the Farcaster Frame
app.get('/api/frame', (req: express.Request, res: express.Response) => {
    const campaignId = req.query.campaignId as string;
    
    if (!campaignId) {
        return res.status(400).send('Missing campaignId. Please provide a campaignId query parameter.');
    }

    const campaign = mockCampaigns.find(c => c.id === parseInt(campaignId, 10));
    if (!campaign) {
        return res.status(404).send('Campaign not found');
    }

    const postUrl = `${FRAME_URL}/api/frame?campaignId=${campaignId}`;
    const imageUrl = `${FRAME_URL}/api/frame-image?campaignId=${campaignId}&t=${Date.now()}`;

    const frameHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="Zora Hype Campaign: ${campaign.tokenName}">
                <meta property="og:image" content="${imageUrl}">
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="${imageUrl}">
                <meta property="fc:frame:button:1" content="Support ${campaign.tokenName}">
                <meta property="fc:frame:button:2" content="Hate ${campaign.tokenName}">
                <meta property="fc:frame:post_url" content="${postUrl}">
            </head>
            <body>
                <h1>Zora Hype Campaign for ${campaign.tokenName}</h1>
                <p>This is a Farcaster Frame. To use it, cast the URL of this page.</p>
            </body>
        </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(frameHtml);
});

// Endpoint for handling frame actions (button clicks)
app.post('/api/frame', (req: express.Request, res: express.Response) => {
    const campaignId = req.query.campaignId as string;
    const campaign = mockCampaigns.find(c => c.id === parseInt(campaignId, 10));

    if (!campaign) {
        return res.status(404).send('Campaign not found');
    }

    const buttonIndex = req.body?.untrustedData?.buttonIndex;
    let text = '';
    
    if (buttonIndex === 1) {
        text = `Thank you for Supporting ${campaign.tokenName}!`;
    } else if (buttonIndex === 2) {
        text = `You have chosen to Hate ${campaign.tokenName}. Bold move!`;
    } else {
        text = 'Something went wrong.';
    }

    const imageUrl = `${FRAME_URL}/api/frame-response-image?text=${encodeURIComponent(text)}&t=${Date.now()}`;

    const responseHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="Zora Hype - Action Confirmed">
                <meta property="og:image" content="${imageUrl}">
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="${imageUrl}">
                <meta property="fc:frame:button:1" content="View on ZoraHype App">
                <meta property="fc:frame:button:1:action" content="link">
                <meta property="fc:frame:button:1:target" content="${FRAME_URL}">
            </head>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(responseHtml);
});

export default app;
