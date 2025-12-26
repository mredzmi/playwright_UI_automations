import * as cheerio from 'cheerio';

export class AIHealer {
  /**
   * Attempts to find a healed selector for a missing element.
   * @param html The current page HTML.
   * @param failedSelector The selector that failed (e.g., "#login-button").
   * @param expectedText Optional: Text expected to be on the element.
   * @param tagName Optional: The tag name expected (e.g., "button", "input").
   * @returns A new selector string if found, or null.
   */
  static heal(html: string, failedSelector: string, expectedText?: string, tagName?: string): string | null {
    const $ = cheerio.load(html);
    console.log(`[AIHealer] Analyzing DOM to heal selector: "${failedSelector}"`);

    // Strategy 1: Find by text content (exact or partial match)
    if (expectedText) {
      // Look for elements containing the text
      let elementsWithText = $(`*:contains("${expectedText}")`);

      // Also look for inputs with value containing the text
      const inputsWithValue = $(`input[value*="${expectedText}"]`);

      // Combine results
      // Note: Cheerio's add might return a new set, we need to be careful
      // Converting to array to handle easier
      const candidates = [...elementsWithText.toArray(), ...inputsWithValue.toArray()];

      if (candidates.length > 0) {
        // Filter to find the best match (e.g. correct tag)
        let bestMatch: any = null;

        if (tagName) {
             const filtered = candidates.filter(el => {
                const tag = $(el).prop('tagName');
                return tag && tag.toLowerCase() === tagName.toLowerCase();
             });
             if (filtered.length > 0) bestMatch = filtered[0];
        }

        if (!bestMatch) {
            bestMatch = candidates[0];
        }

        // Generate a new selector for this element
        const newSelector = this.generateSelector($, $(bestMatch));
        console.log(`[AIHealer] Found by text "${expectedText}": ${newSelector}`);
        return newSelector;
      }
    }

    // Strategy 2: Find by ID similarity (if selector was an ID)
    if (failedSelector.startsWith('#')) {
      const originalId = failedSelector.substring(1);
      const allElements = $('[id]');
      let bestMatchId = '';
      let highestSimilarity = 0;

      allElements.each((_, el) => {
        const id = $(el).attr('id');
        if (id) {
            const similarity = this.calculateSimilarity(originalId, id);
            if (similarity > 0.6 && similarity > highestSimilarity) { // Threshold
                highestSimilarity = similarity;
                bestMatchId = id;
            }
        }
      });

      if (bestMatchId) {
          console.log(`[AIHealer] Found by ID similarity (${highestSimilarity.toFixed(2)}): #${bestMatchId}`);
          return `#${bestMatchId}`;
      }
    }

    // Strategy 3: Find by attribute matching (e.g., data-test, name, placeholder)
    // This is a simplified version. A real AI agent would use an LLM here.
    // We will look for elements with 'data-test' or 'name' that might be similar.

    // Fallback: Check for data-test attribute that might match the selector content
    // e.g. if selector was "#login-button", maybe data-test="login-btn"

    return null;
  }

  private static generateSelector($: cheerio.CheerioAPI, element: cheerio.Cheerio<any>): string {
    const id = element.attr('id');
    if (id) return `#${id}`;

    const dataTest = element.attr('data-test');
    if (dataTest) return `[data-test="${dataTest}"]`;

    const name = element.attr('name');
    if (name) return `[name="${name}"]`;

    // Fallback to tag and text if unique, or path
    // For simplicity, returning a specific unique attribute or path would be better,
    // but here we just return a class based selector or tag if simplistic.
    const className = element.attr('class');
    if (className) {
        const classes = className.split(' ').join('.');
        return `.${classes}`;
    }

    const tagName = element.prop('tagName');
    return tagName ? tagName.toLowerCase() : '*';
  }

  // Simple Levenshtein distance for similarity
  private static calculateSimilarity(s1: string, s2: string): number {
      const longer = s1.length > s2.length ? s1 : s2;
      const shorter = s1.length > s2.length ? s2 : s1;
      if (longer.length === 0) {
          return 1.0;
      }
      return (longer.length - this.editDistance(longer, shorter)) / parseFloat(longer.length.toString());
  }

  private static editDistance(s1: string, s2: string): number {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
