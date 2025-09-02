import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'postcss'

const cwd = process.cwd()

/**
 * @import { Rule } from "eslint"
 */

/**
 * Loads valid Tailwind tokens from a CSS file.
 * @param {string} cssPath - The path to the CSS file.
 * @returns {Set<string>} The set of valid Tailwind tokens.
 * @example
 * const tokens = getValidTokensFromCSS("./dist/theme.css");
 * console.log(tokens);
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
    }
  });

  return tokens;
}

/** @type {Rule.RuleModule} */
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
    const validTokens = getValidTokensFromCSS(resolve(cwd, "./token.css"))
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
          if (!validTokens.has(token)) {
            context.report({
              node,
              messageId: "invalid",
              data: {
                token,
                valid: Array.from(validTokens).join(", "),
              },
            })
          }
        }
      },
    }
  },
}

export const rules = {
  "no-invalid-tailwind-tokens": noInvalidTailwindTokensRule,
}