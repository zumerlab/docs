import { l as languages } from "../../index-bkac8M6P.js";
import { c as clone, i as insertBefore } from "../../language-DPYOfXzt.js";
import "./xml.js";
var addLang = (grammar, lang) => {
  grammar["language-" + lang] = {
    pattern: /[^]+/,
    inside: lang
  };
  return grammar;
};
var addInlined = (tagName, lang) => ({
  pattern: RegExp(`(<${tagName}[^>]*>)(?!</${tagName}>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])+?(?=</${tagName}>)`, "gi"),
  lookbehind: true,
  greedy: true,
  inside: addLang({
    "included-cdata": {
      pattern: /<!\[CDATA\[[^]*?\]\]>/i,
      inside: addLang({
        "cdata": /^<!\[CDATA\[|\]\]>$/i
      }, lang)
    }
  }, lang)
});
var addAttribute = (attrName, lang) => ({
  pattern: RegExp(`((?:^|["'\\s])(?:${attrName})\\s*=\\s*)(?:"[^"]*"|'[^']*'|[^\\s"'=>]+)`, "gi"),
  lookbehind: true,
  greedy: true,
  inside: addLang({
    "punctuation": /^["']|["']$/
  }, lang)
});
var markup = languages.svg = languages.mathml = languages.html = languages.markup = clone(languages.xml);
markup.tag.inside["attr-value"].unshift(
  addAttribute("style", "css"),
  addAttribute("on[a-z]+", "javascript")
);
insertBefore(markup, "cdata", {
  "style": addInlined("style", "css"),
  "script": addInlined("script", "javascript")
});
//# sourceMappingURL=markup.js.map
