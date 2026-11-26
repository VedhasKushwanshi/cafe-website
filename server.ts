import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

interface CompactMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  temperature: string;
  calories: number;
  isVeg: boolean;
  isBestseller: boolean;
  tags: string[];
  description: string;
}

interface CocoRequestBody {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  menuCatalog: CompactMenuItem[];
  timeOfDay: string;
  activeOrder?: {
    id: string;
    status: string;
    estimatedMinutes: number;
    orderType: string;
    tableNumber?: number;
  } | null;
  previousOrders?: string[];
  offersSummary?: string[];
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', cafe: 'Chai & Coc Café' });
  });

  app.post('/api/coco', async (req, res) => {
    try {
      const body = req.body as CocoRequestBody;
      const userMessage = typeof body?.message === 'string' ? body.message.trim() : '';

      if (!userMessage) {
        res.status(400).json({ error: 'Please enter a message for Coco.' });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Coco AI is currently unavailable because GEMINI_API_KEY is not configured on the server. Please configure your Gemini API key in Settings > Secrets.',
        });
        return;
      }

      const catalog = Array.isArray(body.menuCatalog) ? body.menuCatalog : [];
      const validIds = new Set(catalog.map((item) => item.id));
      const historyText = Array.isArray(body.history)
        ? body.history
            .slice(-6)
            .map((h) => `${h.role === 'user' ? 'Guest' : 'Coco'}: ${h.text}`)
            .join('\n')
        : '';

      const systemInstruction = `You are Coco, the warm, friendly, modern AI café assistant at Chai & Coc Café near UPES Bidholi, Dehradun ("Sip. Chill. Connect.").
Your job is to help guests discover handcrafted Indian chai, specialty coffee, cold beverages, shakes, Maggi, sandwiches, snacks, desserts, and combos based on budget (in ₹), taste, hot/cold preference, sweetness, calorie preferences, time of day, and previous orders.

Rules:
- Keep responses concise, natural, warm, and genuinely helpful (2-3 crisp sentences max).
- ONLY recommend items that exist in the provided MENU CATALOG below, returning their exact "id" values in "recommendedItemIds" (0 to 3 items).
- Respect strict budget caps (e.g., "under ₹150" must ONLY include items with price <= 150).
- Respect hot/cold, chocolate/sweet, low-calorie (<= 200 kcal), or chai/coffee preferences accurately.
- If the guest asks to track their order, report their ACTIVE ORDER details accurately and set suggestedAction to "track_order".
- If the guest asks about today's offers, highlight current deals from TODAY'S OFFERS and optionally set suggestedAction to "view_offers".
- Never invent menu items or prices not present in the catalog.

CURRENT TIME OF DAY: ${body.timeOfDay || 'afternoon'}
PREVIOUS ORDERS BY THIS GUEST: ${
        body.previousOrders && body.previousOrders.length > 0
          ? body.previousOrders.join(', ')
          : 'None yet'
      }
ACTIVE ORDER: ${
        body.activeOrder
          ? `Order ${body.activeOrder.id}, Status: ${body.activeOrder.status}, Type: ${body.activeOrder.orderType}${
              body.activeOrder.tableNumber ? ` (Table ${body.activeOrder.tableNumber})` : ''
            }, ETA: ~${body.activeOrder.estimatedMinutes} mins`
          : 'No active order right now'
      }
TODAY'S OFFERS: ${(body.offersSummary || []).join(' | ')}

MENU CATALOG (JSON):
${JSON.stringify(catalog)}`;

      const prompt = historyText
        ? `Recent conversation:\n${historyText}\n\nLatest guest message: ${userMessage}`
        : `Guest message: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  'Friendly, warm 1-3 sentence response from Coco answering the guest and briefly explaining why the recommended items fit.',
              },
              recommendedItemIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exact menu item IDs from the provided MENU CATALOG (up to 3 items). Empty array if no item recommendation applies.',
              },
              suggestedAction: {
                type: Type.STRING,
                description:
                  'Optional UI shortcut: "none", "track_order", "view_offers", "open_menu", or "open_rewards".',
              },
            },
            required: ['reply', 'recommendedItemIds'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: {
        reply?: string;
        recommendedItemIds?: string[];
        suggestedAction?: string;
      } = {};

      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          reply: rawText || 'I would love to help you pick a cup! Tell me if you are craving hot chai, cold coffee, or a quick snack.',
          recommendedItemIds: [],
          suggestedAction: 'none',
        };
      }

      const filteredIds = Array.isArray(parsed.recommendedItemIds)
        ? parsed.recommendedItemIds.filter((id) => validIds.has(id)).slice(0, 3)
        : [];

      res.json({
        reply:
          parsed.reply ||
          'Here are a few fresh favourites from our bar at Chai & Coc Café!',
        recommendedItemIds: filteredIds,
        suggestedAction: parsed.suggestedAction || 'none',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected server error';
      console.error('Coco AI route error:', errorMessage);

      const lower = errorMessage.toLowerCase();
      if (lower.includes('403') || lower.includes('permission_denied') || lower.includes('api_key_invalid')) {
        res.status(403).json({
          error:
            'Unable to authenticate with Gemini API. Please check your API key in Settings > Secrets.',
        });
        return;
      }
      if (lower.includes('429') || lower.includes('resource_exhausted')) {
        res.status(429).json({
          error:
            'Coco is handling a lot of orders right now (rate limit reached). Please try again in a moment.',
        });
        return;
      }

      res.status(500).json({
        error: 'Coco had a brief hiccup connecting to our kitchen assistant. Please try again.',
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chai & Coc Café server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
