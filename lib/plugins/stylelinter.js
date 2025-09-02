import { parse } from 'postcss'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()

/**
 * Loads valid Tailwind tokens from a CSS file.
 * @param {string} cssPath - The path to the CSS file.
 * @returns {Set<string>} The set of valid Tailwind tokens.
 */
const getValidTokensFromCSS = (cssPath) => {
  const css = readFileSync(cssPath, "utf-8");
  const root = parse(css);

  const tokens = new Set();

  root.walkDecls((decl) => {
    if (decl.prop.startsWith("--")) {
      tokens.add(`bg-[var(${decl.prop})]`);
      tokens.add(`text-[var(${decl.prop})]`);
      tokens.add(`border-[var(${decl.prop})]`);
      tokens.add(`fill-[var(${decl.prop})]`);
      tokens.add(`stroke-[var(${decl.prop})]`);

      const cleanName = decl.prop.replace(/^--color-/, "");
      tokens.add(`bg-${cleanName}`);
      tokens.add(`text-${cleanName}`);
      tokens.add(`border-${cleanName}`);
      tokens.add(`fill-${cleanName}`);
      tokens.add(`stroke-${cleanName}`);
    }
  });

  return tokens;
}

/**
 * Checks if the token is an arbitrary color token.
 * @param {string} token
 * @returns {boolean}
 */
const isArbitraryColorToken = (token) => /\[(.+)\]/.test(token);

/**
 * Checks if the token is a valid shorthand with optional opacity.
 * @param {string} baseToken
 * @param {string|null} opacity
 * @param {Set<string>} validTokens
 * @returns {boolean}
 */
const isValidShorthandToken = (baseToken, opacity, validTokens) => {
  if (!validTokens.has(baseToken)) return false;
  if (opacity === null) return true;
  return /^\d{1,3}$/.test(opacity) && Number(opacity) >= 0 && Number(opacity) <= 100;
};

/**
 * Checks if the token is an exception (e.g. bg-no-repeat, text-lg).
 * @param {string} token
 * @returns {boolean}
 */
const isExceptionToken = (token) =>
  /^(bg|text|border|fill|stroke)-(?:\d+xl|\d+|[a-z-]+)$/.test(token) &&
  !/-[a-f0-9]{3,6}$/i.test(token);

/**
 * Reports an invalid token using the ESLint context.
 * @param {import("eslint").Rule.RuleContext} context
 * @param {import("estree").Node} node
 * @param {string} token
 * @param {Set<string>} validTokens
 * @returns {void}
 */
const reportInvalidToken = (context, node, token, validTokens) => {
  context.report({
    node,
    messageId: "invalid",
    data: {
      token,
      valid: Array.from(validTokens).join(", "),
    },
  });
};

/** @type {import("eslint").Rule.RuleModule} */
const noInvalidTailwindTokensRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow invalid Tailwind tokens not defined in generated CSS",
      recommended: true,
    },
    messages: {
      invalid: "Used tailwindcss class '{{token}}'. Use the variables generated on your CSS file instead.",
    },
    schema: [],
  },
  create(context) {
    const validTokens = getValidTokensFromCSS(resolve(cwd, "./src/index.css"))
    const COLOR_PREFIXES = ["bg-", "text-", "border-", "fill-", "stroke-"];

    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return

        if (!node.value || node.value.type !== "Literal") return
        const value = node.value.value
        if (typeof value !== "string") return

        const tokens = value.split(/\s+/)
        for (const token of tokens) {
          if (!COLOR_PREFIXES.some((prefix) => token.startsWith(prefix))) continue

          let baseToken = token;
          let opacity = null;

          if (token.includes("/")) {
            const [base, op] = token.split("/");
            baseToken = base;
            opacity = op;
          }

          if (isArbitraryColorToken(token)) {
            if (!validTokens.has(baseToken)) {
              reportInvalidToken(context, node, token, validTokens);
            }
            continue;
          }

          if (isValidShorthandToken(baseToken, opacity, validTokens)) {
            continue;
          }

          if (isExceptionToken(token)) continue;
          reportInvalidToken(context, node, token, validTokens);
        }
      },
    }
  },
}

export const rules = {
  "no-builtin-tailwind-colors": noInvalidTailwindTokensRule,
}