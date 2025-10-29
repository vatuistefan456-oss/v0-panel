# CS2 Items Pricing System Documentation

## Overview

This document explains how the CS2 items pricing system works, including how real market prices are fetched and converted to server credits.

## System Architecture

### 1. Database Schema

The `item_prices` table stores pricing information for all CS2 items:

\`\`\`sql
CREATE TABLE item_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type VARCHAR(20) NOT NULL, -- 'weapon', 'agent', 'charm'
  weapon_name VARCHAR(255) NOT NULL,
  skin_name VARCHAR(255),
  normal_min INTEGER NOT NULL,
  normal_max INTEGER NOT NULL,
  stattrak_min INTEGER,
  stattrak_max INTEGER,
  souvenir_min INTEGER,
  souvenir_max INTEGER,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(weapon_name, skin_name)
);
\`\`\`

### 2. Price Conversion Formula

Real market prices (in USD) are converted to server credits using this formula:

\`\`\`
Credits = USD Price × Conversion Rate
\`\`\`

**Default Conversion Rate: 1 USD = 1,000 Credits**

Examples:
- $0.10 USD = 100 credits
- $1.50 USD = 1,500 credits
- $22.12 USD = 22,120 credits
- $500.00 USD = 500,000 credits

### 3. Price Ranges

Each item has a price range (min-max) to account for:
- Float value variations (Factory New vs Battle-Scarred)
- Pattern variations (rare patterns cost more)
- Market fluctuations

The range is calculated as:
- **Min Price**: Base market price × 0.7
- **Max Price**: Base market price × 1.8

### 4. Item Type Multipliers

Different item types have different pricing structures:

#### Weapons (Skins)
- **Normal**: Base price
- **StatTrak**: Base price × 1.5
- **Souvenir**: Base price × 1.75

#### Agents
- **Normal only**: Base price (no StatTrak/Souvenir variants)
- Typically range from 5,000 to 45,000 credits

#### Charms
- **Normal only**: Base price (no StatTrak/Souvenir variants)
- Typically range from 15 to 500 credits

### 5. Rarity-Based Fallback Pricing

When real market data is unavailable, the system generates prices based on rarity:

| Rarity | Base Multiplier | Weapon Range (Credits) | Agent Range (Credits) |
|--------|----------------|------------------------|----------------------|
| Consumer Grade | 1× | 100 - 180 | 500 - 900 |
| Industrial Grade | 2× | 200 - 360 | 1,000 - 1,800 |
| Mil-Spec | 5× | 500 - 900 | 2,500 - 4,500 |
| Restricted | 15× | 1,500 - 2,700 | 7,500 - 13,500 |
| Classified | 50× | 5,000 - 9,000 | 25,000 - 45,000 |
| Covert | 150× | 15,000 - 27,000 | 75,000 - 135,000 |
| Contraband | 500× | 50,000 - 90,000 | 250,000 - 450,000 |

## Price Update Process

### Automated Updates

The pricing system can be updated automatically using the provided scripts:

1. **Initial Population**: `scripts/populate-all-prices.ts`
   - Fetches all CS2 items from the API
   - Generates initial prices based on rarity
   - Populates the database

2. **Market Price Sync**: `scripts/sync-market-prices.ts`
   - Fetches real market prices from Steam Community Market
   - Converts USD to credits
   - Updates database with current prices
   - Should be run daily/weekly to keep prices current

### Manual Updates

Admins can manually update prices through the admin panel:
- Navigate to `/admin/all-items`
- Click on any item to view details
- Edit prices directly in the database

## API Integration

### Steam Community Market API

The system uses the Steam Community Market API to fetch real-time prices:

\`\`\`
https://steamcommunity.com/market/priceoverview/
?appid=730
&currency=1
&market_hash_name={item_name}
\`\`\`

Response format:
\`\`\`json
{
  "success": true,
  "lowest_price": "$1.50",
  "median_price": "$1.75",
  "volume": "1,234"
}
\`\`\`

### Rate Limiting

- Steam API: 20 requests per minute
- The sync script includes automatic rate limiting
- Failed requests are retried with exponential backoff

## Usage Examples

### Fetching Item Price

\`\`\`typescript
import { getItemPrice } from '@/app/actions/item-prices'

const result = await getItemPrice('AK-47', 'Redline')
if (result.success && result.price) {
  console.log('Normal:', result.price.normalMin, '-', result.price.normalMax)
  console.log('StatTrak:', result.price.stattrakMin, '-', result.price.stattrakMax)
}
\`\`\`

### Updating Item Price

\`\`\`typescript
import { upsertItemPrice } from '@/app/actions/item-prices'

await upsertItemPrice({
  itemType: 'weapon',
  weaponName: 'AK-47',
  skinName: 'Redline',
  normalMin: 1500,
  normalMax: 2700,
  stattrakMin: 2250,
  stattrakMax: 4050,
  souvenirMin: 2625,
  souvenirMax: 4725
})
\`\`\`

## Maintenance

### Regular Tasks

1. **Daily**: Run market price sync to update popular items
2. **Weekly**: Full database price refresh
3. **Monthly**: Review and adjust conversion rate if needed
4. **Quarterly**: Audit pricing accuracy against market trends

### Monitoring

Monitor these metrics:
- Price update success rate
- API request failures
- Price deviation from market averages
- User feedback on pricing accuracy

## Troubleshooting

### Common Issues

**Issue**: Prices showing as "N/A"
- **Cause**: Item not in database
- **Solution**: Run population script or add item manually

**Issue**: Prices seem outdated
- **Cause**: Market sync not running
- **Solution**: Run `sync-market-prices.ts` script

**Issue**: API rate limit errors
- **Cause**: Too many requests to Steam API
- **Solution**: Increase delay between requests in sync script

## Configuration

### Environment Variables

\`\`\`env
# Price conversion rate (USD to Credits)
PRICE_CONVERSION_RATE=1000

# Steam API settings
STEAM_API_RATE_LIMIT=20  # requests per minute
STEAM_API_RETRY_ATTEMPTS=3
\`\`\`

### Adjusting Conversion Rate

To change the USD to Credits conversion rate:

1. Update `PRICE_CONVERSION_RATE` environment variable
2. Run the market sync script to recalculate all prices
3. Verify prices are within acceptable ranges

## Future Enhancements

- [ ] Real-time price updates via WebSocket
- [ ] Historical price tracking and charts
- [ ] Price prediction using machine learning
- [ ] Multi-currency support
- [ ] Automated market trend analysis
- [ ] Price alerts for significant changes
