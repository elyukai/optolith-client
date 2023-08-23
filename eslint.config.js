// @ts-check
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js"
import reactRecommended from "eslint-plugin-react/configs/recommended.js"
import globals from "globals"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// @ts-expect-error: FlatCompat is not properly typed
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  reactRecommended,
  reactJsxRuntime,
  ...compat.extends("plugin:react-hooks/recommended", "plugin:@typescript-eslint/recommended"),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    ignores: ["node_modules/**", ".webpack/**", "eslint.config.js"],
    rules: {
      // Possible problems
      "require-atomic-updates": "error",
      "no-self-compare": "error",
      "no-unmodified-loop-condition": "error",

      // Suggestions
      "accessor-pairs": "error",
      "arrow-body-style": "error",
      "class-methods-use-this": "warn",
      "default-case": "error",
      eqeqeq: "error",
      "guard-for-in": "error",
      "init-declarations": "error",
      "no-alert": "error",
      "no-caller": "error",
      "no-eval": "error",
      "no-extend-native": [
        2,
        {
          exceptions: ["Array", "Map", "Set"],
        },
      ],
      "no-extra-bind": "error",
      "no-floating-decimal": "error",
      "no-implicit-coercion": "error",
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-loop-func": "error",
      "no-multi-str": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-octal": "error",
      "no-octal-escape": "error",
      "no-param-reassign": "error",
      "no-proto": "error",
      "no-redeclare": "off",
      "no-return-assign": "error",
      "no-script-url": "error",
      "no-throw-literal": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "no-void": "error",
      "no-warning-comments": "warn",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": [
        2,
        {
          VariableDeclarator: {
            array: true,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      "prefer-named-capture-group": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-has-own": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      radix: "error",
      "require-unicode-regexp": "error",
      "symbol-description": "error",
      yoda: "error",

      // TypeScript
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/member-delimiter-style": [
        2,
        {
          multiline: {
            delimiter: "none",
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },
      ],
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-redeclare": "error",
      "@typescript-eslint/no-shadow": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",

      // React
      "react/boolean-prop-naming": "error",
      "react/destructuring-assignment": "error",
      "react/no-access-state-in-setstate": "error",
      "react/no-array-index-key": "error",
      "react/no-children-prop": "error",
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "error",
      "react/no-did-mount-set-state": "error",
      "react/no-did-update-set-state": "warn",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-redundant-should-component-update": "error",
      "react/no-render-return-value": "error",
      "react/no-typos": "error",
      "react/no-string-refs": "error",
      "react/no-this-in-sfc": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unsafe": "error",
      "react/no-unused-prop-types": "error",
      "react/no-unused-state": "error",
      "react/no-will-update-set-state": "error",
      "react/prefer-es6-class": "error",
      "react/prefer-stateless-function": "error",
      "react/react-in-jsx-scope": "off",
      "react/require-render-return": "error",
      "react/self-closing-comp": "error",
      "react/state-in-constructor": [2, "never"],
      "react/style-prop-object": "error",
      "react/void-dom-elements-no-children": "error",
      "react/jsx-boolean-value": [2, "never"],
      "react/jsx-child-element-spacing": "error",
      "react/jsx-closing-tag-location": "error",
      "react/jsx-curly-newline": "error",
      "react/jsx-curly-spacing": "error",
      "react/jsx-equals-spacing": "error",
      "react/jsx-first-prop-new-line": "error",
      "react/jsx-indent-props": [2, 2],
      "react/jsx-no-bind": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-literals": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-one-expression-per-line": [
        2,
        {
          allow: "single-child",
        },
      ],
      "react/jsx-curly-brace-presence": [
        2,
        {
          props: "never",
          children: "ignore",
        },
      ],
      "react/jsx-fragments": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-props-no-multi-spaces": "error",
      "react/jsx-props-no-spreading": "error",
      "react/jsx-tag-spacing": "error",
      "react/jsx-wrap-multilines": [
        2,
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "ignore",
        },
      ],

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]
