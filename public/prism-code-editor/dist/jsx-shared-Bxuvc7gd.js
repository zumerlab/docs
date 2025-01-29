import { l as languages, t as tokenize, w as withoutTokenizer, T as Token } from "./index-bkac8M6P.js";
import { i as insertBefore, c as clone } from "./language-DPYOfXzt.js";
import { r as replace, a as re } from "./shared-DKTvH67n.js";
var space = "\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))*\\*/";
var braces = "\\{(?:[^{}]|\\{(?:[^{}]|\\{[^}]*\\})*\\})*\\}";
var spread = replace("\\{<0>*\\.{3}(?:[^{}]|<1>)*\\}", [space, braces]);
var isText = (token) => token && (!token.type || token.type == "plain-text");
var walkTokens = (tokens, code, position) => {
  for (var i = 0, openedTags = [], l = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var length = token.length;
    var type = token.type;
    var notTagNorBrace = !type;
    var last, tag, start, plainText, content;
    if (type) {
      content = token.content;
      if (type == "tag") {
        start = content[0].length;
        tag = content[2] ? code.substr(position + start, content[1].length) : "";
        if (start > 1) {
          if (l && openedTags[l - 1][0] == tag) {
            l--;
          }
        } else {
          if (content[content.length - 1].length < 2) {
            openedTags[l++] = [tag, 0];
          }
        }
      } else if (l && type == "punctuation") {
        last = openedTags[l - 1];
        if (content == "{")
          last[1]++;
        else if (last[1] && content == "}")
          last[1]--;
        else {
          notTagNorBrace = !"}()[]".includes(content);
        }
      } else {
        notTagNorBrace = true;
      }
    }
    if (notTagNorBrace && l && !openedTags[l - 1][1]) {
      start = position;
      if (isText(tokens[i + 1])) {
        length += tokens[i + 1].length;
        tokens.splice(i + 1, 1);
      }
      if (isText(tokens[i - 1])) {
        start -= tokens[--i].length;
        tokens.splice(i, 1);
      }
      plainText = code.slice(start, position + length);
      tokens[i] = new Token("plain-text", plainText, plainText);
    }
    position += length;
  }
  return tokens;
};
var addJsxTag = (grammar, name) => {
  insertBefore(languages[name] = grammar = clone(grammar), "regex", {
    "tag": {
      pattern: re(
        `</?(?:(?!\\d)[^\\s/=><%]+(?:<0>(?:<0>*(?:[^\\s<>/={*]+(?:<0>*=<0>*(?!\\s)(?:"[^"]*"|'[^']*'|<1>)?|(?=[\\s/>]))|<2>))+)?<0>*/?)?>`,
        [space, braces, spread],
        "g"
      ),
      greedy: true,
      inside: {
        "punctuation": /^<\/?|\/?>$/,
        "tag": {
          pattern: /^[^\s/]+/,
          inside: {
            "namespace": /^[^:]+:/,
            "class-name": /^[A-Z]\w*(?:\.[A-Z]\w*)*$/
          }
        },
        "script": {
          // Allow for two levels of nesting
          pattern: re("(=<0>*)<1>", [space, braces]),
          lookbehind: true,
          alias: name = "language-" + name,
          inside: grammar
        },
        "spread": {
          pattern: RegExp(spread),
          alias: name,
          inside: grammar
        },
        "attr-value": {
          pattern: re(`(=<0>*)(?:"[^"]*"|'[^']*')`, [space]),
          lookbehind: true,
          inside: {
            "punctuation": /^["']|["']$/
          }
        },
        "comment": grammar["comment"],
        "attr-equals": /=/,
        "attr-name": {
          pattern: /\S+/,
          inside: {
            "namespace": /^[^:]+:/
          }
        }
      }
    }
  });
  grammar[tokenize] = (code, grammar2) => walkTokens(withoutTokenizer(code, grammar2), code, 0);
};
export {
  addJsxTag as a,
  braces as b,
  spread as c,
  space as s
};
//# sourceMappingURL=jsx-shared-Bxuvc7gd.js.map
