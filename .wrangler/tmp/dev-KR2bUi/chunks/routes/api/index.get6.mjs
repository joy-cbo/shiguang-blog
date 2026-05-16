import{f as s}from"../../nitro/nitro.mjs";import{g as r}from"../../_/db.mjs";const o=s(async s=>{const o=r(s);return{socialLinks:(await o.prepare("SELECT * FROM social_links WHERE visible = 1 ORDER BY sort_order").all()).results||[]}});export{o as default};
//# sourceMappingURL=index.get6.mjs.map
